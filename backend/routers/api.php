<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/VivoController.php';
require_once __DIR__ . '/../controllers/BeneficiadoController.php';
require_once __DIR__ . '/../controllers/ReporteController.php';

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

$request = $_SERVER["REQUEST_METHOD"];
// ⭐ IMPORTANTE: Usar parse_url para separar path de query string
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
