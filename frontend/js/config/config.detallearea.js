const DetalleAreaConfig = {
    ENDPOINTS: {
        ALL: '/detallearea/all',
        CREAR: '/detallearea/crear',
        EDITAR: '/detallearea/actualizar',
        BORRAR: '/detallearea/borrar',
        FILTRO: '/detallearea/filtro?',
        EXPORTAR: '/detallearea/exportar'
    },
    AREAS: [
        { id: 'Vivo Arequipa', nombre: 'Vivo Arequipa' },
        { id: 'Vivo Provincias', nombre: 'Vivo Provincias' },
        { id: 'Beneficiado Provincias', nombre: 'Beneficiado Provincias' },
        { id: 'Precio Vivo', nombre: 'Precio Vivo' },
        { id: 'Precio Trozado', nombre: 'Precio Trozado' },
        { id: 'Tienda', nombre: 'Tienda' },
        { id: 'Huevo', nombre: 'Huevo' },
        { id: 'Gallina', nombre: 'Gallina' },
        { id: 'Alternos', nombre: 'Alternos' },
        { id: 'Pollo entero auto servicio', nombre: 'Pollo entero auto servicio' },
        { id: 'Pollo Trozado auto servicio', nombre: 'Pollo Trozado auto servicio' }
    ]
};

// Agregar al objeto global de configuración
if (!window.AppConfig.API.ENDPOINTS.DETALLE_AREA) {
    window.AppConfig.API.ENDPOINTS.DETALLE_AREA = DetalleAreaConfig.ENDPOINTS;
}

