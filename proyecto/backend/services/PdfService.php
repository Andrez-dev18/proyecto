<?php
require_once __DIR__ . '/../libraries/fpdf/fpdf.php';

class PdfService extends FPDF
{
    private $db;
    
    public function __construct($db)
    {
        parent::__construct('L', 'mm', 'A4');
        $this->db = $db;
    }
    
    public function generarReporteTamanoMercado()
    {
        $datos = $this->obtenerDatos();
        $resumen = $this->calcularResumen($datos);
        
        $this->AddPage();
        $this->SetMargins(10, 10, 10);
        
        // Título principal con el valor
        $this->SetFont('Arial', 'B', 14);
        $this->Cell(200, 10, utf8_decode('TAMAÑO DE MERCADO SUR'), 0, 0, 'L');
        $this->SetFont('Arial', 'B', 16);
        $this->SetTextColor(0, 0, 255);
        $this->Cell(0, 10, number_format($resumen['total_mercado'], 0, ',', '.'), 0, 1, 'R');
        $this->SetTextColor(0, 0, 0);
        $this->Ln(5);
        
        // Primera fila de tablas (Resúmenes)
        $y1 = $this->GetY();
        
        // Tabla 1: POTENCIAL DE VENTAS (Resumen)
        $this->SetXY(10, $y1);
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(100, 149, 237);
        $this->SetTextColor(255, 255, 255);
        $this->Cell(130, 6, 'POTENCIAL DE VENTAS', 1, 1, 'L', true);
        
        //$this->SetX(10);
        $this->Cell(65, 5, 'MAXIMO', 1, 0, 'C', true);
        $this->Cell(65, 5, 'MINIMO', 1, 1, 'C', true);
        
        $this->SetTextColor(0, 0, 0);
        $this->SetFont('Arial', '', 9);
        $this->SetX(10);
        $this->SetFillColor(173, 216, 230);
        $this->Cell(65, 5, 'PARTICIPACION DE MERCADO', 1, 0, 'L', true);
        $this->SetFillColor(255, 255, 255);
        $this->Cell(32.5, 5, '663.271', 1, 0, 'R', false);
        $this->Cell(32.5, 5, '513.100', 1, 1, 'R', false);
        
        $this->SetX(10);
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(173, 216, 230);
        $this->Cell(65, 5, 'TOTAL', 1, 0, 'L', true);
        $this->SetFillColor(255, 255, 255);
        $this->Cell(32.5, 5, '663.271', 1, 0, 'R', false);
        $this->Cell(32.5, 5, '513.100', 1, 1, 'R', false);
        
        // Tabla 2: Nro DE CLIENTES (Resumen) - al lado derecho
        $this->SetXY(150, $y1);
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(100, 149, 237);
        $this->SetTextColor(255, 255, 255);
        $this->Cell(130, 6, 'Nro DE CLIENTES', 1, 1, 'L', true);
        
        $this->SetX(150);
        $this->Cell(65, 5, 'MAXIMO', 1, 0, 'C', true);
        $this->Cell(65, 5, 'MINIMO', 1, 1, 'C', true);
        
        // Filas de datos
        $this->SetTextColor(0, 0, 0);
        $this->SetFont('Arial', '', 9);
        
        $categorias = [
            'AREQUIPA VIVO' => ['max' => 51, 'min' => 46],
            'AREQUIPA BENEFICIADO' => ['max' => 145, 'min' => 85],
            'PROVINCIAS VIVO' => ['max' => 231, 'min' => 231],
            'PROVINCIAS BENEFICIADO' => ['max' => 12, 'min' => 12],
            'TOTAL' => ['max' => 439, 'min' => 374]
        ];
        
        foreach($categorias as $cat => $valores) {
            $this->SetX(150);
            if($cat == 'TOTAL') {
                $this->SetFont('Arial', 'B', 9);
            }
            $this->SetFillColor(173, 216, 230);
            $this->Cell(65, 5, utf8_decode($cat), 1, 0, 'L', true);
            $this->SetFillColor(255, 255, 255);
            $this->Cell(32.5, 5, $valores['max'], 1, 0, 'R', false);
            $this->Cell(32.5, 5, $valores['min'], 1, 1, 'R', false);
            if($cat != 'TOTAL') {
                $this->SetFont('Arial', '', 9);
            }
        }
        
        // Segunda fila de tablas (Detalles por provincia)
        $this->Ln(10);
        $y2 = $this->GetY();
        
        // Tabla 3: POTENCIAL DE VENTAS (Detalle)
        $this->SetXY(10, $y2);
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(100, 149, 237);
        $this->SetTextColor(255, 255, 255);
        $this->Cell(130, 6, 'POTENCIAL DE VENTAS', 1, 1, 'L', true);
        
        $this->SetX(10);
        $this->Cell(65, 5, 'MAXIMO', 1, 0, 'C', true);
        $this->Cell(65, 5, 'MINIMO', 1, 1, 'C', true);
        
        // Datos por provincia
        $this->SetTextColor(0, 0, 0);
        $this->SetFont('Arial', '', 8);
        
        $provincias = [
            'AREQUIPA' => ['max' => 312809, 'min' => 223230],
            'CAMANA' => ['max' => 22540, 'min' => 18040],
            'ILO' => ['max' => 45255, 'min' => 40775],
            'LA JOYA' => ['max' => 11620, 'min' => 9240],
            'MOLLENDO' => ['max' => 25529, 'min' => 18039],
            'MOQUEGUA' => ['max' => 49350, 'min' => 43470],
            'PEDREGAL' => ['max' => 19670, 'min' => 11340],
            'TACNA' => ['max' => 87500, 'min' => 69510],
            'JULIACA' => ['max' => 78211, 'min' => 69806],
            'PUNO' => ['max' => 10787, 'min' => 8650]
        ];
        
        foreach($provincias as $prov => $valores) {
            $this->SetX(10);
            $this->SetFillColor(173, 216, 230);
            $this->Cell(43, 5, utf8_decode($prov), 1, 0, 'L', true);
            $this->SetFillColor(255, 255, 255);
            $this->Cell(43.5, 5, number_format($valores['max'], 0, ',', '.'), 1, 0, 'R', false);
            $this->Cell(43.5, 5, number_format($valores['min'], 0, ',', '.'), 1, 1, 'R', false);
        }
        
        // Total
        $this->SetX(10);
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(173, 216, 230);
        $this->Cell(43, 5, 'TOTAL', 1, 0, 'L', true);
        $this->SetFillColor(255, 255, 255);
        $this->Cell(43.5, 5, '663.271', 1, 0, 'R', false);
        $this->Cell(43.5, 5, '513.100', 1, 1, 'R', false);
        
        // Tabla 4: Nro DE CLIENTES (Detalle)
        $this->SetXY(150, $y2);
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(100, 149, 237);
        $this->SetTextColor(255, 255, 255);
        $this->Cell(130, 6, 'Nro DE CLIENTES', 1, 1, 'L', true);
        
        $this->SetX(150);
        $this->Cell(65, 5, 'MAXIMO', 1, 0, 'C', true);
        $this->Cell(65, 5, 'MINIMO', 1, 1, 'C', true);
        
        // Datos por provincia
        $this->SetTextColor(0, 0, 0);
        $this->SetFont('Arial', '', 8);
        
        $clientes = [
            'AREQUIPA' => ['max' => 196, 'min' => 131],
            'CAMANA' => ['max' => 16, 'min' => 16],
            'ILO' => ['max' => 36, 'min' => 36],
            'LA JOYA' => ['max' => 14, 'min' => 14],
            'MOLLENDO' => ['max' => 72, 'min' => 72],
            'MOQUEGUA' => ['max' => 36, 'min' => 36],
            'PEDREGAL' => ['max' => 10, 'min' => 10],
            'TACNA' => ['max' => 47, 'min' => 47],
            'JULIACA' => ['max' => 10, 'min' => 10],
            'PUNO' => ['max' => 2, 'min' => 2]
        ];
        
        foreach($clientes as $prov => $valores) {
            $this->SetX(150);
            $this->SetFillColor(173, 216, 230);
            $this->Cell(43, 5, utf8_decode($prov), 1, 0, 'L', true);
            $this->SetFillColor(255, 255, 255);
            $this->Cell(43.5, 5, $valores['max'], 1, 0, 'R', false);
            $this->Cell(43.5, 5, $valores['min'], 1, 1, 'R', false);
        }
        
        // Total
        $this->SetX(150);
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(173, 216, 230);
        $this->Cell(43, 5, 'TOTAL', 1, 0, 'L', true);
        $this->SetFillColor(255, 255, 255);
        $this->Cell(43.5, 5, '439', 1, 0, 'R', false);
        $this->Cell(43.5, 5, '374', 1, 1, 'R', false);
        
        $this->Output('D', 'reporte_tamano_mercado_' . date('Y-m-d') . '.pdf');
    }
    
    private function obtenerDatos()
    {
        $query = "
            SELECT 
                tmd.*,
                pv.nombre AS provincia_nombre,
                e.nombre AS empresa_nombre,
                tp.nombre AS tipo_nombre
            FROM com_db_tama_mer_dia tmd
            LEFT JOIN com_provincia pv ON tmd.provincia = pv.codigo
            LEFT JOIN com_empresa e ON tmd.empresa = e.codigo
            LEFT JOIN com_tipo_pollo tp ON tmd.tipo = tp.codigo
            WHERE DATE(tmd.fecha) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        ";
        
        $stmt = $this->db->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    private function calcularResumen($datos)
    {
        return ['total_mercado' => 1753466];
    }
}
