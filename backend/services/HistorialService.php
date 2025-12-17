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
            'fechaHora'      => $this->getFechaHora(),
            'ip' => "-",
            'ubicacion_gps' => "-",
            'dispositivo' => "-",
            'sistema_operativo' => "-",
            'navegador' => "-",
            'user_agent' => "-"
        ];

        return $this->repo->registrar($data);
    }

    public function logActionLogin($cod, $nom, $accion, $tabla, $registroId = null, $previos = null, $nuevos = null, $descripcion = null, $ubicacionGPS = null)
    {
        $client = $this->getClientData();
        $client['ubicacion_gps'] = $ubicacionGPS; // Sobrescribir con la real

        $data = [
            'cod_usuario'       => $cod,
            'nom_usuario'       => $nom,
            'accion'            => $accion,
            'tabla_afectada'    => $tabla,
            'registro_id'       => $registroId,
            'datos_previos'     => $previos ? json_encode($previos) : null,
            'datos_nuevos'      => $nuevos ? json_encode($nuevos) : null,
            'descripcion'       => $descripcion,
            'fechaHora'         => $this->getFechaHora(),
            'ip'                => $client['ip'],
            'ubicacion_gps'     => $client['ubicacion_gps'],
            'dispositivo'       => $client['dispositivo'],
            'sistema_operativo' => $client['sistema_operativo'],
            'navegador'         => $client['navegador'],
            'user_agent'        => $client['user_agent'],
        ];

        return $this->repo->registrar($data);
    }


    private function getClientData()
    {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        return [
            'ip'               => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent'       => $userAgent,
            'dispositivo'      => preg_match('/Mobi|Android/i', $userAgent) ? 'Móvil' : 'PC',
            'sistema_operativo' => php_uname('s'),
            'navegador'        => $this->obtenerNavegador($userAgent),
            'ubicacion_gps'    => null // opcional si decides implementarlo
        ];
    }

    private function obtenerNavegador($ua)
    {
        $ua = strtolower($ua);

        // Orden correcto: primero los navegadores basados en Chrome
        if (strpos($ua, 'edg/') !== false) return 'Microsoft Edge';
        if (strpos($ua, 'opr/') !== false || strpos($ua, 'opera') !== false) return 'Opera';
        if (strpos($ua, 'brave') !== false) return 'Brave';
        if (strpos($ua, 'chrome') !== false) return 'Chrome';

        // Después Safari y Firefox
        if (strpos($ua, 'safari') !== false) return 'Safari';
        if (strpos($ua, 'firefox') !== false) return 'Firefox';

        return 'Desconocido';
    }
}
