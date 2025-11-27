<?php 
require_once __DIR__ . '/../repositories/HistorialRepository.php';

class HistorialService
{
    private $repo;

    public function __construct($db)
    {
        $this->repo = new HistorialRepository($db);
    }

    private function getUsuarioSesion()
    {
        return [
            'codigo' => $_SESSION['usuario'] ?? null,
            'nombre' => $_SESSION['nombre'] ?? null,
        ];
    }

    private function getFechaHora()
    {
        return date("Y-m-d H:i:s");
    }

    public function logAction($accion, $tabla, $registroId = null, $previos = null, $nuevos = null, $descripcion = null)
    {
        $usuario = $this->getUsuarioSesion();

        $data = [
            'cod_usuario'    => $usuario['codigo'],
            'nom_usuario'    => $usuario['nombre'],
            'accion'         => $accion,
            'tabla_afectada' => $tabla,
            'registro_id'    => $registroId,
            'datos_previos'  => $previos ? json_encode($previos) : null,
            'datos_nuevos'   => $nuevos ? json_encode($nuevos) : null,
            'descripcion'    => $descripcion,
            'fechaHora'      => $this->getFechaHora()
        ];

        return $this->repo->registrar($data);
    }

    public function logActionLogin($cod, $nom, $accion, $tabla, $registroId = null, $previos = null, $nuevos = null, $descripcion = null)
    {
        
        $data = [
            'cod_usuario'    => $cod,
            'nom_usuario'    => $nom,
            'accion'         => $accion,
            'tabla_afectada' => $tabla,
            'registro_id'    => $registroId,
            'datos_previos'  => $previos ? json_encode($previos) : null,
            'datos_nuevos'   => $nuevos ? json_encode($nuevos) : null,
            'descripcion'    => $descripcion,
            'fechaHora'      => $this->getFechaHora()
        ];

        return $this->repo->registrar($data);
    }

}
