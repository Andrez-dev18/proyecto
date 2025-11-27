<?php
require_once __DIR__ . '/../repositories/MercadoDetRepository.php';
require_once __DIR__ . '/../services/HistorialService.php';

class MercadoDetService
{
    private $repo;
    private $historialService;
    public function __construct($db)
    {
        $this->repo = new MercadoDetRepository($db);
        $this->historialService = new HistorialService($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {
        $response = $this->repo->save($data);
        $this->historialService->logAction("INSERTAR", "com_db_mercado_det", $response['id'], null, $data, "registro creado");
        return $response['id'];
    }

    public function update($data)
    {
        $previos = $this->repo->findById($data['id']);

        $response = $this->repo->save($data);

        $this->historialService->logAction("ACTUALIZAR", "com_db_mercado_det", $response['id'], $previos, $data, "registro actualizado");
        return $response;
    }

    public function delete($id)
    {
        $previos = $this->repo->findById($id);

        if(!$previos){
            return 0;
        }

        $deletedRows = $this->repo->delete($id);

        if($deletedRows > 0){
            $this->historialService->logAction("ELIMINAR", "com_db_mercado_det", $id, $previos, null, "registro ELIMINADO");
        }

        return $deletedRows;
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
