<?php
require_once __DIR__ . '/../repositories/TrozadoDiarioRepository.php';
require_once __DIR__ . '/../services/HistorialService.php';

class TrozadoDiarioService
{

    private $repo;
    private $historialService;

    public function __construct($db)
    {
        $this->repo = new TrozadoDiarioRepository($db);
        $this->historialService = new HistorialService($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {
        $id = $this->repo->save($data);
        $this->historialService->logAction("INSERTAR", "com_db_trozado_diario", $id, null, $data, "registro creado");
        return $id;
    }

    public function update($data)
    {
        $previos = $this->repo->findById($data['id']);

        $this->repo->save($data);

        $this->historialService->logAction("ACTUALIZAR", "com_db_trozado_diario", $data['id'], $previos, $data, "registro actualizado");
        return $data['id'];
    }

    public function delete($id)
    {
        $previos = $this->repo->findById($id);

        if(!$previos){
            return 0;
        }

        $deletedRows = $this->repo->delete($id);

        if($deletedRows > 0){
            $this->historialService->logAction("ELIMINAR", "com_db_trozado_diario", $id, $previos, null, "registro ELIMINADO");
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

    public function runEtl($fechaInicio, $fechaFin)
    {
        $resultado = $this->repo->ejecutarEtlTrozadoDiario($fechaInicio, $fechaFin);
        $this->historialService->logAction("ETL", "com_db_trozado_diario", null, null, $resultado, "ETL EJECUTADO");
        return $resultado;
    }

}
