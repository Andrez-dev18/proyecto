const EnteroAutoserConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/enteroAutoser/all',
            FILTRO: '/enteroAutoser/filtro',
            CREAR: '/enteroAutoser/crear',
            ACTUALIZAR: '/enteroAutoser/actualizar',
            ELIMINAR: '/enteroAutoser/borrar',
            EXCEL: '/reporte/enteroAutoser/excel'
        }
    },

    CATALOGOS: {
        PROVEEDORES: '/proveedor/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.EnteroAutoserConfig = EnteroAutoserConfig;
