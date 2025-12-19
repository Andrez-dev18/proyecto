<?php

class TipoPolloRepository
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

    public function findById($id)
    {
        $query = "SELECT * FROM com_tipo_pollo WHERE codigo = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findAll()
    {
        $query = "SELECT * FROM com_tipo_pollo ORDER BY codigo DESC";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        $nombre = $data["nombre"] ?? null;

        // UPDATE
        if (!empty($data["codigo"])) {
            $query = "
                UPDATE com_tipo_pollo SET
                    nombre = :nombre
                WHERE codigo = :codigo
            ";

            $stmt = $this->conn->prepare($query);
            return $stmt->execute([
                ":codigo" => $data["codigo"],
                ":nombre" => $nombre
            ]);
        }

        // INSERT
        $query = "
            INSERT INTO com_tipo_pollo (nombre)
            VALUES (:nombre)
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ":nombre" => $nombre
        ]);
        return $data['codigo'];
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_tipo_pollo WHERE codigo = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

}
