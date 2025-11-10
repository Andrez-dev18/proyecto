<?php
require_once __DIR__ . '/../repositories/EnteroAutoserRepository.php';


class EnteroAutoserService
{
     private $repo;

    public function __construct($db)
    {
        $this->repo = new EnteroAutoserRepository($db);
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

    public function obtenerDatosFiltrados($fechaInicio = null, $fechaFin = null, $proveedor = null)
    {
        return $this->repo->findByFilters($fechaInicio, $fechaFin, $proveedor);
    }


}

