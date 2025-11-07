<?php
require_once __DIR__ . '/../services/HuevoService.php';

class HuevoController
{

    private $service;

    public function __construct($db)
    {
        $this->service = new HuevoService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data["id"]) && !empty(trim($data["id"]))) {
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
        if (!$id || empty(trim($id))) {
            http_response_code(400);
            echo json_encode(["error" => "ID inválido para eliminar el registro."]);
            return;
        }

        $deletedRows = $this->service->delete($id);

        if ($deletedRows > 0) {
            echo json_encode(["message" => "Registro eliminado correctamente"]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "No se encontró el registro con el ID especificado."]);
        }
    }

    public function obtenerDatosFiltrados()
    {
        // Obtener parámetros desde la query string
        $fechaInicio = $_GET['fechaInicio'] ?? null;
        $fechaFin = $_GET['fechaFin'] ?? null;
        $provincia = $_GET['provincia'] ?? null;
        $tipo = $_GET['tipo'] ?? null;
        $mercado = $_GET['mercado'] ?? null;
        $proveedor = $_GET['proveedor'] ?? null;

        $resultados = $this->service->obtenerDatosFiltrados($fechaInicio, $fechaFin, $provincia, $tipo, $mercado, $proveedor);

        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'data' => $resultados
        ]);
    }

}