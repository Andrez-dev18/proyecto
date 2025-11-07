<?php
require_once __DIR__ . '/../repositories/PrecioVivoRepository.php';


class PrecioVivoService
{
     private $repo;

    public function __construct($db)
    {
        $this->repo = new PrecioVivoRepository($db);
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

    public function obtenerDatosFiltrados($fechaInicio = null, $fechaFin = null, $empresa)
    {
        return $this->repo->findByFilters($fechaInicio, $fechaFin, $empresa);
    }


}

