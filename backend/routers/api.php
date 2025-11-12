<?php
require_once __DIR__ . '/../middleware/security.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/VivoController.php';
require_once __DIR__ . '/../controllers/BeneficiadoController.php';
require_once __DIR__ . '/../controllers/ReporteController.php';
require_once __DIR__ . '/../controllers/VivoArequipaController.php';
require_once __DIR__ . '/../controllers/CondicionController.php';
require_once __DIR__ . '/../controllers/EmpresaController.php';
require_once __DIR__ . '/../controllers/MercadoController.php';
require_once __DIR__ . '/../controllers/ProveedorController.php';
require_once __DIR__ . '/../controllers/ProvinciaController.php';
require_once __DIR__ . '/../controllers/TipoController.php';
require_once __DIR__ . '/../controllers/VivoProvinciaController.php';
require_once __DIR__ . '/../controllers/UsuarioController.php';
require_once __DIR__ . '/../controllers/beneficioProvinciaController.php';
require_once __DIR__ . '/../controllers/PrecioVivoController.php';
require_once __DIR__ . '/../controllers/PrecioTrozadoController.php';
require_once __DIR__ . '/../controllers/TiendaController.php';
require_once __DIR__ . '/../controllers/HuevoController.php';
require_once __DIR__ . '/../controllers/GallinaController.php';
require_once __DIR__ . '/../controllers/AlternoController.php';
require_once __DIR__ . '/../controllers/EnteroAutoserController.php';
require_once __DIR__ . '/../controllers/TrozadoAutoserController.php';
require_once __DIR__ . '/../controllers/CriadorEmprendedorController.php';
require_once __DIR__ . '/../controllers/TamaMerDiaController.php';
require_once __DIR__ . '/../controllers/TipoPolloController.php';
require_once __DIR__ . '/../controllers/TipoPolloVivoController.php';
require_once __DIR__ . '/../controllers/CorteController.php';
require_once __DIR__ . '/../controllers/ETL_Controller.php';

/*header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");*/

// Manejo del preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo establecer JSON como default si NO es una descarga de Excel
if (strpos($_SERVER["REQUEST_URI"], '/reporte/') === false) {
    header("Content-Type: application/json; charset=UTF-8");
}

$db = (new Database())->getConnection();
$UserController = new UsuarioController($db);
$vivoController = new VivoController($db);
$beneficiadoController = new BeneficiadoController($db);
$reporteController = new ReporteController($db);
$VivoArequipaController = new VivoArequipaController($db);
$CondicionController = new CondicionController($db);
$EmpresaController = new EmpresaController($db);
$MercadoController = new MercadoController($db);
$ProveedorController = new ProveedorController($db);
$ProvinciaController = new ProvinciaController($db);
$TipoController = new TipoController($db);
$TipoPolloController = new TipoPolloController($db);
$TipoPolloVivoController = new TipoPolloVivoController($db);
$VivoProvinciaController = new VivoProvinciaController($db);
$BeneficioProvincia = new beneficioProvinciaController($db);
$PrecioVivoController = new PrecioVivoController($db);
$PrecioTrozadoController = new PrecioTrozadoController($db);
$TiendaController = new TiendaController($db);
$HuevoController = new HuevoController($db);
$GallinaController = new GallinaController($db);
$AlternoController = new AlternoController($db);
$EnteroAutoserController = new EnteroAutoserController($db);
$TrozadoAutoserController = new TrozadoAutoserController($db);
$CriadorEmprendedorController = new CriadorEmprendedorController($db);
$TamaMerDiaController = new TamaMerDiaController($db);
$CorteController = new CorteController($db);
$ETLController = new ETL_Controller($db);

