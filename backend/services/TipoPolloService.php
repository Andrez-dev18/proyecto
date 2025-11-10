<?php 
require_once __DIR__ . '/../repositories/TipoPolloRepository.php';

class TipoPolloService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new TipoPolloRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>