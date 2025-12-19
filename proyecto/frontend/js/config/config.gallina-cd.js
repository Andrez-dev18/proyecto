const GallinaCDConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/gallinacd/all',
            FILTRO: '/gallinacd/filtro',
            CREAR: '/gallinacd/crear',
            ACTUALIZAR: '/gallinacd/actualizar',
            ELIMINAR: '/gallinacd/borrar',
            EXCEL: '/gallinacd/exportar'
        }
    },

    CATALOGOS: {
        TIPOS: '/tipoGallina/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.GallinaCDConfig = GallinaCDConfig;
