<?php

class DetalleAreaRepository
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll()
{
    $sql = "SELECT 
                d.id,
                d.fecha,
                d.provincia AS provincia_codigo,
                p.nombre AS provincia,
                d.area,
                d.id AS cod_mot,
                d.motivo,
                d.usuarioReporte,
                d.fechaHoraRegistro
            FROM com_db_detalle_area d
            LEFT JOIN com_provincia p ON d.provincia = p.codigo
            ORDER BY d.fecha DESC, d.id DESC";
    
    $stmt = $this->conn->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
    
public function findById($id)
{
    $query = "SELECT 
                d.id,
                d.fecha,
                d.provincia AS provincia_codigo,
                p.nombre AS provincia,
                d.area,
                d.id AS cod_mot,
                d.motivo,
                d.usuarioReporte,
                d.fechaHoraRegistro
            FROM com_db_detalle_area d
            LEFT JOIN com_provincia p ON d.provincia = p.codigo
            WHERE d.id = ?";
    
    $stmt = $this->conn->prepare($query);
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

    public function save($data)
    {
        if (!empty($data['id'])) {
            // ACTUALIZAR
            $query = "UPDATE com_db_detalle_area SET
                        fecha = :fecha,
                        provincia = :provincia,
                        area = :area,
                        motivo = :motivo,
                        usuarioReporte = :usuarioReporte
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':area' => $data['area'] ?? null,
                ':motivo' => $data['motivo'] ?? null,
                ':usuarioReporte' => $data['usuarioReporte'] ?? null
            ];
            
            $stmt->execute($params);
            return $data['id'];
        } else {
            // CREAR NUEVO
            $query = "INSERT INTO com_db_detalle_area (
                        fecha,
                        provincia,
                        area,
                        motivo,
                        usuarioReporte
                    ) VALUES (
                        :fecha,
                        :provincia,
                        :area,
                        :motivo,
                        :usuarioReporte
                    )";

            $stmt = $this->conn->prepare($query);
            $params = [
                ':fecha' => $data['fecha'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':area' => $data['area'] ?? null,
                ':motivo' => $data['motivo'] ?? null,
                ':usuarioReporte' => $data['usuarioReporte'] ?? null
            ];
            
            $stmt->execute($params);
            return $this->conn->lastInsertId();
        }
    }

    public function delete($id)
    {
        $query = "DELETE FROM com_db_detalle_area WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount();
    }

    
public function findByFilters($fechaInicio = null, $fechaFin = null, $provincia = null, $area = null)
{
    $query = "SELECT
                d.id,
                d.id AS cod_mot,
                d.fecha,
                d.provincia AS provincia_codigo,
                p.nombre AS provincia,
                d.area,
                d.motivo,
                d.usuarioReporte,
                d.fechaHoraRegistro
            FROM com_db_detalle_area d
            LEFT JOIN com_provincia p ON d.provincia = p.codigo
            WHERE 1=1";

    $params = [];

    if (!empty($fechaInicio) && !empty($fechaFin)) {
        $query .= " AND d.fecha BETWEEN ? AND ?";
        $params[] = $fechaInicio;
        $params[] = $fechaFin;
    } elseif (!empty($fechaInicio)) {
        $query .= " AND d.fecha >= ?";
        $params[] = $fechaInicio;
    } elseif (!empty($fechaFin)) {
        $query .= " AND d.fecha <= ?";
        $params[] = $fechaFin;
    }
    
    if (!empty($provincia)) {
        $query .= " AND d.provincia = ?";
        $params[] = $provincia;
    }
    
    if (!empty($area)) {
        $query .= " AND d.area = ?";
        $params[] = $area;
    }

    $query .= " ORDER BY d.fechaHoraRegistro DESC";

    $stmt = $this->conn->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

}

