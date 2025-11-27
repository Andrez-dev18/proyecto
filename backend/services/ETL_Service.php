<?php

require_once __DIR__ . '/../repositories/ETL_Repository.php';
require_once __DIR__ . '/../services/HistorialService.php';
class ETL_Service
{
    private $repo;
private $historialService;
    public function __construct($db)
    {
        $this->repo = new Etl_Repository($db);
        $this->historialService = new HistorialService($db);
    }

    public function runEtl($fechaInicio, $fechaFin)
    {
        $resultado = $this->repo->ejecutarETL($fechaInicio, $fechaFin);
        $this->historialService->logAction("ETL", "com_db_tama_mer_dia", null, null, $resultado, "ETL EJECUTADO");
        return $resultado;
    }
}
