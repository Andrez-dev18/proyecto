<?php

class ProveedorRepository
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
        $query = "SELECT * FROM com_proveedor ORDER BY codigo DESC";
        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_proveedor WHERE codigo = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function existsNombre($nombre, $codigo = null)
    {
        $sql = "SELECT codigo FROM com_proveedor WHERE nombre = :nombre";

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

    public function save($data)
    {
        $nombre = $data["nombre"] ?? null;

        if ($this->existsNombre($nombre, $data["codigo"] ?? null)) {
            throw new Exception("El proveedor '{$nombre}' ya existe.");
        }

        // UPDATE
        if (!empty($data["codigo"])) {
            $query = "
                UPDATE com_proveedor SET
                    nombre = :nombre,
                    ruc    = :ruc
                WHERE codigo = :codigo
            ";

            $stmt = $this->conn->prepare($query);
            return $stmt->execute([
                ":codigo" => $data["codigo"],
                ":nombre" => $nombre,
                ":ruc"    => $data["ruc"] ?? ""
            ]);
        }

        // INSERT
        $query = "
            INSERT INTO com_proveedor (nombre, ruc)
            VALUES (:nombre, :ruc)
        ";
        $params = [
            ":nombre" => $nombre,
            ":ruc"    => $data["ruc"] ?? ""
        ];
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $data['codigo'];
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_proveedor WHERE codigo = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

}
