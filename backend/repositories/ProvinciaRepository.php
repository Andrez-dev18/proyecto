<?php

class ProvinciaRepository
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
        $query = "SELECT * FROM com_provincia ORDER BY codigo DESC";
        return $this->executeQuery($query);
    }

    public function existsNombre($nombre, $codigo = null)
    {
        $sql = "SELECT codigo FROM com_provincia WHERE nombre = :nombre";

        if ($codigo !== null) {
            $sql .= " AND codigo != :codigo";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":nombre", $nombre);

        if ($codigo !== null) {
            $stmt->bindValue(":codigo", $codigo);
        }

        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ? true : false;
    }

    // ------------------------------------------
    // SAVE
    // ------------------------------------------
    public function save($data)
    {
        $nombre = $data["nombre"] ?? null;

        if ($this->existsNombre($nombre, $data["codigo"] ?? null)) {
            throw new Exception("La provincia '{$nombre}' ya existe.");
        }

        // UPDATE
        if (!empty($data["codigo"])) {
            $query = "
                UPDATE com_provincia SET
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
            INSERT INTO com_provincia (nombre)
            VALUES (:nombre)
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ":nombre" => $nombre
        ]);
        return $data['codigo'];
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_provincia WHERE codigo = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_provincia WHERE codigo = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

}
