const HuevoConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/huevo/all',
            FILTRO: '/huevo/filtro',
            CREAR: '/huevo/crear',
            ACTUALIZAR: '/huevo/actualizar',
            ELIMINAR: '/huevo/borrar',
            EXCEL: '/huevo/exportar'
        }
    },

    CATALOGOS: {
        PROVINCIAS: '/provincia/all',
        TIPOS: '/tipo/all',
        MERCADOS: '/mercado/all',
        PROVEEDORES: '/proveedor/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.HuevoConfig = HuevoConfig;
