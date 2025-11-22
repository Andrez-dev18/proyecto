/**
 * Configuración de la aplicación InfoGRS
 * @namespace InfoGRSConfig
 */
const InfoGRSConfig = {
    API: {
        BASE_URL: 'http://localhost/api',
        ENDPOINTS: {
            INFOGRS: {
                ALL: '/infogrs/all',
                CREAR: '/infogrs/create',
                EDITAR: '/infogrs/update',
                BORRAR: '/infogrs/delete',
                FILTRO: '/infogrs/filter',
                EXPORTAR: '/infogrs/export'
            },
            CATALOGOS: {
                PROVINCIAS: '/provincia/all',
                ZONAS: '/zona/all',
                TIPOS: '/tipo/all',
                CATEGORIAS: '/categoria/all',
                LINEAS: '/linea/all',
                MERCADOS: '/mercado/all'
            }
        }
    },
    DATATABLES: {
        LANGUAGE_URL: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json',
        PAGE_LENGTH: 10,
        RESPONSIVE: true,
        PROCESSING: true,
        SERVER_SIDE: true
    },
    NOTIFICACIONES: {
        DURACION: 4000,
        POSICION: 'top-right'
    }
};

Object.freeze(InfoGRSConfig);

