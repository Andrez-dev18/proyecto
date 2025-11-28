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
require_once __DIR__ . '/../controllers/IngresosLimaController.php';
require_once __DIR__ . '/../controllers/GallinaCDController.php';
require_once __DIR__ . '/../controllers/ProductoSustitutoController.php';
require_once __DIR__ . '/../controllers/ETL_Controller.php';
require_once __DIR__ . '/../controllers/TipoGallinaController.php';
require_once __DIR__ . '/../controllers/ClienteProcesadoController.php';
require_once __DIR__ . '/../controllers/VendedorController.php';
require_once __DIR__ . '/../controllers/ProductoController.php';
require_once __DIR__ . '/../controllers/TipoTiendaController.php';
require_once __DIR__ . '/../controllers/TipoHuevoController.php';
require_once __DIR__ . '/../controllers/TipoAlternoController.php';
require_once __DIR__ . '/../controllers/TipoEmprendedorController.php';
require_once __DIR__ . '/../controllers/TrozadoDiarioController.php';
require_once __DIR__ . '/../controllers/TipoProdSustitutoController.php';
require_once __DIR__ . '/../controllers/ClientePvController.php';
require_once __DIR__ . '/../controllers/InfoGRSController.php';
require_once __DIR__ . '/../controllers/OficialGRSController.php';
require_once __DIR__ . '/../controllers/MercadoResController.php';
require_once __DIR__ . '/../controllers/MercadoDetController.php';

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
$IngresosLimaController = new IngresosLimaController($db);
$GallinaCDController = new GallinaCDController($db);
$ProductoSustitutoController = new ProductoSustitutoController($db);
$TipoGallinaController = new TipoGallinaController($db);
$ClienteProcesadoController = new ClienteProcesadoController($db);
$VendedorController = new VendedorController($db);
$ProductoController = new ProductoController($db);
$tipoTiendaController = new TipoTiendaController($db);
$TipoHuevoController = new TipoHuevoController($db);
$TipoAlternoController = new TipoAlternoController($db);
$TipoEmprendedorController = new TipoEmprendedorController($db);
$TrozadoDiarioController = new TrozadoDiarioController($db);
$TipoProSutitutoController = new TipoProdSustitutoController($db);
$ClientePvController = new ClientePvController($db);
$InfoGRSController = new InfoGRSController($db);
$OficialGRSController = new OficialGRSController($db);
$MercadoResController = new MercadoResController($db);
$MercadoDetController = new MercadoDetController($db);

$request = $_SERVER["REQUEST_METHOD"];
// IMPORTANTE: Usar parse_url para separar path de query string
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// ========== RUTAS REPORTES EXCEL (PRIMERO, para que no interfieran) ==========
if (strpos($path, "/reporte/beneficiado/arequipa/excel") !== false && $request == "GET") {
    $reporteController->exportarArequipaBeneficiadoExcel();
    exit;
} elseif (strpos($path, "/reporte/beneficiado/provincia/excel") !== false && $request == "GET") {
    $reporteController->exportarProvinciaBeneficiadoExcel();
    exit;
} elseif (strpos($path, "/reporte/vivo/arequipa/excel") !== false && $request == "GET") {
    $reporteController->exportarArequipaVivoExcel();
    exit;
} elseif (strpos($path, "/reporte/vivo/provincia/excel") !== false && $request == "GET") {
    $reporteController->exportarProvinciaVivoExcel();
    exit;
} elseif (strpos($path, "/reporte/vivoProvincia/excel") !== false && $request == "GET") {
    $reporteController->exportarVivoProvinciaExcel();
    exit;
} elseif (strpos($path, "/reporte/vivoArequipa/excel") !== false && $request == "GET") {
    $reporteController->exportarVivoArequipaExcel();
    exit;
}

// ========== RUTAS LOGIN ==========
elseif (strpos($path, "/usuario/login") !== false && $request == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $UserController->login($data);
    exit;
} // ========== RUTAS SESIÓN ==========
elseif (strpos($path, "/usuario/validarSesion") !== false && $request == "GET") {
    require_once __DIR__ . '/../controllers/session.php';
    exit;
} elseif (strpos($path, "/usuario/logout") !== false && $request == "GET") {
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
} elseif (strpos($path, "/vivoProvincia/filtro") !== false && $request == "GET") {
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
} elseif (strpos($path, "/empresa/all") !== false && $request == "GET") {
    $EmpresaController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/empresa/crear") !== false && $request == "POST") {
    $EmpresaController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/empresa/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $EmpresaController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/empresa\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $EmpresaController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/empresa/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;
}


