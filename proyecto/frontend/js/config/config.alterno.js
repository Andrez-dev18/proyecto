const AlternoConfig = {
    ENDPOINTS: {
        ALL: '/alterno/all',
        CREAR: '/alterno/crear',
        EDITAR: '/alterno/actualizar',
        BORRAR: '/alterno/borrar',
        FILTRO: '/alterno/filtro?',
        EXPORTAR: '/alterno/exportar'
    }
};

// Agregar al objeto global de configuración
if (!window.AppConfig.API.ENDPOINTS.ALTERNO) {
    window.AppConfig.API.ENDPOINTS.ALTERNO = AlternoConfig.ENDPOINTS;
}

