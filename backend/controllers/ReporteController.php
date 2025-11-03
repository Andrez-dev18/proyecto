<?php
require_once __DIR__ . '/../services/CapturaPantallaBeneficiadoService.php';
require_once __DIR__ . '/../services/CapturaPantallaVivoService.php';
require_once __DIR__ . '/../services/VivoArequipaService.php';
require_once __DIR__ . '/../services/VivoProvinciaService.php';

class ReporteController {
    private $beneficiadoService;
    private $vivoService;
    private $VivoAqp;
    private $VivoProvincia;

    public function __construct($db) {
        $this->beneficiadoService = new CapturaPantallaBeneficiadoService($db);
        $this->vivoService = new CapturaPantallaVivoService($db);
        $this->VivoAqp = new VivoArequipaService($db);
        $this->VivoProvincia = new VivoProvinciaService($db);
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

    public function exportarVivoProvinciaExcel() {
    $datos = $this->VivoProvincia->getAll();

    $headers = [
        'ID',
        'FECHA',
        'PROVINCIA',
        'PROVEEDOR',
        'RUC PROVEEDOR',
        'TIPO',
        'LINEA',
        'PRECIO MAY. CARNE MIN',
        'PRECIO MAY. CARNE MAX',
        'PRECIO MAY. BRASA MIN',
        'PRECIO MAY. BRASA MAX',
        'PRECIO PUB. MIN',
        'PRECIO PUB. MAX',
        'PESO MACHO PROM. MIN',
        'PESO MACHO PROM. MAX',
        'PESO HEMBRA PROM. MIN',
        'PESO HEMBRA PROM. MAX',
        'PESO BRASA PROM. MIN',
        'PESO BRASA PROM. MAX',
        'COLOR MIN',
        'COLOR MAX',
        'CANTIDAD',
        'USUARIO REGISTRO',
        'FECHA REGISTRO',
        'USUARIO TRANSFERENCIA',
        'FECHA TRANSFERENCIA'
    ];

    $mapper = function ($d) {
        return [
            $d['id'] ?? '',
            $d['fecha'] ?? '',
            strtoupper($d['provincia'] ?? ''),
            strtoupper($d['proveedor'] ?? ''),
            $d['ruc_proveedor'] ?? '',
            strtoupper($d['tipo'] ?? ''),
            strtoupper($d['linea'] ?? ''),
            $d['precioMayCarMin'] ?? '',
            $d['precioMayCarMax'] ?? '',
            $d['precioMayBraMin'] ?? '',
            $d['precioMayBraMax'] ?? '',
            $d['precioPubMin'] ?? '',
            $d['precioPubMax'] ?? '',
            $d['pesoMachoPromMin'] ?? '',
            $d['pesoMachoPromMax'] ?? '',
            $d['pesoHembraPromMin'] ?? '',
            $d['pesoHembraPromMax'] ?? '',
            $d['pesoBrasaPromMin'] ?? '',
            $d['pesoBrasaPromMax'] ?? '',
            $d['colorMin'] ?? '',
            $d['colorMax'] ?? '',
            $d['cantidad'] ?? '',
            strtoupper($d['usuarioRegistro'] ?? ''),
            $d['fechaHoraRegistro'] ?? '',
            strtoupper($d['usuarioTransferencia'] ?? ''),
            $d['fechaHoraTransferencia'] ?? ''
        ];
    };

    $this->outputCSV(
        'Vivo_Provincia_' . date('Y-m-d') . '.csv',
        $headers,
        $datos,
        $mapper
    );
}

    public function exportarVivoArequipaExcel() {
    $datos = $this->VivoAqp->getAll();

    $headers = [
        'ID',
        'FECHA',
        'MERCADO',
        'EMPRESA',
        'RUC EMPRESA',
        'CONDICIÓN',
        'PROVEEDOR',
        'RUC PROVEEDOR',
        'PRECIO MAY. MIN',
        'PRECIO MAY. MAX',
        'PRECIO PUB. MIN',
        'PRECIO PUB. MAX',
        'PESO MACHO MIN',
        'PESO MACHO MAX',
        'PESO HEMBRA MIN',
        'PESO HEMBRA MAX',
        'COLOR MIN',
        'COLOR MAX',
        'PESO MACHO PROM. MIN',
        'PESO MACHO PROM. MAX',
        'PESO HEMBRA PROM. MIN',
        'PESO HEMBRA PROM. MAX',
        'CANTIDAD',
        'USUARIO REGISTRO',
        'FECHA REGISTRO',
        'USUARIO TRANSFERENCIA',
        'FECHA TRANSFERENCIA'
    ];

    $mapper = function ($d) {
        return [
            $d['id'] ?? '',
            $d['fecha'] ?? '',
            strtoupper($d['mercado'] ?? ''),
            strtoupper($d['empresa'] ?? ''),
            $d['ruc_empresa'] ?? '',
            strtoupper($d['condicion'] ?? ''),
            strtoupper($d['proveedor'] ?? ''),
            $d['ruc_proveedor'] ?? '',
            $d['precioMayMin'] ?? '',
            $d['precioMayMax'] ?? '',
            $d['precioPubMin'] ?? '',
            $d['precioPubMax'] ?? '',
            $d['pesoMachoMin'] ?? '',
            $d['pesoMachoMax'] ?? '',
            $d['pesoHembMin'] ?? '',
            $d['pesoHembMax'] ?? '',
            $d['colorMin'] ?? '',
            $d['colorMax'] ?? '',
            $d['pesoMachoPromMin'] ?? '',
            $d['pesoMachoPromMax'] ?? '',
            $d['pesoHembraPromMin'] ?? '',
            $d['pesoHembraPromMax'] ?? '',
            $d['cantidad'] ?? '',
            strtoupper($d['usuarioRegistro'] ?? ''),
            $d['fechaHoraRegistro'] ?? '',
            strtoupper($d['usuarioTransferencia'] ?? ''),
            $d['fechaHoraTransferencia'] ?? ''
        ];
    };

    $this->outputCSV(
        'Vivo_Arequipa_' . date('Y-m-d') . '.csv',
        $headers,
        $datos,
        $mapper
    );
}


}
?>