<?php

class OficialGRSRepository
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
                ccod_cli,
                ccod_cli_comp,
                crazn_soci,
                cdesc_giro,
                cdireccion,
                cnom_ubige,
                provincia,
                cnom_departamento,
                dfec_alta,
                ccod_ruta,
                ccod_vend,
                cnom_vend,
                ccod_fuerz,
                ccod_prod_distribuidor,
                cnom_prod,
                cnom_categ,
                cnom_lin,
                cnom_subli,
                ncant,
                npeso,
                peso_final,
                impte_igv,
                impte_base,
                cruc_cli,
                cdni_cli,
                ccod_movil,
                cdesc_movi,
                cdesc_cana,
                cdia_visit,
                frec,
                id_prov,
                dap,
                ccod_prod_sf,
                cnom_prod_sf,
                categoria_sf,
                familia_sf,
                subfamilia_sf,
                cond,
                nom_db,
                usuarioRegistro,
                fechaHoraRegistro
            FROM com_db_oficial_grs
            ORDER BY fecha DESC, id DESC
    ";

        return $this->executeQuery($query);
    }


    public function save($data)
    {
        // -------------------------------------------------
        // 🔄 SI TIENE ID → ACTUALIZAR
        // -------------------------------------------------
        if (!empty($data['id'])) {

            $query = "
        UPDATE com_db_oficial_grs SET
            fecha = :fecha,
            ccod_cli = :ccod_cli,
            ccod_cli_comp = :ccod_cli_comp,
            crazn_soci = :crazn_soci,
            cdesc_giro = :cdesc_giro,
            cdireccion = :cdireccion,
            cnom_ubige = :cnom_ubige,
            provincia = :provincia,
            cnom_departamento = :cnom_departamento,
            dfec_alta = :dfec_alta,
            ccod_ruta = :ccod_ruta,
            ccod_vend = :ccod_vend,
            cnom_vend = :cnom_vend,
            ccod_fuerz = :ccod_fuerz,
            ccod_prod_distribuidor = :ccod_prod_distribuidor,
            cnom_prod = :cnom_prod,
            cnom_categ = :cnom_categ,
            cnom_lin = :cnom_lin,
            cnom_subli = :cnom_subli,
            ncant = :ncant,
            npeso = :npeso,
            peso_final = :peso_final,
            impte_igv = :impte_igv,
            impte_base = :impte_base,
            cruc_cli = :cruc_cli,
            cdni_cli = :cdni_cli,
            ccod_movil = :ccod_movil,
            cdesc_movi = :cdesc_movi,
            cdesc_cana = :cdesc_cana,
            cdia_visit = :cdia_visit,
            frec = :frec,
            id_prov = :id_prov,
            dap = :dap,
            ccod_prod_sf = :ccod_prod_sf,
            cnom_prod_sf = :cnom_prod_sf,
            categoria_sf = :categoria_sf,
            familia_sf = :familia_sf,
            subfamilia_sf = :subfamilia_sf,
            cond = :cond
        WHERE id = :id
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':id' => $data['id'],
                ':fecha' => $data['fecha'] ?? null,
                ':ccod_cli' => $data['ccod_cli'] ?? null,
                ':ccod_cli_comp' => $data['ccod_cli_comp'] ?? null,
                ':crazn_soci' => $data['crazn_soci'] ?? null,
                ':cdesc_giro' => $data['cdesc_giro'] ?? null,
                ':cdireccion' => $data['cdireccion'] ?? null,
                ':cnom_ubige' => $data['cnom_ubige'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':cnom_departamento' => $data['cnom_departamento'] ?? null,
                ':dfec_alta' => $data['dfec_alta'] ?? null,
                ':ccod_ruta' => $data['ccod_ruta'] ?? null,
                ':ccod_vend' => $data['ccod_vend'] ?? null,
                ':cnom_vend' => $data['cnom_vend'] ?? null,
                ':ccod_fuerz' => $data['ccod_fuerz'] ?? null,
                ':ccod_prod_distribuidor' => $data['ccod_prod_distribuidor'] ?? null,
                ':cnom_prod' => $data['cnom_prod'] ?? null,
                ':cnom_categ' => $data['cnom_categ'] ?? null,
                ':cnom_lin' => $data['cnom_lin'] ?? null,
                ':cnom_subli' => $data['cnom_subli'] ?? null,
                ':ncant' => $data['ncant'] ?? 0,
                ':npeso' => $data['npeso'] ?? 0,
                ':peso_final' => $data['peso_final'] ?? 0,
                ':impte_igv' => $data['impte_igv'] ?? 0,
                ':impte_base' => $data['impte_base'] ?? 0,
                ':cruc_cli' => $data['cruc_cli'] ?? null,
                ':cdni_cli' => $data['cdni_cli'] ?? null,
                ':ccod_movil' => $data['ccod_movil'] ?? null,
                ':cdesc_movi' => $data['cdesc_movi'] ?? null,
                ':cdesc_cana' => $data['cdesc_cana'] ?? null,
                ':cdia_visit' => $data['cdia_visit'] ?? null,
                ':frec' => $data['frec'] ?? null,
                ':id_prov' => $data['id_prov'] ?? null,
                ':dap' => $data['dap'] ?? null,
                ':ccod_prod_sf' => $data['ccod_prod_sf'] ?? null,
                ':cnom_prod_sf' => $data['cnom_prod_sf'] ?? null,
                ':categoria_sf' => $data['categoria_sf'] ?? null,
                ':familia_sf' => $data['familia_sf'] ?? null,
                ':subfamilia_sf' => $data['subfamilia_sf'] ?? null,
                ':cond' => $data['cond'] ?? null
            ];
        }

        // -------------------------------------------------
        // ➕ SI NO TIENE ID → INSERTAR
        // -------------------------------------------------
        else {

            $query = "
        INSERT INTO com_db_oficial_grs (
            fecha,
            ccod_cli,
            ccod_cli_comp,
            crazn_soci,
            cdesc_giro,
            cdireccion,
            cnom_ubige,
            provincia,
            cnom_departamento,
            dfec_alta,
            ccod_ruta,
            ccod_vend,
            cnom_vend,
            ccod_fuerz,
            ccod_prod_distribuidor,
            cnom_prod,
            cnom_categ,
            cnom_lin,
            cnom_subli,
            ncant,
            npeso,
            peso_final,
            impte_igv,
            impte_base,
            cruc_cli,
            cdni_cli,
            ccod_movil,
            cdesc_movi,
            cdesc_cana,
            cdia_visit,
            frec,
            id_prov,
            dap,
            ccod_prod_sf,
            cnom_prod_sf,
            categoria_sf,
            familia_sf,
            subfamilia_sf,
            cond,
            nom_db,
            usuarioRegistro,
            fechaHoraRegistro
        ) VALUES (
            :fecha,
            :ccod_cli,
            :ccod_cli_comp,
            :crazn_soci,
            :cdesc_giro,
            :cdireccion,
            :cnom_ubige,
            :provincia,
            :cnom_departamento,
            :dfec_alta,
            :ccod_ruta,
            :ccod_vend,
            :cnom_vend,
            :ccod_fuerz,
            :ccod_prod_distribuidor,
            :cnom_prod,
            :cnom_categ,
            :cnom_lin,
            :cnom_subli,
            :ncant,
            :npeso,
            :peso_final,
            :impte_igv,
            :impte_base,
            :cruc_cli,
            :cdni_cli,
            :ccod_movil,
            :cdesc_movi,
            :cdesc_cana,
            :cdia_visit,
            :frec,
            :id_prov,
            :dap,
            :ccod_prod_sf,
            :cnom_prod_sf,
            :categoria_sf,
            :familia_sf,
            :subfamilia_sf,
            :cond,
            :nom_db,
            :usuarioRegistro,
            NOW()
        )
        ";

            $stmt = $this->conn->prepare($query);

            $params = [
                ':fecha' => $data['fecha'] ?? null,
                ':ccod_cli' => $data['ccod_cli'] ?? null,
                ':ccod_cli_comp' => $data['ccod_cli_comp'] ?? null,
                ':crazn_soci' => $data['crazn_soci'] ?? null,
                ':cdesc_giro' => $data['cdesc_giro'] ?? null,
                ':cdireccion' => $data['cdireccion'] ?? null,
                ':cnom_ubige' => $data['cnom_ubige'] ?? null,
                ':provincia' => $data['provincia'] ?? null,
                ':cnom_departamento' => $data['cnom_departamento'] ?? null,
                ':dfec_alta' => $data['dfec_alta'] ?? null,
                ':ccod_ruta' => $data['ccod_ruta'] ?? null,
                ':ccod_vend' => $data['ccod_vend'] ?? null,
                ':cnom_vend' => $data['cnom_vend'] ?? null,
                ':ccod_fuerz' => $data['ccod_fuerz'] ?? null,
                ':ccod_prod_distribuidor' => $data['ccod_prod_distribuidor'] ?? null,
                ':cnom_prod' => $data['cnom_prod'] ?? null,
                ':cnom_categ' => $data['cnom_categ'] ?? null,
                ':cnom_lin' => $data['cnom_lin'] ?? null,
                ':cnom_subli' => $data['cnom_subli'] ?? null,
                ':ncant' => $data['ncant'] ?? 0,
                ':npeso' => $data['npeso'] ?? 0,
                ':peso_final' => $data['peso_final'] ?? 0,
                ':impte_igv' => $data['impte_igv'] ?? 0,
                ':impte_base' => $data['impte_base'] ?? 0,
                ':cruc_cli' => $data['cruc_cli'] ?? null,
                ':cdni_cli' => $data['cdni_cli'] ?? null,
                ':ccod_movil' => $data['ccod_movil'] ?? null,
                ':cdesc_movi' => $data['cdesc_movi'] ?? null,
                ':cdesc_cana' => $data['cdesc_cana'] ?? null,
                ':cdia_visit' => $data['cdia_visit'] ?? null,
                ':frec' => $data['frec'] ?? null,
                ':id_prov' => $data['id_prov'] ?? null,
                ':dap' => $data['dap'] ?? null,
                ':ccod_prod_sf' => $data['ccod_prod_sf'] ?? null,
                ':cnom_prod_sf' => $data['cnom_prod_sf'] ?? null,
                ':categoria_sf' => $data['categoria_sf'] ?? null,
                ':familia_sf' => $data['familia_sf'] ?? null,
                ':subfamilia_sf' => $data['subfamilia_sf'] ?? null,
                ':cond' => $data['cond'] ?? null,
                ':nom_db' => $data['nom_db'] ?? 'grs',
                ':usuarioRegistro' => $data['usuarioRegistro'] ?? 'system'
            ];
        }

        return $stmt->execute($params);
    }

    public function autocomplete($campo, $query)
    {
        // Evitar SQL injection: permitir solo columnas válidas
        $columnasValidas = [
            'ccod_cli', 'ccod_cli_comp', 'crazn_soci', 'cdesc_giro', 'cdireccion',
            'cnom_ubige', 'provincia', 'cnom_departamento', 'ccod_ruta',
            'ccod_vend', 'cnom_vend', 'ccod_fuerz', 'ccod_prod_distribuidor',
            'cnom_prod', 'cnom_categ', 'cnom_lin', 'cnom_subli', 'cruc_cli',
            'cdni_cli', 'ccod_movil', 'cdesc_movi', 'cdesc_cana', 'cdia_visit',
            'dap', 'ccod_prod_sf', 'cnom_prod_sf', 'categoria_sf', 'familia_sf',
            'subfamilia_sf', 'nom_db'
        ];

        if (!in_array($campo, $columnasValidas)) {
            return [];
        }

        $query = addslashes($query);

        $sql = "
            SELECT DISTINCT $campo 
            FROM com_db_oficial_grs
            WHERE $campo LIKE '$query%'
            AND $campo IS NOT NULL
            AND $campo != ''
            LIMIT 15
        ";

        return $this->executeQuery($sql);
    }


    public function delete($id)
    {
        $query = "DELETE FROM com_db_oficial_grs WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount(); //  devuelve cuántas filas fueron afectadas
    }


    public function findByFilters($params = [])
    {
        $start        = $params['start'] ?? 0;
        $length       = $params['length'] ?? 10;
        $search       = $params['search']['value'] ?? '';
        $fechaInicio  = $params['fechaInicio'] ?? null;
        $fechaFin     = $params['fechaFin'] ?? null;

        $query = "
                SELECT 
                    id,
                    fecha,
                    ccod_cli,
                    ccod_cli_comp,
                    crazn_soci,
                    cdesc_giro,
                    cdireccion,
                    cnom_ubige,
                    provincia,
                    cnom_departamento,
                    dfec_alta,
                    ccod_ruta,
                    ccod_vend,
                    cnom_vend,
                    ccod_fuerz,
                    ccod_prod_distribuidor,
                    cnom_prod,
                    cnom_categ,
                    cnom_lin,
                    cnom_subli,
                    ncant,
                    npeso,
                    peso_final,
                    impte_igv,
                    impte_base,
                    cruc_cli,
                    cdni_cli,
                    ccod_movil,
                    cdesc_movi,
                    cdesc_cana,
                    cdia_visit,
                    frec,
                    id_prov,
                    dap,
                    ccod_prod_sf,
                    cnom_prod_sf,
                    categoria_sf,
                    familia_sf,
                    subfamilia_sf,
                    cond,
                    nom_db,
                    usuarioRegistro,
                    fechaHoraRegistro
                FROM com_db_oficial_grs
                WHERE 1=1
            ";


        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha >= '$fechaInicio' AND fecha <= '$fechaFin' ";
        }

        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
            AND (
                ccod_cli LIKE '%$search%' OR
                crazn_soci LIKE '%$search%' OR
                cnom_vend LIKE '%$search%' OR
                cnom_prod LIKE '%$search%' OR
                provincia LIKE '%$search%' OR
                cnom_categ LIKE '%$search%' OR
                ccod_ruta LIKE '%$search%'
            )
        ";
        }

        // Paginación
        $query .= " ORDER BY fecha DESC, id DESC LIMIT $start, $length";

        return $this->executeQuery($query);
    }

    public function countAll()
    {
        $query = "SELECT COUNT(*) AS total FROM com_db_oficial_grs";
        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }


    public function countFiltered($params = [])
    {
        $search       = $params['search']['value'] ?? '';
        $fechaInicio  = $params['fechaInicio'] ?? null;
        $fechaFin     = $params['fechaFin'] ?? null;

        $query = "
        SELECT COUNT(*) AS total
        FROM com_db_oficial_grs
        WHERE 1=1
    ";

        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $query .= " AND fecha >= '$fechaInicio' AND fecha <= '$fechaFin' ";
        }

        if (!empty($search)) {
            $search = addslashes($search);
            $query .= "
            AND (
                ccod_cli LIKE '%$search%' OR
                crazn_soci LIKE '%$search%' OR
                cnom_vend LIKE '%$search%' OR
                cnom_prod LIKE '%$search%' OR
                provincia LIKE '%$search%' OR
                cnom_categ LIKE '%$search%' OR
                ccod_ruta LIKE '%$search%'
            )
        ";
        }

        $result = $this->executeQuery($query);
        return $result[0]['total'] ?? 0;
    }
}
