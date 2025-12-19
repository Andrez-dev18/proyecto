<?php 
require_once __DIR__ . '/../repositories/CorteRepository.php';

class CorteService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new CorteRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>