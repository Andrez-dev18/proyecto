<?php
require_once __DIR__ . '/../repositories/UsuarioRepository.php';

class UsuarioService {
    private $repo;

    public function __construct($db) {
        $this->repo = new UsuarioRepository($db);
    }

    public function autenticar($usuario, $password) {
        $result = $this->repo->login($usuario, $password);

        if ($result) {
            return [
                'success' => true,
                'data' => $result
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Usuario o contraseña incorrectos'
            ];
        }
    }
}
