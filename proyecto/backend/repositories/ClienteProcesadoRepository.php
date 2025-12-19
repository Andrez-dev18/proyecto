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

    public function findById($id)
    {
        $query = "SELECT * FROM com_db_cliente_procesados WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
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

        $stmt->execute($params);
        return $this->conn->lastInsertId();
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

    //funcion para ETL
    public function ejecutarEtlClientesProcesados($fechaInicio, $fechaFin)
    {
        try {
            $this->conn->beginTransaction();

            $resultado = [
                'success' => true,
                'mensaje' => 'ETL ejecutado correctamente',
                'detalle' => [],
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ];

            // ========== PASO 1: DELETE ==========
            $deleteSQL = "
            DELETE FROM com_db_cliente_procesados
            WHERE fecha >= '$fechaInicio'
            AND fecha <= '$fechaFin'
            AND nom_db = 'grs'
        ";

            $stmt = $this->conn->query($deleteSQL);
            $registrosEliminados = $stmt->rowCount();
            $resultado['detalle'][] = "Eliminados $registrosEliminados registros de com_db_cliente_procesados";


            // ========== PASO 2: INSERT ==========
            $insertSQL = "
        INSERT INTO com_db_cliente_procesados(
            fecha,distrito,zona,canal,codigo,linea,sublinea,vendedor,
            cliente,descripcion,ruta,nomruta,unidad,peso,importe,nom_db
        )
        SELECT tab.tfectra fecha,
               tab.distrito,
               vr.zona,
               vr.canal,
               tab.tcodigo codigo,
               IF(pr.linea IS NULL, lp.linnom, pr.linea) linea,
               IF(pr.sublinea IS NULL, l.descri, pr.sublinea) sublinea,
               v.nombre vendedor,
               c.nombre cliente,
               tab.descri,
               tab.ruta,
               cr.descri nomruta,
               tab.unidad,
               tab.peso,
               tab.importe,
               'grs'
        FROM (
            SELECT a.tfectra,
                   b.distrito,
                   b.canal,
                   a.tcodigo,
                   m.lin,
                   IF(
                        IF(b.provincia<>'AREQUIPA','OPPP',a.tcodven) IS NULL,
                        IF(LEFT(m.lin,1)='6',
                            IF(b.codven2 IS NULL OR b.codven2='','OP',b.codven2),
                            IF(b.codven IS NULL OR b.codven='','OP',b.codven)
                        ),
                        IF(b.provincia<>'AREQUIPA','OPPP',a.tcodven)
                   ) AS tcodven,
                   a.tprocli,
                   m.descri,
                   b.ruta,
                   SUM(a.tcantid) unidad,
                   ROUND(SUM(a.tespeci),2) peso,
                   ROUND(SUM(a.timport),2) importe
            FROM sale AS a
            LEFT JOIN ccte AS b ON a.tprocli = b.codigo
            LEFT JOIN mitm AS m ON a.tcodigo = m.codigo
            WHERE a.tfectra >= '$fechaInicio'
              AND a.tfectra <= '$fechaFin'
              AND m.lin NOT IN ('601','602')
              AND LEFT(m.lin,1) NOT IN ('8','9','7','0')
              AND a.tcodigo <> '.'
            GROUP BY a.treg, a.tcodigo
        ) AS tab
        LEFT JOIN ccte AS c ON tab.tprocli = c.codigo
        LEFT JOIN ccte AS v ON tab.tcodven = v.codigo
        LEFT JOIN com_vendedor AS vr ON v.nombre = vr.vendedor
        LEFT JOIN com_producto AS pr ON tab.descri = pr.descripcion
        LEFT JOIN linea AS l ON tab.lin = l.linea
        LEFT JOIN (
            SELECT l.linea, lp.linea AS linnom 
            FROM linea AS l
            INNER JOIN com_producto AS lp ON l.descri = lp.sublinea
            GROUP BY lp.linea
        ) AS lp ON lp.linea = l.linea
        LEFT JOIN cctex AS cr 
               ON CONCAT(cr.cod2, cr.cod1) = tab.ruta
              AND cr.cod2 = '01'
        ORDER BY tab.tfectra;
        ";

            $stmt = $this->conn->query($insertSQL);
            $registrosInsertados = $stmt->rowCount();
            $resultado['detalle'][] = "Insertados $registrosInsertados registros en com_db_cliente_procesados";


            // RESUMEN
            $resultado['resumen'] = [
                'eliminados' => $registrosEliminados,
                'insertados' => $registrosInsertados,
                'total' => $registrosEliminados + $registrosInsertados
            ];

            $this->conn->commit();
            return $resultado;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return [
                'success' => false,
                'mensaje' => 'Error al ejecutar el ETL',
                'error' => $e->getMessage(),
                'linea' => $e->getLine(),
                'archivo' => $e->getFile()
            ];
        }
    }
}
