<?php
require_once __DIR__ . '/../services/CapturaPantallaBeneficiadoService.php';
require_once __DIR__ . '/../services/CapturaPantallaVivoService.php';
require_once __DIR__ . '/../services/VivoArequipaService.php';
require_once __DIR__ . '/../services/VivoProvinciaService.php';
require_once __DIR__ . '/../services/beneficioProvinciaService.php';
require_once __DIR__ . '/../services/TamaMerDiaService.php';
require_once __DIR__ . '/../services/PrecioVivoService.php';
require_once __DIR__ . '/../services/PrecioTrozadoService.php';
require_once __DIR__ . '/../services/TiendaService.php';
require_once __DIR__ . '/../services/HuevoService.php';
require_once __DIR__ . '/../services/GallinaService.php';
require_once __DIR__ . '/../services/AlternoService.php';
require_once __DIR__ . '/../services/EnteroAutoserService.php';
require_once __DIR__ . '/../services/TrozadoAutoserService.php';
require_once __DIR__ . '/../services/CriadorEmprendedorService.php';
require_once __DIR__ . '/../services/GallinaCDService.php';
require_once __DIR__ . '/../services/IngresosLimaService.php';
require_once __DIR__ . '/../services/ProductoSustitutoService.php';
require_once __DIR__ . '/../services/MercadoService.php';
require_once __DIR__ . '/../services/ClienteProcesadoService.php';
require_once __DIR__ . '/../services/VendedorService.php';
require_once __DIR__ . '/../services/ProductoService.php';
require_once __DIR__ . '/../services/ClientePvService.php';
require_once __DIR__ . '/../services/InfoGRSService.php';

class ReporteController
{
    private $beneficiadoService;
    private $vivoService;
    private $VivoAqp;
    private $VivoProvincia;
    private $TamanoMercado;
    private $BeneficioProvincia;
    private $PrecioVivo;
    private $PrecioTrozado;
    private $Tienda;
    private $Huevo;
    private $Gallina;
    private $Alterno;
    private $EnteroAutoser;
    private $TrozadoAutoser;
    private $Criador;
    private $ProdSustituto;
    private $Ingresolima;
    private $GallinaCD;
    private $Mercado;
    private $Vendedor;
    private $Producto;
    private $ClienteProcesado;
    private $TrozadoDiario;
    private $InfoGrs;
    private $CtrlClientePV;

    public function __construct($db)
    {
        $this->beneficiadoService = new CapturaPantallaBeneficiadoService($db);
        $this->vivoService = new CapturaPantallaVivoService($db);
        $this->VivoAqp = new VivoArequipaService($db);
        $this->VivoProvincia = new VivoProvinciaService($db);
        $this->TamanoMercado = new TamaMerDiaService($db);
        $this->BeneficioProvincia = new beneficioProvinciaService($db);
        $this->PrecioVivo = new PrecioVivoService($db);
        $this->PrecioTrozado = new PrecioTrozadoService($db);
        $this->Tienda = new TiendaService($db);
        $this->Huevo = new HuevoService($db);
        $this->Gallina = new GallinaService($db);
        $this->Alterno = new AlternoService($db);
        $this->EnteroAutoser = new EnteroAutoserService($db);
        $this->TrozadoAutoser = new TrozadoAutoserService($db);
        $this->Criador = new CriadorEmprendedorService($db);
        $this->ProdSustituto = new ProductoSustitutoService($db);
        $this->Ingresolima = new IngresosLimaService($db);
        $this->GallinaCD = new GallinaCDService($db);
        $this->Mercado = new MercadoService($db);
        $this->Vendedor = new VendedorService($db);
        $this->Producto = new ProductoService($db);
        $this->ClienteProcesado = new ClienteProcesadoService($db);
        $this->TrozadoDiario = new TrozadoDiarioService($db);
        $this->InfoGrs = new InfoGRSService($db);
        $this->CtrlClientePV = new ClientePvService($db);
    }

