<?php

class HuevoRepository
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
                h.id,
                h.fecha,
                p.nombre AS provincia,
                t.nombre AS tipo,
                m.nombre AS mercado,
                pr.nombre AS proveedor,
                h.precioMayMin,
                h.precioMayMax,
                h.precioPubMin,
                h.precioPubMax,
                h.usuarioRegistro,
                h.fechaHoraRegistro,
                h.usuarioTransferencia,
                h.fechaHoraTransferencia
            FROM com_db_huevo h
            LEFT JOIN com_provincia p ON h.provincia = p.codigo
            LEFT JOIN com_tipo t ON h.tipo = t.codigo
            LEFT JOIN com_mercado m ON h.mercado = m.codigo
            LEFT JOIN com_proveedor pr ON h.proveedor = pr.codigo
            ORDER BY h.fechaHoraRegistro DESC
        ";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_huevo SET
                fecha = :fecha,
                provincia = :provincia,
                tipo = :tipo,
                mercado = :mercado,
                proveedor = :proveedor,
                precioMayMin = :precioMayMin,
                precioMayMax = :precioMayMax,
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
                ':provincia' => $data['provincia'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':mercado' => $data['mercado'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':precioMayMin' => $data['precioMayMin'] ?? null,
                ':precioMayMax' => $data['precioMayMax'] ?? null,
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
            INSERT INTO com_db_huevo (
                id,
                fecha,
                provincia,
                tipo,
                mercado,
                proveedor,
                precioMayMin,
                precioMayMax,
                precioPubMin,
                precioPubMax,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :provincia,
                :tipo,
                :mercado,
                :proveedor,
                :precioMayMin,
                :precioMayMax,
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
                ':provincia' => $data['provincia'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':mercado' => $data['mercado'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':precioMayMin' => $data['precioMayMin'] ?? null,
                ':precioMayMax' => $data['precioMayMax'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
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
        $query = "DELETE FROM com_db_huevo WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':id' => $id]);
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $provincia = null, $tipo = null, $mercado = null, $proveedor = null)
    {
        $query = "
        SELECT
                h.id,
                h.fecha,
                p.nombre AS provincia,
                t.nombre AS tipo,
                m.nombre AS mercado,
                pr.nombre AS proveedor,
                h.precioMayMin,
                h.precioMayMax,
                h.precioPubMin,
                h.precioPubMax,
                h.usuarioRegistro,
                h.fechaHoraRegistro,
                h.usuarioTransferencia,
                h.fechaHoraTransferencia
            FROM com_db_huevo h
            LEFT JOIN com_provincia p ON h.provincia = p.codigo
            LEFT JOIN com_tipo t ON h.tipo = t.codigo
            LEFT JOIN com_mercado m ON h.mercado = m.codigo
            LEFT JOIN com_proveedor pr ON h.proveedor = pr.codigo
            WHERE 1=1
    ";

        // 🔹 Filtro de rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND h.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND h.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND h.fecha <= '$fechaFin'";
        }
        // 🔹 Otros filtros
        if (!empty($provincia)) $query .= " AND h.provincia = $provincia";
        if (!empty($tipo)) $query .= " AND h.tipo = $tipo";
        if (!empty($mercado)) $query .= " AND h.mercado = $mercado";
        if (!empty($proveedor)) $query .= " AND h.proveedor = $proveedor";
        
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
