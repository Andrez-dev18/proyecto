<?php
require_once __DIR__ . '/../repositories/OficialGRSRepository.php';
require_once __DIR__ . '/../services/HistorialService.php';

class OficialGRSService
{
    private $repo;
    private $historialService;

    public function __construct($db)
    {
        $this->repo = new OficialGRSRepository($db);
        $this->historialService = new HistorialService($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {

        // Nombre fijo
        $data['dap'] = "RINCONADA DEL SUR AREQUIPA";
        $data['ccod_cli_comp'] = "RINCONADA" . ($data['ccod_cli'] ?? '');

        // Frecuencia (día → número)
        if (!empty($data['cdia_visit'])) {
            $data['frec'] = $this->convertirDiaANumero($data['cdia_visit']);
        } else {
            $data['frec'] = '0';
        }

        // Peso final = npeso
        $npeso = floatval($data['npeso'] ?? 0);
        $data['peso_final'] = $npeso;

        // Tipo de venta
        $tipoVenta = $data['tipo_venta'] ?? "unit";
        $precio = floatval($data['precio'] ?? 0);
        $cantidad = floatval($data['ncant'] ?? 0);

        // Calculo de importes
        if ($precio > 0 && $cantidad > 0) {

            if ($tipoVenta === "unit") {
                $impte_igv = $precio * $cantidad;
            } else { // weight
                $impte_igv = $precio * $npeso * $cantidad;
            }

            $data['impte_igv'] = round($impte_igv, 4);
            $data['impte_base'] = round($impte_igv / 1.18, 2);
        } else {
            // Si no hay precio o cantidad
            $data['impte_igv'] = 0;
            $data['impte_base'] = 0;
        }

        // Calculo de cond
        $data['cond'] = ($data['impte_base'] >= 0.70) ? 1 : 0;

        $id = $this->repo->save($data);
        $this->historialService->logAction("INSERTAR", "com_db_oficial_grs", $id, null, $data, "registro creado");
        return $id;
    }

    public function autocomplete($campo, $query)
    {
        if (strlen($query) < 2) {
            return []; // Evita consultas innecesarias
        }

        return $this->repo->autocomplete($campo, $query);
    }


    private function convertirDiaANumero($nombreDia)
    {
        $dia = strtolower(trim($nombreDia));
        switch ($dia) {
            case 'lunes':
                return '1';
            case 'martes':
                return '2';
            case 'miercoles':
                return '3';
            case 'miércoles':
                return '3';
            case 'jueves':
                return '4';
            case 'viernes':
                return '5';
            case 'sabado':
                return '6';
            case 'sábado':
                return '6';
            case 'domingo':
                return '7';
            default:
                return '0';
        }
    }

    public function diaSemana($numero)
    {

        $dia = '';

        switch ($numero) {
            case 1:
                $dia = 'Lunes';
                break;
            case 2:
                $dia = 'Marts';
                break;
            case 3:
                $dia = 'Miercoles';
                break;
            case 4:
                $dia = 'Jueves';
                break;
            case 5:
                $dia = 'Viernes';
                break;
            case 6:
                $dia = 'Sabado';
                break;
            case 7:
                $dia = 'Domingo';
                break;
            default:
                $dia = '';
                break;
        }
        return $dia;
    }

    public function update($data)
    {
        $previos = $this->repo->findById($data['id']);

        $this->repo->save($data);

        $this->historialService->logAction("ACTUALIZAR", "com_db_oficial_grs", $data['id'], $previos, $data, "registro actualizado");
        return $data['id'];
    }

    public function delete($id)
    {
        $previos = $this->repo->findById($id);

        if(!$previos){
            return 0;
        }

        $deletedRows = $this->repo->delete($id);

        if($deletedRows > 0){
            $this->historialService->logAction("ELIMINAR", "com_db_oficial_grs", $id, $previos, null, "registro ELIMINADO");
        }

        return $deletedRows;
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
