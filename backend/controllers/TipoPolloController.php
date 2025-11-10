<?php 
require_once __DIR__ . '/../services/TipoPolloService.php';

class TipoPolloController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new TipoPolloService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>