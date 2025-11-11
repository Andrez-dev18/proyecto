// js/config/config.criador-emprendedor.js

const CriadorEmprendedorConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
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
