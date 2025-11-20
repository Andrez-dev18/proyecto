const TrozadoDiarioConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/trozadoDiario/all',
            FILTRO: '/trozadoDiario/filtro',
            CREAR: '/trozadoDiario/crear',
            ACTUALIZAR: '/trozadoDiario/actualizar',
            ELIMINAR: '/trozadoDiario/borrar',
            EXCEL: '/trozadoDiario/exportar',
            ETL: '/trozadoDiario/etl'
        }
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.TrozadoDiarioConfig = TrozadoDiarioConfig;

