<?php

class ArequipaBeneficiado {
    public  $id;
    public  $ano;
    public  $mes;
    public  $provincia;
    public  $zona;
    public $compraGrs;
    public  $tipoCliente;
    public  $nombre;
    
    // Campos específicos de Arequipa Beneficiado
    public  $grs;
    public  $rp;
    public  $avicola_renzo;
    public  $avelino;
    public  $peladores;
    public  $avicruz;
    public  $rafael;
    public  $matilde;
    public  $avirox;
    public  $julia;
    public  $simon;
    public  $yesica;
    public $gabriel;
    public  $arturo;
    public  $nicolas;
    public  $luis_f;
    public  $mirella;
    public  $otros;
    
    public  $potencialMinimo;
    public  $potencialMaximo;
    public  $condicionPtmax;

    public static function fromArray(array $r): ArequipaBeneficiado {
        $d = new ArequipaBeneficiado();

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
        $d->avicola_renzo = (int)($r['avicola_renzo'] ?? 0);
        $d->avelino = (int)($r['avelino'] ?? 0);
        $d->peladores = (int)($r['peladores'] ?? 0);
        $d->avicruz = (int)($r['avicruz'] ?? 0);
        $d->rafael = (int)($r['rafael'] ?? 0);
        $d->matilde = (int)($r['matilde'] ?? 0);
        $d->avirox = (int)($r['avirox'] ?? 0);
        $d->julia = (int)($r['julia'] ?? 0);
        $d->simon = (int)($r['simon'] ?? 0);
        $d->yesica = (int)($r['yesica'] ?? 0);
        $d->gabriel = (int)($r['gabriel'] ?? 0);
        $d->arturo = (int)($r['arturo'] ?? 0);
        $d->nicolas = (int)($r['nicolas'] ?? 0);
        $d->luis_f = (int)($r['luis_f'] ?? 0);
        $d->mirella = (int)($r['mirella'] ?? 0);
        $d->otros = (int)($r['otros'] ?? 0);

        $d->potencialMinimo = (int)($r['potencial_minimo'] ?? 0);
        $d->potencialMaximo = (int)($r['potencial_maximo'] ?? 0);
        $d->condicionPtmax = $r['condicion_ptmax'] ?? null;

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
            'avicola_renzo' => $this->avicola_renzo,
            'avelino' => $this->avelino,
            'peladores' => $this->peladores,
            'avicruz' => $this->avicruz,
            'rafael' => $this->rafael,
            'matilde' => $this->matilde,
            'avirox' => $this->avirox,
            'julia' => $this->julia,
            'simon' => $this->simon,
            'yesica' => $this->yesica,
            'gabriel' => $this->gabriel,
            'arturo' => $this->arturo,
            'nicolas' => $this->nicolas,
            'luis_f' => $this->luis_f,
            'mirella' => $this->mirella,
            'otros' => $this->otros,
            'potencialMinimo' => $this->potencialMinimo,
            'potencialMaximo' => $this->potencialMaximo,
            'condicionPtmax' => $this->condicionPtmax,
        ];
    }
}