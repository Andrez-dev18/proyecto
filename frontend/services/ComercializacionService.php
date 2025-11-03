<?php

class ComercializacionService {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    // ========== VIVO AREQUIPA ==========
    
    public function getAllVivoAqp() {
        $sql = "SELECT * FROM com_db_vivo_aqp ORDER BY fecha DESC, id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function filtrarVivoAqp($fecha = null, $mercado = null, $proveedor = null, $condicion = null) {
        $sql = "SELECT * FROM com_db_vivo_aqp WHERE 1=1";
        $params = [];
        
        if ($fecha !== null && $fecha !== '') {
            $sql .= " AND fecha = :fecha";
            $params[':fecha'] = $fecha;
        }
        if ($mercado !== null && $mercado !== '') {
            $sql .= " AND mercado = :mercado";
            $params[':mercado'] = $mercado;
        }
        if ($proveedor !== null && $proveedor !== '') {
            $sql .= " AND proveedor = :proveedor";
            $params[':proveedor'] = $proveedor;
        }
        if ($condicion !== null && $condicion !== '') {
            $sql .= " AND condicion = :condicion";
            $params[':condicion'] = $condicion;
        }
        
        $sql .= " ORDER BY fecha DESC, id DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getByIdVivoAqp($id) {
        $sql = "SELECT * FROM com_db_vivo_aqp WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function saveVivoAqp($data) {
        $sql = "INSERT INTO com_db_vivo_aqp (
            fecha, mercado, empresa, ruc_empr, condicion, proveedor, ruc_prov,
            precioMayMin, precioMayMax, precioPubMin, precioPubMax,
            pesoMachoMin, pesoMachoMax, pesoHembMin, pesoHembMax,
            colorMin, colorMax, pesoMachoPromMin, pesoMachoPromMax,
            pesoHembraPromMin, pesoHembraPromMax, cantidad,
            usuarioRegistro, fechaHoraRegistro, usuarioTransferencia, fechaHoraTransferencia
        ) VALUES (
            :fecha, :mercado, :empresa, :ruc_empr, :condicion, :proveedor, :ruc_prov,
            :precioMayMin, :precioMayMax, :precioPubMin, :precioPubMax,
            :pesoMachoMin, :pesoMachoMax, :pesoHembMin, :pesoHembMax,
            :colorMin, :colorMax, :pesoMachoPromMin, :pesoMachoPromMax,
            :pesoHembraPromMin, :pesoHembraPromMax, :cantidad,
            :usuarioRegistro, :fechaHoraRegistro, :usuarioTransferencia, :fechaHoraTransferencia
        )";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':fecha' => $data['fecha'],
            ':mercado' => $data['mercado'],
            ':empresa' => $data['empresa'],
            ':ruc_empr' => $data['ruc_empr'],
            ':condicion' => $data['condicion'],
            ':proveedor' => $data['proveedor'],
            ':ruc_prov' => $data['ruc_prov'],
            ':precioMayMin' => $data['precioMayMin'],
            ':precioMayMax' => $data['precioMayMax'],
            ':precioPubMin' => $data['precioPubMin'],
            ':precioPubMax' => $data['precioPubMax'],
            ':pesoMachoMin' => $data['pesoMachoMin'],
            ':pesoMachoMax' => $data['pesoMachoMax'],
            ':pesoHembMin' => $data['pesoHembMin'],
            ':pesoHembMax' => $data['pesoHembMax'],
            ':colorMin' => $data['colorMin'],
            ':colorMax' => $data['colorMax'],
            ':pesoMachoPromMin' => $data['pesoMachoPromMin'],
            ':pesoMachoPromMax' => $data['pesoMachoPromMax'],
            ':pesoHembraPromMin' => $data['pesoHembraPromMin'],
            ':pesoHembraPromMax' => $data['pesoHembraPromMax'],
            ':cantidad' => $data['cantidad'],
            ':usuarioRegistro' => $data['usuarioRegistro'],
            ':fechaHoraRegistro' => $data['fechaHoraRegistro'],
            ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
            ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
        ]);
    }
    
    public function updateVivoAqp($data) {
        $sql = "UPDATE com_db_vivo_aqp SET
            fecha = :fecha, mercado = :mercado, empresa = :empresa, ruc_empr = :ruc_empr,
            condicion = :condicion, proveedor = :proveedor, ruc_prov = :ruc_prov,
            precioMayMin = :precioMayMin, precioMayMax = :precioMayMax,
            precioPubMin = :precioPubMin, precioPubMax = :precioPubMax,
            pesoMachoMin = :pesoMachoMin, pesoMachoMax = :pesoMachoMax,
            pesoHembMin = :pesoHembMin, pesoHembMax = :pesoHembMax,
            colorMin = :colorMin, colorMax = :colorMax,
            pesoMachoPromMin = :pesoMachoPromMin, pesoMachoPromMax = :pesoMachoPromMax,
            pesoHembraPromMin = :pesoHembraPromMin, pesoHembraPromMax = :pesoHembraPromMax,
            cantidad = :cantidad,
            usuarioTransferencia = :usuarioTransferencia, 
            fechaHoraTransferencia = :fechaHoraTransferencia
        WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id' => $data['id'],
            ':fecha' => $data['fecha'],
            ':mercado' => $data['mercado'],
            ':empresa' => $data['empresa'],
            ':ruc_empr' => $data['ruc_empr'],
            ':condicion' => $data['condicion'],
            ':proveedor' => $data['proveedor'],
            ':ruc_prov' => $data['ruc_prov'],
            ':precioMayMin' => $data['precioMayMin'],
            ':precioMayMax' => $data['precioMayMax'],
            ':precioPubMin' => $data['precioPubMin'],
            ':precioPubMax' => $data['precioPubMax'],
            ':pesoMachoMin' => $data['pesoMachoMin'],
            ':pesoMachoMax' => $data['pesoMachoMax'],
            ':pesoHembMin' => $data['pesoHembMin'],
            ':pesoHembMax' => $data['pesoHembMax'],
            ':colorMin' => $data['colorMin'],
            ':colorMax' => $data['colorMax'],
            ':pesoMachoPromMin' => $data['pesoMachoPromMin'],
            ':pesoMachoPromMax' => $data['pesoMachoPromMax'],
            ':pesoHembraPromMin' => $data['pesoHembraPromMin'],
            ':pesoHembraPromMax' => $data['pesoHembraPromMax'],
            ':cantidad' => $data['cantidad'],
            ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
            ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
        ]);
    }
    
    public function deleteVivoAqp($id) {
        $sql = "DELETE FROM com_db_vivo_aqp WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
    
    // ========== VIVO PROVINCIA ==========
    
    public function getAllVivoProvincia() {
        $sql = "SELECT * FROM com_db_vivo_provincia ORDER BY fecha DESC, id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function filtrarVivoProvincia($fecha = null, $provincia = null, $proveedor = null, $tipo = null) {
        $sql = "SELECT * FROM com_db_vivo_provincia WHERE 1=1";
        $params = [];
        
        if ($fecha !== null && $fecha !== '') {
            $sql .= " AND fecha = :fecha";
            $params[':fecha'] = $fecha;
        }
        if ($provincia !== null && $provincia !== '') {
            $sql .= " AND provincia = :provincia";
            $params[':provincia'] = $provincia;
        }
        if ($proveedor !== null && $proveedor !== '') {
            $sql .= " AND proveedor = :proveedor";
            $params[':proveedor'] = $proveedor;
        }
        if ($tipo !== null && $tipo !== '') {
            $sql .= " AND tipo = :tipo";
            $params[':tipo'] = $tipo;
        }
        
        $sql .= " ORDER BY fecha DESC, id DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getByIdVivoProvincia($id) {
        $sql = "SELECT * FROM com_db_vivo_provincia WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function saveVivoProvincia($data) {
        $sql = "INSERT INTO com_db_vivo_provincia (
            fecha, provincia, proveedor, ruc_prov, tipo,
            precioMayCarMin, precioMayCarMax, precioMayBraMin, precioMayBraMax,
            precioPubMin, precioPubMax,
            pesoMachoPromMin, pesoMachoPromMax, pesoHembraPromMin, pesoHembraPromMax,
            pesoBrasaPromMin, pesoBrasaPromMax,
            colorMin, colorMax, cantidad,
            usuarioRegistro, fechaHoraRegistro, usuarioTransferencia, fechaHoraTransferencia
        ) VALUES (
            :fecha, :provincia, :proveedor, :ruc_prov, :tipo,
            :precioMayCarMin, :precioMayCarMax, :precioMayBraMin, :precioMayBraMax,
            :precioPubMin, :precioPubMax,
            :pesoMachoPromMin, :pesoMachoPromMax, :pesoHembraPromMin, :pesoHembraPromMax,
            :pesoBrasaPromMin, :pesoBrasaPromMax,
            :colorMin, :colorMax, :cantidad,
            :usuarioRegistro, :fechaHoraRegistro, :usuarioTransferencia, :fechaHoraTransferencia
        )";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':fecha' => $data['fecha'],
            ':provincia' => $data['provincia'],
            ':proveedor' => $data['proveedor'],
            ':ruc_prov' => $data['ruc_prov'],
            ':tipo' => $data['tipo'],
            ':precioMayCarMin' => $data['precioMayCarMin'] ?? null,
            ':precioMayCarMax' => $data['precioMayCarMax'] ?? null,
            ':precioMayBraMin' => $data['precioMayBraMin'] ?? null,
            ':precioMayBraMax' => $data['precioMayBraMax'] ?? null,
            ':precioPubMin' => $data['precioPubMin'] ?? null,
            ':precioPubMax' => $data['precioPubMax'] ?? null,
            ':pesoMachoPromMin' => $data['pesoMachoPromMin'] ?? null,
            ':pesoMachoPromMax' => $data['pesoMachoPromMax'] ?? null,
            ':pesoHembraPromMin' => $data['pesoHembraPromMin'] ?? null,
            ':pesoHembraPromMax' => $data['pesoHembraPromMax'] ?? null,
            ':pesoBrasaPromMin' => $data['pesoBrasaPromMin'] ?? null,
            ':pesoBrasaPromMax' => $data['pesoBrasaPromMax'] ?? null,
            ':colorMin' => $data['colorMin'] ?? null,
            ':colorMax' => $data['colorMax'] ?? null,
            ':cantidad' => $data['cantidad'],
            ':usuarioRegistro' => $data['usuarioRegistro'],
            ':fechaHoraRegistro' => $data['fechaHoraRegistro'],
            ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
            ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
        ]);
    }
    
    public function updateVivoProvincia($data) {
        $sql = "UPDATE com_db_vivo_provincia SET
            fecha = :fecha, provincia = :provincia, proveedor = :proveedor, 
            ruc_prov = :ruc_prov, tipo = :tipo,
            precioMayCarMin = :precioMayCarMin, precioMayCarMax = :precioMayCarMax,
            precioMayBraMin = :precioMayBraMin, precioMayBraMax = :precioMayBraMax,
            precioPubMin = :precioPubMin, precioPubMax = :precioPubMax,
            pesoMachoPromMin = :pesoMachoPromMin, pesoMachoPromMax = :pesoMachoPromMax,
            pesoHembraPromMin = :pesoHembraPromMin, pesoHembraPromMax = :pesoHembraPromMax,
            pesoBrasaPromMin = :pesoBrasaPromMin, pesoBrasaPromMax = :pesoBrasaPromMax,
            colorMin = :colorMin, colorMax = :colorMax, cantidad = :cantidad,
            usuarioTransferencia = :usuarioTransferencia, 
            fechaHoraTransferencia = :fechaHoraTransferencia
        WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id' => $data['id'],
            ':fecha' => $data['fecha'],
            ':provincia' => $data['provincia'],
            ':proveedor' => $data['proveedor'],
            ':ruc_prov' => $data['ruc_prov'],
            ':tipo' => $data['tipo'],
            ':precioMayCarMin' => $data['precioMayCarMin'] ?? null,
            ':precioMayCarMax' => $data['precioMayCarMax'] ?? null,
            ':precioMayBraMin' => $data['precioMayBraMin'] ?? null,
            ':precioMayBraMax' => $data['precioMayBraMax'] ?? null,
            ':precioPubMin' => $data['precioPubMin'] ?? null,
            ':precioPubMax' => $data['precioPubMax'] ?? null,
            ':pesoMachoPromMin' => $data['pesoMachoPromMin'] ?? null,
            ':pesoMachoPromMax' => $data['pesoMachoPromMax'] ?? null,
            ':pesoHembraPromMin' => $data['pesoHembraPromMin'] ?? null,
            ':pesoHembraPromMax' => $data['pesoHembraPromMax'] ?? null,
            ':pesoBrasaPromMin' => $data['pesoBrasaPromMin'] ?? null,
            ':pesoBrasaPromMax' => $data['pesoBrasaPromMax'] ?? null,
            ':colorMin' => $data['colorMin'] ?? null,
            ':colorMax' => $data['colorMax'] ?? null,
            ':cantidad' => $data['cantidad'],
            ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
            ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
        ]);
    }
    
    public function deleteVivoProvincia($id) {
        $sql = "DELETE FROM com_db_vivo_provincia WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
    
    // ========== DATOS PARA SELECTS ==========
    
    public function getEmpresas() {
        $sql = "SELECT codigo, nombre FROM com_empresa ORDER BY nombre";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getMercados() {
        $sql = "SELECT codigo, nombre FROM com_mercado ORDER BY nombre";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getProveedores() {
        $sql = "SELECT codigo, nombre FROM com_proveedor ORDER BY nombre";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getProvincias() {
        $sql = "SELECT codigo, nombre FROM com_provincia ORDER BY nombre";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getCondiciones() {
        $sql = "SELECT codigo, nombre FROM com_condicion ORDER BY nombre";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getTipos() {
        $sql = "SELECT codigo, nombre FROM com_tipo ORDER BY nombre";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
