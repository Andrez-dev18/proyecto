const clientePvConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/clientePv/all',
            FILTRO: '/clientePv/filtro',
            CREAR: '/clientePv/crear',
            EDITAR: '/clientePv/actualizar',
            BORRAR: '/clientePv/borrar',
            EXCEL: '/clientePv/exportar',
            ETL: '/clientePv/etl',
        }
    },
   

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.clientePvConfig = clientePvConfig;
