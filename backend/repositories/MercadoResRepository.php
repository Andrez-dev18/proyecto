<?php

class MercadoResRepository
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
            r.provincia,
            p.nombre AS provincia_nombre,
            r.tipoEstablecimiento,
            r.tamanio,
            r.total,
            r.numAves,
            r.fecha
        FROM com_db_mercado_res r
        LEFT JOIN com_provincia p ON r.provincia = p.codigo
        ORDER BY p.nombre ASC, r.tipoEstablecimiento ASC, r.tamanio ASC
        ";

        return $this->executeQuery($query);
    }


    // VALIDACIÓN GENERAL (reutilizable)
    private function validarData($data)
    {
        if (empty($data['provincia'])) {
            throw new Exception("El campo 'provincia' es obligatorio.");
        }
        if (empty($data['tipoEstablecimiento'])) {
            throw new Exception("El campo 'tipoEstablecimiento' es obligatorio.");
        }
        if (empty($data['tamanio'])) {
            throw new Exception("El campo 'tamanio' es obligatorio.");
        }

        // NORMALIZAR
        $data['tipoEstablecimiento'] = trim($data['tipoEstablecimiento']);
        $data['tamanio'] = trim($data['tamanio']);

        // ENUMS
        $validTipos = [
            "Puesto de mercado",
            "Tienda y puesto aledaño"
        ];
        $validTamanios = ["Grande", "Mediano", "Chico"];

        if (!in_array($data['tipoEstablecimiento'], $validTipos)) {
            throw new Exception("Valor inválido para 'tipoEstablecimiento'.");
        }
        if (!in_array($data['tamanio'], $validTamanios)) {
            throw new Exception("Valor inválido para 'tamanio'.");
        }

        return [
            "provincia" => intval($data['provincia']),
            "tipoEstablecimiento" => $data['tipoEstablecimiento'],
            "tamanio" => $data['tamanio'],
            "num_mercados" => intval($data['num_mercados'] ?? 0),
            "total" => intval($data['total'] ?? 0),
            "numAves" => intval($data['numAves'] ?? 0)
        ];
    }

    // VERIFICAR EXISTENCIA
    private function existe($data)
    {
        $query = "
            SELECT COUNT(*) 
            FROM com_db_mercado_res
            WHERE provincia = :provincia
            AND tipoEstablecimiento = :tipoEstablecimiento
            AND tamanio = :tamanio
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ":provincia" => $data["provincia"],
            ":tipoEstablecimiento" => $data["tipoEstablecimiento"],
            ":tamanio" => $data["tamanio"]
        ]);

        return $stmt->fetchColumn() > 0;
    }

    // SOLO INSERT
    public function insertMercadoRes($data)
    {
        $data = $this->validarData($data);

        if ($this->existe($data)) {
            throw new Exception("El registro ya existe. No se puede duplicar.");
        }

        $query = "
            INSERT INTO com_db_mercado_res (
                provincia, num_mercados, tipoEstablecimiento,
                tamanio, total, numAves
            ) VALUES (
                :provincia, :num_mercados, :tipoEstablecimiento,
                :tamanio, :total, :numAves
            )
        ";

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($data);
    }

    // SOLO UPDATE
    public function updateMercadoRes($data)
    {
        $data = $this->validarData($data);

        if (!$this->existe($data)) {
            throw new Exception("No existe un registro con esta combinación única para actualizar.");
        }

        $query = "
            UPDATE com_db_mercado_res SET
                num_mercados = :num_mercados,
                total = :total,
                numAves = :numAves
            WHERE provincia = :provincia
            AND tipoEstablecimiento = :tipoEstablecimiento
            AND tamanio = :tamanio
        ";

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($data);
    }



    public function delete($provincia, $tipoEstablecimiento, $tamanio)
    {
        $query = "
        DELETE FROM com_db_mercado_res
        WHERE provincia = :provincia
          AND tipoEstablecimiento = :tipoEstablecimiento
          AND tamanio = :tamanio
    ";

        $stmt = $this->conn->prepare($query);

        $stmt->execute([
            ':provincia' => $provincia,
            ':tipoEstablecimiento' => $tipoEstablecimiento,
            ':tamanio' => $tamanio,
        ]);

        return $stmt->rowCount(); // devuelve cuántas filas se eliminaron
    }

    public function findByFilters($params = [])
    {
        $start   = $params['start'] ?? 0;
        $length  = $params['length'] ?? 10;
        $search  = $params['search']['value'] ?? '';

        $provincia   = $params['provincia'] ?? null;
        $tipo        = $params['tipoEstablecimiento'] ?? null;
        $fecha       = $params['fecha'] ?? null;
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $query = "
        SELECT 
            mr.provincia,
            p.nombre AS provincia_nombre,
            mr.tipoEstablecimiento,
            mr.tamanio,
            mr.total,
            mr.numAves,
            mr.fecha
        FROM com_db_mercado_res mr
        LEFT JOIN com_provincia p ON p.codigo = mr.provincia
        WHERE 1=1
    ";

        $sqlParams = [];

        // FILTRO POR PROVINCIA
        if (!empty($provincia)) {
            $query .= " AND mr.provincia = :provincia ";
            $sqlParams[':provincia'] = $provincia;
        }

        // FILTRO POR TIPO DE ESTABLECIMIENTO
        if (!empty($tipo)) {
            $query .= " AND mr.tipoEstablecimiento = :tipo ";
            $sqlParams[':tipo'] = $tipo;
        }

        // FILTRO POR FECHA EXACTA
        if (!empty($fecha)) {
            $query .= " AND mr.fecha = :fecha ";
            $sqlParams[':fecha'] = $fecha;
        }

        // FECHA INICIO
        if (!empty($fechaInicio)) {
            $query .= " AND mr.fecha >= :fechaInicio ";
            $sqlParams[':fechaInicio'] = $fechaInicio;
        }

        // FECHA FIN
        if (!empty($fechaFin)) {
            $query .= " AND mr.fecha <= :fechaFin ";
            $sqlParams[':fechaFin'] = $fechaFin;
        }

        // BUSQUEDA GLOBAL
        if (!empty($search)) {
            $query .= "
        AND (
            p.nombre LIKE :search OR
            mr.tipoEstablecimiento LIKE :search OR
            mr.tamanio LIKE :search OR
            mr.total LIKE :search OR
            mr.numAves LIKE :search
        )
        ";
            $sqlParams[':search'] = "%$search%";
        }

        // ORDEN + PAGINACIÓN
        $query .= " ORDER BY mr.fecha DESC LIMIT $start, $length ";

        return $this->executeQuery($query, $sqlParams);
    }



    public function countFiltered($params = [])
    {
        $search      = $params['search']['value'] ?? '';
        $provincia   = $params['provincia'] ?? null;
        $tipo        = $params['tipoEstablecimiento'] ?? null;
        $fecha       = $params['fecha'] ?? null;
        $fechaInicio = $params['fechaInicio'] ?? null;
        $fechaFin    = $params['fechaFin'] ?? null;

        $query = "
        SELECT COUNT(*) AS total
        FROM com_db_mercado_res mr
        LEFT JOIN com_provincia p ON p.codigo = mr.provincia
        WHERE 1=1
    ";

        $sqlParams = [];

        // FILTRO POR PROVINCIA
        if (!empty($provincia)) {
            $query .= " AND mr.provincia = :provincia ";
            $sqlParams[':provincia'] = $provincia;
        }

        // FILTRO POR TIPO
        if (!empty($tipo)) {
            $query .= " AND mr.tipoEstablecimiento = :tipo ";
            $sqlParams[':tipo'] = $tipo;
        }

        // FILTRO POR FECHA EXACTA
        if (!empty($fecha)) {
            $query .= " AND mr.fecha = :fecha ";
            $sqlParams[':fecha'] = $fecha;
        }

        // FECHA INICIO
        if (!empty($fechaInicio)) {
            $query .= " AND mr.fecha >= :fechaInicio ";
            $sqlParams[':fechaInicio'] = $fechaInicio;
        }

        // FECHA FIN
        if (!empty($fechaFin)) {
            $query .= " AND mr.fecha <= :fechaFin ";
            $sqlParams[':fechaFin'] = $fechaFin;
        }

        // BUSQUEDA
        if (!empty($search)) {
            $query .= "
        AND (
            p.nombre LIKE :search OR
            mr.tipoEstablecimiento LIKE :search OR
            mr.tamanio LIKE :search OR
            mr.total LIKE :search OR
            mr.numAves LIKE :search
        )
        ";
            $sqlParams[':search'] = "%$search%";
        }

        $result = $this->executeQuery($query, $sqlParams);
        return $result[0]['total'] ?? 0;
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_mercado_res";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }


    public function tablaPorProvincias($fecha = null)
    {
        $params = [];
        $filtroFecha = "";

        if ($fecha) {
            $filtroFecha = " AND mr.fecha = :fecha ";
            $params[':fecha'] = $fecha;
        }

        // 1. Obtener provincias dinámicas
        $provincias = $this->executeQuery(
            "SELECT codigo, nombre FROM com_provincia ORDER BY nombre"
        );

        // Armamos lista de nombres para recorrer después
        $listaProvincias = array_column($provincias, 'nombre');

        // 2. Crear SELECT dinámico para filas base (por tipo + tamaño)
        $selectPivot = "";
        foreach ($provincias as $p) {
            $selectPivot .= "
            SUM(CASE WHEN mr.provincia = {$p['codigo']} THEN mr.total ELSE 0 END) AS `{$p['nombre']}`,
        ";
        }

        // TOTAL FINAL
        $selectPivot .= " SUM(mr.total) AS Total ";

        // 3. Query base (Puesto de Mercado / Tienda aledaña)
        $sql = "
            SELECT 
                mr.tipoEstablecimiento,
                mr.tamanio,
                $selectPivot
            FROM com_db_mercado_res mr
            WHERE 1=1
            $filtroFecha
            GROUP BY mr.tipoEstablecimiento, mr.tamanio
            ORDER BY 
                FIELD(mr.tipoEstablecimiento, 'Puesto de mercado', 'Tienda y puesto aledaño'),
                FIELD(mr.tamanio, 'Grande', 'Mediano', 'Chico')
        ";

        $filasBase = $this->executeQuery($sql, $params);

        // ============================================
        //    CONSTRUIR RESULTADO CON ORDEN CORRECTO
        // ============================================

        $resultado = [];
        $totalesPorTipo = [];

        // 1) FILA "N° Mercados"
        $filaMercados = [
            "tipo" => "Datos",
            "categoria" => "N° Mercados",
            "tamanio" => null
        ];

        foreach ($provincias as $p) {
            $codigo = $p['codigo'];
            $cantidad = $this->executeQuery(
                "SELECT COUNT(*) AS total FROM com_mercado WHERE provincia = $codigo"
            )[0]['total'] ?? 0;
            $filaMercados[$p['nombre']] = (int)$cantidad;
        }

        $filaMercados["Total"] = array_sum(array_slice($filaMercados, 3));
        $resultado[] = $filaMercados;

        // 2) AGREGAR LAS FILAS BASE Y CALCULAR TOTALES POR TIPO
        $tiposOrdenados = [];

        foreach ($filasBase as $f) {
            $tipo = $f["tipoEstablecimiento"];

            // Inicializar si no existe
            if (!isset($tiposOrdenados[$tipo])) {
                $tiposOrdenados[$tipo] = [
                    "filas" => [],
                    "total" => [
                        "tipo" => $tipo,
                        "categoria" => $tipo === "Puesto de mercado" ? "Total Puesto de Mercado" : "Total tiendas aledañas",
                        "tamanio" => null
                    ]
                ];
            }

            $fila = [
                "tipo" => $tipo,
                "categoria" => $f["tamanio"],
                "tamanio" => $f["tamanio"]
            ];

            foreach ($listaProvincias as $prov) {
                $fila[$prov] = (int)$f[$prov];
            }
            $fila["Total"] = (int)$f["Total"];

            $tiposOrdenados[$tipo]["filas"][] = $fila;

            // Acumular en el total
            foreach ($listaProvincias as $prov) {
                if (!isset($tiposOrdenados[$tipo]["total"][$prov])) {
                    $tiposOrdenados[$tipo]["total"][$prov] = 0;
                }
                $tiposOrdenados[$tipo]["total"][$prov] += (int)$f[$prov];
            }

            if (!isset($tiposOrdenados[$tipo]["total"]["Total"])) {
                $tiposOrdenados[$tipo]["total"]["Total"] = 0;
            }
            $tiposOrdenados[$tipo]["total"]["Total"] += (int)$f["Total"];
        }

        // 3) AGREGAR FILAS EN ORDEN CORRECTO
        foreach ($tiposOrdenados as $tipo => $datos) {
            // Agregar las filas de detalle
            foreach ($datos["filas"] as $fila) {
                $resultado[] = $fila;
            }
            // Agregar el total del tipo INMEDIATAMENTE después
            $resultado[] = $datos["total"];
        }

        // 4) FILA "Total puestos"
        $filaTP = [
            "tipo" => "Total",
            "categoria" => "Total puestos",
            "tamanio" => null
        ];

        foreach ($listaProvincias as $prov) {
            $filaTP[$prov] = 0;
            foreach ($tiposOrdenados as $datos) {
                $filaTP[$prov] += $datos["total"][$prov] ?? 0;
            }
        }

        $filaTP["Total"] = array_sum(array_slice($filaTP, 3));
        $resultado[] = $filaTP;

        return $resultado;
    }


    public function tablaPorAves($fecha = null)
    {
        $params = [];
        $filtroFecha = "";

        if ($fecha) {
            $filtroFecha = " AND mr.fecha = :fecha ";
            $params[':fecha'] = $fecha;
        }

        $provincias = $this->executeQuery("SELECT codigo, nombre FROM com_provincia ORDER BY nombre");
        $listaProvincias = array_column($provincias, 'nombre');

        $columnas = "";
        foreach ($provincias as $p) {
            $columnas .= "
            SUM(CASE WHEN mr.provincia = {$p['codigo']} THEN mr.numAves ELSE 0 END) AS `{$p['nombre']}`,
        ";
        }

        $columnas .= " SUM(mr.numAves) AS Total ";

        $sql = "
            SELECT 
                mr.tipoEstablecimiento,
                mr.tamanio,
                $columnas
            FROM com_db_mercado_res mr
            WHERE 1=1
            $filtroFecha
            GROUP BY mr.tipoEstablecimiento, mr.tamanio
            ORDER BY 
                FIELD(mr.tipoEstablecimiento, 'Puesto de mercado', 'Tienda y puesto aledaño'),
                FIELD(mr.tamanio, 'Grande', 'Mediano', 'Chico')
        ";

        $filasBase = $this->executeQuery($sql, $params);

        $resultado = [];
        $tiposOrdenados = [];

        // 1) FILA "N° Mercados"
        $filaMercados = [
            "tipo" => "Datos",
            "categoria" => "N° Mercados",
            "tamanio" => null
        ];

        foreach ($provincias as $p) {
            $codigo = $p['codigo'];
            $cantidad = $this->executeQuery(
                "SELECT COUNT(*) AS total FROM com_mercado WHERE provincia = $codigo"
            )[0]['total'] ?? 0;
            $filaMercados[$p['nombre']] = (int)$cantidad;
        }

        $filaMercados["Total"] = array_sum(array_slice($filaMercados, 3));
        $resultado[] = $filaMercados;

        // 2) AGREGAR LAS FILAS BASE Y CALCULAR TOTALES POR TIPO
        foreach ($filasBase as $f) {
            $tipo = $f["tipoEstablecimiento"];

            if (!isset($tiposOrdenados[$tipo])) {
                $tiposOrdenados[$tipo] = [
                    "filas" => [],
                    "total" => [
                        "tipo" => $tipo,
                        "categoria" => $tipo === "Puesto de mercado" ? "Total Puesto de Mercado" : "Total tiendas aledañas",
                        "tamanio" => null
                    ]
                ];
            }

            $fila = [
                "tipo" => $tipo,
                "categoria" => $f["tamanio"],
                "tamanio" => $f["tamanio"]
            ];

            foreach ($listaProvincias as $prov) {
                $fila[$prov] = (int)$f[$prov];
            }
            $fila["Total"] = (int)$f["Total"];

            $tiposOrdenados[$tipo]["filas"][] = $fila;

            foreach ($listaProvincias as $prov) {
                if (!isset($tiposOrdenados[$tipo]["total"][$prov])) {
                    $tiposOrdenados[$tipo]["total"][$prov] = 0;
                }
                $tiposOrdenados[$tipo]["total"][$prov] += (int)$f[$prov];
            }

            if (!isset($tiposOrdenados[$tipo]["total"]["Total"])) {
                $tiposOrdenados[$tipo]["total"]["Total"] = 0;
            }
            $tiposOrdenados[$tipo]["total"]["Total"] += (int)$f["Total"];
        }

        // 3) AGREGAR FILAS EN ORDEN CORRECTO
        foreach ($tiposOrdenados as $tipo => $datos) {
            foreach ($datos["filas"] as $fila) {
                $resultado[] = $fila;
            }
            $resultado[] = $datos["total"];
        }

        // 4) FILA "Total puestos"
        $filaTP = [
            "tipo" => "Total",
            "categoria" => "Total puestos",
            "tamanio" => null
        ];

        foreach ($listaProvincias as $prov) {
            $filaTP[$prov] = 0;
            foreach ($tiposOrdenados as $datos) {
                $filaTP[$prov] += $datos["total"][$prov] ?? 0;
            }
        }

        $filaTP["Total"] = array_sum(array_slice($filaTP, 3));
        $resultado[] = $filaTP;

        return $resultado;
    }

   public function tablaPorMercados($provincia, $fecha = null)
{
    $params = [':provincia' => $provincia];
    $filtroFecha = "";

    if ($fecha) {
        $filtroFecha = " AND det.fecha = :fecha ";
        $params[':fecha'] = $fecha;
    }

    // 1. OBTENER MERCADOS DE LA PROVINCIA
    $sqlMercados = "SELECT codigo, nombre FROM com_mercado WHERE provincia = :provincia ORDER BY nombre";
    $stmt = $this->conn->prepare($sqlMercados);
    $stmt->execute([':provincia' => $provincia]);
    $mercados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$mercados) {
        return [];
    }

    $listaMercados = array_column($mercados, 'nombre');

    // 2. CONSTRUIR COLUMNAS DINÁMICAS
    $columnas = "";
    foreach ($mercados as $m) {
        $nombreSafe = str_replace("'", "''", $m['nombre']);
        $columnas .= "
            SUM(CASE WHEN det.mercado = {$m['codigo']} THEN det.cantidad ELSE 0 END) AS `{$nombreSafe}`,
        ";
    }
    $columnas .= " SUM(det.cantidad) AS Total ";

    // 3. QUERY PRINCIPAL - USAR com_db_mercado_det
    $sql = "
        SELECT 
            det.tipoEstablecimiento,
            det.tamanio,
            $columnas
        FROM com_db_mercado_det det
        INNER JOIN com_mercado m ON m.codigo = det.mercado
        WHERE m.provincia = :provincia
        $filtroFecha
        GROUP BY det.tipoEstablecimiento, det.tamanio
        ORDER BY 
            FIELD(det.tipoEstablecimiento, 'Puesto de mercado', 'Tienda y puesto aledaño'),
            FIELD(det.tamanio, 'Grande', 'Mediano', 'Chico')
    ";

    $stmt2 = $this->conn->prepare($sql);
    $stmt2->execute($params);
    $filasBase = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    $resultado = [];
    $tiposOrdenados = [];

    // 4. FILA "N° Mercados"
    $filaMercados = [
        "tipo" => "Datos",
        "categoria" => "N° Mercados",
        "tamanio" => null
    ];

    foreach ($mercados as $m) {
        $filaMercados[$m['nombre']] = 1;
    }

    $filaMercados["Total"] = count($mercados);
    $resultado[] = $filaMercados;

    // 5. PROCESAR FILAS BASE Y CALCULAR TOTALES POR TIPO
    foreach ($filasBase as $f) {
        $tipo = $f["tipoEstablecimiento"];

        if (!isset($tiposOrdenados[$tipo])) {
            $tiposOrdenados[$tipo] = [
                "filas" => [],
                "total" => [
                    "tipo" => $tipo,
                    "categoria" => $tipo === "Puesto de mercado" ? "Total Puesto de Mercado" : "Total tiendas aledañas",
                    "tamanio" => null
                ]
            ];
        }

        $fila = [
            "tipo" => $tipo,
            "categoria" => $f["tamanio"],
            "tamanio" => $f["tamanio"]
        ];

        foreach ($listaMercados as $merc) {
            $fila[$merc] = (int)($f[$merc] ?? 0);
        }
        $fila["Total"] = (int)($f["Total"] ?? 0);

        $tiposOrdenados[$tipo]["filas"][] = $fila;

        // Sumar a totales
        foreach ($listaMercados as $merc) {
            if (!isset($tiposOrdenados[$tipo]["total"][$merc])) {
                $tiposOrdenados[$tipo]["total"][$merc] = 0;
            }
            $tiposOrdenados[$tipo]["total"][$merc] += (int)($f[$merc] ?? 0);
        }

        if (!isset($tiposOrdenados[$tipo]["total"]["Total"])) {
            $tiposOrdenados[$tipo]["total"]["Total"] = 0;
        }
        $tiposOrdenados[$tipo]["total"]["Total"] += (int)($f["Total"] ?? 0);
    }

    // 6. AGREGAR FILAS EN ORDEN
    foreach ($tiposOrdenados as $tipo => $datos) {
        foreach ($datos["filas"] as $fila) {
            $resultado[] = $fila;
        }
        $resultado[] = $datos["total"];
    }

    // 7. FILA "Total puestos"
    $filaTP = [
        "tipo" => "Total",
        "categoria" => "Total puestos",
        "tamanio" => null
    ];

    foreach ($listaMercados as $merc) {
        $filaTP[$merc] = 0;
        foreach ($tiposOrdenados as $datos) {
            $filaTP[$merc] += $datos["total"][$merc] ?? 0;
        }
    }

    $filaTP["Total"] = array_sum(array_slice($filaTP, 3));
    $resultado[] = $filaTP;

    return $resultado;
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
