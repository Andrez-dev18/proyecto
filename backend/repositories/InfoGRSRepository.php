<?php

class InfoGRSRepository
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
                fecha,
                provincia,
                zona,
                tipo,
                categoria,
                linea,
                codigo,
                descripcion,
                cantidad,
                precio,
                peso,
                importe,
                peso_prom,
                mercado,
                nom_db,
                usuarioRegistro,
                fechaHoraRegistro
            FROM com_db_info_grs
            ORDER BY fecha DESC;
        ";

        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // SI TIENE ID → UPDATE
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_info_grs SET
                fecha = :fecha,
                provincia = :provincia,
                zona = :zona,
                tipo = :tipo,
                categoria = :categoria,
                linea = :linea,
                codigo = :codigo,
                descripcion = :descripcion,
                cantidad = :cantidad,
                precio = :precio,
                peso = :peso,
                importe = :importe,
                peso_prom = :peso_prom,
                mercado = :mercado
            WHERE id = :id
        ";

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':categoria' => $data['categoria'] ?? null,
                ':linea' => $data['linea'] ?? null,
                ':codigo' => $data['codigo'] ?? null,
                ':descripcion' => $data['descripcion'] ?? null,
                ':cantidad' => $data['cantidad'] ?? 0,
                ':precio' => $data['precio'] ?? 0,
                ':peso' => $data['peso'] ?? 0,
                ':importe' => $data['importe'] ?? 0,
                ':peso_prom' => $data['peso_prom'] ?? 0,
                ':mercado' => $data['mercado'] ?? 0
            ];
        }

        // SI NO TIENE ID → INSERT
        else {
            $query = "
            INSERT INTO com_db_info_grs (
                fecha, provincia, zona, tipo, categoria, linea, codigo, descripcion,
                cantidad, precio, peso, importe, peso_prom, mercado,
                nom_db, usuarioRegistro, fechaHoraRegistro
            ) VALUES (
                :fecha, :provincia, :zona, :tipo, :categoria, :linea, :codigo, :descripcion,
                :cantidad, :precio, :peso, :importe, :peso_prom, :mercado,
                :nom_db, :usuarioRegistro, NOW()
            )
        ";

            $stmt = $this->conn->prepare($query);
            $params = [
                ':fecha' => $data['fecha'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':categoria' => $data['categoria'] ?? null,
                ':linea' => $data['linea'] ?? null,
                ':codigo' => $data['codigo'] ?? null,
                ':descripcion' => $data['descripcion'] ?? null,
                ':cantidad' => $data['cantidad'] ?? 0,
                ':precio' => $data['precio'] ?? 0,
                ':peso' => $data['peso'] ?? 0,
                ':importe' => $data['importe'] ?? 0,
                ':peso_prom' => $data['peso_prom'] ?? 0,
                ':mercado' => $data['mercado'] ?? 0,
                ':nom_db' => 'grs',
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? 'sistema'
            ];
        }

        return $stmt->execute($params);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_db_info_grs WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }


    public function findByFilters($params = [])
    {
        $start  = $params['start'] ?? 0;
        $length = $params['length'] ?? 10;
        $search = $params['search']['value'] ?? '';

        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $query = "
        SELECT 
            id,
            fecha,
            provincia,
            zona,
            tipo,
            categoria,
            linea,
            codigo,
            descripcion,
            cantidad,
            precio,
            peso,
            importe,
            peso_prom,
            mercado,
            nom_db
        FROM com_db_info_grs
        WHERE 1=1
    ";

        // FILTRO POR FECHAS
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha >= '$fechaInicio' AND fecha <= '$fechaFin' ";
        }

        // SEARCH
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
            AND (
                provincia LIKE '%$search%' OR
                zona LIKE '%$search%' OR
                tipo LIKE '%$search%' OR
                categoria LIKE '%$search%' OR
                linea LIKE '%$search%' OR
                codigo LIKE '%$search%' OR
                descripcion LIKE '%$search%'
            )
        ";
        }

        // ORDEN + PAGINACIÓN
        $query .= " ORDER BY fecha DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_info_grs";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }

    public function countFiltered($params = [])
    {
        $search = $params['search']['value'] ?? '';
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $query = "
        SELECT COUNT(*) AS total
        FROM com_db_info_grs
        WHERE 1=1
    ";

        // Filtro de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha >= '$fechaInicio' AND fecha <= '$fechaFin' ";
        }

        // Search
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
            AND (
                provincia LIKE '%$search%' OR
                zona LIKE '%$search%' OR
                tipo LIKE '%$search%' OR
                categoria LIKE '%$search%' OR
                linea LIKE '%$search%' OR
                codigo LIKE '%$search%' OR
                descripcion LIKE '%$search%'
            )
        ";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }
}
