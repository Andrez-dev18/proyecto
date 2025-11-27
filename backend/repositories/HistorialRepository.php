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
                fechaHora
            ) VALUES (
                :cod_usuario,
                :nom_usuario,
                :accion,
                :tabla_afectada,
                :registro_id,
                :datos_previos,
                :datos_nuevos,
                :descripcion,
                NOW()
            )
        ";

        return $this->executeNonQuery($query, [
            ':cod_usuario'   => $data['cod_usuario'],
            ':nom_usuario'   => $data['nom_usuario'],
            ':accion'        => $data['accion'],
            ':tabla_afectada' => $data['tabla_afectada'],
            ':registro_id'   => $data['registro_id'],
            ':datos_previos' => $data['datos_previos'],
            ':datos_nuevos'  => $data['datos_nuevos'],
            ':descripcion'   => $data['descripcion'],
        ]);
    }


    private function executeNonQuery($query, $params = [])
    {
        $stmt = $this->conn->prepare($query);
        return $stmt->execute($params);
    }
}
