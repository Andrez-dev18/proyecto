<?php

class MercadoDetRepository
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
                a.tipoEstablecimiento,
                a.tamanio,
                a.cantidad,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_mercado_det a
            LEFT JOIN com_mercado m ON a.mercado = m.codigo
            ORDER BY a.fechaHoraRegistro DESC
        ";

        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM com_db_mercado_det WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
{
    // 1️⃣ Validar operación (insert o update)
    $isUpdate = !empty($data['id']);

    if (!$isUpdate) {
        $data['id'] = $this->generateUuid();
    }

    // 2️⃣ Preparar SQL
    $sql = $isUpdate ? "
        UPDATE com_db_mercado_det SET
            fecha = :fecha,
            mercado = :mercado,
            tipoEstablecimiento = :tipoEstablecimiento,
            tamanio = :tamanio,
            cantidad = :cantidad,
            usuarioRegistro = :usuarioRegistro,
            fechaHoraRegistro = :fechaHoraRegistro,
            usuarioTransferencia = :usuarioTransferencia,
            fechaHoraTransferencia = :fechaHoraTransferencia
        WHERE id = :id
    " : "
        INSERT INTO com_db_mercado_det (
            id, fecha, mercado, tipoEstablecimiento, tamanio,
            cantidad, usuarioRegistro, fechaHoraRegistro,
            usuarioTransferencia, fechaHoraTransferencia
        ) VALUES (
            :id, :fecha, :mercado, :tipoEstablecimiento, :tamanio,
            :cantidad, :usuarioRegistro, :fechaHoraRegistro,
            :usuarioTransferencia, :fechaHoraTransferencia
        )
    ";

    $stmt = $this->conn->prepare($sql);

    $params = [
        ':id' => $data['id'],
        ':fecha' => $data['fecha'] ?? null,
        ':mercado' => $data['mercado'] ?? null,
        ':tipoEstablecimiento' => $data['tipoEstablecimiento'] ?? null,
        ':tamanio' => $data['tamanio'] ?? null,
        ':cantidad' => $data['cantidad'] ?? 0,
        ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
        ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
        ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
        ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
    ];

    $successDet = $stmt->execute($params);

    // ❗ Si falla el detalle, no continuar
    if (!$successDet) {
        return [
            "det" => false,
            "resumen" => "no-ejecutado",
            "error" => $stmt->errorInfo(),
            "message" => "Error al registrar Mercado Det"
        ];
    }

    // 3️⃣ Actualizar resumen
    $idReturn = $data['id'];
    $resultadoResumen = $this->actualizarResumenPDO(
        $data['mercado'],
        $data['tipoEstablecimiento'],
        $data['tamanio']
    );

    return [
        "det" => true,
        "resumen" => $resultadoResumen,
        "message" => $isUpdate ? "Registro actualizado" : "Registro creado",
        "id" => $idReturn
    ];
}



private function actualizarResumenPDO($mercado_codigo, $tipoEstablecimiento, $tamanio)
{
    try {
        // Obtener provincia
        $stmtProv = $this->conn->prepare("SELECT provincia FROM com_mercado WHERE codigo = :codigo");
        $stmtProv->execute([':codigo' => $mercado_codigo]);

        $provincia = $stmtProv->fetchColumn();
        if (!$provincia) {
            return "sin-provincia";
        }

        // Ejecutar consulta
        $sql = "
        INSERT INTO com_db_mercado_res (
            provincia, tipoEstablecimiento, tamanio,
            total, numAves, fecha
        )
        SELECT 
            p.codigo,
            m1.tipoEstablecimiento,
            m1.tamanio,
            SUM(m1.cantidad),
            ROUND(SUM(m1.cantidad) * COALESCE(fp.factor, 1)),
            CURDATE()
        FROM com_db_mercado_det m1
        JOIN com_mercado m ON m1.mercado = m.codigo
        JOIN com_provincia p ON m.provincia = p.codigo
        LEFT JOIN com_factor_proyeccion fp ON m1.tamanio = fp.tamanio
        WHERE 
            m1.mercado = :mercado
            AND m1.tipoEstablecimiento = :tipoE
            AND m1.tamanio = :tamanio
        GROUP BY p.codigo, m1.tipoEstablecimiento, m1.tamanio
        ON DUPLICATE KEY UPDATE 
            total = VALUES(total),
            numAves = VALUES(numAves),
            fecha = VALUES(fecha)
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ':mercado' => $mercado_codigo,
            ':tipoE' => $tipoEstablecimiento,
            ':tamanio' => $tamanio
        ]);

        $rows = $stmt->rowCount();

        if ($rows === 0) return "sin-datos";
        if ($rows === 1) return "insert";
        if ($rows === 2) return "update";  

        return "ok";

    } catch (Exception $e) {
        error_log("Error resumen: " . $e->getMessage());
        return "error";
    }
}



    public function delete($id)
    {
        $query = "DELETE FROM com_db_mercado_det WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($params = [])
    {
        $start  = $params['start'] ?? 0;
        $length = $params['length'] ?? 10;
        $search = $params['search']['value'] ?? '';

        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $mercado = $params['mercado'] ?? null;
        $tipoEstablecimiento = $params['tipoEstablecimiento'] ?? null;

        $query = "
        SELECT
            a.id,
            a.fecha,
            m.nombre AS mercado,
            a.tipoEstablecimiento,
            a.tamanio,
            a.cantidad,
            a.usuarioRegistro,
            a.fechaHoraRegistro,
            a.usuarioTransferencia,
            a.fechaHoraTransferencia
        FROM com_db_mercado_det a
        LEFT JOIN com_mercado m ON a.mercado = m.codigo
        WHERE 1=1
    ";

        // FILTRO POR FECHAS
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND a.fecha BETWEEN '$fechaInicio' AND '$fechaFin' ";
        }

        // FILTRO POR MERCADO
        if (!empty($mercado)) {
            $query .= " AND a.mercado = $mercado ";
        }

        // FILTRO POR TIPO ESTABLECIMIENTO
        if (!empty($tipoEstablecimiento)) {
            $query .= " AND a.tipoEstablecimiento = '$tipoEstablecimiento' ";
        }

        // BÚSQUEDA GENERAL
        if (!empty($search)) {
            $query .= "
            AND (
                m.nombre LIKE '%$search%' OR
                a.tipoEstablecimiento LIKE '%$search%' OR
                a.tamanio LIKE '%$search%'
            )
        ";
        }

        // ORDEN + PAGINACIÓN
        $query .= " ORDER BY a.fecha DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_mercado_det";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }

    public function countFiltered($params = [])
    {
        $search = $params['search']['value'] ?? '';

        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $mercado = $params['mercado'] ?? null;
        $tipoEstablecimiento = $params['tipoEstablecimiento'] ?? null;

        $query = "
        SELECT COUNT(*) AS total
        FROM com_db_mercado_det a
        LEFT JOIN com_mercado m ON a.mercado = m.codigo
        WHERE 1=1
    ";

        // Fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND a.fecha BETWEEN '$fechaInicio' AND '$fechaFin' ";
        }

        // Mercado
        if (!empty($mercado)) {
            $query .= " AND a.mercado = $mercado ";
        }

        // Tipo establecimiento
        if (!empty($tipoEstablecimiento)) {
            $query .= " AND a.tipoEstablecimiento = '$tipoEstablecimiento' ";
        }

        // Búsqueda global
        if (!empty($search)) {
            $query .= "
            AND (
                m.nombre LIKE '%$search%' OR
                a.tipoEstablecimiento LIKE '%$search%' OR
                a.tamanio LIKE '%$search%'
            )
        ";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
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
