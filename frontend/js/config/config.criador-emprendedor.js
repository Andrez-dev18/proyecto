const CriadorEmprendedorConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/criador/all',
            FILTRO: '/criador/filtro',
            CREAR: '/criador/crear',
            ACTUALIZAR: '/criador/actualizar',
            ELIMINAR: '/criador/borrar',
            EXCEL: '/reporte/criador/exportar'
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

window.CriadorEmprendedorConfig = CriadorEmprendedorConfig;

