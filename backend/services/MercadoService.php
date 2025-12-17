<?php 
require_once __DIR__ . '/../repositories/MercadoRepository.php';
require_once __DIR__ . '/../services/HistorialService.php';

class MercadoService
{
    private $repo;
    private $historialService;

    public function __construct($db)
    {
        $this->repo = new MercadoRepository($db);
        $this->historialService = new HistorialService($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {
        $id = $this->repo->save($data);
        $this->historialService->logAction("INSERTAR", "com_mercado", $id, null, $data, "registro creado");
        return $id;
    }

    public function update($data)
    {
        $previos = $this->repo->findById($data['codigo']);

        $this->repo->save($data);

        $this->historialService->logAction("ACTUALIZAR", "com_mercado", $data['codigo'], $previos, $data, "registro actualizado");
        return $data['codigo'];
    }

    public function delete($id)
    {
        $previos = $this->repo->findById($id);

        if(!$previos){
            return 0;
        }

        $deletedRows = $this->repo->delete($id);

        if($deletedRows > 0){
            $this->historialService->logAction("ELIMINAR", "com_mercado", $id, $previos, null, "registro ELIMINADO");
        }

        return $deletedRows;
    }

}

?>