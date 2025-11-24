const MercadoConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/mercado/all',
            CREAR: '/mercado/crear',
            ACTUALIZAR: '/mercado/actualizar',
            ELIMINAR: '/mercado/borrar',
            EXCEL: '/mercado/exportar'
        }
    },
    CATALOGOS: {
        PROVINCIAS: '/provincia/all'
    },
};

window.MercadoConfig = MercadoConfig;

