<?php 
require_once __DIR__ . '/../services/EmpresaService.php';

class EmpresaController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new EmpresaService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>