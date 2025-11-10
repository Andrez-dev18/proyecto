<?php
require_once __DIR__ . '/../repositories/TamaMerDiaRepository.php';


class TamaMerDiaService
{
     private $repo;

    public function __construct($db)
    {
        $this->repo = new TamaMerDiaRepository($db);
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

    public function obtenerDatosFiltrados($fechaInicio = null, $fechaFin = null, $tipo = null, $linea = null, $provincia = null, $zona = null, $empresa = null, $proveedor = null, $producto = null)
    {
        return $this->repo->findByFilters($fechaInicio, $fechaFin, $tipo, $linea, $provincia, $zona, $empresa, $proveedor, $producto);
    }


}

