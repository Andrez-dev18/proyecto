<?php

class beneficioProvinciaRepository
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
                b.id,
                b.fecha,
                p.nombre AS provincia,
                pr.nombre AS proveedor,
                b.precioMayEntero,
                b.precioMayMejorado,
                b.precioMayCarcasa,
                b.precioPubMejorado,
                b.precioPubCarcasa,
                b.pesoPromMenor,
                b.pesoPromMayor,
                b.colorMin,
                b.colorMax,
                b.cantidad,
                b.usuarioRegistro,
                b.fechaHoraRegistro,
                b.usuarioTransferencia,
                b.fechaHoraTransferencia
            FROM com_db_beneficio_provincia b
            LEFT JOIN com_provincia p ON b.provincia = p.codigo
            LEFT JOIN com_proveedor pr ON b.proveedor = pr.codigo
            ORDER BY b.fechaHoraRegistro DESC;
        ";
        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_db_beneficio_provincia WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
                UPDATE com_db_beneficio_provincia SET
                    fecha = :fecha,
                    provincia = :provincia,
                    proveedor = :proveedor,
                    precioMayEntero = :precioMayEntero,
                    precioMayMejorado = :precioMayMejorado,
                    precioMayCarcasa = :precioMayCarcasa,
                    precioPubMejorado = :precioPubMejorado,
                    precioPubCarcasa = :precioPubCarcasa,
                    pesoPromMenor = :pesoPromMenor,
                    pesoPromMayor = :pesoPromMayor,
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
                ':precioMayEntero' => $data['precioMayEntero'] ?? null,
                ':precioMayMejorado' => $data['precioMayMejorado'] ?? null,
                ':precioMayCarcasa' => $data['precioMayCarcasa'] ?? null,
                ':precioPubMejorado' => $data['precioPubMejorado'] ?? null,
                ':precioPubCarcasa' => $data['precioPubCarcasa'] ?? null,
                ':pesoPromMenor' => $data['pesoPromMenor'] ?? null,
                ':pesoPromMayor' => $data['pesoPromMayor'] ?? null,
                ':colorMin' => $data['colorMin'] ?? null,
                ':colorMax' => $data['colorMax'] ?? null,
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
                INSERT INTO com_db_beneficio_provincia (
                    id,
                    fecha,
                    provincia,
                    proveedor,
                    precioMayEntero,
                    precioMayMejorado,
                    precioMayCarcasa,
                    precioPubMejorado,
                    precioPubCarcasa,
                    pesoPromMenor,
                    pesoPromMayor,
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
                    :precioMayEntero,
                    :precioMayMejorado,
                    :precioMayCarcasa,
                    :precioPubMejorado,
                    :precioPubCarcasa,
                    :pesoPromMenor,
                    :pesoPromMayor,
                    :colorMin,
                    :colorMax,
                    :cantidad,
                    :usuarioRegistro,
                    :fechaHoraRegistro,
                    :usuarioTransferencia,
                    :fechaHoraTransferencia
                )
            ";

            // Generar UUID manualmente
            $data['id'] = $this->generateUuid();

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':precioMayEntero' => $data['precioMayEntero'] ?? null,
                ':precioMayMejorado' => $data['precioMayMejorado'] ?? null,
                ':precioMayCarcasa' => $data['precioMayCarcasa'] ?? null,
                ':precioPubMejorado' => $data['precioPubMejorado'] ?? null,
                ':precioPubCarcasa' => $data['precioPubCarcasa'] ?? null,
                ':pesoPromMenor' => $data['pesoPromMenor'] ?? null,
                ':pesoPromMayor' => $data['pesoPromMayor'] ?? null,
                ':colorMin' => $data['colorMin'] ?? null,
                ':colorMax' => $data['colorMax'] ?? null,
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
        $query = "DELETE FROM com_db_beneficio_provincia WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $provincia = null,  $proveedor = null)
    {
        $query = "
        SELECT
                b.id,
                b.fecha,
                p.nombre AS provincia,
                pr.nombre AS proveedor,
                b.precioMayEntero,
                b.precioMayMejorado,
                b.precioMayCarcasa,
                b.precioPubMejorado,
                b.precioPubCarcasa,
                b.pesoPromMenor,
                b.pesoPromMayor,
                b.colorMin,
                b.colorMax,
                b.cantidad,
                b.usuarioRegistro,
                b.fechaHoraRegistro,
                b.usuarioTransferencia,
                b.fechaHoraTransferencia
            FROM com_db_beneficio_provincia b
            LEFT JOIN com_provincia p ON b.provincia = p.codigo
            LEFT JOIN com_proveedor pr ON b.proveedor = pr.codigo
            WHERE 1=1
    ";

        // 🔹 Filtro de rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND b.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND b.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND b.fecha <= '$fechaFin'";
        }

        // 🔹 Otros filtros
        if (!empty($provincia)) $query .= " AND b.provincia = $provincia";
        if (!empty($proveedor)) $query .= " AND b.proveedor = $proveedor";

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
