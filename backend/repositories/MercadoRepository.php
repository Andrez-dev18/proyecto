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
        $query = "SELECT * FROM com_mercado ORDER BY codigo DESC";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // ----------------- UPDATE -----------------
        if (!empty($data["codigo"])) {

            $query = "
            UPDATE com_mercado SET
                nombre = :nombre
            WHERE codigo = :codigo
        ";

            $stmt = $this->conn->prepare($query);

            return $stmt->execute([
                ":codigo" => $data["codigo"],
                ":nombre" => $data["nombre"] ?? ''
            ]);
        }

        // ----------------- INSERT -----------------
        $query = "
        INSERT INTO com_mercado (nombre)
        VALUES (:nombre)
    ";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":nombre" => $data["nombre"] ?? ''
        ]);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_mercado WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }
}
