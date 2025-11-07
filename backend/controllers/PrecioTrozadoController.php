<?php
require_once __DIR__ . '/../services/PrecioTrozadoService.php';

class PrecioTrozadoController
{

    private $service;

    public function __construct($db)
    {
        $this->service = new PrecioTrozadoService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data["id"]) && $data["id"] != 0) {
            http_response_code(400);
            echo json_encode(["error" => "El ID debe ser 0 o no enviado para crear un nuevo registro."]);
            return;
        }
        $this->service->save($data);
        echo json_encode(["message" => "Registro creado correctamente"]);
    }

    public function update()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data["id"]) || empty(trim($data["id"]))) {
            http_response_code(400);
            echo json_encode(["error" => "ID inválido para actualizar el registro."]);
            return;
        }
        $this->service->save($data);
        echo json_encode(["message" => "Registro actualizado correctamente"]);
    }

    public function delete($id)
    {
        if (!$id || $id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "ID inválido para eliminar el registro."]);
            return;
        }
        $this->service->delete($id);
        echo json_encode(["message" => "Registro eliminado correctamente"]);
    }

    public function obtenerDatosFiltrados()
    {
        // Obtener parámetros desde la query string
        $fechaInicio = $_GET['fechaInicio'] ?? null;
        $fechaFin = $_GET['fechaFin'] ?? null;
        $empresa = $_GET['empresa'] ?? null;

        $resultados = $this->service->obtenerDatosFiltrados($fechaInicio, $fechaFin, $empresa);

        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'data' => $resultados
        ]);
    }

}