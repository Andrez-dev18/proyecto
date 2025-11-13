<?php

class ETL_Repository
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

    public function ejecutarEtl($fechaInicio, $fechaFin)
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

            // ========== PASO 1: DELETE GRS ==========
            $deleteGrs = "DELETE FROM com_db_tama_mer_dia 
                          WHERE nom_db='grs' 
                          AND fecha >= '$fechaInicio' 
                          AND fecha <= '$fechaFin'";

            $stmt = $this->conn->query($deleteGrs);
            $registrosEliminadosGrs = $stmt->rowCount();
            $resultado['detalle'][] = "Eliminados $registrosEliminadosGrs registros de GRS";

            // ========== PASO 2: INSERT GRS ==========
            $insertGrs = "
            INSERT INTO com_db_tama_mer_dia (nom_db,fecha,tipo,linea,provincia,zona,empresa,proveedor,producto,cantidad,peso,prom,precio)
            SELECT 'grs',tfectra,tp.codigo codtip,t.codigo codlin,pv.codigo codprov,pz.codigo codzon,empresa,proveedor,tpv.codigo codprd,cantidad,peso,prom,precio FROM (
             SELECT a.tfectra,'POLLO VIVO' tipo,'VIVO' linea,IF(b.provincia IN ('CAMANA','LA JOYA','MOLLENDO','PEDREGAL'),'AREQUIPA',b.provincia)provincia,b.provincia zona,'3' empresa,'35'proveedor,IF(a.tcodigo='100','CARNE','BRASA')producto,SUM(tcantid)cantidad,ROUND(SUM(tespeci),2)peso,ROUND(AVG(tespeci/tcantid),2)prom,ROUND(SUM(timport+tigvsol)/SUM(tespeci),2)precio
             FROM sale AS a
             INNER JOIN ccte AS b ON a.tprocli=b.codigo
             WHERE a.tfectra>='$fechaInicio' AND a.tfectra<='$fechaFin' AND tline='601' AND a.tcodigo<>'.' AND tcodigo IN ('100','103')
             GROUP BY a.tfectra,b.provincia,a.tcodigo
             UNION
             SELECT a.tfectra,'POLLO TROZADO' tipo,'BENEFICIADO' linea,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO',b.provincia)provincia,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO / JULIACA',b.provincia) zona,'3' empresa,'35'proveedor,IF(a.tcodigo='100','CARNE','BRASA')producto,ROUND(SUM(tespeci)/mp.prom,0) cantidad,ROUND(SUM(tespeci),2)peso,mp.prom,ROUND(SUM(timport+tigvsol)/SUM(tespeci),2)precio
             FROM sale AS a
             INNER JOIN ccte AS b ON a.tprocli=b.codigo
             LEFT JOIN (SELECT tfectra,ROUND(SUM(tpeso)/SUM(tcantid),2) AS prom FROM movi_produccion USE INDEX(tcodigo,tfectra),mitm WHERE tcodigo=mitm.codigo AND mitm.lin='602' AND tfectra>='$fechaInicio' AND tfectra<='$fechaFin' AND tcodtra='E204' AND talm='PB4' GROUP BY tfectra) AS mp ON a.tfectra=mp.tfectra
             WHERE a.tfectra>='$fechaInicio' AND a.tfectra<='$fechaFin' AND tline IN ('604','611','608')  AND a.tcodigo<>'.'
             GROUP BY a.tfectra,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO / JULIACA', 'AREQUIPA')
             UNION
             SELECT a.tfectra,'POLLO CONGELADO' tipo,'BENEFICIADO' linea,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO',b.provincia)provincia,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO / JULIACA',b.provincia) zona,'3' empresa,'35'proveedor,IF(a.tcodigo='100','CARNE','CARNE')producto,ROUND(SUM(tespeci)/mp.prom,0) cantidad,ROUND(SUM(tespeci),2)peso,mp.prom,ROUND(SUM(timport+tigvsol)/SUM(tespeci),2)precio
             FROM sale AS a
             INNER JOIN ccte AS b ON a.tprocli=b.codigo
             LEFT JOIN (SELECT tfectra,ROUND(SUM(tpeso)/SUM(tcantid),2) AS prom FROM movi_produccion USE INDEX(tcodigo,tfectra),mitm WHERE tcodigo=mitm.codigo AND mitm.lin='602' AND tfectra>='$fechaInicio' AND tfectra<='$fechaFin' AND tcodtra='E204' AND talm='PB4' GROUP BY tfectra) AS mp ON a.tfectra=mp.tfectra
             WHERE a.tfectra>='$fechaInicio' AND a.tfectra<='$fechaFin' AND tline IN ('603','610')  AND a.tcodigo<>'.'
             GROUP BY a.tfectra,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO / JULIACA', 'AREQUIPA')
             UNION
             SELECT a.tfectra,'POLLO TROZADO CONGELADO' tipo,'BENEFICIADO' linea,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO',b.provincia)provincia,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO / JULIACA',b.provincia) zona,'3' empresa,'35'proveedor,IF(a.tcodigo='100','CARNE','CARNE')producto,ROUND(SUM(tespeci)/mp.prom,0) cantidad,ROUND(SUM(tespeci),2)peso,mp.prom,ROUND(SUM(timport+tigvsol)/SUM(tespeci),2)precio
             FROM sale AS a
             INNER JOIN ccte AS b ON a.tprocli=b.codigo
             LEFT JOIN (SELECT tfectra,ROUND(SUM(tpeso)/SUM(tcantid),2) AS prom FROM movi_produccion USE INDEX(tcodigo,tfectra),mitm WHERE tcodigo=mitm.codigo AND mitm.lin='602' AND tfectra>='$fechaInicio' AND tfectra<='$fechaFin' AND tcodtra='E204' AND talm='PB4' GROUP BY tfectra) AS mp ON a.tfectra=mp.tfectra
             WHERE a.tfectra>='$fechaInicio' AND a.tfectra<='$fechaFin' AND tline IN ('605','611')  AND a.tcodigo<>'.'
             GROUP BY a.tfectra,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO / JULIACA', 'AREQUIPA')
             UNION
             SELECT a.tfectra,'POLLO BENEFICIADO' tipo,'BENEFICIADO' linea,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO',b.provincia)provincia,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO / JULIACA',b.provincia) zona,'3' empresa,'35'proveedor,IF(a.tcodigo='100','CARNE','CARNE')producto,ROUND(SUM(IF(a.tline='602',a.tcantid,0))) +ROUND(SUM(IF(a.tline='602',0,tespeci))/mp.prom,0) cantidad,ROUND(SUM(tespeci),2)peso,ROUND(AVG(IF(a.tline='602',tespeci/tcantid,mp.prom)),2)prom,ROUND(SUM(timport+tigvsol)/SUM(tespeci),2)precio
             FROM sale AS a
             INNER JOIN ccte AS b ON a.tprocli=b.codigo
             LEFT JOIN (SELECT tfectra,ROUND(SUM(tpeso)/SUM(tcantid),2) AS prom FROM movi_produccion USE INDEX(tcodigo,tfectra),mitm WHERE tcodigo=mitm.codigo AND mitm.lin='602' AND tfectra>='$fechaInicio' AND tfectra<='$fechaFin' AND tcodtra='E204' AND talm='PB4') AS mp ON a.tfectra=mp.tfectra
             WHERE a.tfectra>='$fechaInicio' AND a.tfectra<='$fechaFin' AND tline IN ('602','607')  AND a.tcodigo<>'.'
             GROUP BY a.tfectra,IF(b.provincia IN ('JULIACA','PUNO'),'PUNO / JULIACA', 'AREQUIPA')
             ) AS frm 
             LEFT JOIN com_provincia AS pv ON frm.provincia=pv.nombre
             LEFT JOIN com_provincia AS pz ON frm.zona=pz.nombre
             LEFT JOIN com_tipo_pollo_vivo AS tpv ON  CONVERT(frm.producto USING latin1) COLLATE latin1_swedish_ci = tpv.nombre
             LEFT JOIN com_tipo_pollo AS tp ON  CONVERT(frm.tipo USING latin1) COLLATE latin1_swedish_ci = tp.nombre
             LEFT JOIN com_tipo AS t ON CONVERT(frm.linea USING latin1) COLLATE latin1_swedish_ci = t.nombre
            ";

            $stmt = $this->conn->query($insertGrs);
            $registrosInsertadosGrs = $stmt->rowCount();
            $resultado['detalle'][] = "Insertados $registrosInsertadosGrs registros de GRS";

            // ========== PASO 3: DELETE COM_DB_VIVO_AQP ==========
            $deleteVivo = "DELETE FROM com_db_tama_mer_dia 
                           WHERE nom_db='com_db_vivo_aqp' 
                           AND fecha >= '$fechaInicio' 
                           AND fecha <= '$fechaFin'";

            $stmt = $this->conn->query($deleteVivo);
            $registrosEliminadosVivo = $stmt->rowCount();
            $resultado['detalle'][] = "Eliminados $registrosEliminadosVivo registros de COM_DB_VIVO_AQP";

            // ========== PASO 4: INSERT COM_DB_VIVO_AQP ==========
            $insertVivo = "
            INSERT INTO com_db_tama_mer_dia (nom_db,fecha,tipo,linea,provincia,zona,empresa,proveedor,producto,cantidad,peso,prom,precio)
            SELECT 'com_db_vivo_aqp',a.fecha,'1'codtip,'1'codlin,'10'codprov,'10'codzon,empresa,proveedor,'1'codprd,a.cantidad,ROUND(ROUND((pesoMachoPromMin + pesoMachoPromMax + pesoHembraPromMin + pesoHembraPromMax) / NULLIF((pesoMachoPromMin>0) + (pesoMachoPromMax>0) + (pesoHembraPromMin>0) + (pesoHembraPromMax>0),0),2)*cantidad,2) AS peso,ROUND((pesoMachoPromMin + pesoMachoPromMax + pesoHembraPromMin + pesoHembraPromMax) / NULLIF((pesoMachoPromMin>0) + (pesoMachoPromMax>0) + (pesoHembraPromMin>0) + (pesoHembraPromMax>0),0),2)prom,ROUND((precioMayMin + precioMayMax + precioPubMin + precioPubMax) / NULLIF((precioMayMin>0) + (precioMayMax>0) + (precioPubMin>0) + (precioPubMax>0),0),2) AS precio
            FROM com_db_vivo_aqp AS a
            WHERE a.fecha>='$fechaInicio' AND a.fecha<='$fechaFin'
            ORDER BY a.id
            ";

            $stmt = $this->conn->query($insertVivo);
            $registrosInsertadosVivo = $stmt->rowCount();
            $resultado['detalle'][] = "Insertados $registrosInsertadosVivo registros de COM_DB_VIVO_AQP";

            // ========== RESUMEN ==========
            $totalProcesado = $registrosInsertadosGrs + $registrosInsertadosVivo;
            $resultado['resumen'] = [
                'total_registros_procesados' => $totalProcesado,
                'grs' => [
                    'eliminados' => $registrosEliminadosGrs,
                    'insertados' => $registrosInsertadosGrs
                ],
                'com_db_vivo_aqp' => [
                    'eliminados' => $registrosEliminadosVivo,
                    'insertados' => $registrosInsertadosVivo
                ]
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