$request = $_SERVER["REQUEST_METHOD"];
// IMPORTANTE: Usar parse_url para separar path de query string
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// ========== RUTAS REPORTES EXCEL (PRIMERO, para que no interfieran) ==========
if (strpos($path, "/reporte/beneficiado/arequipa/excel") !== false && $request == "GET") {
    $reporteController->exportarArequipaBeneficiadoExcel();
    exit;
} 
elseif (strpos($path, "/reporte/beneficiado/provincia/excel") !== false && $request == "GET") {
    $reporteController->exportarProvinciaBeneficiadoExcel();
    exit;
} 
elseif (strpos($path, "/reporte/vivo/arequipa/excel") !== false && $request == "GET") {
    $reporteController->exportarArequipaVivoExcel();
    exit;
} 
elseif (strpos($path, "/reporte/vivo/provincia/excel") !== false && $request == "GET") {
    $reporteController->exportarProvinciaVivoExcel();
    exit;
}elseif (strpos($path, "/reporte/vivoProvincia/excel") !== false && $request == "GET") {
    $reporteController->exportarVivoProvinciaExcel();
    exit;
}elseif (strpos($path, "/reporte/vivoArequipa/excel") !== false && $request == "GET") {
    $reporteController->exportarVivoArequipaExcel();
    exit;
}

// ========== RUTAS LOGIN ==========
elseif (strpos($path, "/usuario/login") !== false && $request == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $UserController->login($data);
    exit;
}// ========== RUTAS SESIÓN ==========
elseif (strpos($path, "/usuario/validarSesion") !== false && $request == "GET") {
    require_once __DIR__ . '/../controllers/session.php';
    exit;
}
elseif (strpos($path, "/usuario/logout") !== false && $request == "GET") {
    require_once __DIR__ . '/../controllers/logout.php';
    exit;
}



// ========== RUTAS VIVO ==========

// GET Vivo Arequipa (con o sin filtros)
elseif (strpos($path, "/vivo/arequipa") !== false && $request == "GET") {
    // Si hay parámetros GET, usar filtrado
    if (!empty($_GET)) {
        $vivoController->filtrarArequipa();
    } else {
        $vivoController->getArequipa();
    }
    exit;
}

// GET Vivo Provincia (con o sin filtros)
elseif (strpos($path, "/vivo/provincia") !== false && $request == "GET") {
    if (!empty($_GET)) {
        $vivoController->filtrarProvincia();
    } else {
        $vivoController->getProvincia();
    }
    exit;
}

// GET Vivo All
elseif (strpos($path, "/vivo/all") !== false && $request == "GET") {
    $vivoController->getAll();
    exit;
}

// POST Vivo Crear
elseif (strpos($path, "/vivo/crear") !== false && $request == "POST") {
    $vivoController->create();
    exit;
}

// PUT Vivo Actualizar
elseif (strpos($path, "/vivo/actualizar") !== false && $request == "PUT") {
    $vivoController->update();
    exit;
}

// DELETE Vivo Borrar
elseif (preg_match("/\/vivo\/borrar\/(\d+)/", $path, $matches) && $request == "DELETE") {
    $vivoController->delete($matches[1]);
    exit;
}

// ========== RUTAS BENEFICIADO ==========

// GET Beneficiado Arequipa (con o sin filtros)
elseif (strpos($path, "/beneficiado/arequipa") !== false && $request == "GET") {
    // Si hay parámetros GET, usar filtrado
    if (!empty($_GET)) {
        $beneficiadoController->filtrarArequipa();
    } else {
        $beneficiadoController->getArequipa();
    }
    exit;
}

// GET Beneficiado Provincia (con o sin filtros)
elseif (strpos($path, "/beneficiado/provincia") !== false && $request == "GET") {
    if (!empty($_GET)) {
        $beneficiadoController->filtrarProvincia();
    } else {
        $beneficiadoController->getProvincia();
    }
    exit;
}

// GET Beneficiado All
elseif (strpos($path, "/beneficiado/all") !== false && $request == "GET") {
    $beneficiadoController->getAll();
    exit;
}

// POST Beneficiado Crear
elseif (strpos($path, "/beneficiado/crear") !== false && $request == "POST") {
    $beneficiadoController->create();
    exit;
}

// PUT Beneficiado Actualizar
elseif (strpos($path, "/beneficiado/actualizar") !== false && $request == "PUT") {
    $beneficiadoController->update();
    exit;
}

