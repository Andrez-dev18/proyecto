<?php

class EmpresaRepository
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
        $query = "SELECT * FROM com_empresa ORDER BY codigo DESC";
        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_empresa WHERE codigo = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function existsNombre($nombre, $codigo = null)
    {
        $sql = "SELECT codigo FROM com_empresa WHERE nombre = :nombre";

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
        $nombre = $data["nombre"] ?? '';

        // Validación UNIQUE(nombre)
        if ($this->existsNombre($nombre, $data["codigo"] ?? null)) {
            throw new Exception("La empresa '{$nombre}' ya existe.");
        }

        // ----------------- UPDATE -----------------
        if (!empty($data["codigo"])) {

            $query = "
            UPDATE com_empresa SET
                nombre = :nombre,
                ruc    = :ruc
            WHERE codigo = :codigo
        ";

            $stmt = $this->conn->prepare($query);

            return $stmt->execute([
                ":codigo" => $data["codigo"],
                ":nombre" => $nombre,
                ":ruc"    => $data["ruc"] ?? ''
            ]);
        }

        // ----------------- INSERT -----------------
        $query = "
        INSERT INTO com_empresa (nombre, ruc)
        VALUES (:nombre, :ruc)
    ";

        $stmt = $this->conn->prepare($query);
        $params = [
            ":nombre" => $nombre,
            ":ruc"    => $data["ruc"] ?? ''
        ];
        $stmt->execute($params);
        return $data['codigo'];
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_empresa WHERE codigo = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

}
