<?php
require_once __DIR__ . '/../services/TamaMerDiaService.php';

class TamaMerDiaController
{

    private $service;

    private $db;

    public function __construct($db)
    {

        $this->db = $db;
        $this->service = new TamaMerDiaService($db);
    }

    public function getAll()
    {
        echo json_encode($this->service->getAll());
    }

    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data["id"]) && !empty(trim($data["id"]))) {
            http_response_code(400);
            echo json_encode(["error" => "El ID no debe ser enviado para crear nuevo registro."]);
            return;
        }
        $this->service->save($data);
        echo json_encode(["message" => "Registro creado correctamente"]);
    }

    public function update()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data["id"]) || empty(trim($data["id"]))) {
            http_response_code(400);
            echo json_encode(["error" => "ID inválido para actualizar el registro."]);
            return;
        }
        $this->service->save($data);
        echo json_encode(["message" => "Registro actualizado correctamente"]);
    }

    public function delete($id)
    {
        if (!$id || empty(trim($id))) {
            http_response_code(400);
            echo json_encode(["error" => "ID inválido para eliminar el registro."]);
            return;
        }

        $deletedRows = $this->service->delete($id);

        if ($deletedRows > 0) {
            echo json_encode(["message" => "Registro eliminado correctamente"]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "No se encontró el registro con el ID especificado."]);
        }
    }

    public function obtenerTodosDatosFiltro()
    {
        $params = [
            'fechaInicio' => $_GET['fechaInicio'] ?? null,
            'fechaFin'    => $_GET['fechaFin'] ?? null,
            'tipo'        => $_GET['tipoPollo'] ?? null,
            'linea'       => $_GET['tipoLinea'] ?? null,
            'provincia'   => $_GET['provincia'] ?? null,
            'zona'        => $_GET['zona'] ?? null,
            'empresa'     => $_GET['empresa'] ?? null,
            'proveedor'   => $_GET['proveedor'] ?? null,
            'producto'    => $_GET['producto'] ?? null,
            'start'       => intval($_GET['start'] ?? 0),
            'length'      => intval($_GET['length'] ?? 10),
            'search'      => $_GET['search'] ?? ['value' => '']
        ];

        $datos = $this->service->obtenerDatosFiltrados($params);
        $recordsTotal = $this->service->obtenerTotalRegistros();
        $recordsFiltered = $this->service->obtenerTotalFiltrados($params);

        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'params:' => $params,
            'data' => $datos,
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered
        ]);
    }

    // exportarpdf
public function exportarPDF()
{
    require_once __DIR__ . '/../services/PdfService.php';
    
    try {
        $pdfService = new PdfService($this->db);
        $pdfService->generarReporteTamanoMercado();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al generar PDF: ' . $e->getMessage()]);
    }
}

}
