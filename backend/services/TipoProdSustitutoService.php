<?php 
require_once __DIR__ . '/../repositories/TipoProdSutitutoRepository.php';

class TipoProdSustitutoService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new TipoProdSutitutoRepository($db);
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