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

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.MercadoConfig = MercadoConfig;
