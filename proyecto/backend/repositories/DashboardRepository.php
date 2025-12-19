<?php
class DashboardRepository {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // ==================== VIVO AREQUIPA ====================
    public function getVivoAqpResumen($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    DATE(fecha) as fecha,
                    SUM(cantidad) as total_cantidad,
                    SUM(peso) as total_peso,
                    AVG(prom) as peso_promedio,
                    AVG(precio) as precio_promedio,
                    COUNT(*) as num_registros
                FROM comdbtamamerdia
                WHERE nomdb = 'comdbvivoaqp'";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY DATE(fecha) ORDER BY fecha DESC LIMIT 30";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getVivoAqpPorZona($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    z.descri as zona_nombre,
                    SUM(t.cantidad) as total_cantidad,
                    SUM(t.peso) as total_peso,
                    AVG(t.precio) as precio_promedio
                FROM comdbtamamerdia t
                LEFT JOIN cctex z ON t.zona = z.cod1 AND z.cod2 = '10'
                WHERE t.nomdb = 'comdbvivoaqp'";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND t.fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY t.zona ORDER BY total_cantidad DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getVivoAqpPorProveedor($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    p.nombre as proveedor_nombre,
                    SUM(t.cantidad) as total_cantidad,
                    SUM(t.peso) as total_peso,
                    AVG(t.precio) as precio_promedio
                FROM comdbtamamerdia t
                LEFT JOIN comproveedor p ON t.proveedor = p.codigo
                WHERE t.nomdb = 'comdbvivoaqp'";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND t.fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY t.proveedor ORDER BY total_cantidad DESC LIMIT 10";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== BENEFICIADO PROVINCIA ====================
    public function getBeneficiadoProvinciaResumen($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    DATE(b.fecha) as fecha,
                    pr.nombre as provincia_nombre,
                    AVG(b.precioMayEntero) as precio_may_entero,
                    AVG(b.precioMayMejorado) as precio_may_mejorado,
                    AVG(b.precioPubMejorado) as precio_pub_mejorado,
                    SUM(b.cantidad) as total_cantidad
                FROM com_db_beneficio_provincia b
                LEFT JOIN com_provincia pr ON b.provincia = pr.codigo
                WHERE 1=1";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND b.fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY DATE(b.fecha), b.provincia ORDER BY b.fecha DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== TROZADO DIARIO ====================
    public function getTrozadoDiarioResumen($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    DATE(fecha) as fecha,
                    zona,
                    linea,
                    SUM(CAST(cantidad AS DECIMAL(10,2))) as total_cantidad,
                    SUM(CAST(peso AS DECIMAL(10,2))) as total_peso,
                    SUM(CAST(importe AS DECIMAL(10,2))) as total_importe,
                    AVG(CAST(precio AS DECIMAL(10,2))) as precio_promedio
                FROM com_db_trozado_diario
                WHERE 1=1";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY DATE(fecha), zona, linea ORDER BY fecha DESC LIMIT 50";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getTrozadoPorProducto($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    producto,
                    SUM(CAST(cantidad AS DECIMAL(10,2))) as total_cantidad,
                    SUM(CAST(peso AS DECIMAL(10,2))) as total_peso,
                    SUM(CAST(importe AS DECIMAL(10,2))) as total_importe
                FROM com_db_trozado_diario
                WHERE 1=1";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY producto ORDER BY total_importe DESC LIMIT 15";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== CLIENTE PROCESADOS ====================
    public function getClienteProcesadosTop($fechaInicio = null, $fechaFin = null, $limit = 20) {
        $query = "SELECT 
                    cliente,
                    zona,
                    SUM(unidad) as total_unidades,
                    SUM(peso) as total_peso,
                    SUM(importe) as total_importe
                FROM com_db_cliente_procesados
                WHERE 1=1";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY cliente, zona ORDER BY total_importe DESC LIMIT ?";
        $params[] = $limit;
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getClientePorLinea($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    linea,
                    COUNT(DISTINCT cliente) as num_clientes,
                    SUM(importe) as total_importe,
                    SUM(peso) as total_peso
                FROM com_db_cliente_procesados
                WHERE 1=1";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY linea ORDER BY total_importe DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== HUEVO ====================
    public function getHuevoResumen($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    DATE(h.fecha) as fecha,
                    pr.nombre as provincia_nombre,
                    t.nombre as tipo_nombre,
                    AVG(h.precioMayMin) as precio_may_min,
                    AVG(h.precioMayMax) as precio_may_max,
                    AVG(h.precioPubMin) as precio_pub_min,
                    AVG(h.precioPubMax) as precio_pub_max
                FROM com_db_huevo h
                LEFT JOIN com_provincia pr ON h.provincia = pr.codigo
                LEFT JOIN com_tipo_huevo t ON h.tipo = t.codigo
                WHERE 1=1";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND h.fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY DATE(h.fecha), h.provincia, h.tipo ORDER BY h.fecha DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== GALLINA ====================
    public function getGallinaResumen($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    DATE(g.fecha) as fecha,
                    t.nombre as tipo_nombre,
                    AVG(g.precioMayMin) as precio_may_min,
                    AVG(g.precioMayMax) as precio_may_max,
                    SUM(g.cantidad) as total_cantidad
                FROM com_db_gallina g
                LEFT JOIN com_tipo_gallina t ON g.tipo = t.codigo
                WHERE 1=1";
        
        $params = [];
        if ($fechaInicio && $fechaFin) {
            $query .= " AND g.fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY DATE(g.fecha), g.tipo ORDER BY g.fecha DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== RESUMEN GENERAL ====================
    public function getResumenGeneral($fechaInicio = null, $fechaFin = null) {
        $where = "";
        $params = [];
        
        if ($fechaInicio && $fechaFin) {
            $where = "WHERE fecha BETWEEN ? AND ?";
            $params = [$fechaInicio, $fechaFin];
        }
        
        // Total Vivo
        $queryVivo = "SELECT 
                        SUM(cantidad) as total_cantidad,
                        SUM(peso) as total_peso,
                        SUM(cantidad * precio) as total_valor
                    FROM comdbtamamerdia 
                    {$where} AND nomdb = 'comdbvivoaqp'";
        
        $stmtVivo = $this->conn->prepare($queryVivo);
        $stmtVivo->execute($params);
        $vivo = $stmtVivo->fetch(PDO::FETCH_ASSOC);
        
        // Total Trozado
        $queryTrozado = "SELECT 
                            SUM(CAST(importe AS DECIMAL(10,2))) as total_importe
                        FROM com_db_trozado_diario
                        {$where}";
        
        $stmtTrozado = $this->conn->prepare($queryTrozado);
        $stmtTrozado->execute($params);
        $trozado = $stmtTrozado->fetch(PDO::FETCH_ASSOC);
        
        // Total Clientes
        $queryClientes = "SELECT 
                            COUNT(DISTINCT cliente) as total_clientes,
                            SUM(importe) as total_ventas
                        FROM com_db_cliente_procesados
                        {$where}";
        
        $stmtClientes = $this->conn->prepare($queryClientes);
        $stmtClientes->execute($params);
        $clientes = $stmtClientes->fetch(PDO::FETCH_ASSOC);
        
        return [
            'vivo' => $vivo,
            'trozado' => $trozado,
            'clientes' => $clientes
        ];
    }

        // ==================== CRIADORES EMPRENDEDORES ====================
    public function getCriadoresEmprendedoresResumen($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    DATE(fecha) as fecha,
                    tipo,
                    COUNT(*) as total_registros,
                    SUM(cantidad) as total_cantidad
                FROM com_db_criador_emprendedor
                WHERE 1=1";
        
        $params = array();
        if ($fechaInicio && $fechaFin) {
            $query .= " AND fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY DATE(fecha), tipo ORDER BY fecha DESC LIMIT 30";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== PRODUCTO SUSTITUTO ====================
    public function getProductoSustitutoResumen($fechaInicio = null, $fechaFin = null) {
        $query = "SELECT 
                    DATE(fecha) as fecha,
                    producto,
                    SUM(CAST(precioMin AS DECIMAL(10,2))) as precio_min_total,
                    SUM(CAST(precioMax AS DECIMAL(10,2))) as precio_max_total,
                    AVG(CAST(precioMin AS DECIMAL(10,2))) as precio_min_prom,
                    AVG(CAST(precioMax AS DECIMAL(10,2))) as precio_max_prom
                FROM com_db_producto_sustituto
                WHERE 1=1";
        
        $params = array();
        if ($fechaInicio && $fechaFin) {
            $query .= " AND fecha BETWEEN ? AND ?";
            $params[] = $fechaInicio;
            $params[] = $fechaFin;
        }
        
        $query .= " GROUP BY DATE(fecha), producto ORDER BY fecha DESC LIMIT 30";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== MONITOREO DEL SISTEMA ====================
public function getEstadisticasGeneralesSistema($fechaInicio = null, $fechaFin = null) {
    $where = "";
    $params = [];
    
    if ($fechaInicio && $fechaFin) {
        $where = "WHERE fecha BETWEEN ? AND ?";
        $params = [$fechaInicio, $fechaFin];
    }

    $stats = [];

    // 1. POLLO VIVO AREQUIPA
    $query1 = "SELECT COUNT(*) as total, SUM(peso) as total_peso, 
               MAX(fecha) as ultimo_ingreso
               FROM comdbtamamerdia $where AND nomdb = 'comdbvivoaqp'";
    $stmt1 = $this->conn->prepare($query1);
    $stmt1->execute($params);
    $stats['vivo_aqp'] = $stmt1->fetch(PDO::FETCH_ASSOC);

    // 2. BENEFICIADO PROVINCIA
    $query2 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
               FROM com_db_beneficio_provincia $where";
    $stmt2 = $this->conn->prepare($query2);
    $stmt2->execute($params);
    $stats['beneficiado'] = $stmt2->fetch(PDO::FETCH_ASSOC);

    // 3. TROZADO DIARIO
    $query3 = "SELECT COUNT(*) as total, 
               SUM(CAST(importe AS DECIMAL(10,2))) as total_importe,
               MAX(fecha) as ultimo_ingreso
               FROM com_db_trozado_diario $where";
    $stmt3 = $this->conn->prepare($query3);
    $stmt3->execute($params);
    $stats['trozado'] = $stmt3->fetch(PDO::FETCH_ASSOC);

    // 4. CLIENTES PROCESADOS
    $query4 = "SELECT COUNT(*) as total, 
               COUNT(DISTINCT cliente) as clientes_unicos,
               SUM(importe) as total_ventas,
               MAX(fecha) as ultimo_ingreso
               FROM com_db_cliente_procesados $where";
    $stmt4 = $this->conn->prepare($query4);
    $stmt4->execute($params);
    $stats['clientes'] = $stmt4->fetch(PDO::FETCH_ASSOC);

    // 5. HUEVO
    $query5 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
               FROM com_db_huevo $where";
    $stmt5 = $this->conn->prepare($query5);
    $stmt5->execute($params);
    $stats['huevo'] = $stmt5->fetch(PDO::FETCH_ASSOC);

    // 6. GALLINA
    $query6 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
               FROM com_db_gallina $where";
    $stmt6 = $this->conn->prepare($query6);
    $stmt6->execute($params);
    $stats['gallina'] = $stmt6->fetch(PDO::FETCH_ASSOC);

    // 7. CRIADORES
    $query7 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
               FROM com_db_criador_emprendedor $where";
    $stmt7 = $this->conn->prepare($query7);
    $stmt7->execute($params);
    $stats['criadores'] = $stmt7->fetch(PDO::FETCH_ASSOC);

    // 8. PRODUCTO SUSTITUTO
    $query8 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
               FROM com_db_prod_sustituto $where";
    $stmt8 = $this->conn->prepare($query8);
    $stmt8->execute($params);
    $stats['producto_sustituto'] = $stmt8->fetch(PDO::FETCH_ASSOC);

    // 9. INFO GRS
    $query9 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
               FROM com_db_info_grs $where";
    $stmt9 = $this->conn->prepare($query9);
    $stmt9->execute($params);
    $stats['info_grs'] = $stmt9->fetch(PDO::FETCH_ASSOC);

    // 10. CONTROL CLIENTE PV
    $query10 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
                FROM com_db_ctrl_cliente_pv $where";
    $stmt10 = $this->conn->prepare($query10);
    $stmt10->execute($params);
    $stats['ctrl_cliente_pv'] = $stmt10->fetch(PDO::FETCH_ASSOC);

    // 11. INGRESOS LIMA
    $query11 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
                FROM com_db_ingre_emp_lima $where";
    $stmt11 = $this->conn->prepare($query11);
    $stmt11->execute($params);
    $stats['ingresos_lima'] = $stmt11->fetch(PDO::FETCH_ASSOC);

    // 12. VIVO PROVINCIA
    $query12 = "SELECT COUNT(*) as total, MAX(fecha) as ultimo_ingreso
                FROM com_db_vivo_provincia $where";
    $stmt12 = $this->conn->prepare($query12);
    $stmt12->execute($params);
    $stats['vivo_provincia'] = $stmt12->fetch(PDO::FETCH_ASSOC);

    return $stats;
}

public function getUsoPorModuloSistema($fechaInicio = null, $fechaFin = null) {
    $stats = $this->getEstadisticasGeneralesSistema($fechaInicio, $fechaFin);
    
    return [
        'Pollo Vivo Arequipa' => intval($stats['vivo_aqp']['total'] ?? 0),
        'Beneficiado Provincia' => intval($stats['beneficiado']['total'] ?? 0),
        'Trozado Diario' => intval($stats['trozado']['total'] ?? 0),
        'Clientes Procesados' => intval($stats['clientes']['total'] ?? 0),
        'Huevo' => intval($stats['huevo']['total'] ?? 0),
        'Gallina' => intval($stats['gallina']['total'] ?? 0),
        'Criadores Emprendedores' => intval($stats['criadores']['total'] ?? 0),
        'Producto Sustituto' => intval($stats['producto_sustituto']['total'] ?? 0),
        'Info GRS' => intval($stats['info_grs']['total'] ?? 0),
        'Control Cliente PV' => intval($stats['ctrl_cliente_pv']['total'] ?? 0),
        'Ingresos Lima' => intval($stats['ingresos_lima']['total'] ?? 0),
        'Vivo Provincia' => intval($stats['vivo_provincia']['total'] ?? 0)
    ];
}

public function getActividadUltimos30DiasSistema() {
    $actividad = [];
    
    for ($i = 29; $i >= 0; $i--) {
        $fecha = date('Y-m-d', strtotime("-$i days"));
        $actividad[$fecha] = 0;
    }

    $tablas = [
        ['tabla' => 'comdbtamamerdia', 'condicion' => "nomdb = 'comdbvivoaqp'"],
        ['tabla' => 'com_db_beneficio_provincia', 'condicion' => '1=1'],
        ['tabla' => 'com_db_trozado_diario', 'condicion' => '1=1'],
        ['tabla' => 'com_db_cliente_procesados', 'condicion' => '1=1'],
        ['tabla' => 'com_db_huevo', 'condicion' => '1=1'],
        ['tabla' => 'com_db_gallina', 'condicion' => '1=1'],
        ['tabla' => 'com_db_criador_emprendedor', 'condicion' => '1=1'],
        ['tabla' => 'com_db_info_grs', 'condicion' => '1=1']
    ];

    foreach ($tablas as $config) {
        $query = "SELECT DATE(fecha) as fecha, COUNT(*) as total
                  FROM {$config['tabla']}
                  WHERE {$config['condicion']}
                  AND fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                  GROUP BY DATE(fecha)";
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($result as $row) {
                if (isset($actividad[$row['fecha']])) {
                    $actividad[$row['fecha']] += intval($row['total']);
                }
            }
        } catch (Exception $e) {
            // Continuar si falla
        }
    }

    return $actividad;
}

public function getUsuariosActivosSistema() {
    $query = "SELECT COUNT(DISTINCT cod_usuario) as total
              FROM com_historial_acciones
              WHERE fechaHora >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    
    try {
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return intval($result['total'] ?? 0);
    } catch (Exception $e) {
        return 0;
    }
}

public function getActividadRecienteSistema($limit = 10) {
    $query = "SELECT cod_usuario, nom_usuario, accion, tabla_afectada, 
              descripcion, fechaHora
              FROM com_historial_acciones
              ORDER BY fechaHora DESC
              LIMIT ?";
    
    try {
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return [];
    }
}


}
?>
