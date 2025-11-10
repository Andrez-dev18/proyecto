<?php

class CriadorEmprendedorRepository
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
                pr.nombre AS proveedor,
                t.nombre AS tipo,
                a.cantidad,
                a.precio,
                a.observaciones,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_criador_emprendedor a
            LEFT JOIN com_provincia p ON a.provincia = p.codigo
            LEFT JOIN com_proveedor pr ON a.proveedor = pr.codigo
            LEFT JOIN com_tipo t ON a.tipo = t.codigo
            ORDER BY a.fechaHoraRegistro DESC

        ";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_criador_emprendedor SET
                fecha = :fecha,
                provincia = :provincia,
                proveedor = :proveedor,
                tipo = :tipo,
                cantidad = :cantidad,
                precio = :precio,
                observaciones = :observaciones,
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
                ':proveedor' => $data['proveedor'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':precio' => $data['precio'] ?? null,
                ':observaciones' => $data['observaciones'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
            INSERT INTO com_db_criador_emprendedor (
                id,
                fecha,
                provincia,
                proveedor,
                tipo,
                cantidad,
                precio,
                observaciones,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :provincia,
                :proveedor,
                :tipo,
                :cantidad,
                :precio,
                :observaciones,
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
                ':provincia' => $data['provincia'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':precio' => $data['precio'] ?? null,
                ':observaciones' => $data['observaciones'] ?? null,
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
        $query = "DELETE FROM com_db_criador_emprendedor WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $provincia = null, $proveedor, $tipo)
    {
        $query = "
        SELECT
                a.id,
                a.fecha,
                p.nombre AS provincia,
                pr.nombre AS proveedor,
                t.nombre AS tipo,
                a.cantidad,
                a.precio,
                a.observaciones,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_criador_emprendedor a
            LEFT JOIN com_provincia p ON a.provincia = p.codigo
            LEFT JOIN com_proveedor pr ON a.proveedor = pr.codigo
            LEFT JOIN com_tipo t ON a.tipo = t.codigo
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
        if (!empty($proveedor)) $query .= " AND a.proveedor = $proveedor";
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
