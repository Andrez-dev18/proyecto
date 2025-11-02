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
<<<<<<< HEAD
        $query = "SELECT * FROM com_db_vivo_aqp";
=======
        $query = "
        SELECT
            a.id,
            a.fecha,
            m.nombre AS mercado,
            e.nombre AS empresa,
            e.ruc AS ruc_empresa,
            c.nombre AS condicion,
            pr.nombre AS proveedor,
            pr.ruc AS ruc_proveedor,
            a.precioMayMin,
            a.precioMayMax,
            a.precioPubMin,
            a.precioPubMax,
            a.pesoMachoMin,
            a.pesoMachoMax,
            a.pesoHembMin,
            a.pesoHembMax,
            a.colorMin,
            a.colorMax,
            a.pesoMachoPromMin,
            a.pesoMachoPromMax,
            a.pesoHembraPromMin,
            a.pesoHembraPromMax,
            a.cantidad,
            a.usuarioRegistro,
            a.fechaHoraRegistro,
            a.usuarioTransferencia,
            a.fechaHoraTransferencia
        FROM com_db_vivo_aqp a
        LEFT JOIN com_mercado m ON a.mercado = m.codigo
        LEFT JOIN com_empresa e ON a.empresa = e.codigo
        LEFT JOIN com_condicion c ON a.condicion = c.codigo
        LEFT JOIN com_proveedor pr ON a.proveedor = pr.codigo
    ";
>>>>>>> 666f841b1b2dd8a35caa2caf0c1d75526fefc10a
        return $this->executeQuery($query);
    }


    public function save($data)
<<<<<<< HEAD
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
=======
    {
        $query = "
        INSERT INTO com_db_vivo_aqp (
            fecha,
            mercado,
            empresa,
            condicion,
            proveedor,
            precioMayMin,
            precioMayMax,
            precioPubMin,
            precioPubMax,
            pesoMachoMin,
            pesoMachoMax,
            pesoHembMin,
            pesoHembMax,
            colorMin,
            colorMax,
            pesoMachoPromMin,
            pesoMachoPromMax,
            pesoHembraPromMin,
            pesoHembraPromMax,
            cantidad,
            usuarioRegistro,
            fechaHoraRegistro,
            usuarioTransferencia,
            fechaHoraTransferencia
        ) VALUES (
            :fecha,
            :mercado,
            :empresa,
            :condicion,
            :proveedor,
            :precioMayMin,
            :precioMayMax,
            :precioPubMin,
            :precioPubMax,
            :pesoMachoMin,
            :pesoMachoMax,
            :pesoHembMin,
            :pesoHembMax,
            :colorMin,
            :colorMax,
            :pesoMachoPromMin,
            :pesoMachoPromMax,
            :pesoHembraPromMin,
            :pesoHembraPromMax,
            :cantidad,
            :usuarioRegistro,
            :fechaHoraRegistro,
            :usuarioTransferencia,
            :fechaHoraTransferencia
        )
    ";
>>>>>>> 666f841b1b2dd8a35caa2caf0c1d75526fefc10a

    $stmt = $this->conn->prepare($query);

    $params = [
        ':fecha' => $data['fecha'] ?? null,
<<<<<<< HEAD
        ':mercado' => $data['mercado'] ?? null,
        ':empresa' => $data['empresa'] ?? null,
        ':ruc_empr' => $data['ruc_empr'] ?? null,
        ':condicion' => $data['condicion'] ?? null,
        ':proveedor' => $data['proveedor'] ?? null,
        ':ruc_prov' => $data['ruc_prov'] ?? null,
=======
        ':mercado' => $data['mercado'] ?? null, // ID numérico
        ':empresa' => $data['empresa'] ?? null, // ID numérico
        ':condicion' => $data['condicion'] ?? null, // ID numérico
        ':proveedor' => $data['proveedor'] ?? null, // ID numérico
>>>>>>> 666f841b1b2dd8a35caa2caf0c1d75526fefc10a
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
<<<<<<< HEAD
}
=======
    }
>>>>>>> 666f841b1b2dd8a35caa2caf0c1d75526fefc10a


    private function executeQuery($query)
    {
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
<<<<<<< HEAD

}

?>
=======
}
>>>>>>> 666f841b1b2dd8a35caa2caf0c1d75526fefc10a
