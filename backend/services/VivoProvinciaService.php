<?php
require_once __DIR__ . '/../repositories/VivoProvinciaRepository.php';

class VivoProvinciaService
{

    private $repo;

    public function __construct($db)
    {
        $this->repo = new VivoProvinciaRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

     public function save($data)
    {
        return $this->repo->save($data);
    }

}
