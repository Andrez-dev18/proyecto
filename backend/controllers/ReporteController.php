<?php
require_once __DIR__ . '/../services/CapturaPantallaBeneficiadoService.php';
require_once __DIR__ . '/../services/CapturaPantallaVivoService.php';

class ReporteController {
    private $beneficiadoService;
    private $vivoService;

    public function __construct($db) {
        $this->beneficiadoService = new CapturaPantallaBeneficiadoService($db);
        $this->vivoService = new CapturaPantallaVivoService($db);
    }

    private function outputCSV($filename, $headers, $data, $dataMapper) {
        // Configurar headers para descarga
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        // Abrir salida
        $output = fopen('php://output', 'w');
        
        // BOM para UTF-8 (para que Excel reconozca tildes)
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Escribir título
        fputcsv($output, [strtoupper($filename)], ';');
        fputcsv($output, ['Generado: ' . date('d/m/Y H:i:s')], ';');
        fputcsv($output, [], ';'); // Línea vacía
        
        // Escribir encabezados
        fputcsv($output, $headers, ';');
        
        // Escribir datos
        foreach ($data as $row) {
            fputcsv($output, $dataMapper($row), ';');
        }
        
        // Línea de resumen
        fputcsv($output, [], ';');
        fputcsv($output, ['Total de registros:', count($data)], ';');
        
        fclose($output);
        exit;
    }

    public function exportarArequipaBeneficiadoExcel() {
        $datos = $this->beneficiadoService->getListArequipaBeneficiado();
        
        $headers = [
            'AÑO', 'MES', 'PROVINCIA', 'ZONA', 'COMPRA GRS', 'TIPO CLIENTE',
            'NOMBRE', 'GRS', 'RP', 'RENZO', 'AVELINO', 'PELADORES', 'AVICRUZ',
            'RAFAEL', 'MATILDE', 'AVIROX', 'JULIA', 'SIMON', 'YESICA', 'GABRIEL',
            'ARTURO', 'NICOLAS', 'LUIS F', 'MIRELLA', 'OTROS',
            'POTENCIAL MIN', 'POTENCIAL MAX', 'CONDICIÓN PT MAX'
        ];
        
        $mapper = function($d) {
            return [
                $d['ano'],
                strtoupper($d['mes']),
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['zona'] ?? ''),
                $d['compraGrs'] ?? '',
                strtoupper($d['tipoCliente'] ?? ''),
                strtoupper($d['nombre'] ?? ''),
                $d['grs'],
                $d['rp'],
                $d['avicola_renzo'],
                $d['avelino'],
                $d['peladores'],
                $d['avicruz'],
                $d['rafael'],
                $d['matilde'],
                $d['avirox'],
                $d['julia'],
                $d['simon'],
                $d['yesica'],
                $d['gabriel'],
                $d['arturo'],
                $d['nicolas'],
                $d['luis_f'],
                $d['mirella'],
                $d['otros'],
                $d['potencialMinimo'],
                $d['potencialMaximo'],
                $d['condicionPtmax'] ?? ''
            ];
        };
        
        $this->outputCSV(
            'Arequipa_Beneficiado_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarProvinciaBeneficiadoExcel() {
        $datos = $this->beneficiadoService->getListProvinciaBeneficiado();
        
        $headers = [
            'AÑO', 'MES', 'PROVINCIA', 'ZONA', 'COMPRA GRS', 'TIPO CLIENTE',
            'NOMBRE', 'GRS', 'RP', 'GRS VIVO', 'SANTA ELENA', 'GRANJAS CHICAS',
            'ROSARIO', 'SAN FERNANDO LIMA', 'AVÍCOLA RENZO', 'OTROS',
            'POTENCIAL MIN', 'POTENCIAL MAX', 'CONDICIÓN PT MIN',
            'CONDICIÓN PT MAX', 'OBSERVACIONES'
        ];
        
        $mapper = function($d) {
            return [
                $d['ano'],
                strtoupper($d['mes']),
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['zona'] ?? ''),
                $d['compraGrs'] ?? '',
                strtoupper($d['tipoCliente'] ?? ''),
                strtoupper($d['nombre'] ?? ''),
                $d['grs'],
                $d['rp'],
                $d['grs_vivo'],
                $d['santa_elena'],
                $d['granjas_chicas'],
                $d['rosario'],
                $d['sanfern_lima'],
                $d['avicola_renzo'],
                $d['otros'],
                $d['potencialMinimo'],
                $d['potencialMaximo'],
                $d['condicionPtmin'] ?? '',
                $d['condicionPtmax'] ?? '',
                $d['observaciones'] ?? ''
            ];
        };
        
