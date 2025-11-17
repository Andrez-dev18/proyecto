const VivoProvinciaConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/vivo/provincias/all',
            FILTRO: '/vivoProvincia/filtro',
            CREAR: '/vivoProvincia/crear',
            ACTUALIZAR: '/vivoProvincia/actualizar',
            ELIMINAR: '/vivoProvincia/borrar',
            EXCEL: '/reporte/vivoProvincia/excel'
        }
    },

    CATALOGOS: {
        PROVINCIAS: '/provincia/all',
        ZONAS: '/zona/all',
        TIPOS_CLIENTE: '/tipoCliente/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.VivoProvinciaConfig = VivoProvinciaConfig;