//######### RUTAS MERCADO #########
elseif (strpos($path, "/mercado/all") !== false && $request == "GET") {
    $MercadoController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/mercado/crear") !== false && $request == "POST") {
    $MercadoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/mercado/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $MercadoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/mercado\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $MercadoController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/mercado/exportar") !== false && $request == "GET") {
    $reporteController->exportarMercadoExcel();
    exit;


    //######### RUTAS PROVEEDOR #########
} elseif (strpos($path, "/proveedor/all") !== false && $request == "GET") {
    $ProveedorController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/proveedor/crear") !== false && $request == "POST") {
    $ProveedorController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/proveedor/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $ProveedorController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/proveedor\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $ProveedorController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/proveedor/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;



    ######### RUTAS PROVINCIA #########
} elseif (strpos($path, "/provincia/all") !== false && $request == "GET") {
    $ProvinciaController->getAll();
    exit;

    //crear
} elseif (strpos($path, "/provincia/crear") !== false && $request == "POST") {
    $ProvinciaController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/provincia/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $ProvinciaController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/provincia\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $ProvinciaController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/provincia/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;



    ######### RUTAS TIPO #########
} elseif (strpos($path, "/tipo/all") !== false && $request == "GET") {
    $TipoController->getAll();
    exit;

    //crear
} elseif (strpos($path, "/tipo/crear") !== false && $request == "POST") {
    $TipoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tipo/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TipoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tipo\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TipoController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/tipo/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;


    ######### RUTAS TIPO_TIENDA #########
} elseif (strpos($path, "/tipoTienda/all") !== false && $request == "GET") {
    $tipoTiendaController->getAll();
    exit;

    //crear
} elseif (strpos($path, "/tipoTienda/crear") !== false && $request == "POST") {
    $tipoTiendaController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tipoTienda/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $tipoTiendaController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tipoTienda\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $tipoTiendaController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/tipoTienda/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;


    ######### RUTAS TIPO HUEVO #########
} elseif (strpos($path, "/tipoHuevo/all") !== false && $request == "GET") {
    $TipoHuevoController->getAll();
    exit;

    //crear
} elseif (strpos($path, "/tipoHuevo/crear") !== false && $request == "POST") {
    $TipoHuevoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tipoHuevo/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TipoHuevoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tipoHuevo\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TipoHuevoController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/tipoHuevo/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;


    ######### RUTAS TIPO ALTERNO #########
} elseif (strpos($path, "/tipoAlterno/all") !== false && $request == "GET") {
    $TipoAlternoController->getAll();
    exit;

    //crear
} elseif (strpos($path, "/tipoAlterno/crear") !== false && $request == "POST") {
    $TipoAlternoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tipoAlterno/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TipoAlternoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tipoAlterno\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TipoAlternoController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/tipoAlterno/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;


    ############### RUTA TIPO EMPRENDEDOR ####################
} elseif (strpos($path, "/tipoEmpren/all") !== false && $request == "GET") {
    $TipoEmprendedorController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/tipoEmpren/crear") !== false && $request == "POST") {
    $TipoEmprendedorController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tipoEmpren/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TipoEmprendedorController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tipoEmpren\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TipoEmprendedorController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/tipoEmpren/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;


    ############### RUTA TIPO POLLO ####################
} elseif (strpos($path, "/tipoPollo/all") !== false && $request == "GET") {
    $TipoPolloController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/tipoPollo/crear") !== false && $request == "POST") {
    $TipoPolloController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tipoPollo/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TipoPolloController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tipoPollo\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TipoPolloController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/tipoPollo/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;

    ############### RUTA TIPO GALLINA  ####################
} elseif (strpos($path, "/tipoGallina/all") !== false && $request == "GET") {
    $TipoGallinaController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/tipoGallina/crear") !== false && $request == "POST") {
    $TipoGallinaController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/tipoGallina/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TipoGallinaController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/tipoGallina\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TipoGallinaController->delete($matches[1]);
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/tipoGallina/exportar") !== false && $request == "GET") {
    //$reporteController->exportarProdSustitutoExcel();
    exit;


    ################ RUTA TIPO POLLO VIVO #########################
} elseif (strpos($path, "/tipoPolloVivo/all") !== false && $request == "GET") {
    $TipoPolloVivoController->getAll();
    exit;
    ############## RUTA CORTES###################
} elseif (strpos($path, "/corte/all") !== false && $request == "GET") {
    $CorteController->getAll();
    exit;
}