        $this->outputCSV(
            'Provincia_Beneficiado_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarArequipaVivoExcel() {
        $datos = $this->vivoService->getListArequipaVivo();
        
        $headers = [
            'AÑO', 'MES', 'PROVINCIA', 'ZONA', 'COMPRA', 'TIPO CLIENTE',
            'NOMBRE', 'GRS', 'RP', 'RENZO', 'FAFO', 'SANTA ANGELA',
            'ROSARIO', 'POLLO LIMA', 'OTRAS GRANJAS CHICAS',
            'POTENCIAL MIN', 'POTENCIAL MAX', 'CONDICIÓN PT MIN',
            'CONDICIÓN PT MAX', 'OBSERVACIONES'
        ];
        
        $mapper = function($d) {
            return [
                $d['ano'],
                strtoupper($d['mes']),
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['zona'] ?? ''),
                $d['compra'] ?? '',
                strtoupper($d['tipo_cliente'] ?? ''),
                strtoupper($d['nombre'] ?? ''),
                $d['grs'],
                $d['rp'],
                $d['renzo'],
                $d['fafo'],
                $d['santa_angela'],
                $d['rosario'],
                $d['pollo_lima'],
                $d['otras_granjas_chicas'],
                $d['potencial_minimo'],
                $d['potencial_maximo'],
                $d['condicion_ptmin'] ?? '',
                $d['condicion_ptmax'] ?? '',
                $d['observaciones'] ?? ''
            ];
        };
        
        $this->outputCSV(
            'Arequipa_Vivo_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarProvinciaVivoExcel() {
        $datos = $this->vivoService->getListProvinciaVivo();
        
        $headers = [
            'AÑO', 'MES', 'PROVINCIA', 'ZONA', 'COMPRA', 'TIPO CLIENTE',
            'NOMBRE', 'GRS', 'RP', 'RENZO', 'FAFO', 'SANTA ANGELA',
            'JORGE PAN', 'MIRIAN G', 'VASQUEZ', 'SAN JOAQUIN', 'FORTUNATO',
            'ROSARIO', 'PERCA', 'GAMBOA', 'ASOC SONDOR', 'OTRAS GRANJAS CHICAS',
            'POTENCIAL MIN', 'POTENCIAL MAX', 'CONDICIÓN PT MAX', 'OBSERVACIONES'
        ];
        
        $mapper = function($d) {
            return [
                $d['ano'],
                strtoupper($d['mes']),
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['zona'] ?? ''),
                $d['compra'] ?? '',
                strtoupper($d['tipo_cliente'] ?? ''),
                strtoupper($d['nombre'] ?? ''),
                $d['grs'],
                $d['rp'],
                $d['renzo'],
                $d['fafo'],
                $d['santa_angela'],
                $d['jorge_pan'],
                $d['mirian_g'],
                $d['vasquez'],
                $d['san_joaquin'],
                $d['fortunato'],
                $d['rosario'],
                $d['perca'],
                $d['gamboa'],
                $d['asoc_sondor'],
                $d['otras_granjas_chicas'],
                $d['potencial_minimo'],
                $d['potencial_maximo'],
                $d['condicion_ptmax'] ?? '',
                $d['observaciones'] ?? ''
            ];
        };
        
        $this->outputCSV(
            'Provincia_Vivo_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }
}
?>