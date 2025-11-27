<?php 
require_once __DIR__ . '/../repositories/TipoGallinaRepository.php';
require_once __DIR__ . '/../services/HistorialService.php';

class TipoGallinaService
{
    private $repo;
    private $historialService;

    public function __construct($db)
    {
        $this->repo = new TipoGallinaRepository($db);
        $this->historialService = new HistorialService($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {
        $id = $this->repo->save($data);
        $this->historialService->logAction("INSERTAR", "com_tipo_gallina", $id, null, $data, "registro creado");
        return $id;
    }

    public function update($data)
    {
        $previos = $this->repo->findById($data['codigo']);

        $id = $this->repo->save($data);

        $this->historialService->logAction("ACTUALIZAR", "com_tipo_gallina", $id, $previos, $data, "registro actualizado");
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
            $this->historialService->logAction("ELIMINAR", "com_tipo_gallina", $id, $previos, null, "registro ELIMINADO");
        }

        return $deletedRows;
    }

}

?>