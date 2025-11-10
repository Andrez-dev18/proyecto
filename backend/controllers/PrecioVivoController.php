<?php
require_once __DIR__ . '/../services/PrecioVivoService.php';

class PrecioVivoController
{

    private $service;

    public function __construct($db)
    {
        $this->service = new PrecioVivoService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

public function create()
{
    $data = json_decode(file_get_contents("php://input"), true);
    
    // CORREGIDO: Permitir crear sin ID o con ID vacío
    if (isset($data["id"]) && !empty($data["id"])) {
        http_response_code(400);
        echo json_encode(["error" => "No debe enviar ID para crear un nuevo registro."]);
        return;
    }
    
    // Eliminar el ID si viene vacío
    unset($data['id']);
    
    $this->service->save($data);
    echo json_encode(["message" => "Registro creado correctamente"]);
}


    public function update()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data["id"]) || $data["id"] <= 0) {
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