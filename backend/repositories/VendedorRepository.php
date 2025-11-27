<?php

class VendedorRepository
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
            id,
            vendedor,
            canal,
            zona
        FROM com_vendedor
        ORDER BY vendedor ASC
    ";

        return $this->executeQuery($query);
    }

     public function findById($id)
    {
        $query = "SELECT * FROM com_vendedor WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function existsCombination($vendedor, $canal, $zona, $id = null)
    {
        $sql = "
            SELECT id 
            FROM com_vendedor 
            WHERE vendedor = :vendedor 
              AND canal = :canal 
              AND zona = :zona
        ";

        if ($id !== null) {
            $sql .= " AND id != :id";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":vendedor", $vendedor);
        $stmt->bindValue(":canal", $canal);
        $stmt->bindValue(":zona", $zona);

        if ($id !== null) {
            $stmt->bindValue(":id", $id);
        }

        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ? true : false;
    }

    public function save($data)
    {
        $vendedor = $data["vendedor"] ?? null;
        $canal    = $data["canal"] ?? null;
        $zona     = $data["zona"] ?? null;

        // Validación de duplicados
        if ($this->existsCombination($vendedor, $canal, $zona, $data["id"] ?? null)) {
            throw new Exception("El vendedor '{$vendedor}' ya está registrado en el canal '{$canal}' y zona '{$zona}'.");
        }

        // -------- UPDATE --------
        if (!empty($data['id'])) {

            $query = "
                UPDATE com_vendedor SET
                    vendedor = :vendedor,
                    canal    = :canal,
                    zona     = :zona
                WHERE id = :id
            ";

            $stmt = $this->conn->prepare($query);

            return $stmt->execute([
                ':id'        => $data['id'],
                ':vendedor'  => $vendedor,
                ':canal'     => $canal,
                ':zona'      => $zona
            ]);
        }

        // -------- INSERT --------
        $query = "
            INSERT INTO com_vendedor (
                vendedor, canal, zona
            ) VALUES (
                :vendedor, :canal, :zona
            )
        ";

        $stmt = $this->conn->prepare($query);

        $stmt->execute([
            ':vendedor' => $vendedor,
            ':canal'    => $canal,
            ':zona'     => $zona
        ]);
        return $this->conn->lastInsertId();
    }


    public function delete($id)
    {
        $query = "DELETE FROM com_vendedor WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($params = [])
    {
        $start  = $params['start'] ?? 0;
        $length = $params['length'] ?? 10;
        $search = $params['search']['value'] ?? '';

        $query = "
        SELECT
            id,
            vendedor,
            canal,
            zona
        FROM com_vendedor
        WHERE 1=1
    ";

        // 🔍 Búsqueda global
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
            AND (
                vendedor LIKE '%$search%' OR
                canal LIKE '%$search%' OR
                zona LIKE '%$search%'
            )
        ";
        }

        // Paginación
        $query .= " ORDER BY id ASC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_vendedor";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }

    public function countFiltered($params = [])
    {
        $search = $params['search']['value'] ?? '';

        $query = "
        SELECT COUNT(*) AS total
        FROM com_vendedor
        WHERE 1=1
    ";

        // 🔍 Misma búsqueda global que findByFilters()
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
            AND (
                vendedor LIKE '%$search%' OR
                canal LIKE '%$search%' OR
                zona LIKE '%$search%'
            )
        ";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }
}
