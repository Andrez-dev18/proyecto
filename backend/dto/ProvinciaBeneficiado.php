<?php

class ProvinciaBeneficiado {
    public int $id;
    public int $ano;
    public string $mes;
    public ?string $provincia;
    public ?string $zona;
    public ?string $compraGrs;
    public ?string $tipoCliente;
    public ?string $nombre;
    
    // Campos específicos de Provincia Beneficiado
    public int $grs;
    public int $rp;
    public int $grs_vivo;
    public int $santa_elena;
    public int $granjas_chicas;
    public int $rosario;
    public int $sanfern_lima;
    public int $avicola_renzo;
    public int $otros;
    
    public int $potencialMinimo;
    public int $potencialMaximo;
    public ?string $condicionPtmin;
    public ?string $condicionPtmax;
    public ?string $observaciones;

    public static function fromArray(array $r): ProvinciaBeneficiado {
        $d = new ProvinciaBeneficiado();

        $d->id = (int)($r['id'] ?? 0);
        $d->ano = (int)($r['ano'] ?? 0);
        $d->mes = $r['mes'] ?? '';
        $d->provincia = $r['provincia'] ?? null;
        $d->zona = $r['zona'] ?? null;
        $d->compraGrs = $r['compra_grs'] ?? null;
        $d->tipoCliente = $r['tipo_cliente'] ?? null;
        $d->nombre = $r['nombre'] ?? null;

        $d->grs = (int)($r['grs'] ?? 0);
        $d->rp = (int)($r['rp'] ?? 0);
        $d->grs_vivo = (int)($r['grs_vivo'] ?? 0);
        $d->santa_elena = (int)($r['santa_elena'] ?? 0);
        $d->granjas_chicas = (int)($r['granjas_chicas'] ?? 0);
        $d->rosario = (int)($r['rosario'] ?? 0);
        $d->sanfern_lima = (int)($r['sanfern_lima'] ?? 0);
        $d->avicola_renzo = (int)($r['avicola_renzo'] ?? 0);
        $d->otros = (int)($r['otros'] ?? 0);

        $d->potencialMinimo = (int)($r['potencial_minimo'] ?? 0);
        $d->potencialMaximo = (int)($r['potencial_maximo'] ?? 0);
        $d->condicionPtmin = $r['condicion_ptmin'] ?? null;
        $d->condicionPtmax = $r['condicion_ptmax'] ?? null;
        $d->observaciones = $r['observaciones'] ?? null;

        return $d;
    }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'ano' => $this->ano,
            'mes' => $this->mes,
            'provincia' => $this->provincia,
            'zona' => $this->zona,
            'compraGrs' => $this->compraGrs,
            'tipoCliente' => $this->tipoCliente,
            'nombre' => $this->nombre,
            'grs' => $this->grs,
            'rp' => $this->rp,
            'grs_vivo' => $this->grs_vivo,
            'santa_elena' => $this->santa_elena,
            'granjas_chicas' => $this->granjas_chicas,
            'rosario' => $this->rosario,
            'sanfern_lima' => $this->sanfern_lima,
            'avicola_renzo' => $this->avicola_renzo,
            'otros' => $this->otros,
            'potencialMinimo' => $this->potencialMinimo,
            'potencialMaximo' => $this->potencialMaximo,
            'condicionPtmin' => $this->condicionPtmin,
            'condicionPtmax' => $this->condicionPtmax,
            'observaciones' => $this->observaciones,
        ];
    }
}