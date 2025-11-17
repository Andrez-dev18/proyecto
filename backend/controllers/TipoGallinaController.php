<?php 
require_once __DIR__ . '/../services/TipoGallinaService.php';

class TipoGallinaController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new TipoGallinaService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>