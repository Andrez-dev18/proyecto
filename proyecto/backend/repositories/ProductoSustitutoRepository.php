<?php

class ProductoSustitutoRepository
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
                b.nombre producto,
                a.peso,
                a.precio,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
                FROM com_db_prod_sustituto AS a 
                INNER JOIN com_tip_prod_sut AS b ON a.producto=b.codigo
            ORDER BY a.fechaHoraRegistro DESC
    ";

        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_db_prod_sustituto WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
        UPDATE com_db_prod_sustituto SET
            fecha = :fecha,
            producto = :producto,
            peso = :peso,
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
                ':producto' => $data['producto'] ?? null,
                ':peso' => $data['peso'] ?? null,
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
        INSERT INTO com_db_prod_sustituto (
            id,
            fecha,
            producto,
            peso,
            precio,
            usuarioRegistro,
            fechaHoraRegistro,
            usuarioTransferencia,
            fechaHoraTransferencia
        ) VALUES (
            :id,
            :fecha,
            :producto,
            :peso,
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
                ':producto' => $data['producto'] ?? null,
                ':peso' => $data['peso'] ?? null,
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
        $query = "DELETE FROM com_db_prod_sustituto WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $producto = null)
    {
        $query = "
             SELECT 
                a.id,
                a.fecha,
                b.nombre producto,
                a.peso,
                a.precio,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
                FROM com_db_prod_sustituto AS a 
                LEFT JOIN com_tip_prod_sut AS b ON a.producto=b.codigo
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

        // 🔹 Filtro por empresa
        if (!empty($producto)) {
            $query .= " AND a.producto = $producto";
        }

        // 🔹 Ordenar por registro más reciente
        $query .= " ORDER BY a.fechaHoraRegistro DESC";

        return $this->executeQuery($query);
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
