<?php 

class VivoProvincia{
      public int $id;
    public ?string $fecha;
    public ?string $provincia;
    public ?string $proveedor;
    public ?int $ruc_prov;
    public ?string $tipo;
    public ?float $precioMayCarMin;
    public ?float $precioMayCarMax;
    public ?float $precioMayBraMin;
    public ?float $precioMayBraMax;
    public ?float $precioPubMin;
    public ?float $precioPubMax;
    public ?float $pesoMachoPromMin;
    public ?float $pesoMachoPromMax;
    public ?float $pesoHembraPromMin;
    public ?float $pesoHembraPromMax;
    public ?float $pesoBrasaPromMin;
    public ?float $pesoBrasaPromMax;
    public ?float $colorMin;
    public ?float $colorMax;
    public ?float $cantidad;
    public ?string $usuarioRegistro;
    public ?string $fechaHoraRegistro;
    public ?string $usuarioTransferencia;
    public ?string $fechaHoraTransferencia;

    public static function fromArray(array $r): VivoProvincia {
        $d = new VivoProvincia();

        $d->id = (int)($r['id'] ?? 0);
        $d->fecha = $r['fecha'] ?? null;
        $d->provincia = $r['provincia'] ?? null;
        $d->proveedor = $r['proveedor'] ?? null;
        $d->ruc_prov = isset($r['ruc_prov']) ? (int)$r['ruc_prov'] : null;
        $d->tipo = $r['tipo'] ?? null;
        $d->precioMayCarMin = isset($r['precioMayCarMin']) ? (float)$r['precioMayCarMin'] : null;
        $d->precioMayCarMax = isset($r['precioMayCarMax']) ? (float)$r['precioMayCarMax'] : null;
        $d->precioMayBraMin = isset($r['precioMayBraMin']) ? (float)$r['precioMayBraMin'] : null;
        $d->precioMayBraMax = isset($r['precioMayBraMax']) ? (float)$r['precioMayBraMax'] : null;
        $d->precioPubMin = isset($r['precioPubMin']) ? (float)$r['precioPubMin'] : null;
        $d->precioPubMax = isset($r['precioPubMax']) ? (float)$r['precioPubMax'] : null;
        $d->pesoMachoPromMin = isset($r['pesoMachoPromMin']) ? (float)$r['pesoMachoPromMin'] : null;
        $d->pesoMachoPromMax = isset($r['pesoMachoPromMax']) ? (float)$r['pesoMachoPromMax'] : null;
        $d->pesoHembraPromMin = isset($r['pesoHembraPromMin']) ? (float)$r['pesoHembraPromMin'] : null;
        $d->pesoHembraPromMax = isset($r['pesoHembraPromMax']) ? (float)$r['pesoHembraPromMax'] : null;
        $d->pesoBrasaPromMin = isset($r['pesoBrasaPromMin']) ? (float)$r['pesoBrasaPromMin'] : null;
        $d->pesoBrasaPromMax = isset($r['pesoBrasaPromMax']) ? (float)$r['pesoBrasaPromMax'] : null;
        $d->colorMin = isset($r['colorMin']) ? (float)$r['colorMin'] : null;
        $d->colorMax = isset($r['colorMax']) ? (float)$r['colorMax'] : null;
        $d->cantidad = isset($r['cantidad']) ? (float)$r['cantidad'] : null;
        $d->usuarioRegistro = $r['usuarioRegistro'] ?? null;
        $d->fechaHoraRegistro = $r['fechaHoraRegistro'] ?? null;
        $d->usuarioTransferencia = $r['usuarioTransferencia'] ?? null;
        $d->fechaHoraTransferencia = $r['fechaHoraTransferencia'] ?? null;

        return $d;
    }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'fecha' => $this->fecha,
            'provincia' => $this->provincia,
            'proveedor' => $this->proveedor,
            'ruc_prov' => $this->ruc_prov,
            'tipo' => $this->tipo,
            'precioMayCarMin' => $this->precioMayCarMin,
            'precioMayCarMax' => $this->precioMayCarMax,
            'precioMayBraMin' => $this->precioMayBraMin,
            'precioMayBraMax' => $this->precioMayBraMax,
            'precioPubMin' => $this->precioPubMin,
            'precioPubMax' => $this->precioPubMax,
            'pesoMachoPromMin' => $this->pesoMachoPromMin,
            'pesoMachoPromMax' => $this->pesoMachoPromMax,
            'pesoHembraPromMin' => $this->pesoHembraPromMin,
            'pesoHembraPromMax' => $this->pesoHembraPromMax,
            'pesoBrasaPromMin' => $this->pesoBrasaPromMin,
            'pesoBrasaPromMax' => $this->pesoBrasaPromMax,
            'colorMin' => $this->colorMin,
            'colorMax' => $this->colorMax,
            'cantidad' => $this->cantidad,
            'usuarioRegistro' => $this->usuarioRegistro,
            'fechaHoraRegistro' => $this->fechaHoraRegistro,
            'usuarioTransferencia' => $this->usuarioTransferencia,
            'fechaHoraTransferencia' => $this->fechaHoraTransferencia,
        ];
    }
}

?>