############## RUTA TIPO PRODUCTO SUSTITUTO ###################
elseif (strpos($path, "/tipoProductoSusti/all") !== false && $request == "GET") {
    $TipoProSutitutoController->getAll();
    exit;
}



//======================== RUTAS PARA NUEVAS TABLAS ====================================


######### RUTAS BENEFICIO PROVINCIA #########
// obtener todos
elseif (strpos($path, "/beneficioProvincia/all") !== false && $request == "GET") {
    $BeneficioProvincia->getAll();
    exit;
    //crear
} elseif (strpos($path, "/beneficioProvincia/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/beneficioProvincia/filtro") !== false && $request == "GET") {
    $BeneficioProvincia->obtenerDatosFiltrados();
    exit;
    //EXPORTAR EN FORMATO EXCEL
} elseif (strpos($path, "/beneficioProvincia/exportar") !== false && $request == "GET") {
    $reporteController->exportarBeneficioProvinciaExcel();
    exit;
}

######### RUTAS PRECIO VIVO #########
// obtener todos
elseif (strpos($path, "/precioVivo/all") !== false && $request == "GET") {
    $PrecioVivoController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/precioVivo/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/precioVivo/filtro") !== false && $request == "GET") {
    $PrecioVivoController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR EN FORMATO EXCEL
} elseif (strpos($path, "/precioVivo/exportar") !== false && $request == "GET") {
    $reporteController->exportarPrecioVivoExcel();
    exit;
}

######### RUTAS PRECIO TROZADO #########
// obtener todos
elseif (strpos($path, "/precioTrozado/all") !== false && $request == "GET") {
    $PrecioTrozadoController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/precioTrozado/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/precioTrozado/filtro") !== false && $request == "GET") {
    $PrecioTrozadoController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/precioTrozado/exportar") !== false && $request == "GET") {
    $reporteController->exportarPrecioTrozadoExcel();
    exit;
}

######### RUTAS COM_TIENDA #########
// obtener todos
elseif (strpos($path, "/tienda/all") !== false && $request == "GET") {
    $TiendaController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/tienda/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/tienda/filtro") !== false && $request == "GET") {
    $TiendaController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/tienda/exportar") !== false && $request == "GET") {
    $reporteController->exportarTiendaExcel();
    exit;
}

######### RUTAS COM_HUEVO #########
// obtener todos
elseif (strpos($path, "/huevo/all") !== false && $request == "GET") {
    $HuevoController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/huevo/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/huevo/filtro") !== false && $request == "GET") {
    $HuevoController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/huevo/exportar") !== false && $request == "GET") {
    $reporteController->exportarHuevoExcel();
    exit;
}

######### RUTAS COM_GALLINA#########
// obtener todos
elseif (strpos($path, "/gallina/all") !== false && $request == "GET") {
    $GallinaController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/gallina/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/gallina/filtro") !== false && $request == "GET") {
    $GallinaController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/gallina/exportar") !== false && $request == "GET") {
    $reporteController->exportarGallinaExcel();
    exit;
}

######### RUTAS COM_ALTERNO #########
// obtener todos
elseif (strpos($path, "/alterno/all") !== false && $request == "GET") {
    $AlternoController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/alterno/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/alterno/filtro") !== false && $request == "GET") {
    $AlternoController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/alterno/exportar") !== false && $request == "GET") {
    $reporteController->exportarAlternoExcel();
    exit;
}

