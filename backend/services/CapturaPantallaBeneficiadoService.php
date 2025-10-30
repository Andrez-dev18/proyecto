<?php
require_once __DIR__ . '/../repositories/CapturaPantallaBeneficiadoRepository.php';
require_once __DIR__ . '/../dto/ArequipaBeneficiado.php';
require_once __DIR__ . '/../dto/ProvinciaBeneficiado.php';

class CapturaPantallaBeneficiadoService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new CapturaPantallaBeneficiadoRepository($db);
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
        return $this->repo->update($data);
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
        return $this->repo->save($data);
    }

    public function delete($id)
    {
        return $this->repo->delete($id);
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
