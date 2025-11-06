<?php

class ArequipaVivo {
    public $id;
    public $ano;
    public $mes;
    public $provincia;
    public $zona;
    public $compra;
    public $tipo_cliente;
    public $nombre;
    public $grs;
    public $rp;
    public $renzo;
    public $fafo;
    public $santa_angela;
    public $rosario;
    public $pollo_lima;
    public $otras_granjas_chicas;
    public $potencial_minimo;
    public $potencial_maximo;
    public $condicion_ptmin;
    public $condicion_ptmax;
    public $observaciones;

    // factory desde un array asociativo (fila DB)
    public static function fromArray(array $r): ArequipaVivo {
        $d = new ArequipaVivo();

        $d->id = isset($r['id']) ? (int)$r['id'] : 0;
        $d->ano = isset($r['ano']) ? (int)$r['ano'] : 0;
        $d->mes = $r['mes'] ?? '';
        $d->provincia = $r['provincia'] ?? null;
        $d->zona = $r['zona'] ?? null;
        $d->compra = $r['compra'] ?? null;
        $d->tipo_cliente = $r['tipo_cliente'] ?? null;
        $d->nombre = $r['nombre'] ?? null;

        // Campos exclusivos o relevantes para Arequipa (si no existen en row, quedan 0)
        $d->grs = (int)($r['grs'] ?? 0);
        $d->rp = (int)($r['rp'] ?? 0);
        $d->renzo = (int)($r['renzo'] ?? 0);
        $d->fafo = (int)($r['fafo'] ?? 0);
        $d->santa_angela = (int)($r['santa_angela'] ?? 0);
        $d->rosario = (int)($r['rosario'] ?? 0);
        $d->pollo_lima = (int)($r['pollo_lima'] ?? 0);
        $d->otras_granjas_chicas = (int)($r['otras_granjas_chicas'] ?? 0);

        $d->potencial_minimo = (int)($r['potencial_minimo'] ?? 0);
        $d->potencial_maximo = (int)($r['potencial_maximo'] ?? 0);
        $d->condicion_ptmin = $r['condicion_ptmin'] ?? null;
        $d->condicion_ptmax = $r['condicion_ptmax'] ?? null;
        $d->observaciones = $r['observaciones'] ?? null;

        return $d;
    }

    // para serializar a JSON (array plano)
    public function toArray(): array {
        return [
            'id' => $this->id,
            'ano' => $this->ano,
            'mes' => $this->mes,
            'provincia' => $this->provincia,
            'zona' => $this->zona,
            'compra' => $this->compra,
            'tipo_cliente' => $this->tipo_cliente,
            'nombre' => $this->nombre,
            'grs' => $this->grs,
            'rp' => $this->rp,
            'renzo' => $this->renzo,
            'fafo' => $this->fafo,
            'santa_angela' => $this->santa_angela,
            'rosario' => $this->rosario,
            'pollo_lima' => $this->pollo_lima,
            'otras_granjas_chicas' => $this->otras_granjas_chicas,
            'potencial_minimo' => $this->potencial_minimo,
            'potencial_maximo' => $this->potencial_maximo,
            'condicion_ptmin' => $this->condicion_ptmin,
            'condicion_ptmax' => $this->condicion_ptmax,
            'observaciones' => $this->observaciones,
        ];
    }
}
