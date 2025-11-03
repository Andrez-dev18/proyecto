<?php
require_once __DIR__ . '/../repositories/VivoArequipaRepository.php';
require_once __DIR__ . '/../models/VivoArequipa.php';

class VivoArequipaService
{

    private $repo;

    public function __construct($db)
    {
        $this->repo = new VivoArequipaRepository($db);
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

    public function obtenerDatosFiltrados($fecha = null, $mercado = null, $empresa = null, $condicion = null, $proveedor = null)
    {
        return $this->repo->findByFilters($fecha, $mercado, $empresa, $condicion, $proveedor);
    }

}
