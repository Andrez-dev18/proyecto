<?php 
require_once __DIR__ . '/../services/VivoProvinciaService.php';

class VivoProvinciaController
{

    private $service;

    public function __construct($db)
    {
        $this->service = new VivoProvinciaService($db);
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

}

?>