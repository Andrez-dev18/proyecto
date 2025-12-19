<?php 
require_once __DIR__ . '/../repositories/CondicionRepository.php';

class CondicionService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new CondicionRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

}

?>