// DELETE Beneficiado Borrar
elseif (preg_match("/\/beneficiado\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && $request == "DELETE") {
    $beneficiadoController->delete($matches[1]);
    exit;
}


//################## RUTAS VIVO AREQUIPA #################################
// GET Vivo All
elseif (strpos($path, "/vivoArequipa/all") !== false && $request == "GET") {
    $VivoArequipaController->getAll();
    exit;
} elseif (strpos($path, "/vivoArequipa/filtro") !== false && $request == "GET") {
    $VivoArequipaController->obtenerDatosFiltrados();
    exit;
}
// POST Vivo Arequipa Crear
elseif (strpos($path, "/vivoArequipa/crear") !== false && $request == "POST") {
    $VivoArequipaController->create();
    exit;
}
// PUT Vivo Arequipa Actualizar (aceptar PUT o POST como fallback)
elseif (strpos($path, "/vivoArequipa/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $VivoArequipaController->update();
    exit;
}
// DELETE Vivo Arequipa Borrar (aceptar DELETE o POST como fallback)
elseif (preg_match("/\/vivoArequipa\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $VivoArequipaController->delete($matches[1]);
    exit;
}

//################## RUTAS VIVO PROVINCIA #################################
// GET Vivo All
elseif (strpos($path, "/vivoProvincia/all") !== false && $request == "GET") {
    $VivoProvinciaController->getAll();
    exit;
}elseif (strpos($path, "/vivoProvincia/filtro") !== false && $request == "GET") {
    $VivoProvinciaController->obtenerDatosFiltrados();
    exit;
}
// POST Vivo Provincia Crear
elseif (strpos($path, "/vivoProvincia/crear") !== false && $request == "POST") {
    $VivoProvinciaController->create();
    exit;
}
// PUT Vivo Provincia Actualizar (aceptar PUT o POST como fallback)
elseif (strpos($path, "/vivoProvincia/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $VivoProvinciaController->update();
    exit;
}
// DELETE Vivo Provincia Borrar (aceptar DELETE o POST como fallback)
elseif (preg_match("/\/vivoProvincia\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $VivoProvinciaController->delete($matches[1]);
    exit;
}



 //######### RUTAS CONDICION #########
elseif (strpos($path, "/condicion/all") !== false && $request == "GET") {
    $CondicionController->getAll();
    exit;
    //########## RUTAS EMPRESA #########
}elseif (strpos($path, "/empresa/all") !== false && $request == "GET") {
    $EmpresaController->getAll();
    exit;
    //######### RUTAS MERCADO #########
}elseif (strpos($path, "/mercado/all") !== false && $request == "GET") {
    $MercadoController->getAll();
    exit;
    //######### RUTAS PROVEEDOR #########
}elseif (strpos($path, "/proveedor/all") !== false && $request == "GET") {
    $ProveedorController->getAll();
    exit;
    ######### RUTAS PROVINCIA #########
}elseif (strpos($path, "/provincia/all") !== false && $request == "GET") {
    $ProvinciaController->getAll();
    exit;
    ######### RUTAS TIPO #########
}elseif (strpos($path, "/tipo/all") !== false && $request == "GET") {
    $TipoController->getAll();
    exit;
    ############### RUTA TIPO POLLO ####################
}elseif (strpos($path, "/tipoPollo/all") !== false && $request == "GET") {
    $TipoPolloController->getAll();
    exit;
    ################ RUTA TIPO POLLO VIVO #########################
}elseif (strpos($path, "/tipoPolloVivo/all") !== false && $request == "GET") {
    $TipoPolloVivoController->getAll();
    exit;
    ############## RUTA CORTES###################
}elseif (strpos($path, "/corte/all") !== false && $request == "GET") {
    $CorteController->getAll();
    exit;
}



//======================== RUTAS PARA NUEVAS TABLAS ====================================


######### RUTAS BENEFICIO PROVINCIA #########
// obtener todos
elseif (strpos($path, "/beneficioProvincia/all") !== false && $request == "GET") {
    $BeneficioProvincia->getAll();
    exit;
    //crear
}elseif (strpos($path, "/beneficioProvincia/crear") !== false && $request == "POST") {
    $BeneficioProvincia->create();
    exit;
}
//actualizar
elseif (strpos($path, "/beneficioProvincia/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $BeneficioProvincia->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/beneficioProvincia\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $BeneficioProvincia->delete($matches[1]);
    exit;
    //filtro uso: filtro?fechaInicio=2025-10-01&fechaFin=2025-10-20&provincia=2&proveedor=5
}elseif (strpos($path, "/beneficioProvincia/filtro") !== false && $request == "GET") {
    $BeneficioProvincia->obtenerDatosFiltrados();
    exit;
    //EXPORTAR EN FORMATO EXCEL
}elseif (strpos($path, "/beneficioProvincia/exportar") !== false && $request == "GET") {
    $reporteController->exportarBeneficioProvinciaExcel();
    exit;
}

######### RUTAS PRECIO VIVO #########
// obtener todos
elseif (strpos($path, "/precioVivo/all") !== false && $request == "GET") {
    $PrecioVivoController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/precioVivo/crear") !== false && $request == "POST") {
    $PrecioVivoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/precioVivo/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $PrecioVivoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/precioVivo\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $PrecioVivoController->delete($matches[1]);
    exit;
    //filtro uso: filtro?fechaInicio=2025-10-01&fechaFin=2025-10-20&empresa=2
}elseif (strpos($path, "/precioVivo/filtro") !== false && $request == "GET") {
    $PrecioVivoController->obtenerDatosFiltrados();
    exit;
  //EXPORTAR EN FORMATO EXCEL
}elseif (strpos($path, "/precioVivo/exportar") !== false && $request == "GET") {
    $reporteController->exportarPrecioVivoExcel();
    exit;
}

######### RUTAS PRECIO TROZADO #########
// obtener todos
elseif (strpos($path, "/precioTrozado/all") !== false && $request == "GET") {
    $PrecioTrozadoController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/precioTrozado/crear") !== false && $request == "POST") {
    $PrecioTrozadoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/precioTrozado/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $PrecioTrozadoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/precioTrozado\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $PrecioTrozadoController->delete($matches[1]);
    exit;
    //filtro uso: filtro?fechaInicio=2025-10-01&fechaFin=2025-10-20&empresa=2
}elseif (strpos($path, "/precioTrozado/filtro") !== false && $request == "GET") {
    $PrecioTrozadoController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
}elseif (strpos($path, "/precioTrozado/exportar") !== false && $request == "GET") {
    $reporteController->exportarPrecioTrozadoExcel();
    exit;
}

######### RUTAS COM_TIENDA #########
// obtener todos
elseif (strpos($path, "/tienda/all") !== false && $request == "GET") {
    $TiendaController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/tienda/crear") !== false && $request == "POST") {
    $TiendaController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tienda/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TiendaController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tienda\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TiendaController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&empresa=2&tipo=3
}elseif (strpos($path, "/tienda/filtro") !== false && $request == "GET") {
    $TiendaController->obtenerDatosFiltrados();
    exit;
   //EXPORTAR FORMATO EXCEL
}elseif (strpos($path, "/tienda/exportar") !== false && $request == "GET") {
    $reporteController->exportarTiendaExcel();
    exit;
}

######### RUTAS COM_HUEVO #########
// obtener todos
elseif (strpos($path, "/huevo/all") !== false && $request == "GET") {
    $HuevoController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/huevo/crear") !== false && $request == "POST") {
    $HuevoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/huevo/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $HuevoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/huevo\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $HuevoController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&provincia=2&tipo=3&mercado=2&proveedor=2
}elseif (strpos($path, "/huevo/filtro") !== false && $request == "GET") {
    $HuevoController->obtenerDatosFiltrados();
    exit;
  //EXPORTAR FORMATO EXCEL
}elseif (strpos($path, "/huevo/exportar") !== false && $request == "GET") {
    $reporteController->exportarHuevoExcel();
    exit;
}

######### RUTAS COM_GALLINA#########
// obtener todos
elseif (strpos($path, "/gallina/all") !== false && $request == "GET") {
    $GallinaController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/gallina/crear") !== false && $request == "POST") {
    $GallinaController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/gallina/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $GallinaController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/gallina\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $GallinaController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&tipo=3
}elseif (strpos($path, "/gallina/filtro") !== false && $request == "GET") {
    $GallinaController->obtenerDatosFiltrados();
    exit;
 //EXPORTAR FORMATO EXCEL
}elseif (strpos($path, "/gallina/exportar") !== false && $request == "GET") {
    $reporteController->exportarGallinaExcel();
    exit;
}

######### RUTAS COM_ALTERNO #########
// obtener todos
elseif (strpos($path, "/alterno/all") !== false && $request == "GET") {
    $AlternoController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/alterno/crear") !== false && $request == "POST") {
    $AlternoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/alterno/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $AlternoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/alterno\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $AlternoController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&provincia=2&mercado=2tipo=3
}elseif (strpos($path, "/alterno/filtro") !== false && $request == "GET") {
    $AlternoController->obtenerDatosFiltrados();
    exit;
 //EXPORTAR FORMATO EXCEL
}elseif (strpos($path, "/alterno/exportar") !== false && $request == "GET") {
    $reporteController->exportarAlternoExcel();
    exit;
}

######### RUTAS COM_ENTERO_AUTOSER #########
// obtener todos
elseif (strpos($path, "/enteroAutoser/all") !== false && $request == "GET") {
    $EnteroAutoserController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/enteroAutoser/crear") !== false && $request == "POST") {
    $EnteroAutoserController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/enteroAutoser/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $EnteroAutoserController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/enteroAutoser\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $EnteroAutoserController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&proveedor=1
}elseif (strpos($path, "/enteroAutoser/filtro") !== false && $request == "GET") {
    $EnteroAutoserController->obtenerDatosFiltrados();
    exit;
//EXPORTAR FORMATO EXCEL
}elseif (strpos($path, "/enteroAutoser/exportar") !== false && $request == "GET") {
    $reporteController->exportarEnteroAutoSerExcel();
    exit;
}

######### RUTAS COM_TROZADO_AUTOSER #########
// obtener todos
elseif (strpos($path, "/trozadoAutoser/all") !== false && $request == "GET") {
    $TrozadoAutoserController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/trozadoAutoser/crear") !== false && $request == "POST") {
    $TrozadoAutoserController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/trozadoAutoser/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TrozadoAutoserController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/trozadoAutoser\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TrozadoAutoserController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&corte=1
}elseif (strpos($path, "/trozadoAutoser/filtro") !== false && $request == "GET") {
    $TrozadoAutoserController->obtenerDatosFiltrados();
    exit;
//EXPORTAR FORMATO EXCEL
}elseif (strpos($path, "/trozadoAutoser/exportar") !== false && $request == "GET") {
    $reporteController->exportarTrozadoAutoserExcel();
    exit;
}

######### RUTAS COM_CRIADOR_EMPRENDEDOR #########
// obtener todos
elseif (strpos($path, "/criador/all") !== false && $request == "GET") {
    $CriadorEmprendedorController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/criador/crear") !== false && $request == "POST") {
    $CriadorEmprendedorController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/criador/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $CriadorEmprendedorController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/criador\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $CriadorEmprendedorController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&corte=1
}elseif (strpos($path, "/criador/filtro") !== false && $request == "GET") {
    $CriadorEmprendedorController->obtenerDatosFiltrados();
    exit;
//EXPORTAR FORMATO EXCEL
}elseif (strpos($path, "/criador/exportar") !== false && $request == "GET") {
    $reporteController->exportarCriadorEmprendedorExcel();
    exit;
}

######### RUTAS COM_DB_TAMA_MER_DIA #########
// obtener todos
elseif (strpos($path, "/tamamerdia/all") !== false && $request == "POST") {
    $TamaMerDiaController->getAll();
    exit;
    //crear
}elseif (strpos($path, "/tamamerdia/crear") !== false && $request == "POST") {
    $TamaMerDiaController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tamamerdia/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TamaMerDiaController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tamamerdia\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TamaMerDiaController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&proveedor=1
}elseif (strpos($path, "/tamamerdia/filtro") !== false && $request == "GET") {
    $TamaMerDiaController->obtenerDatosFiltrados();
    exit;
    // EXPORTAR A EXCEL
}elseif (strpos($path, "/tamamerdia/exportar") !== false && $request == "GET") {
    $reporteController->exportarTamanoMercadoExcel();
    exit;
    ################# FUNCION PARA EJECUTAR ETL DE TABLA TAMAÑO MERCADO  ##########################
}elseif (strpos($path, "/tamamerdia/etl/run") !== false && $request == "POST") {
    $ETLController->run();
    exit;
}

// ========== RUTA NO ENCONTRADA ==========
else {
    http_response_code(404);
    echo json_encode([
        "error" => "Ruta no encontrada",
        "path" => $path,
        "method" => $request
    ]);
}
?>
