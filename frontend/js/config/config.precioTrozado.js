const PrecioTrozadoConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/precioTrozado/all',
            FILTRO: '/precioTrozado/filtro',
            CREAR: '/precioTrozado/crear',
            ACTUALIZAR: '/precioTrozado/actualizar',
            ELIMINAR: '/precioTrozado/borrar',
            EXCEL: '/reporte/precioTrozado/excel'
        }
    },

    CATALOGOS: {
        EMPRESAS: '/empresa/all',
        CORTES: '/corte/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.PrecioTrozadoConfig = PrecioTrozadoConfig;
