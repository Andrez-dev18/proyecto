<?php
require_once __DIR__ . '/../models/CapturaPantallaBeneficiado.php';

class CapturaPantallaBeneficiadoRepository
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function findAll()
    {
        $query = "SELECT * FROM com_db_pot_venta_bene ORDER BY id DESC";
        return $this->executeQuery($query);
    }

    public function findArequipaBeneficiado()
    {
        $query = "SELECT * FROM com_db_pot_venta_bene WHERE tipo_proc = 'Arequipa Beneficiado' ORDER BY id DESC";
        return $this->executeQuery($query);
    }

    public function findProvinciaBeneficiado()
    {
        $query = "SELECT * FROM com_db_pot_venta_bene WHERE tipo_proc = 'Provincia Beneficiado' ORDER BY id DESC";
        return $this->executeQuery($query);
    }

    public function findById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM com_db_pot_venta_bene WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        $query = "INSERT INTO com_db_pot_venta_bene (
            tipo_proc, ano, mes, provincia, zona, compra_grs, tipo_cliente, nombre,
            grs, rp, grs_vivo, santa_elena, granjas_chicas, rosario, sanfern_lima, avicola_renzo,
            avelino, peladores, avicruz, rafael, matilde, avirox, julia, simon, yesica,
            gabriel, arturo, nicolas, luis_f, mirella, otros,
            potencial_minimo, potencial_maximo, condicion_ptmin, condicion_ptmax, observaciones
        ) VALUES (
            :tipo_proc, :ano, :mes, :provincia, :zona, :compra_grs, :tipo_cliente, :nombre,
            :grs, :rp, :grs_vivo, :santa_elena, :granjas_chicas, :rosario, :sanfern_lima, :avicola_renzo,
            :avelino, :peladores, :avicruz, :rafael, :matilde, :avirox, :julia, :simon, :yesica,
            :gabriel, :arturo, :nicolas, :luis_f, :mirella, :otros,
            :potencial_minimo, :potencial_maximo, :condicion_ptmin, :condicion_ptmax, :observaciones
        )";

        $stmt = $this->conn->prepare($query);

        $params = [
            ':tipo_proc' => $data['tipo_proc'] ?? null,
            ':ano' => $data['ano'] ?? null,
            ':mes' => $data['mes'] ?? null,
            ':provincia' => $data['provincia'] ?? null,
            ':zona' => $data['zona'] ?? null,
            ':compra_grs' => $data['compraGrs'] ?? null,
            ':tipo_cliente' => $data['tipoCliente'] ?? null,
            ':nombre' => $data['nombre'] ?? null,
            ':grs' => $data['grs'] ?? 0,
            ':rp' => $data['rp'] ?? 0,
            ':grs_vivo' => $data['grs_vivo'] ?? 0,
            ':santa_elena' => $data['santa_elena'] ?? 0,
            ':granjas_chicas' => $data['granjas_chicas'] ?? 0,
            ':rosario' => $data['rosario'] ?? 0,
            ':sanfern_lima' => $data['sanfern_lima'] ?? 0,
            ':avicola_renzo' => $data['avicola_renzo'] ?? 0,
            ':avelino' => $data['avelino'] ?? 0,
            ':peladores' => $data['peladores'] ?? 0,
            ':avicruz' => $data['avicruz'] ?? 0,
            ':rafael' => $data['rafael'] ?? 0,
            ':matilde' => $data['matilde'] ?? 0,
            ':avirox' => $data['avirox'] ?? 0,
            ':julia' => $data['julia'] ?? 0,
            ':simon' => $data['simon'] ?? 0,
            ':yesica' => $data['yesica'] ?? 0,
            ':gabriel' => $data['gabriel'] ?? 0,
            ':arturo' => $data['arturo'] ?? 0,
            ':nicolas' => $data['nicolas'] ?? 0,
            ':luis_f' => $data['luis_f'] ?? 0,
            ':mirella' => $data['mirella'] ?? 0,
            ':otros' => $data['otros'] ?? 0,
            ':potencial_minimo' => $data['potencialMinimo'] ?? 0,
            ':potencial_maximo' => $data['potencialMaximo'] ?? 0,
            ':condicion_ptmin' => $data['condicionPtmin'] ?? null,
            ':condicion_ptmax' => $data['condicionPtmax'] ?? null,
            ':observaciones' => $data['observaciones'] ?? null
        ];

        return $stmt->execute($params);
    }

    public function update(array $data)
    {
        $sql = "UPDATE com_db_pot_venta_bene SET
            tipo_proc = :tipo_proc,
            ano = :ano,
            mes = :mes,
            provincia = :provincia,
            zona = :zona,
            compra_grs = :compra_grs,
            tipo_cliente = :tipo_cliente,
            nombre = :nombre,
            grs = :grs,
            rp = :rp,
            grs_vivo = :grs_vivo,
            santa_elena = :santa_elena,
            granjas_chicas = :granjas_chicas,
            rosario = :rosario,
            sanfern_lima = :sanfern_lima,
            avicola_renzo = :avicola_renzo,
            avelino = :avelino,
            peladores = :peladores,
            avicruz = :avicruz,
            rafael = :rafael,
            matilde = :matilde,
            avirox = :avirox,
            julia = :julia,
            simon = :simon,
            yesica = :yesica,
            gabriel = :gabriel,
            arturo = :arturo,
            nicolas = :nicolas,
            luis_f = :luis_f,
            mirella = :mirella,
            otros = :otros,
            potencial_minimo = :potencial_minimo,
            potencial_maximo = :potencial_maximo,
            condicion_ptmin = :condicion_ptmin,
            condicion_ptmax = :condicion_ptmax,
            observaciones = :observaciones
            WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $params = [
            ':tipo_proc' => $data['tipo_proc'] ?? null,
            ':ano' => $data['ano'] ?? null,
            ':mes' => $data['mes'] ?? null,
            ':provincia' => $data['provincia'] ?? null,
            ':zona' => $data['zona'] ?? null,
            ':compra_grs' => $data['compraGrs'] ?? null,
            ':tipo_cliente' => $data['tipoCliente'] ?? null,
            ':nombre' => $data['nombre'] ?? null,
            ':grs' => $data['grs'] ?? 0,
            ':rp' => $data['rp'] ?? 0,
            ':grs_vivo' => $data['grs_vivo'] ?? 0,
            ':santa_elena' => $data['santa_elena'] ?? 0,
            ':granjas_chicas' => $data['granjas_chicas'] ?? 0,
            ':rosario' => $data['rosario'] ?? 0,
            ':sanfern_lima' => $data['sanfern_lima'] ?? 0,
            ':avicola_renzo' => $data['avicola_renzo'] ?? 0,
            ':avelino' => $data['avelino'] ?? 0,
            ':peladores' => $data['peladores'] ?? 0,
            ':avicruz' => $data['avicruz'] ?? 0,
            ':rafael' => $data['rafael'] ?? 0,
            ':matilde' => $data['matilde'] ?? 0,
            ':avirox' => $data['avirox'] ?? 0,
            ':julia' => $data['julia'] ?? 0,
            ':simon' => $data['simon'] ?? 0,
            ':yesica' => $data['yesica'] ?? 0,
            ':gabriel' => $data['gabriel'] ?? 0,
            ':arturo' => $data['arturo'] ?? 0,
            ':nicolas' => $data['nicolas'] ?? 0,
            ':luis_f' => $data['luis_f'] ?? 0,
            ':mirella' => $data['mirella'] ?? 0,
            ':otros' => $data['otros'] ?? 0,
            ':potencial_minimo' => $data['potencialMinimo'] ?? 0,
            ':potencial_maximo' => $data['potencialMaximo'] ?? 0,
            ':condicion_ptmin' => $data['condicionPtmin'] ?? null,
            ':condicion_ptmax' => $data['condicionPtmax'] ?? null,
            ':observaciones' => $data['observaciones'] ?? null,
            ':id' => $data['id']
        ];

        return $stmt->execute($params);
    }

    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM com_db_pot_venta_bene WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function executeQuery($query)
    {
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function filtrarArequipa($ano = null, $mes = null, $provincia = null, $zona = null, $tipo_cliente = null)
    {
        $query = "SELECT * FROM com_db_pot_venta_bene WHERE tipo_proc = 'Arequipa Beneficiado'";
        $params = [];

        if (!empty($ano)) {
            $query .= " AND ano = :ano";
            $params[':ano'] = $ano;
        }
        if (!empty($mes)) {
            $query .= " AND mes = :mes";
            $params[':mes'] = $mes;
        }
        if (!empty($provincia)) {
            $query .= " AND provincia = :provincia";
            $params[':provincia'] = $provincia;
        }
        if (!empty($zona)) {
            $query .= " AND zona = :zona";
            $params[':zona'] = $zona;
        }
        if (!empty($tipo_cliente)) {
            $query .= " AND tipo_cliente = :tipo_cliente";
            $params[':tipo_cliente'] = $tipo_cliente;
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function filtrarProvincia($ano = null, $mes = null, $provincia = null, $zona = null, $tipo_cliente = null)
    {
        $query = "SELECT * FROM com_db_pot_venta_bene WHERE tipo_proc = 'Provincia Beneficiado'";
        $params = [];

        if (!empty($ano)) {
            $query .= " AND ano = :ano";
            $params[':ano'] = $ano;
        }
        if (!empty($mes)) {
            $query .= " AND mes = :mes";
            $params[':mes'] = $mes;
        }
        if (!empty($provincia)) {
            $query .= " AND provincia = :provincia";
            $params[':provincia'] = $provincia;
        }
        if (!empty($zona)) {
            $query .= " AND zona = :zona";
            $params[':zona'] = $zona;
        }
        if (!empty($tipo_cliente)) {
            $query .= " AND tipo_cliente = :tipo_cliente";
            $params[':tipo_cliente'] = $tipo_cliente;
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
