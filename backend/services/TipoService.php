<?php 
require_once __DIR__ . '/../repositories/TipoRepository.php';

class TipoService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new TipoRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>