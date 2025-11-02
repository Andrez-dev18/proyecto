<?php 
require_once __DIR__ . '/../services/CondicionService.php';

class CondicionController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new CondicionService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

}

?>