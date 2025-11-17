<?php

class IngresosLimaRepository
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
            e.nombre AS empresa,
            a.unidad_fija,
            a.unidad_movil,
            a.kilos,
            a.peso_promedio,
            a.precio_campo,
            a.precio_granja,
            a.soles,
            a.participacion,
            a.usuarioRegistro,
            a.fechaHoraRegistro,
            a.usuarioTransferencia,
            a.fechaHoraTransferencia
        FROM com_db_ingre_emp_lima a
        LEFT JOIN com_empresa e ON a.empresa = e.codigo
        ORDER BY a.fechaHoraRegistro DESC
    ";

        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
        UPDATE com_db_ingre_emp_lima SET
            fecha = :fecha,
            empresa = :empresa,
            unidad_fija = :unidad_fija,
            unidad_movil = :unidad_movil,
            kilos = :kilos,
            peso_promedio = :peso_promedio,
            precio_campo = :precio_campo,
            precio_granja = :precio_granja,
            soles = :soles,
            participacion = :participacion,
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
                ':unidad_fija' => $data['unidad_fija'] ?? null,
                ':unidad_movil' => $data['unidad_movil'] ?? null,
                ':kilos' => $data['kilos'] ?? null,
                ':peso_promedio' => $data['peso_promedio'] ?? null,
                ':precio_campo' => $data['precio_campo'] ?? null,
                ':precio_granja' => $data['precio_granja'] ?? null,
                ':soles' => $data['soles'] ?? null,
                ':participacion' => $data['participacion'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
        INSERT INTO com_db_ingre_emp_lima (
            id,
            fecha,
            empresa,
            unidad_fija,
            unidad_movil,
            kilos,
            peso_promedio,
            precio_campo,
            precio_granja,
            soles,
            participacion,
            usuarioRegistro,
            fechaHoraRegistro,
            usuarioTransferencia,
            fechaHoraTransferencia
        ) VALUES (
            :id,
            :fecha,
            :empresa,
            :unidad_fija,
            :unidad_movil,
            :kilos,
            :peso_promedio,
            :precio_campo,
            :precio_granja,
            :soles,
            :participacion,
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
                ':unidad_fija' => $data['unidad_fija'] ?? null,
                ':unidad_movil' => $data['unidad_movil'] ?? null,
                ':kilos' => $data['kilos'] ?? null,
                ':peso_promedio' => $data['peso_promedio'] ?? null,
                ':precio_campo' => $data['precio_campo'] ?? null,
                ':precio_granja' => $data['precio_granja'] ?? null,
                ':soles' => $data['soles'] ?? null,
                ':participacion' => $data['participacion'] ?? null,
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
        $query = "DELETE FROM com_db_ingre_emp_lima WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $empresa = null)
    {
        $query = "
        SELECT
            a.id,
            a.fecha,
            e.nombre AS empresa,
            a.unidad_fija,
            a.unidad_movil,
            a.kilos,
            a.peso_promedio,
            a.precio_campo,
            a.precio_granja,
            a.soles,
            a.participacion,
            a.usuarioRegistro,
            a.fechaHoraRegistro,
            a.usuarioTransferencia,
            a.fechaHoraTransferencia
        FROM com_db_ingre_emp_lima a
        LEFT JOIN com_empresa e ON a.empresa = e.codigo
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
        if (!empty($empresa)) {
            $query .= " AND a.empresa = $empresa";
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
