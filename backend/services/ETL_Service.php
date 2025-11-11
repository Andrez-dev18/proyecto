<?php

require_once __DIR__ . '/../repositories/ETL_Repository.php';

class ETL_Service
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new Etl_Repository($db);
    }

    public function runEtl($fechaInicio, $fechaFin)
    {
        return $this->repo->ejecutarETL($fechaInicio, $fechaFin);
    }
}
