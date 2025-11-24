
const ProvinciaConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/provincia/all',
            CREAR: '/provincia/crear',
            ACTUALIZAR: '/provincia/actualizar',
            ELIMINAR: '/provincia/borrar',
            EXPORTAR: '/provincia/exportar'
        }
    },
    TABLA: {
        COLUMNAS_VISIBLES: {
            0: true, // codigo
            1: true, // nombre
            2: true  // opciones
        }
    }
};

// Hacer disponible globalmente
window.ProvinciaConfig = ProvinciaConfig;
