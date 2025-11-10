const GallinaConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/gallina/all',
            FILTRO: '/gallina/filtro',
            CREAR: '/gallina/crear',
            ACTUALIZAR: '/gallina/actualizar',
            ELIMINAR: '/gallina/borrar',
            EXCEL: '/reporte/gallina/excel'
        }
    },

    CATALOGOS: {
        TIPOS: '/tipo/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.GallinaConfig = GallinaConfig;