    private function outputCSV($filename, $headers, $data, $dataMapper)
    {
        // Configurar headers para descarga
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        // Abrir salida
        $output = fopen('php://output', 'w');

        // BOM para UTF-8 (para que Excel reconozca tildes)
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

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

    public function exportarArequipaBeneficiadoExcel()
    {
        $datos = $this->beneficiadoService->getListArequipaBeneficiado();

        $headers = [
            'AÑO',
            'MES',
            'PROVINCIA',
            'ZONA',
            'COMPRA GRS',
            'TIPO CLIENTE',
            'NOMBRE',
            'GRS',
            'RP',
            'RENZO',
            'AVELINO',
            'PELADORES',
            'AVICRUZ',
            'RAFAEL',
            'MATILDE',
            'AVIROX',
            'JULIA',
            'SIMON',
            'YESICA',
            'GABRIEL',
            'ARTURO',
            'NICOLAS',
            'LUIS F',
            'MIRELLA',
            'OTROS',
            'POTENCIAL MIN',
            'POTENCIAL MAX',
            'CONDICIÓN PT MAX'
        ];

        $mapper = function ($d) {
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

    public function exportarProvinciaBeneficiadoExcel()
    {
        $datos = $this->beneficiadoService->getListProvinciaBeneficiado();

        $headers = [
            'AÑO',
            'MES',
            'PROVINCIA',
            'ZONA',
            'COMPRA GRS',
            'TIPO CLIENTE',
            'NOMBRE',
            'GRS',
            'RP',
            'GRS VIVO',
            'SANTA ELENA',
            'GRANJAS CHICAS',
            'ROSARIO',
            'SAN FERNANDO LIMA',
            'AVÍCOLA RENZO',
            'OTROS',
            'POTENCIAL MIN',
            'POTENCIAL MAX',
            'CONDICIÓN PT MIN',
            'CONDICIÓN PT MAX',
            'OBSERVACIONES'
        ];

        $mapper = function ($d) {
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

    public function exportarArequipaVivoExcel()
    {
        $datos = $this->vivoService->getListArequipaVivo();

        $headers = [
            'AÑO',
            'MES',
            'PROVINCIA',
            'ZONA',
            'COMPRA',
            'TIPO CLIENTE',
            'NOMBRE',
            'GRS',
            'RP',
            'RENZO',
            'FAFO',
            'SANTA ANGELA',
            'ROSARIO',
            'POLLO LIMA',
            'OTRAS GRANJAS CHICAS',
            'POTENCIAL MIN',
            'POTENCIAL MAX',
            'CONDICIÓN PT MIN',
            'CONDICIÓN PT MAX',
            'OBSERVACIONES'
        ];

        $mapper = function ($d) {
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

    public function exportarProvinciaVivoExcel()
    {
        $datos = $this->vivoService->getListProvinciaVivo();

        $headers = [
            'AÑO',
            'MES',
            'PROVINCIA',
            'ZONA',
            'COMPRA',
            'TIPO CLIENTE',
            'NOMBRE',
            'GRS',
            'RP',
            'RENZO',
            'FAFO',
            'SANTA ANGELA',
            'JORGE PAN',
            'MIRIAN G',
            'VASQUEZ',
            'SAN JOAQUIN',
            'FORTUNATO',
            'ROSARIO',
            'PERCA',
            'GAMBOA',
            'ASOC SONDOR',
            'OTRAS GRANJAS CHICAS',
            'POTENCIAL MIN',
            'POTENCIAL MAX',
            'CONDICIÓN PT MAX',
            'OBSERVACIONES'
        ];

        $mapper = function ($d) {
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

    public function exportarVivoProvinciaExcel()
    {
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

    public function exportarVivoArequipaExcel()
    {
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

    public function exportarTamanoMercadoExcel()
    {
        // Obtener todos los registros de la tabla com_db_tama_mer_dia
        $datos = $this->TamanoMercado->getAll();

        // Encabezados del archivo CSV
        $headers = [
            'ID',
            'FECHA',
            'TIPO',
            'LÍNEA',
            'PROVINCIA',
            'ZONA',
            'EMPRESA',
            'PROVEEDOR',
            'PRODUCTO',
            'CANTIDAD',
            'PESO',
            'PROMEDIO',
            'PRECIO',
            'INFO MERCADO',
            'BASE DE DATOS'
        ];

        // Mapeo de los datos
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['tipo'] ?? ''),
                strtoupper($d['linea'] ?? ''),
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['zona'] ?? ''),
                strtoupper($d['empresa'] ?? ''),
                strtoupper($d['proveedor'] ?? ''),
                strtoupper($d['producto'] ?? ''),
                $d['cantidad'] ?? '',
                $d['peso'] ?? '',
                $d['prom'] ?? '',
                $d['precio'] ?? '',
                $d['info_mercado'] ?? '',
                strtoupper($d['nom_db'] ?? '')
            ];
        };

        // Exportar a CSV
        $this->outputCSV(
            'Tamano_Mercado_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarBeneficioProvinciaExcel()
    {
        $datos = $this->BeneficioProvincia->getAll();

        // Encabezados del archivo Excel/CSV
        $headers = [
            'ID',
            'FECHA',
            'PROVINCIA',
            'PROVEEDOR',
            'PRECIO MAY. ENTERO',
            'PRECIO MAY. MEJORADO',
            'PRECIO MAY. CARCASA',
            'PRECIO PUB. MEJORADO',
            'PRECIO PUB. CARCASA',
            'PESO PROM. MENOR',
            'PESO PROM. MAYOR',
            'COLOR MIN',
            'COLOR MAX',
            'CANTIDAD',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos a formato plano
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['proveedor'] ?? ''),
                $d['precioMayEntero'] ?? '',
                $d['precioMayMejorado'] ?? '',
                $d['precioMayCarcasa'] ?? '',
                $d['precioPubMejorado'] ?? '',
                $d['precioPubCarcasa'] ?? '',
                $d['pesoPromMenor'] ?? '',
                $d['pesoPromMayor'] ?? '',
                $d['colorMin'] ?? '',
                $d['colorMax'] ?? '',
                $d['cantidad'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Llamar a la función genérica de exportación
        $this->outputCSV(
            'Beneficio_Provincia_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarPrecioVivoExcel()
    {
        // Obtener los datos desde el método findAll()
        $datos = $this->PrecioVivo->getAll();

        // Encabezados del archivo Excel/CSV
        $headers = [
            'ID',
            'FECHA',
            'EMPRESA',
            'PRECIO MIN. CENTRO ACOPIO',
            'PRECIO MAX. CENTRO ACOPIO',
            'PRECIO MIN. MAYORISTA REPARTO',
            'PRECIO MAX. MAYORISTA REPARTO',
            'PRECIO PUB. MIN',
            'PRECIO PUB. MAX',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos al formato plano
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['empresa'] ?? ''),
                $d['precioMinCentroAcopio'] ?? '',
                $d['precioMaxCentroAcopio'] ?? '',
                $d['precioMinMayoristaReparto'] ?? '',
                $d['precioMaxMayoristaReparto'] ?? '',
                $d['precioPubMin'] ?? '',
                $d['precioPubMax'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar el archivo CSV (puedes cambiar a Excel si lo prefieres)
        $this->outputCSV(
            'Precio_Vivo_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarPrecioTrozadoExcel()
    {

        $datos = $this->PrecioTrozado->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'EMPRESA',
            'CORTE',
            'PRECIO',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapeo de datos a formato plano
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['empresa'] ?? ''),
                strtoupper($d['corte'] ?? ''),
                $d['precio'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar a CSV o Excel
        $this->outputCSV(
            'Precio_Trozado_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarTiendaExcel()
    {

        $datos = $this->Tienda->getAll();

        // Encabezados del archivo Excel/CSV
        $headers = [
            'ID',
            'FECHA',
            'EMPRESA',
            'TIPO',
            'CÓDIGO PRODUCTO',
            'PRECIO',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapeo de los datos para exportación
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['empresa'] ?? ''),
                strtoupper($d['tipo'] ?? ''),
                strtoupper($d['codpro'] ?? ''),
                $d['precio'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Llamar a la función genérica de exportación
        $this->outputCSV(
            'Tienda_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarHuevoExcel()
    {

        $datos = $this->Huevo->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'PROVINCIA',
            'TIPO',
            'MERCADO',
            'PROVEEDOR',
            'PRECIO MAY. MIN',
            'PRECIO MAY. MAX',
            'PRECIO PUB. MIN',
            'PRECIO PUB. MAX',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['tipo'] ?? ''),
                strtoupper($d['mercado'] ?? ''),
                strtoupper($d['proveedor'] ?? ''),
                $d['precioMayMin'] ?? '',
                $d['precioMayMax'] ?? '',
                $d['precioPubMin'] ?? '',
                $d['precioPubMax'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar como CSV (o Excel si usas PhpSpreadsheet)
        $this->outputCSV(
            'Huevo_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarGallinaExcel()
    {

        $datos = $this->Gallina->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'TIPO',
            'PRECIO MAY. MIN',
            'PRECIO MAY. MAX',
            'PRECIO PUB. MIN',
            'PRECIO PUB. MAX',
            'CANTIDAD',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['tipo'] ?? ''),
                $d['precioMayMin'] ?? '',
                $d['precioMayMax'] ?? '',
                $d['precioPubMin'] ?? '',
                $d['precioPubMax'] ?? '',
                $d['cantidad'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar como CSV (usa tu función genérica)
        $this->outputCSV(
            'Gallina_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarAlternoExcel()
    {
        $datos = $this->Alterno->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'PROVINCIA',
            'MERCADO',
            'TIPO',
            'PRECIO MIN',
            'PRECIO MAX',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapeo de los datos a formato plano
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['mercado'] ?? ''),
                strtoupper($d['tipo'] ?? ''),
                $d['precioMin'] ?? '',
                $d['precioMax'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar como CSV (puedes adaptar a Excel si usas PhpSpreadsheet)
        $this->outputCSV(
            'Alterno_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarEnteroAutoSerExcel()
    {
        $datos = $this->EnteroAutoser->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'PROVEEDOR',
            'PRECIO MAY. MIN',
            'PRECIO MAY. MAX',
            'PRECIO PUB. MIN',
            'PRECIO PUB. MAX',
            'COLOR',
            'CANTIDAD',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapeo de los datos al formato del archivo
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['proveedor'] ?? ''),
                $d['precioMayMin'] ?? '',
                $d['precioMayMax'] ?? '',
                $d['precioPubMin'] ?? '',
                $d['precioPubMax'] ?? '',
                strtoupper($d['color'] ?? ''),
                $d['cantidad'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Llamar al método genérico para generar el archivo CSV
        $this->outputCSV(
            'Entero_AutoSer_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarTrozadoAutoserExcel()
    {
        $datos = $this->TrozadoAutoser->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'CORTE',
            'PRECIO SUPERMERCADO',
            'PRECIO PLAZA VEA',
            'PRECIO TOTTUS',
            'PRECIO METRO',
            'PRECIO TIENDA PALOMAR',
            'PRECIO TIENDA RICO POLLO',
            'PRECIO AVELINO',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['corte'] ?? ''),
                $d['precioSuper'] ?? '',
                $d['precioPlazaVea'] ?? '',
                $d['precioTottus'] ?? '',
                $d['precioMetro'] ?? '',
                $d['precioTiendaPalomar'] ?? '',
                $d['precioTiendaRicoPollo'] ?? '',
                $d['precioAvelino'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar como CSV (o Excel)
        $this->outputCSV(
            'Trozado_Autoser_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarCriadorEmprendedorExcel()
    {
        // Obtener los datos desde el método findAll()
        $datos = $this->Criador->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'PROVINCIA',
            'PROVEEDOR',
            'TIPO',
            'CANTIDAD',
            'PRECIO',
            'OBSERVACIONES',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['proveedor'] ?? ''),
                strtoupper($d['tipo'] ?? ''),
                $d['cantidad'] ?? '',
                $d['precio'] ?? '',
                strtoupper($d['observaciones'] ?? ''),
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar como CSV (o Excel si usas PhpSpreadsheet)
        $this->outputCSV(
            'Criador_Emprendedor_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarProdSustitutoExcel()
    {
        // Obtener los datos desde el método findAll()
        $datos = $this->ProdSustituto->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'PRODUCTO',
            'PESO',
            'PRECIO',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['producto'] ?? ''),
                $d['peso'] ?? '',
                $d['precio'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar como CSV (o Excel si usas PhpSpreadsheet)
        $this->outputCSV(
            'Prod_Sustituto_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarGallinaCdExcel()
    {
        // Obtener los datos desde el método findAll()
        $datos = $this->GallinaCD->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'TIPO',
            'UNIDADES',
            'KILOS',
            'PESO',
            'PRECIO GRANJA 1',
            'PRECIO GRANJA 2',
            'PRECIO GRANJA 3',
            'PRECIO GRANJA 4',
            'PRECIO GRANJA 5',
            'PRECIO CD 1',
            'PRECIO CD 2',
            'PRECIO CD 3',
            'PRECIO CD 4',
            'PRECIO CD 5',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['tipo'] ?? ''),
                $d['unidades'] ?? '',
                $d['kilos'] ?? '',
                $d['peso'] ?? '',
                $d['precio_granja_1'] ?? '',
                $d['precio_granja_2'] ?? '',
                $d['precio_granja_3'] ?? '',
                $d['precio_granja_4'] ?? '',
                $d['precio_granja_5'] ?? '',
                $d['precio_cd_1'] ?? '',
                $d['precio_cd_2'] ?? '',
                $d['precio_cd_3'] ?? '',
                $d['precio_cd_4'] ?? '',
                $d['precio_cd_5'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar como CSV (puedes cambiar a Excel si usas PhpSpreadsheet)
        $this->outputCSV(
            'Gallina_CD_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarIngreEmpLimaExcel()
    {
        // Obtener los datos desde el método findAll()
        $datos = $this->Ingresolima->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'EMPRESA',
            'UNIDAD FIJA',
            'UNIDAD MOVIL',
            'KILOS',
            'PESO PROMEDIO',
            'PRECIO CAMPO',
            'PRECIO GRANJA',
            'SOLES',
            'PARTICIPACION',
            'USUARIO REGISTRO',
            'FECHA REGISTRO',
            'USUARIO TRANSFERENCIA',
            'FECHA TRANSFERENCIA'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['empresa'] ?? ''),
                $d['unidad_fija'] ?? '',
                $d['unidad_movil'] ?? '',
                $d['kilos'] ?? '',
                $d['peso_promedio'] ?? '',
                $d['precio_campo'] ?? '',
                $d['precio_granja'] ?? '',
                $d['soles'] ?? '',
                $d['participacion'] ?? '',
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? '',
                strtoupper($d['usuarioTransferencia'] ?? ''),
                $d['fechaHoraTransferencia'] ?? ''
            ];
        };

        // Exportar como CSV (o Excel si usas PhpSpreadsheet)
        $this->outputCSV(
            'Ingre_Emp_Lima_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarMercadoExcel()
    {
        // Obtener los datos desde la BD
        $datos = $this->Mercado->getAll();

        // Encabezados del archivo
        $headers = [
            'CÓDIGO',
            'NOMBRE'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['codigo'] ?? '',
                strtoupper($d['nombre'] ?? '')
            ];
        };

        // Exportar como CSV
        $this->outputCSV(
            'Mercados_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarClienteProcesadosExcel()
    {
        // Obtener los datos desde la BD
        $datos = $this->ClienteProcesado->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'DISTRITO',
            'ZONA',
            'CANAL',
            'CÓDIGO',
            'LÍNEA',
            'SUBLÍNEA',
            'VENDEDOR',
            'CLIENTE',
            'DESCRIPCIÓN',
            'RUTA',
            'NOM RUTA',
            'UNIDAD',
            'PESO',
            'IMPORTE',
            'NOM_DB',
            'USUARIO REGISTRO',
            'FECHA REGISTRO'
        ];

        // Mapeo de datos
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['distrito'] ?? ''),
                strtoupper($d['zona'] ?? ''),
                strtoupper($d['canal'] ?? ''),
                $d['codigo'] ?? '',
                strtoupper($d['linea'] ?? ''),
                strtoupper($d['sublinea'] ?? ''),
                strtoupper($d['vendedor'] ?? ''),
                strtoupper($d['cliente'] ?? ''),
                strtoupper($d['descripcion'] ?? ''),
                $d['ruta'] ?? '',
                strtoupper($d['nomruta'] ?? ''),
                $d['unidad'] ?? '',
                $d['peso'] ?? '',
                $d['importe'] ?? '',
                strtoupper($d['nom_db'] ?? ''),
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? ''
            ];
        };

        // Exportar CSV
        $this->outputCSV(
            'Cliente_Procesados_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarVendedoresExcel()
    {
        // Obtener los datos desde la BD
        $datos = $this->Vendedor->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'VENDEDOR',
            'CANAL',
            'ZONA'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                strtoupper($d['vendedor'] ?? ''),
                strtoupper($d['canal'] ?? ''),
                strtoupper($d['zona'] ?? '')
            ];
        };

        // Exportar como CSV
        $this->outputCSV(
            'Vendedores_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarComProductoExcel()
    {
        // Obtener los datos desde la BD
        $datos = $this->Producto->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'DESCRIPCIÓN',
            'LÍNEA',
            'SUBLÍNEA',
            'CÓDIGO'
        ];

        // Mapear los datos obtenidos del query
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                strtoupper($d['descripcion'] ?? ''),
                strtoupper($d['linea'] ?? ''),
                strtoupper($d['sublinea'] ?? ''),
                $d['codigo'] ?? ''
            ];
        };

        // Exportar como CSV
        $this->outputCSV(
            'Com_Productos_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarTrozadoDiarioExcel()
    {
        // Obtener los datos
        $datos = $this->TrozadoDiario->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'ZONA',
            'LINEA',
            'CODIGO',
            'PRODUCTO',
            'CANTIDAD',
            'PRECIO',
            'PESO',
            'IMPORTE',
            'PROMEDIO',
            'BD',
            'USUARIO REGISTRO',
            'FECHA REGISTRO'
        ];

        // Mapear cada fila
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['zona'] ?? ''),
                strtoupper($d['linea'] ?? ''),
                $d['codigo'] ?? '',
                strtoupper($d['producto'] ?? ''),
                $d['cantidad'] ?? '',
                $d['precio'] ?? '',
                $d['peso'] ?? '',
                $d['importe'] ?? '',
                $d['pprom'] ?? '',
                strtoupper($d['nom_db'] ?? ''),
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? ''
            ];
        };

        // Exportar CSV
        $this->outputCSV(
            'Trozado_Diario_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarCtrlClientePVExcel()
    {
        // Obtener los datos
        $datos = $this->CtrlClientePV->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'ZONA',
            'SUBZONA',
            'CLIENTE',
            'COORPORATIVO',
            'CARNE UNIDADES',
            'CARNE KILOS',
            'CARNE SOLES',
            'BRASA UNIDADES',
            'BRASA KILOS',
            'BRASA SOLES',
            'TOTAL UNIDADES',
            'TOTAL KILOS',
            'TOTAL SOLES',
            'BD',
            'USUARIO REGISTRO',
            'FECHA REGISTRO'
        ];

        // Mapear cada fila (convertir algunos a mayúsculas)
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['zona'] ?? ''),
                strtoupper($d['subzona'] ?? ''),
                strtoupper($d['cliente'] ?? ''),
                strtoupper($d['coorporativo'] ?? ''),
                $d['carne_unidad'] ?? '',
                $d['carne_kilos'] ?? '',
                $d['carne_soles'] ?? '',
                $d['brasa_unidad'] ?? '',
                $d['brasa_kilos'] ?? '',
                $d['brasa_soles'] ?? '',
                $d['total_unidad'] ?? '',
                $d['total_kilos'] ?? '',
                $d['total_soles'] ?? '',
                strtoupper($d['nom_db'] ?? ''),
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? ''
            ];
        };

        // Exportar CSV
        $this->outputCSV(
            'Ctrl_Cliente_PV_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }

    public function exportarInfoGrsExcel()
    {
        // Obtener los datos
        $datos = $this->InfoGrs->getAll();

        // Encabezados del archivo
        $headers = [
            'ID',
            'FECHA',
            'PROVINCIA',
            'ZONA',
            'TIPO',
            'CATEGORIA',
            'LINEA',
            'CODIGO',
            'DESCRIPCION',
            'CANTIDAD',
            'PRECIO',
            'PESO',
            'IMPORTE',
            'PROM. PESO',
            'MERCADO',
            'BD',
            'USUARIO REGISTRO',
            'FECHA REGISTRO'
        ];

        // Mapear cada fila
        $mapper = function ($d) {
            return [
                $d['id'] ?? '',
                $d['fecha'] ?? '',
                strtoupper($d['provincia'] ?? ''),
                strtoupper($d['zona'] ?? ''),
                strtoupper($d['tipo'] ?? ''),
                strtoupper($d['categoria'] ?? ''),
                strtoupper($d['linea'] ?? ''),
                $d['codigo'] ?? '',
                strtoupper($d['descripcion'] ?? ''),
                $d['cantidad'] ?? '',
                $d['precio'] ?? '',
                $d['peso'] ?? '',
                $d['importe'] ?? '',
                $d['peso_prom'] ?? '',
                strtoupper($d['mercado'] ?? ''),
                strtoupper($d['nom_db'] ?? ''),
                strtoupper($d['usuarioRegistro'] ?? ''),
                $d['fechaHoraRegistro'] ?? ''
            ];
        };

        // Exportar CSV
        $this->outputCSV(
            'Info_GRS_' . date('Y-m-d') . '.csv',
            $headers,
            $datos,
            $mapper
        );
    }
}
