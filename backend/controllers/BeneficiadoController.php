<?php
require_once __DIR__ . '/../services/CapturaPantallaBeneficiadoService.php';

class BeneficiadoController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new CapturaPantallaBeneficiadoService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

    public function getArequipa()
    {
        $list = $this->service->getListArequipaBeneficiado();
        echo json_encode($list, JSON_UNESCAPED_UNICODE);
    }

    public function getProvincia()
    {
        $list = $this->service->getListProvinciaBeneficiado();
        echo json_encode($list, JSON_UNESCAPED_UNICODE);
    }

    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data["id"]) && $data["id"] != 0) {
            http_response_code(400);
            echo json_encode(["error" => "El ID debe ser 0 o no enviado para crear un nuevo registro."]);
            return;
        }

        $this->service->save($data);
        echo json_encode(["message" => "Registro creado correctamente"]);
    }

    public function update()
    {
        header('Content-Type: application/json; charset=utf-8');

        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || !isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos inválidos o falta el ID.']);
            return;
        }

        // Buscar el registro actual
        $beneficiado = $this->service->getById($input['id']);

        if (!$beneficiado) {
            http_response_code(404);
            echo json_encode(['error' => 'Registro no encontrado.']);
            return;
        }

        // Actualizar los campos permitidos
        $campos = [
            'tipo_proc',
            'ano',
            'mes',
            'provincia',
            'zona',
            'compraGrs',
            'tipoCliente',
            'nombre',
            'grs',
            'rp',
            'grs_vivo',
            'santa_elena',
            'granjas_chicas',
            'rosario',
            'sanfern_lima',
            'avicola_renzo',
            'avelino',
            'peladores',
            'avicruz',
            'rafael',
            'matilde',
            'avirox',
            'julia',
            'simon',
            'yesica',
            'gabriel',
            'arturo',
            'nicolas',
            'luis_f',
            'mirella',
            'otros',
            'potencialMinimo',
            'potencialMaximo',
            'condicionPtmin',
            'condicionPtmax',
            'observaciones'
        ];

        foreach ($campos as $campo) {
            if (isset($input[$campo])) {
                $beneficiado[$campo] = $input[$campo];
            }
        }

        // Asegurar que el ID se mantenga
        $beneficiado['id'] = $input['id'];

        // Guardar cambios
        $actualizado = $this->service->updateBeneficiado($beneficiado);

        if ($actualizado) {
            echo json_encode(['message' => 'Registro actualizado correctamente', 'data' => $beneficiado]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar el registro.']);
        }
    }

    public function delete($id)
    {
        $this->service->delete($id);
        echo json_encode(["message" => "Se eliminó el registro correctamente"]);
    }

    public function filtrarArequipa()
    {
        header('Content-Type: application/json; charset=utf-8');

        $ano = $_GET['ano'] ?? null;
        $mes = $_GET['mes'] ?? null;
        $provincia = $_GET['provincia'] ?? null;
        $zona = $_GET['zona'] ?? null;
        $tipo_cliente = $_GET['tipo_cliente'] ?? null;

        try {
            $data = $this->service->filtrarArequipa($ano, $mes, $provincia, $zona, $tipo_cliente);

            echo json_encode([
                'success' => true,
                'count' => count($data),
                'data' => $data
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function filtrarProvincia()
    {
        header('Content-Type: application/json; charset=utf-8');

        $ano = $_GET['ano'] ?? null;
        $mes = $_GET['mes'] ?? null;
        $provincia = $_GET['provincia'] ?? null;
        $zona = $_GET['zona'] ?? null;
        $tipo_cliente = $_GET['tipo_cliente'] ?? null;

        try {
            $data = $this->service->filtrarProvincia($ano, $mes, $provincia, $zona, $tipo_cliente);

            echo json_encode([
                'success' => true,
                'count' => count($data),
                'data' => $data
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }
}
