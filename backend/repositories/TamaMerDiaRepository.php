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

    public function findPaginated($start, $length, $search = '')
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
        WHERE 
            tp.nombre LIKE :search 
            OR tl.nombre LIKE :search 
            OR pv.nombre LIKE :search 
            OR pr.nombre LIKE :search 
        ORDER BY tmd.fecha DESC
        LIMIT :start, :length
    ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
        $stmt->bindValue(':start', (int)$start, PDO::PARAM_INT);
        $stmt->bindValue(':length', (int)$length, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countGetAll()
    {
        $stmt = $this->conn->query("SELECT COUNT(*) FROM com_db_tama_mer_dia");
        return $stmt->fetchColumn();
    }

    public function countGetAllFiltered($search = '')
    {
        $stmt = $this->conn->prepare("
        SELECT COUNT(*)
        FROM com_db_tama_mer_dia AS tmd
        LEFT JOIN com_tipo AS tl ON tmd.linea = tl.codigo
        LEFT JOIN com_tipo_pollo AS tp ON tmd.tipo = tp.codigo
        LEFT JOIN com_provincia AS pv ON tmd.provincia = pv.codigo
        LEFT JOIN com_provincia AS pz ON tmd.zona = pz.codigo
        LEFT JOIN com_empresa AS e ON tmd.empresa = e.codigo
        LEFT JOIN com_proveedor AS pr ON tmd.proveedor = pr.codigo
        LEFT JOIN com_tipo_pollo_vivo AS pp ON tmd.producto = pp.codigo
        WHERE tp.nombre LIKE :search 
           OR tl.nombre LIKE :search 
           OR pv.nombre LIKE :search 
           OR pr.nombre LIKE :search
    ");
        $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchColumn();
    }


    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_tama_mer_dia SET
                fecha = :fecha,
                tipo = :tipo,
                linea = :linea,
                provincia = :provincia,
                zona = :zona,
                empresa = :empresa,
                proveedor = :proveedor,
                producto = :producto,
                cantidad = :cantidad,
                peso = :peso,
                prom = :prom,
                precio = :precio
            WHERE id = :id
        ";

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':linea' => $data['linea'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':empresa' => $data['empresa'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':producto' => $data['producto'] ?? null,
                ':cantidad' => $data['cantidad'] ?? 0,
                ':peso' => $data['peso'] ?? 0,
                ':prom' => $data['prom'] ?? 0,
                ':precio' => $data['precio'] ?? 0
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
            INSERT INTO com_db_tama_mer_dia (
                fecha,
                tipo,
                linea,
                provincia,
                zona,
                empresa,
                proveedor,
                producto,
                cantidad,
                peso,
                prom,
                precio,
                info_mercado,
                nom_db
            ) VALUES (
                :fecha,
                :tipo,
                :linea,
                :provincia,
                :zona,
                :empresa,
                :proveedor,
                :producto,
                :cantidad,
                :peso,
                :prom,
                :precio,
                :info_mercado,
                :nom_db
            )
        ";

            $stmt = $this->conn->prepare($query);
            $params = [
                ':fecha' => $data['fecha'] ?? null,
                ':tipo' => $data['tipo'] ?? null,
                ':linea' => $data['linea'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':empresa' => $data['empresa'] ?? null,
                ':proveedor' => $data['proveedor'] ?? null,
                ':producto' => $data['producto'] ?? null,
                ':cantidad' => $data['cantidad'] ?? 0,
                ':peso' => $data['peso'] ?? 0,
                ':prom' => $data['prom'] ?? 0,
                ':precio' => $data['precio'] ?? 0,
                ':info_mercado' => 0,
                ':nom_db' => 'grs',
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

    public function findByFilters($params = [])
    {
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin     = $params['fechaFin'] ?? null;
        $tipo         = $params['tipo'] ?? null;
        $linea        = $params['linea'] ?? null;
        $provincia    = $params['provincia'] ?? null;
        $zona         = $params['zona'] ?? null;
        $empresa      = $params['empresa'] ?? null;
        $proveedor    = $params['proveedor'] ?? null;
        $producto     = $params['producto'] ?? null;

        $start  = $params['start'] ?? 0;
        $length = $params['length'] ?? 10; // registros por página

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
            LEFT JOIN com_tipo_pollo AS tp ON tmd.tipo = tp.codigo
            LEFT JOIN com_tipo AS tl ON tmd.linea = tl.codigo
            LEFT JOIN com_provincia AS pv ON tmd.provincia = pv.codigo
            LEFT JOIN com_provincia AS pz ON tmd.zona = pz.codigo
            LEFT JOIN com_empresa AS e ON tmd.empresa = e.codigo
            LEFT JOIN com_proveedor AS pr ON tmd.proveedor = pr.codigo
            LEFT JOIN com_tipo_pollo_vivo AS pp ON tmd.producto = pp.codigo
            WHERE 1=1
        ";

        // 🔹 Filtros
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND tmd.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND tmd.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND tmd.fecha <= '$fechaFin'";
        }

        if (!empty($tipo)) $query .= " AND tmd.tipo = $tipo";
        if (!empty($linea)) $query .= " AND tmd.linea = $linea";
        if (!empty($provincia)) $query .= " AND tmd.provincia = $provincia";
        if (!empty($zona)) $query .= " AND tmd.zona = $zona";
        if (!empty($empresa)) $query .= " AND tmd.empresa = $empresa";
        if (!empty($proveedor)) $query .= " AND tmd.proveedor = $proveedor";
        if (!empty($producto)) $query .= " AND tmd.producto = $producto";

        // Orden y paginación
        $query .= " ORDER BY tmd.fecha DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    // Total registros sin filtro
    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_tama_mer_dia";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }

    // Total registros con filtros
    public function countFiltered($params = [])
    {
        $query = "SELECT COUNT(*) AS total
              FROM com_db_tama_mer_dia AS tmd
              WHERE 1=1";

        if (!empty($params['fechaInicio']) && !empty($params['fechaFin'])) {
            $query .= " AND tmd.fecha BETWEEN '{$params['fechaInicio']}' AND '{$params['fechaFin']}'";
        } elseif (!empty($params['fechaInicio'])) {
            $query .= " AND tmd.fecha >= '{$params['fechaInicio']}'";
        } elseif (!empty($params['fechaFin'])) {
            $query .= " AND tmd.fecha <= '{$params['fechaFin']}'";
        }

        if (!empty($params['tipo'])) $query .= " AND tmd.tipo = {$params['tipo']}";
        if (!empty($params['linea'])) $query .= " AND tmd.linea = {$params['linea']}";
        if (!empty($params['provincia'])) $query .= " AND tmd.provincia = {$params['provincia']}";
        if (!empty($params['zona'])) $query .= " AND tmd.zona = {$params['zona']}";
        if (!empty($params['empresa'])) $query .= " AND tmd.empresa = {$params['empresa']}";
        if (!empty($params['proveedor'])) $query .= " AND tmd.proveedor = {$params['proveedor']}";
        if (!empty($params['producto'])) $query .= " AND tmd.producto = {$params['producto']}";

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
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
