<?php
require_once __DIR__ . '/../repositories/TrozadoAutoserRepository.php';


class TrozadoAutoserService
{
     private $repo;

    public function __construct($db)
    {
        $this->repo = new TrozadoAutoserRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

     public function save($data)
    {
        return $this->repo->save($data);
    }

    public function delete($id)
    {
        return $this->repo->delete($id);
    }

    public function obtenerDatosFiltrados($fechaInicio = null, $fechaFin = null, $corte = null)
    {
        return $this->repo->findByFilters($fechaInicio, $fechaFin, $corte);
    }


}

