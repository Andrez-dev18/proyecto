<?php

class TipoProdSutitutoRepository
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
        $query = "SELECT * FROM com_tip_prod_sut ORDER BY codigo DESC";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // ----------------- UPDATE -----------------
        if (!empty($data["codigo"])) {

            $query = "
            UPDATE com_tip_prod_sut
                nombre = :nombre,
                linea  = :linea
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
        INSERT INTO com_tip_prod_sut (nombre, linea)
        VALUES (:nombre, :linea)
    ";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":nombre" => $data["nombre"] ?? ''
        ]);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_tip_prod_sut WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

}
