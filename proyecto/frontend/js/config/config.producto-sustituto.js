const ProductoSustitutoConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/productoSusti/all',
            FILTRO: '/productoSusti/filtro',
            CREAR: '/productoSusti/crear',
            ACTUALIZAR: '/productoSusti/actualizar',
            ELIMINAR: '/productoSusti/borrar',
            EXCEL: '/productoSusti/exportar',
            TIPOS_PRODUCTO: '/tipoProductoSusti/all'
        }
    },

    CATALOGOS: {
        PRODUCTOS: '/tipoProductoSustituto/all'
    },

    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.ProductoSustitutoConfig = ProductoSustitutoConfig;
