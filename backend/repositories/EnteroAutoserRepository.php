<?php

class EnteroAutoserRepository
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
                p.nombre AS proveedor,
                a.precioMayMin,
                a.precioMayMax,
                a.precioPubMin,
                a.precioPubMax,
                a.color,
                a.cantidad,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_entero_autoser a
            LEFT JOIN com_proveedor p ON a.proveedor = p.codigo
            ORDER BY a.fechaHoraRegistro DESC
        ";
        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_db_entero_autoser WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_entero_autoser SET
                fecha = :fecha,
                proveedor = :proveedor,
                precioMayMin = :precioMayMin,
                precioMayMax = :precioMayMax,
                precioPubMin = :precioPubMin,
                precioPubMax = :precioPubMax,
                color = :color,
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
                ':proveedor' => $data['proveedor'] ?? null,
                ':precioMayMin' => $data['precioMayMin'] ?? null,
                ':precioMayMax' => $data['precioMayMax'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
                ':color' => $data['color'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
            INSERT INTO com_db_entero_autoser (
                id,
                fecha,
                proveedor,
                precioMayMin,
                precioMayMax,
                precioPubMin,
                precioPubMax,
                color,
                cantidad,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :proveedor,
                :precioMayMin,
                :precioMayMax,
                :precioPubMin,
                :precioPubMax,
                :color,
                :cantidad,
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
                ':proveedor' => $data['proveedor'] ?? null,
                ':precioMayMin' => $data['precioMayMin'] ?? null,
                ':precioMayMax' => $data['precioMayMax'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
                ':color' => $data['color'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
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
        $query = "DELETE FROM com_db_entero_autoser WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $proveedor = null)
    {
        $query = "
        SELECT
                a.id,
                a.fecha,
                p.nombre AS proveedor,
                a.precioMayMin,
                a.precioMayMax,
                a.precioPubMin,
                a.precioPubMax,
                a.color,
                a.cantidad,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_entero_autoser a
            LEFT JOIN com_proveedor p ON a.proveedor = p.codigo
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
        if (!empty($proveedor)) $query .= " AND a.proveedor = $proveedor";

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
