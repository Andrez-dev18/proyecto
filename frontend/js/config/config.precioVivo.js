const PrecioVivoConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/precioVivo/all',
            FILTRO: '/precioVivo/filtro',
            CREAR: '/precioVivo/crear',
            ACTUALIZAR: '/precioVivo/actualizar',
            ELIMINAR: '/precioVivo/borrar',
            EXCEL: '/reporte/precioVivo/excel'
        }
    },

    CATALOGOS: {
        EMPRESAS: '/empresa/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.PrecioVivoConfig = PrecioVivoConfig;

