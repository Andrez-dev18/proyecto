<?php 
require_once __DIR__ . '/../services/TipoService.php';

class TipoController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new TipoService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>