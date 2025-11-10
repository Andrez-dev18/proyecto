<?php 
require_once __DIR__ . '/../services/CorteService.php';

class CorteController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new CorteService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>