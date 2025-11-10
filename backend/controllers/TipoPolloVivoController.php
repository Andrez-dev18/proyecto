<?php 
require_once __DIR__ . '/../services/TipoPolloVivoService.php';

class TipoPolloVivoController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new TipoPolloVivoService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>