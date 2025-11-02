<?php 

class VivoArequipa{
<<<<<<< HEAD
     public int $id;
=======
    public int $id;
>>>>>>> 666f841b1b2dd8a35caa2caf0c1d75526fefc10a
    public ?string $fecha;
    public ?string $mercado;
    public ?string $empresa;
    public ?string $ruc_empr;
    public ?string $condicion;
    public ?string $proveedor;
    public ?int $ruc_prov;
    public ?float $precioMayMin;
    public ?float $precioMayMax;
    public ?float $precioPubMin;
    public ?float $precioPubMax;
    public ?float $pesoMachoMin;
    public ?float $pesoMachoMax;
    public ?float $pesoHembMin;
    public ?float $pesoHembMax;
    public ?float $colorMin;
    public ?float $colorMax;
    public ?float $pesoMachoPromMin;
    public ?float $pesoMachoPromMax;
    public ?float $pesoHembraPromMin;
    public ?float $pesoHembraPromMax;
    public ?float $cantidad;
    public ?string $usuarioRegistro;
    public ?string $fechaHoraRegistro;
    public ?string $usuarioTransferencia;
    public ?string $fechaHoraTransferencia;

    public static function fromArray(array $r): VivoArequipa {
        $d = new VivoArequipa();

        $d->id = (int)($r['id'] ?? 0);
        $d->fecha = $r['fecha'] ?? null;
        $d->mercado = $r['mercado'] ?? null;
        $d->empresa = $r['empresa'] ?? null;
        $d->ruc_empr = $r['ruc_empr'] ?? null;
        $d->condicion = $r['condicion'] ?? null;
        $d->proveedor = $r['proveedor'] ?? null;
        $d->ruc_prov = isset($r['ruc_prov']) ? (int)$r['ruc_prov'] : null;
        $d->precioMayMin = isset($r['precioMayMin']) ? (float)$r['precioMayMin'] : null;
        $d->precioMayMax = isset($r['precioMayMax']) ? (float)$r['precioMayMax'] : null;
        $d->precioPubMin = isset($r['precioPubMin']) ? (float)$r['precioPubMin'] : null;
        $d->precioPubMax = isset($r['precioPubMax']) ? (float)$r['precioPubMax'] : null;
        $d->pesoMachoMin = isset($r['pesoMachoMin']) ? (float)$r['pesoMachoMin'] : null;
        $d->pesoMachoMax = isset($r['pesoMachoMax']) ? (float)$r['pesoMachoMax'] : null;
        $d->pesoHembMin = isset($r['pesoHembMin']) ? (float)$r['pesoHembMin'] : null;
        $d->pesoHembMax = isset($r['pesoHembMax']) ? (float)$r['pesoHembMax'] : null;
        $d->colorMin = isset($r['colorMin']) ? (float)$r['colorMin'] : null;
        $d->colorMax = isset($r['colorMax']) ? (float)$r['colorMax'] : null;
        $d->pesoMachoPromMin = isset($r['pesoMachoPromMin']) ? (float)$r['pesoMachoPromMin'] : null;
        $d->pesoMachoPromMax = isset($r['pesoMachoPromMax']) ? (float)$r['pesoMachoPromMax'] : null;
        $d->pesoHembraPromMin = isset($r['pesoHembraPromMin']) ? (float)$r['pesoHembraPromMin'] : null;
        $d->pesoHembraPromMax = isset($r['pesoHembraPromMax']) ? (float)$r['pesoHembraPromMax'] : null;
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
            'mercado' => $this->mercado,
            'empresa' => $this->empresa,
            'ruc_empr' => $this->ruc_empr,
            'condicion' => $this->condicion,
            'proveedor' => $this->proveedor,
            'ruc_prov' => $this->ruc_prov,
            'precioMayMin' => $this->precioMayMin,
            'precioMayMax' => $this->precioMayMax,
            'precioPubMin' => $this->precioPubMin,
            'precioPubMax' => $this->precioPubMax,
            'pesoMachoMin' => $this->pesoMachoMin,
            'pesoMachoMax' => $this->pesoMachoMax,
            'pesoHembMin' => $this->pesoHembMin,
            'pesoHembMax' => $this->pesoHembMax,
            'colorMin' => $this->colorMin,
            'colorMax' => $this->colorMax,
            'pesoMachoPromMin' => $this->pesoMachoPromMin,
            'pesoMachoPromMax' => $this->pesoMachoPromMax,
            'pesoHembraPromMin' => $this->pesoHembraPromMin,
            'pesoHembraPromMax' => $this->pesoHembraPromMax,
            'cantidad' => $this->cantidad,
            'usuarioRegistro' => $this->usuarioRegistro,
            'fechaHoraRegistro' => $this->fechaHoraRegistro,
            'usuarioTransferencia' => $this->usuarioTransferencia,
            'fechaHoraTransferencia' => $this->fechaHoraTransferencia,
        ];
    }
}

?>