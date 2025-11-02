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

}

?>