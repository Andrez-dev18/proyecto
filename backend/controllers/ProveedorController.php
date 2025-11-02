<?php 
require_once __DIR__ . '/../services/ProveedorService.php';

class ProveedorController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new ProveedorService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>