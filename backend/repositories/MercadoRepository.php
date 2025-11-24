<?php

class MercadoRepository
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

    public function findAll()
    {
        $query = "
            SELECT 
                m.codigo,
                m.nombre,
                pv.nombre AS provincia,
                m.activo
            FROM com_mercado AS m
            LEFT JOIN com_provincia AS pv ON m.provincia = pv.codigo
            ORDER BY m.codigo DESC
        ";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // ----------------- UPDATE -----------------
        if (!empty($data["codigo"])) {

            $query = "
            UPDATE com_mercado SET
                nombre    = :nombre,
                provincia = :provincia,
                activo    = :activo
            WHERE codigo = :codigo
        ";

            $stmt = $this->conn->prepare($query);

            return $stmt->execute([
                ":codigo"    => $data["codigo"],
                ":nombre"    => $data["nombre"] ?? '',
                ":provincia" => $data["provincia"] ?? 0,
                ":activo"    => isset($data["activo"]) ? $data["activo"] : 1
            ]);
        }

        // ----------------- INSERT -----------------
        $query = "
        INSERT INTO com_mercado (nombre, provincia, activo)
        VALUES (:nombre, :provincia, :activo)
    ";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":nombre"    => $data["nombre"] ?? '',
            ":provincia" => $data["provincia"] ?? 0,
            ":activo"    => isset($data["activo"]) ? $data["activo"] : 1
        ]);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_mercado WHERE codigo = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }
}
