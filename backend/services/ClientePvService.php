<?php
require_once __DIR__ . '/../repositories/ClientePvRepository.php';


class ClientePvService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new ClientePvRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {

        $totalUnidad = floatval($data['carne_unidad'] ?? 0) +  floatval($data['brasa_unidad'] ?? 0);
        $totalKilos = floatval($data['carne_kilos'] ?? 0) + floatval($data['brasa_kilos'] ?? 0);
        $totalSoles = floatval($data['carne_soles'] ?? 0) + floatval($data['brasa_soles'] ?? 0);

        $data['total_unidad'] = $totalUnidad;
        $data['total_kilos'] = $totalKilos;
        $data['total_soles'] = $totalSoles;

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
}
