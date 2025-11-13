<?php
require_once __DIR__ . '/../repositories/ProductoSustitutoRepository.php';


class ProductoSustitutoService
{
     private $repo;

    public function __construct($db)
    {
        $this->repo = new ProductoSustitutoRepository($db);
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

    public function obtenerDatosFiltrados($fechaInicio = null, $fechaFin = null, $producto = null)
    {
        return $this->repo->findByFilters($fechaInicio, $fechaFin, $producto);
    }


}