######### RUTAS COM_ENTERO_AUTOSER #########
// obtener todos
elseif (strpos($path, "/enteroAutoser/all") !== false && $request == "GET") {
    $EnteroAutoserController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/enteroAutoser/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/enteroAutoser/filtro") !== false && $request == "GET") {
    $EnteroAutoserController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/enteroAutoser/exportar") !== false && $request == "GET") {
    $reporteController->exportarEnteroAutoSerExcel();
    exit;
}

######### RUTAS COM_TROZADO_AUTOSER #########
// obtener todos
elseif (strpos($path, "/trozadoAutoser/all") !== false && $request == "GET") {
    $TrozadoAutoserController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/trozadoAutoser/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/trozadoAutoser/filtro") !== false && $request == "GET") {
    $TrozadoAutoserController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/trozadoAutoser/exportar") !== false && $request == "GET") {
    $reporteController->exportarTrozadoAutoserExcel();
    exit;
}

######### RUTAS COM_CRIADOR_EMPRENDEDOR #########
// obtener todos
elseif (strpos($path, "/criador/all") !== false && $request == "GET") {
    $CriadorEmprendedorController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/criador/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/criador/filtro") !== false && $request == "GET") {
    $CriadorEmprendedorController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/criador/exportar") !== false && $request == "GET") {
    $reporteController->exportarCriadorEmprendedorExcel();
    exit;
}

######### RUTAS COM_DB_TAMA_MER_DIA #########
// obtener todos
elseif (strpos($path, "/tamamerdia/all") !== false && $request == "POST") {
    $TamaMerDiaController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/tamamerdia/crear") !== false && $request == "POST") {
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
} elseif (strpos($path, "/tamamerdia/filtro") !== false && $request == "GET") {
    $TamaMerDiaController->obtenerTodosDatosFiltro();
    exit;
    // EXPORTAR A EXCEL
} elseif (strpos($path, "/tamamerdia/exportar") !== false && $request == "GET") {
    $reporteController->exportarTamanoMercadoExcel();
    exit;
    ################# FUNCION PARA EJECUTAR ETL DE TABLA TAMAÑO MERCADO  ##########################
} elseif (strpos($path, "/tamamerdia/etl/run") !== false && $request == "POST") {
    $ETLController->run();
    exit;
}elseif (strpos($path, "/tamamerdia/pdf") !== false && $request == "GET") {
    $TamaMerDiaController->exportarPDF();
    exit;
}


######### RUTAS COM_DB_INGRESO_LIMA #########
// obtener todos
elseif (strpos($path, "/ingresoLima/all") !== false && $request == "GET") {
    $IngresosLimaController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/ingresoLima/crear") !== false && $request == "POST") {
    $IngresosLimaController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/ingresoLima/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $IngresosLimaController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/ingresoLima\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $IngresosLimaController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&empresa=1
} elseif (strpos($path, "/ingresoLima/filtro") !== false && $request == "GET") {
    $IngresosLimaController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/ingresoLima/exportar") !== false && $request == "GET") {
    $reporteController->exportarIngreEmpLimaExcel();
    exit;
}

######### RUTAS COM_DB_GALLINA_CD #########
// obtener todos
elseif (strpos($path, "/gallinacd/all") !== false && $request == "GET") {
    $GallinaCDController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/gallinacd/crear") !== false && $request == "POST") {
    $GallinaCDController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/gallinacd/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $GallinaCDController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/gallinacd\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $GallinaCDController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&tipo=1
} elseif (strpos($path, "/gallinacd/filtro") !== false && $request == "GET") {
    $GallinaCDController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/gallinacd/exportar") !== false && $request == "GET") {
    $reporteController->exportarGallinaCdExcel();
    exit;
} elseif (strpos($path, "/tipoGallina/all") !== false && $request == "GET") {
    $TipoGallinaController->getAll();
    exit;
}


######### RUTAS COM_DB_PRODUCTO_SUSTITUTO #########
// obtener todos
elseif (strpos($path, "/productoSusti/all") !== false && $request == "GET") {
    $ProductoSustitutoController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/productoSusti/crear") !== false && $request == "POST") {
    $ProductoSustitutoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/productoSusti/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $ProductoSustitutoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/productoSusti\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $ProductoSustitutoController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&tipo=1
} elseif (strpos($path, "/productoSusti/filtro") !== false && $request == "GET") {
    $ProductoSustitutoController->obtenerDatosFiltrados();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/productoSusti/exportar") !== false && $request == "GET") {
    $reporteController->exportarProdSustitutoExcel();
    exit;
}

