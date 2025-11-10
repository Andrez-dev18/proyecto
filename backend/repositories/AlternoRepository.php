<?php

class AlternoRepository
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
                a.id,
                a.fecha,
                p.nombre AS provincia,
                m.nombre AS mercado,
                t.nombre AS tipo,
                a.precioMin,
                a.precioMax,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_alterno a
            LEFT JOIN com_tipo t ON a.tipo = t.codigo
            LEFT JOIN com_provincia p ON a.provincia = p.codigo
            LEFT JOIN com_mercado m ON a.mercado = m.codigo
            ORDER BY a.fechaHoraRegistro DESC
        ";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_alterno SET
                fecha = :fecha,
                provincia = :provincia,
                mercado = :mercado,
                tipo = :tipo,
                precioMin = :precioMin,
                precioMax = :precioMax,
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
                ':provincia' => $data['provincia'] ?? null,
                ':mercado' => $data['mercado'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':precioMin' => $data['precioMin'] ?? null,
                ':precioMax' => $data['precioMax'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
            INSERT INTO com_db_alterno (
                id,
                fecha,
                provincia,
                mercado,
                tipo,
                precioMin,
                precioMax,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :provincia,
                :mercado,
                :tipo,
                :precioMin,
                :precioMax,
                :usuarioRegistro,
                :fechaHoraRegistro,
                :usuarioTransferencia,
                :fechaHoraTransferencia
            )
        ";

            // Generar UUID manualmente si no existe
            $data['id'] =  $this->generateUuid();

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':mercado' => $data['mercado'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':precioMin' => $data['precioMin'] ?? null,
                ':precioMax' => $data['precioMax'] ?? null,
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
        $query = "DELETE FROM com_db_alterno WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $provincia = null, $mercado = null, $tipo = null)
    {
        $query = "
        SELECT
                a.id,
                a.fecha,
                p.nombre AS provincia,
                m.nombre AS mercado,
                t.nombre AS tipo,
                a.precioMin,
                a.precioMax,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_alterno a
            LEFT JOIN com_tipo t ON a.tipo = t.codigo
            LEFT JOIN com_provincia p ON a.provincia = p.codigo
            LEFT JOIN com_mercado m ON a.mercado = m.codigo
            WHERE 1=1
    ";

        // 🔹 Filtro de rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND a.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND a.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND a.fecha <= '$fechaFin'";
        }
        if (!empty($provincia)) $query .= " AND a.provincia = $provincia";
        if (!empty($mercado)) $query .= " AND a.mercado = $mercado";
        if (!empty($tipo)) $query .= " AND a.tipo = $tipo";

        return $this->executeQuery($query);
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
