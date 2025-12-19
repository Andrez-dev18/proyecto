<?php
require_once __DIR__ . '/../services/MercadoResService.php';

class MercadoResController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new MercadoResService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

    public function resumenProvincias()
    {
        $fecha = $_GET['fecha'] ?? null;
        $data = $this->service->getResumenPorProvincias($fecha);

        echo json_encode($data);
    }

    public function resumenAvesProvincias()
    {
        $fecha = $_GET['fecha'] ?? null;
        $data = $this->service->getResumenAvesPorProvincias($fecha);

        echo json_encode($data);
    }

    // 📌 GET /api/resumen/mercados?provincia=7&fecha=2025-11-24
    public function resumenMercados()
    {
        $provincia = $_GET['provincia'] ?? null;
        $fecha     = $_GET['fecha'] ?? null;

        $data = $this->service->getResumenPorMercados($provincia, $fecha);

        echo json_encode($data);
    }

    public function create()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data) {
                throw new Exception("JSON inválido.");
            }

            // Crear registro (solo inserta)
            $this->service->create($data);

            echo json_encode(["message" => "Registro creado correctamente"]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }


    public function update()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data) {
                throw new Exception("JSON inválido.");
            }

            // Para update NO se usa ID. Validamos por la combinación única.
            if (
                empty($data["provincia"]) ||
                empty($data["tipo_establecimiento"]) ||
                empty($data["tamanio"])
            ) {
                throw new Exception("Para actualizar se requiere provincia, tipo_establecimiento y tamanio.");
            }

            $this->service->update($data);

            echo json_encode(["message" => "Registro actualizado correctamente"]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }



    public function delete()
    {
        // Recibe JSON del frontend
        $body = json_decode(file_get_contents("php://input"), true);

        // Extraer claves necesarias
        $provincia = $body['provincia'] ?? null;
        $tipo = $body['tipo_establecimiento'] ?? null;
        $tamanio = $body['tamanio'] ?? null;

        // Validaciones
        if (!$provincia || !$tipo || !$tamanio) {
            http_response_code(400);
            echo json_encode([
                "error" => "Datos incompletos para eliminar el registro (provincia, tipo_establecimiento, tamanio)."
            ]);
            return;
        }

        // Ejecutar borrado
        $deletedRows = $this->service->delete($provincia, $tipo, $tamanio);

        if ($deletedRows > 0) {
            echo json_encode(["message" => "Registro eliminado correctamente"]);
        } else {
            http_response_code(404);
            echo json_encode([
                "error" => "No se encontró el registro con esos valores."
            ]);
        }
    }

    public function obtenerTodosDatosFiltro()
    {
        $params = [
            'provincia' => $_GET['provincia'] ?? null,
            'tipo_establecimiento' => $_GET['tipoEstablecimiento'] ?? null,
            'start'       => intval($_GET['start'] ?? 0),
            'length'      => intval($_GET['length'] ?? 10),
            'search'      => $_GET['search'] ?? ['value' => '']
        ];

        $datos = $this->service->obtenerDatosFiltrados($params);
        $recordsTotal = $this->service->obtenerTotalRegistros();
        $recordsFiltered = $this->service->obtenerTotalFiltrados($params);

        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'params:' => $params,
            'data' => $datos,
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered
        ]);
    }
}