######### RUTAS COM_CLIENTE_PROCESADO #########
// obtener todos
elseif (strpos($path, "/clienteProce/all") !== false && $request == "GET") {
    $ClienteProcesadoController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/clienteProce/crear") !== false && $request == "POST") {
    $ClienteProcesadoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/clienteProce/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $ClienteProcesadoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/clienteProce\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $ClienteProcesadoController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&tipo=1
} elseif (strpos($path, "/clienteProce/filtro") !== false && $request == "GET") {
    $ClienteProcesadoController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/clienteProce/exportar") !== false && $request == "GET") {
    $reporteController->exportarClienteProcesadosExcel();
    exit;
} ################# FUNCION PARA EJECUTAR ETL  ##########################
elseif (strpos($path, "/clienteProce/etl") !== false && $request == "POST") {
    $ClienteProcesadoController->runETL();
    exit;
}

######### RUTAS COM_VENDEDOR #########
// obtener todos
elseif (strpos($path, "/vendedor/all") !== false && $request == "GET") {
    $VendedorController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/vendedor/crear") !== false && $request == "POST") {
    $VendedorController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/vendedor/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $VendedorController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/vendedor\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $VendedorController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&tipo=1
} elseif (strpos($path, "/vendedor/filtro") !== false && $request == "GET") {
    $VendedorController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/vendedor/exportar") !== false && $request == "GET") {
    $reporteController->exportarVendedoresExcel();
    exit;
}


######### RUTAS COM_PRODUCTO #########
// obtener todos
elseif (strpos($path, "/producto/all") !== false && $request == "GET") {
    $ProductoController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/producto/crear") !== false && $request == "POST") {
    $ProductoController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/producto/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $ProductoController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/producto\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $ProductoController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30&tipo=1
} elseif (strpos($path, "/producto/filtro") !== false && $request == "GET") {
    $ProductoController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/producto/exportar") !== false && $request == "GET") {
    $reporteController->exportarComProductoExcel();
    exit;
}



######### RUTAS COM_TROZADO_DIARIO #########
// obtener todos
elseif (strpos($path, "/trozadoDiario/all") !== false && $request == "GET") {
    $TrozadoDiarioController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/trozadoDiario/crear") !== false && $request == "POST") {
    $TrozadoDiarioController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/trozadoDiario/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $TrozadoDiarioController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/trozadoDiario\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $TrozadoDiarioController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30
} elseif (strpos($path, "/trozadoDiario/filtro") !== false && $request == "GET") {
    $TrozadoDiarioController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/trozadoDiario/exportar") !== false && $request == "GET") {
    $reporteController->exportarTrozadoDiarioExcel();
    exit;
} ################# FUNCION PARA EJECUTAR ETL TROZADO DIARIO  ##########################
elseif (strpos($path, "/trozadoDiario/etl") !== false && $request == "POST") {
    $TrozadoDiarioController->runETL();
    exit;
}



######### RUTAS COM_INFO_GRS #########
// obtener todos
elseif (strpos($path, "/infoGRS/all") !== false && $request == "GET") {
    $InfoGRSController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/infoGRS/crear") !== false && $request == "POST") {
    $InfoGRSController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/infoGRS/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $InfoGRSController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/infoGRS\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $InfoGRSController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30
} elseif (strpos($path, "/infoGRS/filtro") !== false && $request == "GET") {
    $InfoGRSController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/infoGRS/exportar") !== false && $request == "GET") {
    $reporteController->exportarInfoGrsExcel();
    exit;
} ################# FUNCION PARA EJECUTAR ETL TROZADO DIARIO  ##########################
elseif (strpos($path, "/infoGRS/etl") !== false && $request == "POST") {
    $TrozadoDiarioController->runETL();
    exit;
}



