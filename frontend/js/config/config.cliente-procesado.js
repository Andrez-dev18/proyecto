const ClienteProcesadoConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            FILTRO: '/clienteProce/filtro',
            CREAR: '/clienteProce/crear',
            EDITAR: '/clienteProce/actualizar',
            BORRAR: '/clienteProce/borrar',
            EXPORTA: '/clienteProce/exportar',
            ETL: '/clienteProce/etl'
        }
    },
    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.ClienteProcesadoConfig = ClienteProcesadoConfig;
