const TrozadoAutoserConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/trozadoAutoser/all',
            FILTRO: '/trozadoAutoser/filtro',
            CREAR: '/trozadoAutoser/crear',
            ACTUALIZAR: '/trozadoAutoser/actualizar',
            ELIMINAR: '/trozadoAutoser/borrar',
            EXCEL: '/reporte/trozadoAutoser/exportar'
        }
    },

    CATALOGOS: {
        CORTES: '/corte/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.TrozadoAutoserConfig = TrozadoAutoserConfig;
