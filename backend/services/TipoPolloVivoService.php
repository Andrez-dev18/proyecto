<?php 
require_once __DIR__ . '/../repositories/TipoPolloVivoRepository.php';

class TipoPolloVivoService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new TipoPolloVivoRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>