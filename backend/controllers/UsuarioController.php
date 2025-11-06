<?php
require_once __DIR__ . '/../services/UsuarioService.php';

class UsuarioController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new UsuarioService($db);
    }
    
    public function login($data) {
        session_start();

        $usuario = $data['usuario'] ?? '';
        $password = $data['password'] ?? '';

        $resultado = $this->service->autenticar($usuario, $password);

        if ($resultado['success']) {
            // Crear variables de sesión
            $_SESSION['usuario'] = $resultado['data']['codigo'];
            $_SESSION['nombre'] = $resultado['data']['nombre'];

            echo json_encode([
                'success' => true,
                'data' => $resultado['data']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Usuario o contraseña incorrectos'
            ]);
        }
    }
}
