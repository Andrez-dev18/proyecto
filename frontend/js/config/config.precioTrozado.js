const PrecioTrozadoConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/precioTrozado/all',
            FILTRO: '/precioTrozado/filtro',
            CREAR: '/precioTrozado/crear',
            ACTUALIZAR: '/precioTrozado/actualizar',
            ELIMINAR: '/precioTrozado/borrar',
            EXCEL: '/reporte/precioTrozado/exportar'
        }
    },

    CATALOGOS: {
        EMPRESAS: '/empresa/all',
        CORTES: '/corte/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.PrecioTrozadoConfig = PrecioTrozadoConfig;
