<?php 
require_once __DIR__ . '/../services/ProvinciaService.php';

class ProvinciaController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new ProvinciaService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>