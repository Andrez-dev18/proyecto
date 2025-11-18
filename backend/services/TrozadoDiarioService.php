<?php
require_once __DIR__ . '/../repositories/TrozadoDiarioRepository.php';

class TrozadoDiarioService
{

    private $repo;

    public function __construct($db)
    {
        $this->repo = new TrozadoDiarioRepository($db);
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

    public function obtenerDatosFiltrados($params = [])
    {
        return $this->repo->findByFilters($params);
    }

    public function obtenerTotalRegistros()
    {
        return $this->repo->countAll();
    }

    public function obtenerTotalFiltrados($params = [])
    {
        return $this->repo->countFiltered($params);
    }

    public function runEtl($fechaInicio, $fechaFin)
    {
        return $this->repo->ejecutarEtlTrozadoDiario($fechaInicio, $fechaFin);
    }

}
