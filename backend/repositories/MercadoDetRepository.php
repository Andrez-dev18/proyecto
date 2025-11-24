<?php

class MercadoDetRepository
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
                a.id,
                a.fecha,
                m.nombre AS mercado,
                a.tipo_establecimiento,
                a.tamanio,
                a.cantidad,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_mercado_det a
            LEFT JOIN com_mercado m ON a.mercado = m.codigo
            ORDER BY a.fechaHoraRegistro DESC
        ";

        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si existe ID => actualizar
        if (!empty($data['id'])) {

            $query = "
            UPDATE com_db_mercado_det SET
                fecha = :fecha,
                mercado = :mercado,
                tipo_establecimiento = :tipo_establecimiento,
                tamanio = :tamanio,
                cantidad = :cantidad,
                usuarioRegistro = :usuarioRegistro,
                fechaHoraRegistro = :fechaHoraRegistro,
                usuarioTransferencia = :usuarioTransferencia,
                fechaHoraTransferencia = :fechaHoraTransferencia
            WHERE id = :id
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':mercado' => $data['mercado'] ?? null,
                ':tipo_establecimiento' => $data['tipo_establecimiento'] ?? null,
                ':tamanio' => $data['tamanio'] ?? null,
                ':cantidad' => $data['cantidad'] ?? 0,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si NO tiene ID => insertar
        else {

            $query = "
            INSERT INTO com_db_mercado_det (
                id,
                fecha,
                mercado,
                tipo_establecimiento,
                tamanio,
                cantidad,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :mercado,
                :tipo_establecimiento,
                :tamanio,
                :cantidad,
                :usuarioRegistro,
                :fechaHoraRegistro,
                :usuarioTransferencia,
                :fechaHoraTransferencia
            )
        ";

            // Generar UUID
            $data['id'] = $this->generateUuid();

            $stmt = $this->conn->prepare($query);

            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':mercado' => $data['mercado'] ?? null,
                ':tipo_establecimiento' => $data['tipo_establecimiento'] ?? null,
                ':tamanio' => $data['tamanio'] ?? null,
                ':cantidad' => $data['cantidad'] ?? 0,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }

        return $stmt->execute($params);
    }


    public function delete($id)
    {
        $query = "DELETE FROM com_db_mercado_det WHERE id = :id";
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

        $mercado = $params['mercado'] ?? null;
        $tipo_establecimiento = $params['tipo_establecimiento'] ?? null;

        $query = "
        SELECT
            a.id,
            a.fecha,
            m.nombre AS mercado,
            a.tipo_establecimiento,
            a.tamanio,
            a.cantidad,
            a.usuarioRegistro,
            a.fechaHoraRegistro,
            a.usuarioTransferencia,
            a.fechaHoraTransferencia
        FROM com_db_mercado_det a
        LEFT JOIN com_mercado m ON a.mercado = m.codigo
        WHERE 1=1
    ";

        // FILTRO POR FECHAS
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND a.fecha BETWEEN '$fechaInicio' AND '$fechaFin' ";
        }

        // FILTRO POR MERCADO
        if (!empty($mercado)) {
            $query .= " AND a.mercado = $mercado ";
        }

        // FILTRO POR TIPO ESTABLECIMIENTO
        if (!empty($tipo_establecimiento)) {
            $query .= " AND a.tipo_establecimiento = '$tipo_establecimiento' ";
        }

        // BÚSQUEDA GENERAL
        if (!empty($search)) {
            $query .= "
            AND (
                m.nombre LIKE '%$search%' OR
                a.tipo_establecimiento LIKE '%$search%' OR
                a.tamanio LIKE '%$search%'
            )
        ";
        }

        // ORDEN + PAGINACIÓN
        $query .= " ORDER BY a.fecha DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_mercado_det";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }

    public function countFiltered($params = [])
    {
        $search = $params['search']['value'] ?? '';

        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $mercado = $params['mercado'] ?? null;
        $tipo_establecimiento = $params['tipo_establecimiento'] ?? null;

        $query = "
        SELECT COUNT(*) AS total
        FROM com_db_mercado_det a
        LEFT JOIN com_mercado m ON a.mercado = m.codigo
        WHERE 1=1
    ";

        // Fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND a.fecha BETWEEN '$fechaInicio' AND '$fechaFin' ";
        }

        // Mercado
        if (!empty($mercado)) {
            $query .= " AND a.mercado = $mercado ";
        }

        // Tipo establecimiento
        if (!empty($tipo_establecimiento)) {
            $query .= " AND a.tipo_establecimiento = '$tipo_establecimiento' ";
        }

        // Búsqueda global
        if (!empty($search)) {
            $query .= "
            AND (
                m.nombre LIKE '%$search%' OR
                a.tipo_establecimiento LIKE '%$search%' OR
                a.tamanio LIKE '%$search%'
            )
        ";
        }

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
