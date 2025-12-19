<?php

class HistorialRepository
{

    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    private function executeQuery($query)
    {
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function registrar($data)
    {
        $query = "
        INSERT INTO com_historial_acciones (
            cod_usuario,
            nom_usuario,
            accion,
            tabla_afectada,
            registro_id,
            datos_previos,
            datos_nuevos,
            descripcion,
            fechaHora,
            ip,
            ubicacion_gps,
            dispositivo,
            sistema_operativo,
            navegador,
            user_agent
        ) VALUES (
            :cod_usuario,
            :nom_usuario,
            :accion,
            :tabla_afectada,
            :registro_id,
            :datos_previos,
            :datos_nuevos,
            :descripcion,
            :fechaHora,
            :ip,
            :ubicacion_gps,
            :dispositivo,
            :sistema_operativo,
            :navegador,
            :user_agent
        )
    ";

    return $this->executeNonQuery($query, [
        ':cod_usuario'      => $data['cod_usuario'],
        ':nom_usuario'      => $data['nom_usuario'],
        ':accion'           => $data['accion'],
        ':tabla_afectada'   => $data['tabla_afectada'],
        ':registro_id'      => $data['registro_id'],
        ':datos_previos'    => $data['datos_previos'],
        ':datos_nuevos'     => $data['datos_nuevos'],
        ':descripcion'      => $data['descripcion'],
        ':fechaHora'        => $data['fechaHora'],
        ':ip'               => $data['ip'],
        ':ubicacion_gps'    => $data['ubicacion_gps'],
        ':dispositivo'      => $data['dispositivo'],
        ':sistema_operativo'=> $data['sistema_operativo'],
        ':navegador'        => $data['navegador'],
        ':user_agent'       => $data['user_agent'],
    ]);
    }


    private function executeNonQuery($query, $params = [])
    {
        $stmt = $this->conn->prepare($query);
        return $stmt->execute($params);
    }
}
