<?php 
require_once __DIR__ . '/../repositories/ProveedorRepository.php';

class ProveedorService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new ProveedorRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>