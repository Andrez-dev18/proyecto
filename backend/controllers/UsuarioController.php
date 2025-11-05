<?php
require_once __DIR__ . '/../services/UsuarioService.php';

class UsuarioController {
    private $service;

    public function __construct($db) {
        $this->service = new UsuarioService($db);
    }

    public function login($data) {
        $usuario = $data['usuario'] ?? '';
        $password = $data['password'] ?? '';

        $resultado = $this->service->autenticar($usuario, $password);
        echo json_encode($resultado);
    }
}
