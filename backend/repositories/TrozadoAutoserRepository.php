<?php

class TrozadoAutoserRepository
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
                a.id,
                a.fecha,
                p.nombre AS corte,
                a.precioSuper,
                a.precioPlazaVea,
                a.precioTottus,
                a.precioMetro,
                a.precioTiendaPalomar,
                a.precioTiendaRicoPollo,
                a.precioAvelino,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_trozado_autoser a
            LEFT JOIN com_corte p ON a.corte = p.codigo
            ORDER BY a.fechaHoraRegistro DESC

        ";
        return $this->executeQuery($query);
    }

    public function save($data)
    {
        // Si existe ID, actualizamos
        if (!empty($data['id'])) {
            $query = "
            UPDATE com_db_trozado_autoser SET
                fecha = :fecha,
                corte = :corte,
                precioSuper = :precioSuper,
                precioPlazaVea = :precioPlazaVea,
                precioTottus = :precioTottus,
                precioMetro = :precioMetro,
                precioTiendaPalomar = :precioTiendaPalomar,
                precioTiendaRicoPollo = :precioTiendaRicoPollo,
                precioAvelino = :precioAvelino,
                usuarioRegistro = :usuarioRegistro,
                fechaHoraRegistro = :fechaHoraRegistro,
                usuarioTransferencia = :usuarioTransferencia,
                fechaHoraTransferencia = :fechaHoraTransferencia
            WHERE id = :id
        ";

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':corte' => $data['corte'] ?? null,
                ':precioSuper' => $data['precioSuper'] ?? 0,
                ':precioPlazaVea' => $data['precioPlazaVea'] ?? 0,
                ':precioTottus' => $data['precioTottus'] ?? 0,
                ':precioMetro' => $data['precioMetro'] ?? 0,
                ':precioTiendaPalomar' => $data['precioTiendaPalomar'] ?? 0,
                ':precioTiendaRicoPollo' => $data['precioTiendaRicoPollo'] ?? 0,
                ':precioAvelino' => $data['precioAvelino'] ?? 0,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }
        // Si no tiene ID, insertamos nuevo
        else {
            $query = "
            INSERT INTO com_db_trozado_autoser (
                id,
                fecha,
                corte,
                precioSuper,
                precioPlazaVea,
                precioTottus,
                precioMetro,
                precioTiendaPalomar,
                precioTiendaRicoPollo,
                precioAvelino,
                usuarioRegistro,
                fechaHoraRegistro,
                usuarioTransferencia,
                fechaHoraTransferencia
            ) VALUES (
                :id,
                :fecha,
                :corte,
                :precioSuper,
                :precioPlazaVea,
                :precioTottus,
                :precioMetro,
                :precioTiendaPalomar,
                :precioTiendaRicoPollo,
                :precioAvelino,
                :usuarioRegistro,
                :fechaHoraRegistro,
                :usuarioTransferencia,
                :fechaHoraTransferencia
            )
        ";

            // Generar UUID si no existe
            $data['id'] = $this->generateUuid();

            $stmt = $this->conn->prepare($query);
            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':corte' => $data['corte'] ?? null,
                ':precioSuper' => $data['precioSuper'] ?? 0,
                ':precioPlazaVea' => $data['precioPlazaVea'] ?? 0,
                ':precioTottus' => $data['precioTottus'] ?? 0,
                ':precioMetro' => $data['precioMetro'] ?? 0,
                ':precioTiendaPalomar' => $data['precioTiendaPalomar'] ?? 0,
                ':precioTiendaRicoPollo' => $data['precioTiendaRicoPollo'] ?? 0,
                ':precioAvelino' => $data['precioAvelino'] ?? 0,
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? null,
                ':fechaHoraRegistro' => $data['fechaHoraRegistro'] ?? null,
                ':usuarioTransferencia' => $data['usuarioTransferencia'] ?? null,
                ':fechaHoraTransferencia' => $data['fechaHoraTransferencia'] ?? null,
            ];
        }

        return $stmt->execute($params);
    }


    public function delete($id)
    {
        $query = "DELETE FROM com_db_trozado_autoser WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); // ← devuelve cuántas filas fueron afectadas
    }

    public function findByFilters($fechaInicio = null, $fechaFin = null, $corte = null)
    {
        $query = "
        SELECT
                a.id,
                a.fecha,
                p.nombre AS corte,
                a.precioSuper,
                a.precioPlazaVea,
                a.precioTottus,
                a.precioMetro,
                a.precioTiendaPalomar,
                a.precioTiendaRicoPollo,
                a.precioAvelino,
                a.usuarioRegistro,
                a.fechaHoraRegistro,
                a.usuarioTransferencia,
                a.fechaHoraTransferencia
            FROM com_db_trozado_autoser a
            LEFT JOIN com_corte p ON a.corte = p.codigo
            WHERE 1=1
    ";

        // 🔹 Filtro de rango de fechas
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND a.fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
        } elseif (!empty($fechaInicio)) {
            $query .= " AND a.fecha >= '$fechaInicio'";
        } elseif (!empty($fechaFin)) {
            $query .= " AND a.fecha <= '$fechaFin'";
        }
        if (!empty($corte)) $query .= " AND a.corte = $corte";

        return $this->executeQuery($query);
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
