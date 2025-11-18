<?php

class TrozadoDiarioRepository
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
            linea,
            codigo,
            producto,
            cantidad,
            precio,
            peso,
            importe,
            pprom,
            nom_db,
            usuarioRegistro,
            fechaHoraRegistro
        FROM com_db_trozado_diario
        ORDER BY fechaHoraRegistro DESC
    ";

        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // 👉 Si existe ID → UPDATE
        if (!empty($data['id'])) {

            $query = "
            UPDATE com_db_trozado_diario SET
                fecha = :fecha,
                zona = :zona,
                linea = :linea,
                codigo = :codigo,
                producto = :producto,
                cantidad = :cantidad,
                precio = :precio,
                peso = :peso,
                importe = :importe,
                pprom = :pprom,
                nom_db = :nom_db,
                usuarioRegistro = :usuarioRegistro,
                fechaHoraRegistro = :fechaHoraRegistro
            WHERE id = :id
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':linea' => $data['linea'] ?? null,
                ':codigo' => $data['codigo'] ?? null,
                ':producto' => $data['producto'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':precio' => $data['precio'] ?? null,
                ':peso' => $data['peso'] ?? null,
                ':importe' => $data['importe'] ?? null,
                ':pprom' => $data['pprom'] ?? null,
                ':nom_db' => $data['nom_db'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null
            ];
        }

        // 👉 Si NO tiene ID → INSERT
        else {

            $query = "
            INSERT INTO com_db_trozado_diario (
                fecha,
                zona,
                linea,
                codigo,
                producto,
                cantidad,
                precio,
                peso,
                importe,
                pprom,
                nom_db,
                usuarioRegistro,
                fechaHoraRegistro
            ) VALUES (
                :fecha,
                :zona,
                :linea,
                :codigo,
                :producto,
                :cantidad,
                :precio,
                :peso,
                :importe,
                :pprom,
                :nom_db,
                :usuarioRegistro,
                :fechaHoraRegistro
            )
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':fecha' => $data['fecha'] ?? null,
                ':zona' => $data['zona'] ?? null,
                ':linea' => $data['linea'] ?? null,
                ':codigo' => $data['codigo'] ?? null,
                ':producto' => $data['producto'] ?? null,
                ':cantidad' => $data['cantidad'] ?? null,
                ':precio' => $data['precio'] ?? null,
                ':peso' => $data['peso'] ?? null,
                ':importe' => $data['importe'] ?? null,
                ':pprom' => $data['pprom'] ?? null,
                ':nom_db' => $data['nom_db'] ?? null,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null
            ];
        }

        return $stmt->execute($params);
    }


    public function delete($id)
    {
        $query = "DELETE FROM com_db_trozado_diario WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($params = [])
    {
        $start       = $params['start'] ?? 0;
        $length      = $params['length'] ?? 10;
        $search      = $params['search']['value'] ?? '';
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $query = "
                SELECT
                    id,
                    fecha,
                    zona,
                    linea,
                    codigo,
                    producto,
                    cantidad,
                    precio,
                    peso,
                    importe,
                    pprom,
                    nom_db,
                    usuarioRegistro,
                    fechaHoraRegistro
                FROM com_db_trozado_diario
                WHERE 1=1
            ";

        //  Filtro por fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha BETWEEN '$fechaInicio' AND '$fechaFin' ";
        }

        // 🔍 Búsqueda global
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
            AND (
                zona LIKE '%$search%' OR
                linea LIKE '%$search%' OR
                codigo LIKE '%$search%' OR
                producto LIKE '%$search%' OR
                cantidad LIKE '%$search%' OR
                precio LIKE '%$search%' OR
                peso LIKE '%$search%' OR
                importe LIKE '%$search%' OR
                pprom LIKE '%$search%' OR
                nom_db LIKE '%$search%' OR
                usuarioRegistro LIKE '%$search%'
            )
        ";
        }

        // 📌 Orden + Paginación
        $query .= " ORDER BY fecha DESC, id DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }



    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_trozado_diario";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }


    public function countFiltered($params = [])
    {
        $search      = $params['search']['value'] ?? '';
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $query = "
                SELECT COUNT(*) AS total
                FROM com_db_trozado_diario
                WHERE 1=1
            ";

        //  Filtro por rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha BETWEEN '$fechaInicio' AND '$fechaFin' ";
        }

        // 🔍 Misma búsqueda global
        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
            AND (
                zona LIKE '%$search%' OR
                linea LIKE '%$search%' OR
                codigo LIKE '%$search%' OR
                producto LIKE '%$search%' OR
                cantidad LIKE '%$search%' OR
                precio LIKE '%$search%' OR
                peso LIKE '%$search%' OR
                importe LIKE '%$search%' OR
                pprom LIKE '%$search%' OR
                nom_db LIKE '%$search%' OR
                usuarioRegistro LIKE '%$search%'
            )
        ";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }


    public function ejecutarEtlTrozadoDiario($fechaInicio, $fechaFin)
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

            // ========== PASO ÚNICO: INSERT (ETL ORIGINAL) ==========
            $insertSQL = "
                    INSERT INTO com_db_trozado_diario (
                        fecha,
                        zona,
                        linea,
                        codigo,
                        producto,
                        cantidad,
                        precio,
                        peso,
                        importe,
                        pprom
                    )
                    SELECT 
                        a.tfectra AS fecha,
                        c.provincia AS zona,
                        l.descri AS linea,
                        a.tcodigo AS codigo,
                        m.descri AS producto,
                        ROUND(a.tespeci * mp.prom) AS unidades,
                        ROUND(a.tpreuni, 2) AS precio,
                        a.tespeci AS peso,
                        ROUND(a.timport, 2) AS importe,
                        ROUND(mp.prom, 2) AS promedio
                    FROM sale AS a
                    INNER JOIN mitm AS m 
                        ON a.tcodigo = m.codigo
                    INNER JOIN linea AS l 
                        ON m.lin = l.linea
                    INNER JOIN ccte AS c 
                        ON a.tprocli = c.codigo
                    LEFT JOIN (
                        SELECT 
                            tfectra,
                            ROUND(SUM(tpeso) / SUM(tcantid), 8) AS prom
                        FROM movi_produccion USE INDEX(tcodigo, tfectra), mitm
                        WHERE tcodigo = mitm.codigo
                        AND mitm.lin = '602'
                        AND tfectra >= '$fechaInicio'
                        AND tfectra <= '$fechaFin'
                        AND tcodtra = 'E204'
                        AND talm = 'PB4'
                        GROUP BY tfectra
                    ) AS mp ON a.tfectra = mp.tfectra
                    WHERE 
                        tline IN ('607','604','608','611')
                        AND a.tfectra >= '$fechaInicio'
                        AND a.tfectra <= '$fechaFin';
                    ";

            $stmt = $this->conn->query($insertSQL);
            $registrosInsertados = $stmt->rowCount();

            $resultado['detalle'][] = "Insertados $registrosInsertados registros en com_db_trozado_diario";

            // ========== RESUMEN ==========
            $resultado['resumen'] = [
                'insertados' => $registrosInsertados,
                'total' => $registrosInsertados
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
