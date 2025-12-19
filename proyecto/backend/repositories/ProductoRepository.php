<?php

class ProductoRepository
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
            descripcion,
            linea,
            sublinea,
            codigo
        FROM com_producto
        ORDER BY descripcion ASC
    ";

        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_producto WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        $descripcion = $data["descripcion"] ?? null;

        // *** VALIDACIÓN DE DUPLICADOS ***
        if ($this->existsDescripcion($descripcion, $data["id"] ?? null)) {
            throw new Exception("La descripción '{$descripcion}' ya existe.");
        }

        // ----------------- UPDATE -----------------
        if (!empty($data["id"])) {

            $query = "
                UPDATE com_producto SET
                    descripcion = :descripcion,
                    linea = :linea,
                    sublinea = :sublinea,
                    codigo = :codigo
                WHERE id = :id
            ";

            $stmt = $this->conn->prepare($query);
            return $stmt->execute([
                ":id" => $data["id"],
                ":descripcion" => $descripcion,
                ":linea" => $data["linea"] ?? null,
                ":sublinea" => $data["sublinea"] ?? null,
                ":codigo" => $data["codigo"] ?? null
            ]);
        }

        // ----------------- INSERT -----------------
        $query = "
            INSERT INTO com_producto (
                descripcion, linea, sublinea, codigo
            ) VALUES (
                :descripcion, :linea, :sublinea, :codigo
            )
        ";

        $stmt = $this->conn->prepare($query);
        $params = [
            ":descripcion" => $descripcion,
            ":linea" => $data["linea"] ?? null,
            ":sublinea" => $data["sublinea"] ?? null,
            ":codigo" => $data["codigo"] ?? null
        ];
        $stmt->execute($params);
        return $this->conn->lastInsertId();
    }


    public function delete($id)
    {
        $query = "DELETE FROM com_producto WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($params = [])
    {
        $start   = $params['start'] ?? 0;
        $length  = $params['length'] ?? 10;
        $search  = $params['search']['value'] ?? '';

        $query = "
        SELECT
            id,
            descripcion,
            linea,
            sublinea,
            codigo
        FROM com_producto
        WHERE 1=1
    ";

        // 🔍 Búsqueda global
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= " AND (
            descripcion LIKE '%$search%' OR
            linea LIKE '%$search%' OR
            sublinea LIKE '%$search%' OR
            codigo LIKE '%$search%'
        )";
        }

        // 📌 Orden y paginación
        $query .= " ORDER BY id ASC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_producto";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }


    public function countFiltered($params = [])
    {
        $search = $params['search']['value'] ?? '';

        $query = "
        SELECT COUNT(*) AS total
        FROM com_producto
        WHERE 1=1
    ";

        // 🔍 Aplicar búsqueda global
        if (!empty($search)) {
            $search = addslashes($search);

            $query .= " AND (
            descripcion LIKE '%$search%' OR
            linea LIKE '%$search%' OR
            sublinea LIKE '%$search%' OR
            codigo LIKE '%$search%'
        )";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }


    public function existsDescripcion($descripcion, $id = null)
    {
        $sql = "SELECT id FROM com_producto WHERE descripcion = :descripcion";

        // Si es UPDATE, excluir su propio ID
        if ($id !== null) {
            $sql .= " AND id != :id";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":descripcion", $descripcion);

        if ($id !== null) {
            $stmt->bindValue(":id", $id);
        }

        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ? true : false;
    }
}
