<?php

class PrecioVivoRepository
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
                p.id,
                p.fecha,
                e.nombre AS empresa,
                p.precioMinCentroAcopio,
                p.precioMaxCentroAcopio,
                p.precioMinMayoristaReparto,
                p.precioMaxMayoristaReparto,
                p.precioPubMin,
                p.precioPubMax,
                p.usuarioRegistro,
                p.fechaHoraRegistro,
                p.usuarioTransferencia,
                p.fechaHoraTransferencia
            FROM com_db_precio_vivo p
            LEFT JOIN com_empresa e ON p.empresa = e.codigo
            ORDER BY p.fechaHoraRegistro DESC
        ";
        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_db_precio_vivo WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_precio_vivo SET
                fecha = :fecha,
                empresa = :empresa,
                precioMinCentroAcopio = :precioMinCentroAcopio,
                precioMaxCentroAcopio = :precioMaxCentroAcopio,
                precioMinMayoristaReparto = :precioMinMayoristaReparto,
                precioMaxMayoristaReparto = :precioMaxMayoristaReparto,
                precioPubMin = :precioPubMin,
                precioPubMax = :precioPubMax,
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
                ':empresa' => $data['empresa'] ?? null,
                ':precioMinCentroAcopio' => $data['precioMinCentroAcopio'] ?? null,
                ':precioMaxCentroAcopio' => $data['precioMaxCentroAcopio'] ?? null,
                ':precioMinMayoristaReparto' => $data['precioMinMayoristaReparto'] ?? null,
                ':precioMaxMayoristaReparto' => $data['precioMaxMayoristaReparto'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
            INSERT INTO com_db_precio_vivo (
                id,
                fecha,
                empresa,
                precioMinCentroAcopio,
                precioMaxCentroAcopio,
                precioMinMayoristaReparto,
                precioMaxMayoristaReparto,
                precioPubMin,
                precioPubMax,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :empresa,
                :precioMinCentroAcopio,
                :precioMaxCentroAcopio,
                :precioMinMayoristaReparto,
                :precioMaxMayoristaReparto,
                :precioPubMin,
                :precioPubMax,
                :usuarioRegistro,
                :fechaHoraRegistro,
                :usuarioTransferencia,
                :fechaHoraTransferencia
            )
        ";

            // Generar UUID manualmente si no existe
            $data['id'] = $this->generateUuid();

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':empresa' => $data['empresa'] ?? null,
                ':precioMinCentroAcopio' => $data['precioMinCentroAcopio'] ?? null,
                ':precioMaxCentroAcopio' => $data['precioMaxCentroAcopio'] ?? null,
                ':precioMinMayoristaReparto' => $data['precioMinMayoristaReparto'] ?? null,
                ':precioMaxMayoristaReparto' => $data['precioMaxMayoristaReparto'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }

        $stmt->execute($params);
        return $data['id'];
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_db_precio_vivo WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $empresa = null)
    {
        $query = "
        SELECT
                p.id,
                p.fecha,
                e.nombre AS empresa,
                p.precioMinCentroAcopio,
                p.precioMaxCentroAcopio,
                p.precioMinMayoristaReparto,
                p.precioMaxMayoristaReparto,
                p.precioPubMin,
                p.precioPubMax,
                p.usuarioRegistro,
                p.fechaHoraRegistro,
                p.usuarioTransferencia,
                p.fechaHoraTransferencia
            FROM com_db_precio_vivo p
            LEFT JOIN com_empresa e ON p.empresa = e.codigo
            WHERE 1=1
    ";

        // 🔹 Filtro de rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND p.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND p.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND p.fecha <= '$fechaFin'";
        }
        // 🔹 Otros filtros
        if (!empty($empresa)) $query .= " AND p.empresa = $empresa";

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
