const InfoGRSConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/infoGRS/all',
            FILTRO: '/infoGRS/filtro',
            CREAR: '/infoGRS/crear',
            EDITAR: '/infoGRS/actualizar',
            BORRAR: '/infoGRS/borrar',
            EXCEL: '/infoGRS/exportar',
            ETL: '/infoGRS/etl',
        }
    },
   

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.InfoGRSConfig = InfoGRSConfig;
