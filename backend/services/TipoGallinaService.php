<?php 
require_once __DIR__ . '/../repositories/TipoGallinaRepository.php';

class TipoGallinaService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new TipoGallinaRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>