const bdOficialConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/oficialGRS/all',
            FILTRO: '/oficialGRS/filtro',
            CREAR: '/oficialGRS/crear',
            EDITAR: '/oficialGRS/actualizar',
            BORRAR: '/oficialGRS/borrar',
            EXPORTA: '/oficialGRS/exportar',
            ETL: '/oficialGRS/etl',
            AUTOCOMPLETADO: '/oficialGRS/autocomplete'
        }
    },
   

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.bdOficialConfig = bdOficialConfig;
