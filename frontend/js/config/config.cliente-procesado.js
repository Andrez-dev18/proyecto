const ClienteProcesadoAppConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/clienteProce/all',
            CREAR: '/clienteProce/crear',
            ACTUALIZAR: '/clienteProce/actualizar',
            ELIMINAR: '/clienteProce/borrar',
            FILTRO: '/clienteProce/filtro',
            EXPORTAR: '/clienteProce/exportar',
            ETL: '/clienteProce/etl'
        }
    }
};

window.ClienteProcesadoConfig = ClienteProcesadoAppConfig;
