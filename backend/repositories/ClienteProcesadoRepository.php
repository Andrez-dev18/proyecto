<?php

class ClienteProcesadoRepository
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
            distrito,
            zona,
            canal,
            codigo,
            linea,
            sublinea,
            vendedor,
            cliente,
            descripcion,
            ruta,
            nomruta,
            unidad,
            peso,
            importe,
            nom_db,
            usuarioRegistro,
            fechaHoraRegistro
        FROM com_db_cliente_procesados
        ORDER BY fechaHoraRegistro DESC
        ";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {

            $query = "
        UPDATE com_db_cliente_procesados SET
            fecha = :fecha,
            distrito = :distrito,
            zona = :zona,
            canal = :canal,
            codigo = :codigo,
            linea = :linea,
            sublinea = :sublinea,
            vendedor = :vendedor,
            cliente = :cliente,
            descripcion = :descripcion,
            ruta = :ruta,
            nomruta = :nomruta,
            unidad = :unidad,
            peso = :peso,
            importe = :importe,
            nom_db = :nom_db,
            usuarioRegistro = :usuarioRegistro,
            fechaHoraRegistro = :fechaHoraRegistro
        WHERE id = :id
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':distrito' => $data['distrito'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':canal' => $data['canal'] ?? null,
                ':codigo' => $data['codigo'] ?? null,
                ':linea' => $data['linea'] ?? null,
                ':sublinea' => $data['sublinea'] ?? null,
                ':vendedor' => $data['vendedor'] ?? null,
                ':cliente' => $data['cliente'] ?? null,
                ':descripcion' => $data['descripcion'] ?? null,
                ':ruta' => $data['ruta'] ?? null,
                ':nomruta' => $data['nomruta'] ?? null,
                ':unidad' => $data['unidad'] ?? 0,
                ':peso' => $data['peso'] ?? 0,
                ':importe' => $data['importe'] ?? 0,
                ':nom_db' => $data['nom_db'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
            ];
        }

        // Si no tiene ID → Insertar
        else {

            $query = "
        INSERT INTO com_db_cliente_procesados (
            fecha,
            distrito,
            zona,
            canal,
            codigo,
            linea,
            sublinea,
            vendedor,
            cliente,
            descripcion,
            ruta,
            nomruta,
            unidad,
            peso,
            importe,
            nom_db,
            usuarioRegistro,
            fechaHoraRegistro
        ) VALUES (
            :fecha,
            :distrito,
            :zona,
            :canal,
            :codigo,
            :linea,
            :sublinea,
            :vendedor,
            :cliente,
            :descripcion,
            :ruta,
            :nomruta,
            :unidad,
            :peso,
            :importe,
            :nom_db,
            :usuarioRegistro,
            :fechaHoraRegistro
        )
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':fecha' => $data['fecha'] ?? null,
                ':distrito' => $data['distrito'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':canal' => $data['canal'] ?? null,
                ':codigo' => $data['codigo'] ?? null,
                ':linea' => $data['linea'] ?? null,
                ':sublinea' => $data['sublinea'] ?? null,
                ':vendedor' => $data['vendedor'] ?? null,
                ':cliente' => $data['cliente'] ?? null,
                ':descripcion' => $data['descripcion'] ?? null,
                ':ruta' => $data['ruta'] ?? null,
                ':nomruta' => $data['nomruta'] ?? null,
                ':unidad' => $data['unidad'] ?? 0,
                ':peso' => $data['peso'] ?? 0,
                ':importe' => $data['importe'] ?? 0,
                ':nom_db' => $data['nom_db'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
            ];
        }

        return $stmt->execute($params);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_db_cliente_procesados WHERE id = :id";
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
            distrito,
            zona,
            canal,
            codigo,
            linea,
            sublinea,
            vendedor,
            cliente,
            descripcion,
            ruta,
            nomruta,
            unidad,
            peso,
            importe,
            nom_db,
            usuarioRegistro,
            fechaHoraRegistro
        FROM com_db_cliente_procesados
        WHERE 1=1
    ";

        // 🔹 Filtro por fecha
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND fecha <= '$fechaFin'";
        }

        // 🔹 Search global Datatables
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= " AND (
            distrito LIKE '%$search%' OR
            zona LIKE '%$search%' OR
            canal LIKE '%$search%' OR
            codigo LIKE '%$search%' OR
            linea LIKE '%$search%' OR
            sublinea LIKE '%$search%' OR
            vendedor LIKE '%$search%' OR
            cliente LIKE '%$search%' OR
            descripcion LIKE '%$search%' OR
            ruta LIKE '%$search%' OR
            nomruta LIKE '%$search%' OR
            nom_db LIKE '%$search%' OR
            unidad LIKE '%$search%' OR
            peso LIKE '%$search%' OR
            importe LIKE '%$search%'
        )";
        }

        // 🔹 Orden, paginación
        $query .= " ORDER BY fecha DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_cliente_procesados";
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
        FROM com_db_cliente_procesados
        WHERE 1=1
    ";

        // 🔹 Filtro por fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND fecha <= '$fechaFin'";
        }

        // 🔍 Search global
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= " AND (
            distrito LIKE '%$search%' OR
            zona LIKE '%$search%' OR
            canal LIKE '%$search%' OR
            codigo LIKE '%$search%' OR
            linea LIKE '%$search%' OR
            sublinea LIKE '%$search%' OR
            vendedor LIKE '%$search%' OR
            cliente LIKE '%$search%' OR
            descripcion LIKE '%$search%' OR
            ruta LIKE '%$search%' OR
            nomruta LIKE '%$search%' OR
            nom_db LIKE '%$search%' OR
            unidad LIKE '%$search%' OR
            peso LIKE '%$search%' OR
            importe LIKE '%$search%'
        )";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }
}
