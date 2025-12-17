<?php
require_once __DIR__ . '/../services/MercadoDetService.php';

class MercadoDetController
{

    private $service;

    public function __construct($db)
    {
        $this->service = new MercadoDetService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

    public function create()
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data["id"])) {
        http_response_code(400);
        echo json_encode(["error" => "El ID no debe enviarse al crear"]);
        return;
    }

    $result = $this->service->save($data);
    echo json_encode($result);
}

public function update()
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data["id"])) {
        http_response_code(400);
        echo json_encode(["error" => "Falta ID para actualizar"]);
        return;
    }

    $result = $this->service->update($data);
    echo json_encode($result);
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

    public function obtenerTodosDatosFiltro()
    {
        $params = [
            'fechaInicio' => $_GET['fechaInicio'] ?? null,
            'fechaFin'    => $_GET['fechaFin'] ?? null,
            'mercado' => $_GET['mercado'] ?? null,
            'tipoEstablecimiento' => $_GET['tipoEstablecimiento'] ?? null,
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
