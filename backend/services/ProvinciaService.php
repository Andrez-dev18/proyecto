<?php 
require_once __DIR__ . '/../repositories/ProvinciaRepository.php';

class ProvinciaService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new ProvinciaRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>