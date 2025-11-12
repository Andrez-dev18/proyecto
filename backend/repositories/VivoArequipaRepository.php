<?php


class VivoArequipaRepository
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
            m.nombre AS mercado,
            e.nombre AS empresa,
            e.ruc AS ruc_empresa,
            c.nombre AS condicion,
            pr.nombre AS proveedor,
            pr.ruc AS ruc_proveedor,
            a.precioMayMin,
            a.precioMayMax,
            a.precioPubMin,
            a.precioPubMax,
            a.pesoMachoMin,
            a.pesoMachoMax,
            a.pesoHembMin,
            a.pesoHembMax,
            a.colorMin,
            a.colorMax,
            a.pesoMachoPromMin,
            a.pesoMachoPromMax,
            a.pesoHembraPromMin,
            a.pesoHembraPromMax,
            a.cantidad,
            a.usuarioRegistro,
            a.fechaHoraRegistro,
            a.usuarioTransferencia,
            a.fechaHoraTransferencia
        FROM com_db_vivo_aqp a
        LEFT JOIN com_mercado m ON a.mercado = m.codigo
        LEFT JOIN com_empresa e ON a.empresa = e.codigo
        LEFT JOIN com_condicion c ON a.condicion = c.codigo
        LEFT JOIN com_proveedor pr ON a.proveedor = pr.codigo
        WHERE a.fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()
        ORDER BY a.fechaHoraRegistro DESC;
    ";
        $result = $this->executeQuery($query);

    // Si no hay resultados, traer los últimos 100 registros
    if (empty($result)) {
        $queryFallback = "
            SELECT
            a.id,
            a.fecha,
            m.nombre AS mercado,
            e.nombre AS empresa,
            e.ruc AS ruc_empresa,
            c.nombre AS condicion,
            pr.nombre AS proveedor,
            pr.ruc AS ruc_proveedor,
            a.precioMayMin,
            a.precioMayMax,
            a.precioPubMin,
            a.precioPubMax,
            a.pesoMachoMin,
            a.pesoMachoMax,
            a.pesoHembMin,
            a.pesoHembMax,
            a.colorMin,
            a.colorMax,
            a.pesoMachoPromMin,
            a.pesoMachoPromMax,
            a.pesoHembraPromMin,
            a.pesoHembraPromMax,
            a.cantidad,
            a.usuarioRegistro,
            a.fechaHoraRegistro,
            a.usuarioTransferencia,
            a.fechaHoraTransferencia
        FROM com_db_vivo_aqp a
        LEFT JOIN com_mercado m ON a.mercado = m.codigo
        LEFT JOIN com_empresa e ON a.empresa = e.codigo
        LEFT JOIN com_condicion c ON a.condicion = c.codigo
        LEFT JOIN com_proveedor pr ON a.proveedor = pr.codigo
        ORDER BY a.fechaHoraRegistro DESC
        LIMIT 100;
        ";
        $result = $this->executeQuery($queryFallback);
    }

    return $result;
    }


    public function save($data)
    {
        // If id exists, perform UPDATE; otherwise INSERT
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_vivo_aqp SET
                fecha = :fecha,
                mercado = :mercado,
                empresa = :empresa,
                condicion = :condicion,
                proveedor = :proveedor,
                precioMayMin = :precioMayMin,
                precioMayMax = :precioMayMax,
                precioPubMin = :precioPubMin,
                precioPubMax = :precioPubMax,
                pesoMachoMin = :pesoMachoMin,
                pesoMachoMax = :pesoMachoMax,
                pesoHembMin = :pesoHembMin,
                pesoHembMax = :pesoHembMax,
                colorMin = :colorMin,
                colorMax = :colorMax,
                pesoMachoPromMin = :pesoMachoPromMin,
                pesoMachoPromMax = :pesoMachoPromMax,
                pesoHembraPromMin = :pesoHembraPromMin,
                pesoHembraPromMax = :pesoHembraPromMax,
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
                ':mercado' => $data['mercado'] ?? null,
                ':empresa' => $data['empresa'] ?? null,
                ':condicion' => $data['condicion'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':precioMayMin' => $data['precioMayMin'] ?? null,
                ':precioMayMax' => $data['precioMayMax'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
                ':pesoMachoMin' => $data['pesoMachoMin'] ?? null,
                ':pesoMachoMax' => $data['pesoMachoMax'] ?? null,
                ':pesoHembMin' => $data['pesoHembMin'] ?? null,
                ':pesoHembMax' => $data['pesoHembMax'] ?? null,
                ':colorMin' => $data['colorMin'] ?? null,
                ':colorMax' => $data['colorMax'] ?? null,
                ':pesoMachoPromMin' => $data['pesoMachoPromMin'] ?? null,
                ':pesoMachoPromMax' => $data['pesoMachoPromMax'] ?? null,
                ':pesoHembraPromMin' => $data['pesoHembraPromMin'] ?? null,
                ':pesoHembraPromMax' => $data['pesoHembraPromMax'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
            ];
        } else {
            $query = "
            INSERT INTO com_db_vivo_aqp (
                id,
                fecha,
                mercado,
                empresa,
                condicion,
                proveedor,
                precioMayMin,
                precioMayMax,
                precioPubMin,
                precioPubMax,
                pesoMachoMin,
                pesoMachoMax,
                pesoHembMin,
                pesoHembMax,
                colorMin,
                colorMax,
                pesoMachoPromMin,
                pesoMachoPromMax,
                pesoHembraPromMin,
                pesoHembraPromMax,
                cantidad,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :mercado,
                :empresa,
                :condicion,
                :proveedor,
                :precioMayMin,
                :precioMayMax,
                :precioPubMin,
                :precioPubMax,
                :pesoMachoMin,
                :pesoMachoMax,
                :pesoHembMin,
                :pesoHembMax,
                :colorMin,
                :colorMax,
                :pesoMachoPromMin,
                :pesoMachoPromMax,
                :pesoHembraPromMin,
                :pesoHembraPromMax,
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
                ':mercado' => $data['mercado'] ?? null,
                ':empresa' => $data['empresa'] ?? null,
                ':condicion' => $data['condicion'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':precioMayMin' => $data['precioMayMin'] ?? null,
                ':precioMayMax' => $data['precioMayMax'] ?? null,
                ':precioPubMin' => $data['precioPubMin'] ?? null,
                ':precioPubMax' => $data['precioPubMax'] ?? null,
                ':pesoMachoMin' => $data['pesoMachoMin'] ?? null,
                ':pesoMachoMax' => $data['pesoMachoMax'] ?? null,
                ':pesoHembMin' => $data['pesoHembMin'] ?? null,
                ':pesoHembMax' => $data['pesoHembMax'] ?? null,
                ':colorMin' => $data['colorMin'] ?? null,
                ':colorMax' => $data['colorMax'] ?? null,
                ':pesoMachoPromMin' => $data['pesoMachoPromMin'] ?? null,
                ':pesoMachoPromMax' => $data['pesoMachoPromMax'] ?? null,
                ':pesoHembraPromMin' => $data['pesoHembraPromMin'] ?? null,
                ':pesoHembraPromMax' => $data['pesoHembraPromMax'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
            ];
        }

        return $stmt->execute($params);
    }


    private function executeQuery($query)
    {
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_db_vivo_aqp WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':id' => $id]);
    }


    public function findByFilters($fechaInicio = null, $fechaFin = null, $mercado = null, $empresa = null, $condicion = null, $proveedor = null)
    {
        $query = "
        SELECT
            a.id,
            a.fecha,
            m.nombre AS mercado,
            e.nombre AS empresa,
            e.ruc AS ruc_empresa,
            c.nombre AS condicion,
            pr.nombre AS proveedor,
            pr.ruc AS ruc_proveedor,
            a.precioMayMin,
            a.precioMayMax,
            a.precioPubMin,
            a.precioPubMax,
            a.pesoMachoMin,
            a.pesoMachoMax,
            a.pesoHembMin,
            a.pesoHembMax,
            a.colorMin,
            a.colorMax,
            a.pesoMachoPromMin,
            a.pesoMachoPromMax,
            a.pesoHembraPromMin,
            a.pesoHembraPromMax,
            a.cantidad,
            a.usuarioRegistro,
            a.fechaHoraRegistro,
            a.usuarioTransferencia,
            a.fechaHoraTransferencia
        FROM com_db_vivo_aqp a
        LEFT JOIN com_mercado m ON a.mercado = m.codigo
        LEFT JOIN com_empresa e ON a.empresa = e.codigo
        LEFT JOIN com_condicion c ON a.condicion = c.codigo
        LEFT JOIN com_proveedor pr ON a.proveedor = pr.codigo
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

        // 🔹 Otros filtros
        if (!empty($mercado)) $query .= " AND a.mercado = $mercado";
        if (!empty($empresa)) $query .= " AND a.empresa = $empresa";
        if (!empty($condicion)) $query .= " AND a.condicion = $condicion";
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
