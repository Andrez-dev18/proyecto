const MercadoDetConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/mercadodet/all',
            FILTRO: '/mercadodet/filtro',
            CREAR: '/mercadodet/crear',
            ACTUALIZAR: '/mercadodet/actualizar',
            ELIMINAR: '/mercadodet/borrar',
            EXCEL: '/mercadodet/exportar'
        }
    },

    CATALOGOS: {
        mercado: '/mercado/all',
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.MercadoDetConfig = MercadoDetConfig;
