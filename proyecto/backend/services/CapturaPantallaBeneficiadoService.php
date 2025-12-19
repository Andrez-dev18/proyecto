<?php
require_once __DIR__ . '/../repositories/CapturaPantallaBeneficiadoRepository.php';
require_once __DIR__ . '/../dto/ArequipaBeneficiado.php';
require_once __DIR__ . '/../dto/ProvinciaBeneficiado.php';
require_once __DIR__ . '/../services/HistorialService.php';
require_once __DIR__ . '/../services/HistorialService.php';

class CapturaPantallaBeneficiadoService
{
    private $repo;
    private $historialService;

    public function __construct($db)
    {
        $this->repo = new CapturaPantallaBeneficiadoRepository($db);
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

    public function updateBeneficiado(array $data)
    {
        $previos = $this->repo->findById($data['id']);

        $id = $this->repo->update($data);

        $this->historialService->logAction("ACTUALIZAR", "com_db_pot_venta_bene", $id, $previos, $data, "registro actualizado");
        return $id;
    }

    public function getListArequipaBeneficiado(): array
    {
        $rows = $this->repo->findArequipaBeneficiado();
        $out = [];
        foreach ($rows as $r) {
            $dto = ArequipaBeneficiado::fromArray($r);
            $out[] = $dto->toArray();
        }
        return $out;
    }

    public function getListProvinciaBeneficiado(): array
    {
        $rows = $this->repo->findProvinciaBeneficiado();
        $out = [];
        foreach ($rows as $r) {
            $dto = ProvinciaBeneficiado::fromArray($r);
            $out[] = $dto->toArray();
        }
        return $out;
    }

    public function save($data)
    {
        $id = $this->repo->save($data);
        $this->historialService->logAction("INSERTAR", "com_db_pot_venta_bene", $id, null, $data, "registro creado");
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
            $this->historialService->logAction("ELIMINAR", "com_db_pot_venta_bene", $id, $previos, null, "registro ELIMINADO");
        }

        return $deletedRows;
    }

    public function filtrarArequipa($ano = null, $mes = null, $provincia = null, $zona = null, $tipo_cliente = null)
    {
        $rows = $this->repo->filtrarArequipa($ano, $mes, $provincia, $zona, $tipo_cliente);

        $result = [];
        foreach ($rows as $r) {
            $dto = ArequipaBeneficiado::fromArray($r);
            $result[] = $dto->toArray();
        }

        return $result;
    }

    public function filtrarProvincia($ano = null, $mes = null, $provincia = null, $zona = null, $tipo_cliente = null)
    {
        $rows = $this->repo->filtrarProvincia($ano, $mes, $provincia, $zona, $tipo_cliente);

        $result = [];
        foreach ($rows as $r) {
            $dto = ProvinciaBeneficiado::fromArray($r);
            $result[] = $dto->toArray();
        }

        return $result;
    }
}
