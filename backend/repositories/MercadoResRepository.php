<?php

class MercadoResRepository
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }
    public function findAll()
    {
        $query = "
            SELECT
            r.provincia,
            p.nombre AS provincia_nombre,
            r.num_mercados,
            r.tipo_establecimiento,
            r.tamanio,
            r.total,
            r.num_aves
        FROM com_db_mercado_res r
        LEFT JOIN com_provincia p ON r.provincia = p.codigo
        ORDER BY p.nombre ASC, r.tipo_establecimiento ASC, r.tamanio ASC
        ";

        return $this->executeQuery($query);
    }


    // VALIDACIÓN GENERAL (reutilizable)
    private function validarData($data)
    {
        if (empty($data['provincia'])) {
            throw new Exception("El campo 'provincia' es obligatorio.");
        }
        if (empty($data['tipo_establecimiento'])) {
            throw new Exception("El campo 'tipo_establecimiento' es obligatorio.");
        }
        if (empty($data['tamanio'])) {
            throw new Exception("El campo 'tamanio' es obligatorio.");
        }

        // NORMALIZAR
        $data['tipo_establecimiento'] = trim($data['tipo_establecimiento']);
        $data['tamanio'] = trim($data['tamanio']);

        // ENUMS
        $validTipos = [
            "Puesto de mercado",
            "Tienda y puesto aledaño"
        ];
        $validTamanios = ["Grande", "Mediano", "Chico"];

        if (!in_array($data['tipo_establecimiento'], $validTipos)) {
            throw new Exception("Valor inválido para 'tipo_establecimiento'.");
        }
        if (!in_array($data['tamanio'], $validTamanios)) {
            throw new Exception("Valor inválido para 'tamanio'.");
        }

        return [
            "provincia" => intval($data['provincia']),
            "tipo_establecimiento" => $data['tipo_establecimiento'],
            "tamanio" => $data['tamanio'],
            "num_mercados" => intval($data['num_mercados'] ?? 0),
            "total" => intval($data['total'] ?? 0),
            "num_aves" => intval($data['num_aves'] ?? 0)
        ];
    }

    // VERIFICAR EXISTENCIA
    private function existe($data)
    {
        $query = "
            SELECT COUNT(*) 
            FROM com_db_mercado_res
            WHERE provincia = :provincia
            AND tipo_establecimiento = :tipo_establecimiento
            AND tamanio = :tamanio
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ":provincia" => $data["provincia"],
            ":tipo_establecimiento" => $data["tipo_establecimiento"],
            ":tamanio" => $data["tamanio"]
        ]);

        return $stmt->fetchColumn() > 0;
    }

    // SOLO INSERT
    public function insertMercadoRes($data)
    {
        $data = $this->validarData($data);

        if ($this->existe($data)) {
            throw new Exception("El registro ya existe. No se puede duplicar.");
        }

        $query = "
            INSERT INTO com_db_mercado_res (
                provincia, num_mercados, tipo_establecimiento,
                tamanio, total, num_aves
            ) VALUES (
                :provincia, :num_mercados, :tipo_establecimiento,
                :tamanio, :total, :num_aves
            )
        ";

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($data);
    }

    // SOLO UPDATE
    public function updateMercadoRes($data)
    {
        $data = $this->validarData($data);

        if (!$this->existe($data)) {
            throw new Exception("No existe un registro con esta combinación única para actualizar.");
        }

        $query = "
            UPDATE com_db_mercado_res SET
                num_mercados = :num_mercados,
                total = :total,
                num_aves = :num_aves
            WHERE provincia = :provincia
            AND tipo_establecimiento = :tipo_establecimiento
            AND tamanio = :tamanio
        ";

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($data);
    }



    public function delete($provincia, $tipo_establecimiento, $tamanio)
    {
        $query = "
        DELETE FROM com_db_mercado_res
        WHERE provincia = :provincia
          AND tipo_establecimiento = :tipo_establecimiento
          AND tamanio = :tamanio
    ";

        $stmt = $this->conn->prepare($query);

        $stmt->execute([
            ':provincia' => $provincia,
            ':tipo_establecimiento' => $tipo_establecimiento,
            ':tamanio' => $tamanio,
        ]);

        return $stmt->rowCount(); // devuelve cuántas filas se eliminaron
    }

    public function findByFilters($params = [])
    {
        $start   = $params['start'] ?? 0;
        $length  = $params['length'] ?? 10;
        $search  = $params['search']['value'] ?? '';

        // Filtros seleccionados
        $provincia = $params['provincia'] ?? null;
        $tipo      = $params['tipo_establecimiento'] ?? null;

        $query = "
        SELECT 
            mr.provincia,
            p.nombre AS provincia_nombre,
            mr.num_mercados,
            mr.tipo_establecimiento,
            mr.tamanio,
            mr.total,
            mr.num_aves
        FROM com_db_mercado_res mr
        LEFT JOIN com_provincia p ON p.codigo = mr.provincia
        WHERE 1=1
    ";

        // FILTRO POR PROVINCIA
        if (!empty($provincia)) {
            $query .= " AND mr.provincia = '" . intval($provincia) . "' ";
        }

        // FILTRO POR TIPO DE ESTABLECIMIENTO
        if (!empty($tipo)) {
            $tipo = addslashes($tipo);
            $query .= " AND mr.tipo_establecimiento = '$tipo' ";
        }

        // BUSQUEDA GLOBAL
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
        AND (
            p.nombre LIKE '%$search%' OR
            mr.tipo_establecimiento LIKE '%$search%' OR
            mr.tamanio LIKE '%$search%' OR
            mr.num_mercados LIKE '%$search%' OR
            mr.total LIKE '%$search%' OR
            mr.num_aves LIKE '%$search%'
        )
        ";
        }

        // ORDEN + PAGINACIÓN
        $query .= " ORDER BY p.nombre DESC LIMIT $start, $length ";

        return $this->executeQuery($query);
    }


    public function countFiltered($params = [])
    {
        $search     = $params['search']['value'] ?? '';
        $provincia  = $params['provincia'] ?? null;
        $tipo       = $params['tipo_establecimiento'] ?? null;

        $query = "
        SELECT COUNT(*) AS total
        FROM com_db_mercado_res mr
        LEFT JOIN com_provincia p ON p.codigo = mr.provincia
        WHERE 1=1
    ";

        // FILTRO POR PROVINCIA
        if (!empty($provincia)) {
            $query .= " AND mr.provincia = '" . intval($provincia) . "' ";
        }

        // FILTRO POR TIPO DE ESTABLECIMIENTO
        if (!empty($tipo)) {
            $tipo = addslashes($tipo);
            $query .= " AND mr.tipo_establecimiento = '$tipo' ";
        }

        // BUSQUEDA GENERAL
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
        AND (
            p.nombre LIKE '%$search%' OR
            mr.tipo_establecimiento LIKE '%$search%' OR
            mr.tamanio LIKE '%$search%' OR
            mr.num_mercados LIKE '%$search%' OR
            mr.total LIKE '%$search%' OR
            mr.num_aves LIKE '%$search%'
        )
        ";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }


    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_mercado_res";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }





    private function executeQuery($query)
    {
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function generateUuid()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff)
        );
    }
}
