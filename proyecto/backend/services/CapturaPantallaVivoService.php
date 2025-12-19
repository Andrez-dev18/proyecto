<?php
require_once __DIR__ . '/../repositories/CapturaPantallaVivoRepository.php';
require_once __DIR__ . '/../dto/ArequipaVivo.php';
require_once __DIR__ . '/../dto/ProvinciaVivo.php';
require_once __DIR__ . '/../services/HistorialService.php';

class CapturaPantallaVivoService
{
    private $repo;
    private $historialService;

    public function __construct($db)
    {
        $this->repo = new CapturaPantallaVivoRepository($db);
        $this->historialService = new HistorialService($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function getById($id)
    {
        return $this->repo->findById($id);
    }

    public function updateVivo(array $vivo)
    {
        $previos = $this->repo->findById($vivo['id']);

        $id = $this->repo->update($vivo);

        $this->historialService->logAction("ACTUALIZAR", "com_db_pot_venta_vivo", $id, $previos, $vivo, "registro actualizado");
        return $id;
    }

    public function getArequipaVivo()
    {
        return $this->repo->findArequipaVivo();
    }

    public function getProvinciaVivo()
    {
        return $this->repo->findProvinciaVivo();
    }

    public function save($data)
    {
        $id = $this->repo->save($data);
        $this->historialService->logAction("INSERTAR", "com_db_pot_venta_vivo", $id, null, $data, "registro creado");
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
            $this->historialService->logAction("ELIMINAR", "com_db_pot_venta_vivo", $id, $previos, null, "registro ELIMINADO");
        }

        return $deletedRows;
    }

    public function getListArequipaVivo(): array
    {
        $rows = $this->repo->findArequipaVivo(); // devuelve array de assoc rows
        $out = [];
        foreach ($rows as $r) {
            $dto = ArequipaVivo::fromArray($r);
            $out[] = $dto->toArray(); // o $out[] = $dto si quieres objetos
        }
        return $out;
    }

    public function getListProvinciaVivo(): array
    {
        $rows = $this->repo->findProvinciaVivo();
        $out = [];
        foreach ($rows as $r) {
            $dto = ProvinciaVivo::fromArray($r);
            $out[] = $dto->toArray();
        }
        return $out;
    }

    public function filtrarArequipa($ano = null, $mes = null, $provincia = null, $zona = null, $tipo_cliente = null)
    {
        // obtiene filas crudas del repo (assoc arrays)
        $rows = $this->repo->filtrarArequipa($ano, $mes, $provincia, $zona, $tipo_cliente);

        $result = [];
        foreach ($rows as $r) {
            $dto = ArequipaVivo::fromArray($r);
            $result[] = $dto->toArray(); // devuelve arrays planos listos para json_encode
        }

        return $result;
    }

    public function filtrarProvincia($ano = null, $mes = null, $provincia = null, $zona = null, $tipo_cliente = null)
    {
        $rows = $this->repo->filtrarProvincia($ano, $mes, $provincia, $zona, $tipo_cliente);

        $result = [];
        foreach ($rows as $r) {
            $dto = ProvinciaVivo::fromArray($r);
            $result[] = $dto->toArray();
        }

        return $result;
    }
}
