const MercadoResConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/mercadores/all',
            FILTRO: '/mercadores/filtro',
            CREAR: '/mercadores/crear',
            ACTUALIZAR: '/mercadores/actualizar',
            ELIMINAR: '/mercadores/borrar',
            EXCEL: '/mercadores/exportar'
        }
    },

    CATALOGOS: {
        PROVINCIAS: '/provincia/all',
        PROVEEDORES: '/proveedor/all',
        TIPOS: '/tipo/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.MercadoResConfig = MercadoResConfig;