######### RUTAS COM_CTRL_CLIENTE_PV #########
// obtener todos
elseif (strpos($path, "/clientePv/all") !== false && $request == "GET") {
    $ClientePvController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/clientePv/crear") !== false && $request == "POST") {
    $ClientePvController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/clientePv/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $ClientePvController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/clientePv\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $ClientePvController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30
} elseif (strpos($path, "/clientePv/filtro") !== false && $request == "GET") {
    $ClientePvController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/clientePv/exportar") !== false && $request == "GET") {
    $reporteController->exportarCtrlClientePVExcel();
    exit;
} ################# FUNCION PARA EJECUTAR ETL##########################
elseif (strpos($path, "/clientePv/etl") !== false && $request == "POST") {
    $TrozadoDiarioController->runETL();
    exit;
}


######### RUTAS COM_OFICIAL_GRS #########
// obtener todos
elseif (strpos($path, "/oficialGRS/all") !== false && $request == "GET") {
    $OficialGRSController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/oficialGRS/crear") !== false && $request == "POST") {
    $OficialGRSController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/oficialGRS/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $OficialGRSController->update();
    exit;
}
//borrar con regex para ids con caracteres
elseif (preg_match("/\/oficialGRS\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $OficialGRSController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30
} elseif (strpos($path, "/oficialGRS/filtro") !== false && $request == "POST") {
    $OficialGRSController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/oficialGRS/exportar") !== false && $request == "GET") {
    $reporteController->exportarOficialGRSExcel();
    exit;
} ################# FUNCION PARA EJECUTAR ETL TROZADO DIARIO  ##########################
elseif (strpos($path, "/oficialGRS/etl") !== false && $request == "POST") {
    //$OficialGRSController->runETL();
    exit;
} elseif (strpos($path, "/oficialGRS/autocomplete") !== false && $request == "GET") {
    $OficialGRSController->autocomplete();
    exit;
}


######### RUTAS COM_MERCADO_RES #########
// obtener todos
elseif (strpos($path, "/mercadores/all") !== false && $request == "GET") {
    $MercadoResController->getAll();
    exit;
} elseif (strpos($path, "/mercadores/resumen/provincias") !== false && $request == "GET") {
    $MercadoResController->resumenProvincias();
    exit;
} elseif (strpos($path, "/mercadores/resumen/aves") !== false && $request == "GET") {
    $MercadoResController->resumenAvesProvincias();
    exit;
} elseif (strpos($path, "/mercadores/resumen/mercados") !== false && $request == "GET") {
    $MercadoResController->resumenMercados();
    exit;
    //crear
} elseif (strpos($path, "/mercadores/crear") !== false && $request == "POST") {
    $MercadoResController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/mercadores/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $MercadoResController->update();
    exit;
} //borrar con regex para ids con caracteres
elseif (strpos($path, "/mercadores/borrar") !== false && $request == "POST") {
    $MercadoResController->delete();
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30
} elseif (strpos($path, "/mercadores/filtro") !== false && $request == "GET") {
    $MercadoResController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/mercadores/exportar") !== false && $request == "GET") {
    $reporteController->exportarMercadoResExcel();
    exit;
}

######### RUTAS COM_MERCADO_DET #########
// obtener todos
elseif (strpos($path, "/mercadodet/all") !== false && $request == "GET") {
    $MercadoDetController->getAll();
    exit;
    //crear
} elseif (strpos($path, "/mercadodet/crear") !== false && $request == "POST") {
    $MercadoDetController->create();
    exit;
}
//actualizar
elseif (strpos($path, "/mercadodet/actualizar") !== false && ($request == "PUT" || $request == "POST")) {
    $MercadoDetController->update();
    exit;
} //borrar con regex para ids con caracteres
elseif (preg_match("/\/mercadodet\/borrar\/([a-zA-Z0-9\-]+)/", $path, $matches) && ($request == "DELETE" || $request == "POST")) {
    $MercadoDetController->delete($matches[1]);
    exit;
    //filtro?fechaInicio=2025-05-01&fechaFin=2025-10-30
} elseif (strpos($path, "/mercadodet/filtro") !== false && $request == "GET") {
    $MercadoDetController->obtenerTodosDatosFiltro();
    exit;
    //EXPORTAR FORMATO EXCEL
} elseif (strpos($path, "/mercadodet/exportar") !== false && $request == "GET") {
    $reporteController->exportarMercadoDetExcel();
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
