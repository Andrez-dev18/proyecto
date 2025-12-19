<?php

class VivoProvinciaRepository
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
            v.id,
            v.fecha,
            p.nombre AS provincia,
            pr.nombre AS proveedor,
            pr.ruc AS ruc_proveedor,
            t.nombre AS tipo,
            t.linea,
            v.precioMayCarMin,
            v.precioMayCarMax,
            v.precioMayBraMin,
            v.precioMayBraMax,
            v.precioPubMin,
            v.precioPubMax,
            v.pesoMachoPromMin,
            v.pesoMachoPromMax,
            v.pesoHembraPromMin,
            v.pesoHembraPromMax,
            v.pesoBrasaPromMin,
            v.pesoBrasaPromMax,
            v.colorMin,
            v.colorMax,
            v.cantidad,
            v.usuarioRegistro,
            v.fechaHoraRegistro,
            v.usuarioTransferencia,
            v.fechaHoraTransferencia
        FROM com_db_vivo_provincia v
        LEFT JOIN com_provincia p ON v.provincia = p.codigo
        LEFT JOIN com_proveedor pr ON v.proveedor = pr.codigo
        LEFT JOIN com_tipo t ON v.tipo = t.codigo
        WHERE v.fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()
        ORDER BY v.fechaHoraRegistro DESC;
    ";

        return $this->executeQuery($query);
    }

     public function findById($id)
    {
        $query = "SELECT * FROM com_db_vivo_provincia WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // If id exists, perform UPDATE; otherwise INSERT
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_vivo_provincia SET
                fecha = :fecha,
                provincia = :provincia,
                proveedor = :proveedor,
                tipo = :tipo,
                precioMayCarMin = :precioMayCarMin,
                precioMayCarMax = :precioMayCarMax,
                precioMayBraMin = :precioMayBraMin,
                precioMayBraMax = :precioMayBraMax,
                precioPubMin = :precioPubMin,
                precioPubMax = :precioPubMax,
                pesoMachoPromMin = :pesoMachoPromMin,
                pesoMachoPromMax = :pesoMachoPromMax,
                pesoHembraPromMin = :pesoHembraPromMin,
                pesoHembraPromMax = :pesoHembraPromMax,
                pesoBrasaPromMin = :pesoBrasaPromMin,
                pesoBrasaPromMax = :pesoBrasaPromMax,
                colorMin = :colorMin,
                colorMax = :colorMax,
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
                ':provincia' => $data['provincia'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':precioMayCarMin' => $data['precioMayCarMin'] ?? null,
                ':precioMayCarMax' => $data['precioMayCarMax'] ?? null,
                ':precioMayBraMin' => $data['precioMayBraMin'] ?? null,
                ':precioMayBraMax' => $data['precioMayBraMax'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
                ':pesoMachoPromMin' => $data['pesoMachoPromMin'] ?? null,
                ':pesoMachoPromMax' => $data['pesoMachoPromMax'] ?? null,
                ':pesoHembraPromMin' => $data['pesoHembraPromMin'] ?? null,
                ':pesoHembraPromMax' => $data['pesoHembraPromMax'] ?? null,
                ':pesoBrasaPromMin' => $data['pesoBrasaPromMin'] ?? null,
                ':pesoBrasaPromMax' => $data['pesoBrasaPromMax'] ?? null,
                ':colorMin' => $data['colorMin'] ?? null,
                ':colorMax' => $data['colorMax'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
            ];
        } else {
            $query = "
            INSERT INTO com_db_vivo_provincia (
                id,
                fecha,
                provincia,
                proveedor,
                tipo,
                precioMayCarMin,
                precioMayCarMax,
                precioMayBraMin,
                precioMayBraMax,
                precioPubMin,
                precioPubMax,
                pesoMachoPromMin,
                pesoMachoPromMax,
                pesoHembraPromMin,
                pesoHembraPromMax,
                pesoBrasaPromMin,
                pesoBrasaPromMax,
                colorMin,
                colorMax,
                cantidad,
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
                :precioMayCarMin,
                :precioMayCarMax,
                :precioMayBraMin,
                :precioMayBraMax,
                :precioPubMin,
                :precioPubMax,
                :pesoMachoPromMin,
                :pesoMachoPromMax,
                :pesoHembraPromMin,
                :pesoHembraPromMax,
                :pesoBrasaPromMin,
                :pesoBrasaPromMax,
                :colorMin,
                :colorMax,
                :cantidad,
                :usuarioRegistro,
                :fechaHoraRegistro,
                :usuarioTransferencia,
                :fechaHoraTransferencia
            )
            ";

            $data['id'] = $this->generateUuid();

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':precioMayCarMin' => $data['precioMayCarMin'] ?? null,
                ':precioMayCarMax' => $data['precioMayCarMax'] ?? null,
                ':precioMayBraMin' => $data['precioMayBraMin'] ?? null,
                ':precioMayBraMax' => $data['precioMayBraMax'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
                ':pesoMachoPromMin' => $data['pesoMachoPromMin'] ?? null,
                ':pesoMachoPromMax' => $data['pesoMachoPromMax'] ?? null,
                ':pesoHembraPromMin' => $data['pesoHembraPromMin'] ?? null,
                ':pesoHembraPromMax' => $data['pesoHembraPromMax'] ?? null,
                ':pesoBrasaPromMin' => $data['pesoBrasaPromMin'] ?? null,
                ':pesoBrasaPromMax' => $data['pesoBrasaPromMax'] ?? null,
                ':colorMin' => $data['colorMin'] ?? null,
                ':colorMax' => $data['colorMax'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
            ];
        }

        $stmt->execute($params);
        return $data['id'];
    }


    public function findByFilters($params = [])
    {
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin     = $params['fechaFin'] ?? null;
        $provincia    = $params['provincia'] ?? null;
        $proveedor    = $params['proveedor'] ?? null;
        $tipo         = $params['tipo'] ?? null;

        $start   = $params['start'] ?? 0;
        $length  = $params['length'] ?? 10;
        $search  = $params['search']['value'] ?? '';

        $query = "
        SELECT 
            v.id,
            v.fecha,
            p.nombre AS provincia,
            pr.nombre AS proveedor,
            pr.ruc AS ruc_proveedor,
            t.nombre AS tipo,
            t.linea,
            v.precioMayCarMin,
            v.precioMayCarMax,
            v.precioMayBraMin,
            v.precioMayBraMax,
            v.precioPubMin,
            v.precioPubMax,
            v.pesoMachoPromMin,
            v.pesoMachoPromMax,
            v.pesoHembraPromMin,
            v.pesoHembraPromMax,
            v.pesoBrasaPromMin,
            v.pesoBrasaPromMax,
            v.colorMin,
            v.colorMax,
            v.cantidad,
            v.usuarioRegistro,
            v.fechaHoraRegistro,
            v.usuarioTransferencia,
            v.fechaHoraTransferencia
        FROM com_db_vivo_provincia v
        LEFT JOIN com_provincia p ON v.provincia = p.codigo
        LEFT JOIN com_proveedor pr ON v.proveedor = pr.codigo
        LEFT JOIN com_tipo t ON v.tipo = t.codigo
        WHERE 1=1
    ";

        // 🔹 Filtros por fecha
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND v.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND v.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND v.fecha <= '$fechaFin'";
        }

        // 🔹 Filtros por campos individuales
        if (!empty($provincia)) $query .= " AND v.provincia = $provincia";
        if (!empty($proveedor)) $query .= " AND v.proveedor = $proveedor";
        if (!empty($tipo)) $query .= " AND v.tipo = $tipo";

        // 🔹 Búsqueda global
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= " AND (
            p.nombre LIKE '%$search%' OR
            pr.nombre LIKE '%$search%' OR
            t.nombre LIKE '%$search%' OR
            t.linea LIKE '%$search%' OR
            v.precioMayCarMin LIKE '%$search%' OR
            v.precioPubMin LIKE '%$search%' OR
            v.colorMin LIKE '%$search%' OR
            v.usuarioRegistro LIKE '%$search%'
        )";
        }

        // 🔹 Orden y paginación
        $query .= " ORDER BY v.fecha DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_vivo_provincia";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }

    public function countFiltered($params = [])
    {
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin     = $params['fechaFin'] ?? null;
        $provincia    = $params['provincia'] ?? null;
        $proveedor    = $params['proveedor'] ?? null;
        $tipo         = $params['tipo'] ?? null;
        $search       = $params['search']['value'] ?? '';

        $query = "
        SELECT COUNT(*) AS total
        FROM com_db_vivo_provincia v
        LEFT JOIN com_provincia p ON v.provincia = p.codigo
        LEFT JOIN com_proveedor pr ON v.proveedor = pr.codigo
        LEFT JOIN com_tipo t ON v.tipo = t.codigo
        WHERE 1=1
    ";

        // 🔹 Filtros
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND v.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND v.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND v.fecha <= '$fechaFin'";
        }

        if (!empty($provincia)) $query .= " AND v.provincia = $provincia";
        if (!empty($proveedor)) $query .= " AND v.proveedor = $proveedor";
        if (!empty($tipo)) $query .= " AND v.tipo = $tipo";

        // 🔹 Búsqueda global
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= " AND (
            p.nombre LIKE '%$search%' OR
            pr.nombre LIKE '%$search%' OR
            t.nombre LIKE '%$search%' OR
            t.linea LIKE '%$search%' OR
            v.precioMayCarMin LIKE '%$search%' OR
            v.precioPubMin LIKE '%$search%' OR
            v.colorMin LIKE '%$search%' OR
            v.usuarioRegistro LIKE '%$search%'
        )";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }



    private function executeQuery($query)
    {
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_db_vivo_provincia WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
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
