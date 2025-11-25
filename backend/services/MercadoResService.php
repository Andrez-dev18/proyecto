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

     public function getResumenPorProvincias($fecha = null)
    {
        return $this->repo->tablaPorProvincias($fecha);
    }

    public function getResumenAvesPorProvincias($fecha = null)
    {
        return $this->repo->tablaPorAves($fecha);
    }

    // 📌 TABLA 3: Totales por mercados en una provincia
    public function getResumenPorMercados($provincia, $fecha = null)
    {
        if (!$provincia) {
            return ["error" => "Provincia requerida"];
        }
        return $this->repo->tablaPorMercados($provincia, $fecha);
    }

}
