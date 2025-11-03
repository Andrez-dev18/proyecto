<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/VivoController.php';
require_once __DIR__ . '/../controllers/BeneficiadoController.php';
require_once __DIR__ . '/../controllers/ReporteController.php';
require_once __DIR__ . '/../controllers/VivoArequipaController.php';
require_once __DIR__ . '/../controllers/VivoProvinciaController.php';
require_once __DIR__ . '/../controllers/CondicionController.php';
require_once __DIR__ . '/../controllers/EmpresaController.php';
require_once __DIR__ . '/../controllers/MercadoController.php';
require_once __DIR__ . '/../controllers/ProveedorController.php';
require_once __DIR__ . '/../controllers/ProvinciaController.php';
require_once __DIR__ . '/../controllers/TipoController.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

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
$vivoController = new VivoController($db);
$beneficiadoController = new BeneficiadoController($db);
$reporteController = new ReporteController($db);
$VivoArequipaController = new VivoArequipaController($db);
$VivoProvinciaController = new VivoProvinciaController($db);
$CondicionController = new CondicionController($db);
$EmpresaController = new EmpresaController($db);
$MercadoController = new MercadoController($db);
$ProveedorController = new ProveedorController($db);
$ProvinciaController = new ProvinciaController($db);
$TipoController = new TipoController($db);

$request = $_SERVER["REQUEST_METHOD"];
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// ========== RUTAS REPORTES EXCEL (PRIMERO, MÁS ESPECÍFICAS) ==========
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
}

//################## RUTAS VIVO AREQUIPA #################################
// DELETE debe ir primero (más específico)
elseif (preg_match("/\/vivoArequipa\/borrar\/(\d+)/", $path, $matches) && $request == "DELETE") {
    $VivoArequipaController->delete($matches[1]);
    exit;
}
elseif (strpos($path, "/vivoArequipa/exportar") !== false && $request == "GET") {
    $VivoArequipaController->exportarCSV();
    exit;
}
elseif (strpos($path, "/vivoArequipa/crear") !== false && $request == "POST") {
    $VivoArequipaController->create();
    exit;
}
elseif (strpos($path, "/vivoArequipa/actualizar") !== false && $request == "PUT") {
    $VivoArequipaController->update();
    exit;
}
elseif (strpos($path, "/vivoArequipa/all") !== false && $request == "GET") {
    $VivoArequipaController->getAll();
    exit;
}

//################## RUTAS VIVO PROVINCIA #################################
// DELETE debe ir primero (más específico)
elseif (preg_match("/\/vivoProvincia\/borrar\/(\d+)/", $path, $matches) && $request == "DELETE") {
    $VivoProvinciaController->delete($matches[1]);
    exit;
}
elseif (strpos($path, "/vivoProvincia/exportar") !== false && $request == "GET") {
    $VivoProvinciaController->exportarCSV();
    exit;
}
elseif (strpos($path, "/vivoProvincia/crear") !== false && $request == "POST") {
    $VivoProvinciaController->create();
    exit;
}
elseif (strpos($path, "/vivoProvincia/actualizar") !== false && $request == "PUT") {
    $VivoProvinciaController->update();
    exit;
}
elseif (strpos($path, "/vivoProvincia/all") !== false && $request == "GET") {
    $VivoProvinciaController->getAll();
    exit;
}

// ========== RUTAS CATÁLOGOS (TABLAS SECUNDARIAS) ==========

elseif (strpos($path, "/condicion/all") !== false && $request == "GET") {
    $CondicionController->getAll();
    exit;
}
elseif (strpos($path, "/empresa/all") !== false && $request == "GET") {
    $EmpresaController->getAll();
    exit;
}
elseif (strpos($path, "/mercado/all") !== false && $request == "GET") {
    $MercadoController->getAll();
    exit;
}
elseif (strpos($path, "/proveedor/all") !== false && $request == "GET") {
    $ProveedorController->getAll();
    exit;
}
elseif (strpos($path, "/provincia/all") !== false && $request == "GET") {
    $ProvinciaController->getAll();
    exit;
}
elseif (strpos($path, "/tipo/all") !== false && $request == "GET") {
    $TipoController->getAll();
    exit;
}

// ========== RUTAS VIVO (DASHBOARD CAPTURAS - MANTENER FUNCIONANDO) ==========

// GET Vivo Arequipa (con o sin filtros)
elseif (strpos($path, "/vivo/arequipa") !== false && $request == "GET") {
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

// ========== RUTAS BENEFICIADO (DASHBOARD CAPTURAS - MANTENER FUNCIONANDO) ==========

// GET Beneficiado Arequipa (con o sin filtros)
elseif (strpos($path, "/beneficiado/arequipa") !== false && $request == "GET") {
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
elseif (preg_match("/\/beneficiado\/borrar\/(\d+)/", $path, $matches) && $request == "DELETE") {
    $beneficiadoController->delete($matches[1]);
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
