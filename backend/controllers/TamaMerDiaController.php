<?php
require_once __DIR__ . '/../services/TamaMerDiaService.php';

class TamaMerDiaController
{

    private $service;

    public function __construct($db)
    {
        $this->service = new TamaMerDiaService($db);
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
            echo json_encode(["error" => "El ID no debe ser enviado para crear nuevo registro."]);
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
        $tipo = $_GET['tipo'] ?? null;
        $linea = $_GET['linea'] ?? null;
        $provincia = $_GET['provincia'] ?? null;
        $zona = $_GET['zona'] ?? null;
        $empresa = $_GET['empresa'] ?? null;
        $proveedor = $_GET['proveedor'] ?? null;
        $producto = $_GET['producto'] ?? null;

        $resultados = $this->service->obtenerDatosFiltrados($fechaInicio, $fechaFin, $tipo, $linea, $provincia, $zona, $empresa, $proveedor, $producto);

        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'data' => $resultados
        ]);
    }

}