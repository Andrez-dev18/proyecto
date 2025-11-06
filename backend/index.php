<?php
require_once __DIR__ . '/routers/api.php';
session_start();

header("Access-Control-Allow-Origin: http://localhost"); // Permitir cualquier origen (puedes restringirlo si deseas)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// --- Manejo del preflight (OPTIONS) ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

?>

