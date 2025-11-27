<?php
//session_start();
header("Content-Type: application/json");

require_once __DIR__ . '/../services/HistorialService.php';
$historialService = new HistorialService($db);

// Si existe una sesión activa, registramos el LOGOUT
if (isset($_SESSION['usuario'])) {

    // Datos de usuario antes de destruir sesión
    $codigo = $_SESSION['codigo'] ?? null;
    $nombre = $_SESSION['nombre'] ?? null;
    $usuario = $_SESSION['usuario'] ?? null;

    // Registrar acción de logout
    $historialService->logActionLogin(
        $usuario,
        $nombre,
        "LOGOUT",
        null,  // no afecta tabla
        null, 
        null,
        [
            "mensaje" => "Cierre de sesión"
        ],
        "CIERRE DE SESIÓN DEL USUARIO"
    );
}

// Limpiar sesión
session_unset();
session_destroy();

echo json_encode(["success" => true, "message" => "Sesión cerrada correctamente"]);
