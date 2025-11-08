<?php

class TamaMerDiaRepository
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
                tmd.id,
                tmd.fecha,
                tp.nombre AS tipo,
                tl.nombre AS linea,
                pv.nombre AS provincia,
                pz.nombre AS zona,
                e.nombre AS empresa,
                pr.nombre AS proveedor,
                pp.nombre AS producto,
                tmd.cantidad,
                tmd.peso,
                tmd.prom,
                tmd.precio,
                tmd.info_mercado,
                tmd.nom_db
            FROM com_db_tama_mer_dia AS tmd
            LEFT JOIN com_tipo AS tl ON tmd.linea = tl.codigo
            LEFT JOIN com_tipo_pollo AS tp ON tmd.tipo = tp.codigo
            LEFT JOIN com_provincia AS pv ON tmd.provincia = pv.codigo
            LEFT JOIN com_provincia AS pz ON tmd.zona = pz.codigo
            LEFT JOIN com_empresa AS e ON tmd.empresa = e.codigo
            LEFT JOIN com_proveedor AS pr ON tmd.proveedor = pr.codigo
            LEFT JOIN com_tipo_pollo_vivo AS pp ON tmd.producto = pp.codigo
            ORDER BY tmd.fecha DESC;
        ";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_tienda SET
                fecha = :fecha,
                empresa = :empresa,
                tipo = :tipo,
                codpro = :codpro,
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
                ':empresa' => $data['empresa'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':codpro' => $data['codpro'] ?? null,
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
            INSERT INTO com_db_tienda (
                id,
                fecha,
                empresa,
                tipo,
                codpro,
                precio,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :empresa,
                :tipo,
                :codpro,
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
                ':empresa' => $data['empresa'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':codpro' => $data['codpro'] ?? null,
                ':precio' => $data['precio'] ?? null,
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
        $query = "DELETE FROM com_db_tama_mer_dia WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $empresa = null, $tipo = null)
    {
        $query = "
        SELECT 
                tmd.id,
                tmd.fecha,
                tp.nombre AS tipo,
                tl.nombre AS linea,
                pv.nombre AS provincia,
                pz.nombre AS zona,
                e.nombre AS empresa,
                pr.nombre AS proveedor,
                pp.nombre AS producto,
                tmd.cantidad,
                tmd.peso,
                tmd.prom,
                tmd.precio,
                tmd.info_mercado,
                tmd.nom_db
            FROM com_db_tama_mer_dia AS tmd
            LEFT JOIN com_tipo AS tl ON tmd.linea = tl.codigo
            LEFT JOIN com_tipo_pollo AS tp ON tmd.tipo = tp.codigo
            LEFT JOIN com_provincia AS pv ON tmd.provincia = pv.codigo
            LEFT JOIN com_provincia AS pz ON tmd.zona = pz.codigo
            LEFT JOIN com_empresa AS e ON tmd.empresa = e.codigo
            LEFT JOIN com_proveedor AS pr ON tmd.proveedor = pr.codigo
            LEFT JOIN com_tipo_pollo_vivo AS pp ON tmd.producto = pp.codigo
            WHERE 1=1
    ";

        // 🔹 Filtro de rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND t.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND t.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND t.fecha <= '$fechaFin'";
        }
        // 🔹 Otros filtros
        if (!empty($empresa)) $query .= " AND t.empresa = $empresa";
        if (!empty($tipo)) $query .= " AND t.tipo = $tipo";

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
