<?php
require_once __DIR__ . '/../repositories/AlternoRepository.php';
require_once __DIR__ . '/../services/HistorialService.php';

class AlternoService
{
    private $repo;
      private $historialService;

    public function __construct($db)
    {
        $this->repo = new AlternoRepository($db);
        $this->historialService = new HistorialService($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {
        $id = $this->repo->save($data);
        $this->historialService->logAction("INSERTAR", "com_db_alterno", $id, null, $data, "registro creado");
        return $id;
    }

    public function update($data)
    {
        $previos = $this->repo->findById($data['id']);

        $id = $this->repo->save($data);

        $this->historialService->logAction("ACTUALIZAR", "com_db_alterno", $id, $previos, $data, "registro actualizado");
        return $id;
    }

    public function delete($id)
    {
        $previos = $this->repo->findById($id);

        if(!$previos){
            return 0;
        }

        $deletedRows = $this->repo->delete($id);

        if($deletedRows > 0){
            $this->historialService->logAction("ELIMINAR", "com_db_alterno", $id, $previos, null, "registro ELIMINADO");
        }

        return $deletedRows;
    }

    public function obtenerDatosFiltrados($fechaInicio = null, $fechaFin = null, $provincia = null, $mercado = null, $tipo = null)
    {
        return $this->repo->findByFilters($fechaInicio, $fechaFin, $provincia, $mercado, $tipo);
    }
}
