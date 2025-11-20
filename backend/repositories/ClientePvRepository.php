<?php

class ClientePvRepository
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
                zona,
                subzona,
                cliente,
                coorporativo,
                carne_unidad,
                carne_kilos,
                carne_soles,
                brasa_unidad,
                brasa_kilos,
                brasa_soles,
                total_unidad,
                total_kilos,
                total_soles,
                nom_db,
                usuarioRegistro,
                fechaHoraRegistro
            FROM com_db_ctrl_cliente_pv
            ORDER BY fechaHoraRegistro DESC
    ";

        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si tiene ID: actualizar
        if (!empty($data['id'])) {

            $query = "
        UPDATE com_db_ctrl_cliente_pv SET
            fecha = :fecha,
            zona = :zona,
            subzona = :subzona,
            cliente = :cliente,
            coorporativo = :coorporativo,
            carne_unidad = :carne_unidad,
            carne_kilos = :carne_kilos,
            carne_soles = :carne_soles,
            brasa_unidad = :brasa_unidad,
            brasa_kilos = :brasa_kilos,
            brasa_soles = :brasa_soles,
            total_unidad = :total_unidad,
            total_kilos = :total_kilos,
            total_soles = :total_soles
        WHERE id = :id
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':subzona' => $data['subzona'] ?? null,
                ':cliente' => $data['cliente'] ?? null,
                ':coorporativo' => $data['coorporativo'] ?? null,
                ':carne_unidad' => $data['carne_unidad'] ?? 0,
                ':carne_kilos' => $data['carne_kilos'] ?? 0,
                ':carne_soles' => $data['carne_soles'] ?? 0,
                ':brasa_unidad' => $data['brasa_unidad'] ?? 0,
                ':brasa_kilos' => $data['brasa_kilos'] ?? 0,
                ':brasa_soles' => $data['brasa_soles'] ?? 0,
                ':total_unidad' => $data['total_unidad'] ?? 0,
                ':total_kilos' => $data['total_kilos'] ?? 0,
                ':total_soles' => $data['total_soles'] ?? 0
            ];
        }

        // Si no tiene ID: insertar
        else {

            $query = "
        INSERT INTO com_db_ctrl_cliente_pv (
            fecha,
            zona,
            subzona,
            cliente,
            coorporativo,
            carne_unidad,
            carne_kilos,
            carne_soles,
            brasa_unidad,
            brasa_kilos,
            brasa_soles,
            total_unidad,
            total_kilos,
            total_soles,
            nom_db,
            usuarioRegistro,
            fechaHoraRegistro
        ) VALUES (
            :fecha,
            :zona,
            :subzona,
            :cliente,
            :coorporativo,
            :carne_unidad,
            :carne_kilos,
            :carne_soles,
            :brasa_unidad,
            :brasa_kilos,
            :brasa_soles,
            :total_unidad,
            :total_kilos,
            :total_soles,
            :nom_db,
            :usuarioRegistro,
            NOW()
        )
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':fecha' => $data['fecha'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':subzona' => $data['subzona'] ?? null,
                ':cliente' => $data['cliente'] ?? null,
                ':coorporativo' => $data['coorporativo'] ?? null,
                ':carne_unidad' => $data['carne_unidad'] ?? 0,
                ':carne_kilos' => $data['carne_kilos'] ?? 0,
                ':carne_soles' => $data['carne_soles'] ?? 0,
                ':brasa_unidad' => $data['brasa_unidad'] ?? 0,
                ':brasa_kilos' => $data['brasa_kilos'] ?? 0,
                ':brasa_soles' => $data['brasa_soles'] ?? 0,
                ':total_unidad' => $data['total_unidad'] ?? 0,
                ':total_kilos' => $data['total_kilos'] ?? 0,
                ':total_soles' => $data['total_soles'] ?? 0,
                ':nom_db' => $data['nom_db'] ?? 'grs',
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? 'system'
            ];
        }

        return $stmt->execute($params);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_db_ctrl_cliente_pv WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($params = [])
    {
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $start       = $params['start'] ?? 0;
        $length      = $params['length'] ?? 10;
        $search      = $params['search']['value'] ?? '';

        $query = "
                SELECT 
                    id,
                    fecha,
                    zona,
                    subzona,
                    cliente,
                    coorporativo,
                    carne_unidad,
                    carne_kilos,
                    carne_soles,
                    brasa_unidad,
                    brasa_kilos,
                    brasa_soles,
                    total_unidad,
                    total_kilos,
                    total_soles,
                    nom_db,
                    usuarioRegistro,
                    fechaHoraRegistro
                FROM com_db_ctrl_cliente_pv
                WHERE 1=1
            ";


        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND fecha <= '$fechaFin'";
        }

        if (!empty($search)) {
            $search = addslashes($search);
            $query .= " AND (
            zona LIKE '%$search%' OR
            subzona LIKE '%$search%' OR
            cliente LIKE '%$search%' OR
            coorporativo LIKE '%$search%' OR
            nom_db LIKE '%$search%' OR
            usuarioRegistro LIKE '%$search%' OR
            carne_unidad LIKE '%$search%' OR
            carne_kilos LIKE '%$search%' OR
            carne_soles LIKE '%$search%' OR
            brasa_unidad LIKE '%$search%' OR
            brasa_kilos LIKE '%$search%' OR
            brasa_soles LIKE '%$search%' OR
            total_unidad LIKE '%$search%' OR
            total_kilos LIKE '%$search%' OR
            total_soles LIKE '%$search%'
        )";
        }

        $query .= " ORDER BY fecha DESC, id DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_ctrl_cliente_pv";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }


    public function countFiltered($params = [])
    {
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;
        $search      = $params['search']['value'] ?? '';

        $query = "
        SELECT COUNT(*) AS total
        FROM com_db_ctrl_cliente_pv
        WHERE 1=1
    ";

        // --------------------
        // 🔹 Filtro por fecha
        // --------------------
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND fecha <= '$fechaFin'";
        }

        // --------------------
        // 🔎 Search global
        // --------------------
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= " AND (
            zona LIKE '%$search%' OR
            subzona LIKE '%$search%' OR
            cliente LIKE '%$search%' OR
            coorporativo LIKE '%$search%' OR
            nom_db LIKE '%$search%' OR
            usuarioRegistro LIKE '%$search%' OR
            carne_unidad LIKE '%$search%' OR
            carne_kilos LIKE '%$search%' OR
            carne_soles LIKE '%$search%' OR
            brasa_unidad LIKE '%$search%' OR
            brasa_kilos LIKE '%$search%' OR
            brasa_soles LIKE '%$search%' OR
            total_unidad LIKE '%$search%' OR
            total_kilos LIKE '%$search%' OR
            total_soles LIKE '%$search%'
        )";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }
}
