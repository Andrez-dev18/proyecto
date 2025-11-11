<?php
require_once __DIR__ . '/../services/ETL_Service.php';

class ETL_Controller
{

    private $service;

    public function __construct($db)
    {
        $this->service = new ETL_Service($db);
    }

    public function run()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        $fechaInicio = $input['fechaInicio'] ?? null;
        $fechaFin = $input['fechaFin'] ?? null;

        if (!$fechaInicio || !$fechaFin) {
            echo json_encode(['success' => false, 'error' => 'Debe enviar fechaInicio y fechaFin']);
            return;
        }

        $result = $this->service->runEtl($fechaInicio, $fechaFin);
        echo json_encode($result);
    }

}