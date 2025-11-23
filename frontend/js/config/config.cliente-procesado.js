const AppConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            CLIENTES_PROCESADOS: {
                ALL: '/clienteProce/all',
                CREAR: '/clienteProce/create',
                EDITAR: '/clienteProce/update',
                BORRAR: '/clienteProce/delete',
                EXPORTAR: '/clienteProce/exportar',
                ETL_RUN: '/clienteProce/etl/run'
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.AppConfig = AppConfig;
}
