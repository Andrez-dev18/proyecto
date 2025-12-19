<?php

class GallinaCDRepository
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
            g.id,
            g.fecha,
            t.nombre AS tipo,
            g.unidades,
            g.kilos,
            g.peso,
            g.precio_granja_1,
            g.precio_granja_2,
            g.precio_granja_3,
            g.precio_granja_4,
            g.precio_granja_5,
            g.precio_cd_1,
            g.precio_cd_2,
            g.precio_cd_3,
            g.precio_cd_4,
            g.precio_cd_5,
            g.usuarioRegistro,
            g.fechaHoraRegistro,
            g.usuarioTransferencia,
            g.fechaHoraTransferencia
        FROM com_db_gallina_cd g
        LEFT JOIN com_tipo_gallina t ON g.tipo = t.codigo
        ORDER BY g.fechaHoraRegistro DESC
    ";

        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_db_gallina_cd WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
        UPDATE com_db_gallina_cd SET
            fecha = :fecha,
            tipo = :tipo,
            unidades = :unidades,
            kilos = :kilos,
            peso = :peso,
            precio_granja_1 = :precio_granja_1,
            precio_granja_2 = :precio_granja_2,
            precio_granja_3 = :precio_granja_3,
            precio_granja_4 = :precio_granja_4,
            precio_granja_5 = :precio_granja_5,
            precio_cd_1 = :precio_cd_1,
            precio_cd_2 = :precio_cd_2,
            precio_cd_3 = :precio_cd_3,
            precio_cd_4 = :precio_cd_4,
            precio_cd_5 = :precio_cd_5,
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
                ':tipo' => $data['tipo'] ?? null,
                ':unidades' => $data['unidades'] ?? null,
                ':kilos' => $data['kilos'] ?? null,
                ':peso' => $data['peso'] ?? null,
                ':precio_granja_1' => $data['precio_granja_1'] ?? null,
                ':precio_granja_2' => $data['precio_granja_2'] ?? null,
                ':precio_granja_3' => $data['precio_granja_3'] ?? null,
                ':precio_granja_4' => $data['precio_granja_4'] ?? null,
                ':precio_granja_5' => $data['precio_granja_5'] ?? null,
                ':precio_cd_1' => $data['precio_cd_1'] ?? null,
                ':precio_cd_2' => $data['precio_cd_2'] ?? null,
                ':precio_cd_3' => $data['precio_cd_3'] ?? null,
                ':precio_cd_4' => $data['precio_cd_4'] ?? null,
                ':precio_cd_5' => $data['precio_cd_5'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
        INSERT INTO com_db_gallina_cd (
            id,
            fecha,
            tipo,
            unidades,
            kilos,
            peso,
            precio_granja_1,
            precio_granja_2,
            precio_granja_3,
            precio_granja_4,
            precio_granja_5,
            precio_cd_1,
            precio_cd_2,
            precio_cd_3,
            precio_cd_4,
            precio_cd_5,
            usuarioRegistro,
            fechaHoraRegistro,
            usuarioTransferencia,
            fechaHoraTransferencia
        ) VALUES (
            :id,
            :fecha,
            :tipo,
            :unidades,
            :kilos,
            :peso,
            :precio_granja_1,
            :precio_granja_2,
            :precio_granja_3,
            :precio_granja_4,
            :precio_granja_5,
            :precio_cd_1,
            :precio_cd_2,
            :precio_cd_3,
            :precio_cd_4,
            :precio_cd_5,
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
                ':tipo' => $data['tipo'] ?? null,
                ':unidades' => $data['unidades'] ?? null,
                ':kilos' => $data['kilos'] ?? null,
                ':peso' => $data['peso'] ?? null,
                ':precio_granja_1' => $data['precio_granja_1'] ?? null,
                ':precio_granja_2' => $data['precio_granja_2'] ?? null,
                ':precio_granja_3' => $data['precio_granja_3'] ?? null,
                ':precio_granja_4' => $data['precio_granja_4'] ?? null,
                ':precio_granja_5' => $data['precio_granja_5'] ?? null,
                ':precio_cd_1' => $data['precio_cd_1'] ?? null,
                ':precio_cd_2' => $data['precio_cd_2'] ?? null,
                ':precio_cd_3' => $data['precio_cd_3'] ?? null,
                ':precio_cd_4' => $data['precio_cd_4'] ?? null,
                ':precio_cd_5' => $data['precio_cd_5'] ?? null,
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
        $query = "DELETE FROM com_db_gallina_cd WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $tipo = null)
    {
        $query = "
       SELECT
            g.id,
            g.fecha,
            t.nombre AS tipo,
            g.unidades,
            g.kilos,
            g.peso,
            g.precio_granja_1,
            g.precio_granja_2,
            g.precio_granja_3,
            g.precio_granja_4,
            g.precio_granja_5,
            g.precio_cd_1,
            g.precio_cd_2,
            g.precio_cd_3,
            g.precio_cd_4,
            g.precio_cd_5,
            g.usuarioRegistro,
            g.fechaHoraRegistro,
            g.usuarioTransferencia,
            g.fechaHoraTransferencia
        FROM com_db_gallina_cd g
        LEFT JOIN com_tipo_gallina t ON g.tipo = t.codigo
        WHERE 1=1
    ";

        // 🔹 Filtro de rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND g.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND g.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND g.fecha <= '$fechaFin'";
        }

        // 🔹 Filtro por empresa
        if (!empty($tipo)) {
            $query .= " AND g.tipo = $tipo";
        }

        // 🔹 Ordenar por registro más reciente
        $query .= " ORDER BY g.fechaHoraRegistro DESC";

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
