<?php

class TipoRepository
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
        $query = "SELECT * FROM com_tipo ORDER BY codigo DESC";
        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_tipo WHERE codigo = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // ----------------- UPDATE -----------------
        if (!empty($data["codigo"])) {

            $query = "
            UPDATE com_tipo SET
                nombre = :nombre,
                linea  = :linea
            WHERE codigo = :codigo
        ";

            $stmt = $this->conn->prepare($query);

            return $stmt->execute([
                ":codigo" => $data["codigo"],
                ":nombre" => $data["nombre"] ?? '',
                ":linea"  => $data["linea"] ?? ''
            ]);
        }

        // ----------------- INSERT -----------------
        $query = "
        INSERT INTO com_tipo (nombre, linea)
        VALUES (:nombre, :linea)
    ";

        $stmt = $this->conn->prepare($query);

        $stmt->execute([
            ":nombre" => $data["nombre"] ?? '',
            ":linea"  => $data["linea"] ?? ''
        ]);
        return $data['codigo'];
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_tipo WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

}
