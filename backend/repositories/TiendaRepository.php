<?php

class TiendaRepository
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
                t.id,
                t.fecha,
                e.nombre AS empresa,
                i.nombre AS tipo,
                t.codpro,
                t.precio,
                t.usuarioRegistro,
                t.fechaHoraRegistro,
                t.usuarioTransferencia,
                t.fechaHoraTransferencia
            FROM com_db_tienda t
            LEFT JOIN com_empresa e ON t.empresa = e.codigo
            LEFT JOIN com_tipo i ON t.tipo = i.codigo
            ORDER BY t.fechaHoraRegistro DESC
        ";
        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_db_tienda WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_tienda SET
                fecha = :fecha,
                empresa = :empresa,
                tipo = :tipo,
                codpro = :codpro,
                precio = :precio,
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
                ':tipo' => $data['tipo'] ?? null,
                ':codpro' => $data['codpro'] ?? null,
                ':precio' => $data['precio'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
            INSERT INTO com_db_tienda (
                id,
                fecha,
                empresa,
                tipo,
                codpro,
                precio,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :empresa,
                :tipo,
                :codpro,
                :precio,
                :usuarioRegistro,
                :fechaHoraRegistro,
                :usuarioTransferencia,
                :fechaHoraTransferencia
            )
        ";

            // Generar UUID si no existe
            $data['id'] = $this->generateUuid();

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':empresa' => $data['empresa'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':codpro' => $data['codpro'] ?? null,
                ':precio' => $data['precio'] ?? null,
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
        $query = "DELETE FROM com_db_tienda WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $empresa = null, $tipo = null)
    {
        $query = "
        SELECT
                t.id,
                t.fecha,
                e.nombre AS empresa,
                i.nombre AS tipo,
                t.codpro,
                t.precio,
                t.usuarioRegistro,
                t.fechaHoraRegistro,
                t.usuarioTransferencia,
                t.fechaHoraTransferencia
            FROM com_db_tienda t
            LEFT JOIN com_empresa e ON t.empresa = e.codigo
            LEFT JOIN com_tipo i ON t.tipo = i.codigo
            WHERE 1=1
    ";

        // 🔹 Filtro de rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND t.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND t.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND t.fecha <= '$fechaFin'";
        }
        // 🔹 Otros filtros
        if (!empty($empresa)) $query .= " AND t.empresa = $empresa";
        if (!empty($tipo)) $query .= " AND t.tipo = $tipo";

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
