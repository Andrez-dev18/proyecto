const TiendaConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/tienda/all',
            FILTRO: '/tienda/filtro',
            CREAR: '/tienda/crear',
            ACTUALIZAR: '/tienda/actualizar',
            ELIMINAR: '/tienda/borrar',
            EXCEL: '/reporte/tienda/exportar'
        }
    },

    CATALOGOS: {
        EMPRESAS: '/empresa/all',
        TIPOS: '/tipo/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.TiendaConfig = TiendaConfig;
