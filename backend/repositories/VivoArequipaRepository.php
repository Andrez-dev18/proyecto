<?php
require_once __DIR__ . '/../models/VivoArequipa.php';

class VivoArequipaRepository
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function findAll()
    {
        $query = "SELECT * FROM com_db_vivo_aqp";
        return $this->executeQuery($query);
    }


    public function save($data)
{
    $query = "INSERT INTO com_db_vivo_aqp (
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

    $stmt = $this->conn->prepare($query);

    $params = [
        ':fecha' => $data['fecha'] ?? null,
        ':mercado' => $data['mercado'] ?? null,
        ':empresa' => $data['empresa'] ?? null,
        ':ruc_empr' => $data['ruc_empr'] ?? null,
        ':condicion' => $data['condicion'] ?? null,
        ':proveedor' => $data['proveedor'] ?? null,
        ':ruc_prov' => $data['ruc_prov'] ?? null,
        ':precioMayMin' => $data['precioMayMin'] ?? null,
        ':precioMayMax' => $data['precioMayMax'] ?? null,
        ':precioPubMin' => $data['precioPubMin'] ?? null,
        ':precioPubMax' => $data['precioPubMax'] ?? null,
        ':pesoMachoMin' => $data['pesoMachoMin'] ?? null,
        ':pesoMachoMax' => $data['pesoMachoMax'] ?? null,
        ':pesoHembMin' => $data['pesoHembMin'] ?? null,
        ':pesoHembMax' => $data['pesoHembMax'] ?? null,
        ':colorMin' => $data['colorMin'] ?? null,
        ':colorMax' => $data['colorMax'] ?? null,
        ':pesoMachoPromMin' => $data['pesoMachoPromMin'] ?? null,
        ':pesoMachoPromMax' => $data['pesoMachoPromMax'] ?? null,
        ':pesoHembraPromMin' => $data['pesoHembraPromMin'] ?? null,
        ':pesoHembraPromMax' => $data['pesoHembraPromMax'] ?? null,
        ':cantidad' => $data['cantidad'] ?? null,
        ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
        ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
        ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
        ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null
    ];

    return $stmt->execute($params);
}


    private function executeQuery($query)
    {
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}

?>
