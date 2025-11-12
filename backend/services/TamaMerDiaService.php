<?php
require_once __DIR__ . '/../repositories/TamaMerDiaRepository.php';


class TamaMerDiaService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new TamaMerDiaRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function getPaginated($start, $length, $search)
    {
        $data = $this->repo->findPaginated($start, $length, $search);
        $recordsTotal = $this->repo->countGetAll();
        $recordsFiltered = $this->repo->countGetAllFiltered($search);

        return [
            "draw" => intval($_POST['draw'] ?? 0),
            "recordsTotal" => $recordsTotal,
            "recordsFiltered" => $recordsFiltered,
            "data" => $data
        ];
    }

    public function save($data)
    {
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
