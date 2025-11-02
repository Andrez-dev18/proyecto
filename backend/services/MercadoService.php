<?php 
require_once __DIR__ . '/../repositories/MercadoRepository.php';

class MercadoService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new MercadoRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>