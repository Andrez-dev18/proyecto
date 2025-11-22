<?php
require_once __DIR__ . '/../repositories/MercadoResRepository.php';


class MercadoResService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new MercadoResRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function create($data)
    {
        return $this->repo->insertMercadoRes($data);
    }

    public function update($data)
    {
        return $this->repo->updateMercadoRes($data);
    }

    public function delete($provincia, $tipo_establecimiento, $tamanio)
    {
        return $this->repo->delete($provincia, $tipo_establecimiento, $tamanio);
    }

    public function obtenerDatosFiltrados($fechaInicio = null, $fechaFin = null, $empresa = null)
    {
        return $this->repo->findByFilters($fechaInicio, $fechaFin, $empresa);
    }

    public function obtenerTotalRegistros()
    {
        return $this->repo->countAll();
    }

    public function obtenerTotalFiltrados($params = [])
    {
        return $this->repo->countFiltered($params);
    }
}
