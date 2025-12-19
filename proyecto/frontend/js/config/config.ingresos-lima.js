const IngresosLimaConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/ingresoLima/all',
            FILTRO: '/ingresoLima/filtro',
            CREAR: '/ingresoLima/crear',
            ACTUALIZAR: '/ingresoLima/actualizar',
            ELIMINAR: '/ingresoLima/borrar',
            EXCEL: '/ingresoLima/exportar'
        }
    },

    CATALOGOS: {
        EMPRESAS: '/empresa/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.IngresosLimaConfig = IngresosLimaConfig;
