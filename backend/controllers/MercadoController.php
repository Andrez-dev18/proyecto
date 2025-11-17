<?php
require_once __DIR__ . '/../services/MercadoService.php';

class MercadoController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new MercadoService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

    public function create()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            if (isset($data["id"]) && !empty(trim($data["id"]))) {
                http_response_code(400);
                echo json_encode(["error" => "El ID no debe ser enviado para crear nuevo registro."]);
                return;
            }
            $this->service->save($data);
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
            if (!isset($data["id"]) || empty(trim($data["id"]))) {
                http_response_code(400);
                echo json_encode(["error" => "ID inválido para actualizar el registro."]);
                return;
            }
            $this->service->save($data);
            echo json_encode(["message" => "Registro actualizado correctamente"]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["error" => $e->getMessage()]);
        }
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
}
