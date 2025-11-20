<?php
require_once __DIR__ . '/../repositories/OficialGRSRepository.php';


class OficialGRSService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new OficialGRSRepository($db);
    }

    public function getAll()
    {
        return $this->repo->findAll();
    }

    public function save($data)
    {

        // -------------------------------------------------------
        // 1. DEFINIR NOMBRE DISTRIBUIDORA (FIJO)
        // -------------------------------------------------------
        // Según tu BD, se usa el nombre completo con espacios
        $nombreDistribuidora = "RINCONADA";
        $data['dap'] = "RINCONADA DEL SUR AREQUIPA";

        // Formato BD para comp (según tu lógica anterior):
        $data['ccod_cli_comp'] = $nombreDistribuidora . $data['ccod_cli'];

        // -------------------------------------------------------
        // 3. FRECUENCIA (Texto -> Número)
        // -------------------------------------------------------
        // La BD espera '1' en frec si el día es 'Lunes'
        if (!empty($data['cdia_visit'])) {
            $data['frec'] = $this->convertirDiaANumero($data['cdia_visit']);
        } else {
            $data['frec'] = '0';
        }

        // PESO FINAL = NPESO (peso sin bonificaciones)
        $data['peso_final'] = !empty($data['npeso']) ? floatval($data['npeso']) : 0;

        // COND = 1 (si importe base >= 0.70), 0 caso contrario
        if (isset($data['impte_base'])) {
            $importeBase = floatval($data['impte_base']);
            $data['cond'] = ($importeBase >= 0.70) ? 1 : 0;
        } else {
            $data['cond'] = 0;
        }

        // Guardar en BD
        return $this->repo->save($data);

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
