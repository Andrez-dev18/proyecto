<?php 
require_once __DIR__ . '/../repositories/EmpresaRepository.php';

class EmpresaService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new EmpresaRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {
        return $this->repo->save($data);
    }

    public function delete($id)
    {
        return $this->repo->delete($id);
    }

}

?>