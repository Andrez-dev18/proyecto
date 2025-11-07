<?php
require_once __DIR__ . '/../repositories/AlternoRepository.php';


class AlternoService
{
     private $repo;

    public function __construct($db)
    {
        $this->repo = new AlternoRepository($db);
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

    public function obtenerDatosFiltrados($fechaInicio = null, $fechaFin = null, $provincia = null, $mercado = null, $tipo = null)
    {
        return $this->repo->findByFilters($fechaInicio, $fechaFin, $provincia, $mercado, $tipo);
    }


}

