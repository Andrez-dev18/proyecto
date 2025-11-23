const AppConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            AUTH: {
                LOGIN: '/usuario/login',
                VALIDAR: '/usuario/validarSesion',
                LOGOUT: '/usuario/logout'
            },
            VIVO: {
                AREQUIPA: '/vivo/arequipa',
                PROVINCIA: '/vivo/provincia',
                CREAR: '/vivo/crear',
                ACTUALIZAR: '/vivo/actualizar',
                ELIMINAR: '/vivo/borrar'
            },
            TIPO: {
                ALL: '/tipo/all',
                CREAR: '/tipo/crear',
                EDITAR: '/tipo/actualizar',
                BORRAR: '/tipo/borrar',
                FILTRO: '/tipo/filtrar',
                EXPORTAR: '/tipo/exportar'
            },
            
            BENEFICIADO: {
                AREQUIPA: '/beneficiado/arequipa',
                PROVINCIA: '/beneficiado/provincia',
                CREAR: '/beneficiado/crear',
                ACTUALIZAR: '/beneficiado/actualizar',
                ELIMINAR: '/beneficiado/borrar'
            },
            REPORTES: {
                VIVO_AREQUIPA: '/reporte/vivo/arequipa/excel',
                VIVO_PROVINCIA: '/reporte/vivo/provincia/excel',
                BENEFICIADO_AREQUIPA: '/reporte/beneficiado/arequipa/excel',
                BENEFICIADO_PROVINCIA: '/reporte/beneficiado/provincia/excel'
            },
            VIVO_AQP: {
                FILTRO: '/vivoArequipa/filtro'
            },
            VIVO_PROVINCIA: {
                FILTRO: '/vivoProvincia/filtro'
            },
            TAMAMERDIA: {
                ALL: '/tamamerdia/all',
                CREAR: '/tamamerdia/crear',
                EDITAR: '/tamamerdia/actualizar',
                BORRAR: '/tamamerdia/borrar',
                FILTRO: '/tamamerdia/filtro?',
                EXPORTA: '/tamamerdia/exportar',
            },

            PRECIOVIVO: {
                ALL: '/preciovivo/all',
                CREAR: '/preciovivo/crear',
                EDITAR: '/preciovivo/actualizar',
                BORRAR: '/preciovivo/borrar',
                FILTRO: '/preciovivo/filtro?',
                EXPORTA: '/preciovivo/exportar',
            },
            
        }
    },

    TIPOS_DATOS: {
        VIVO_AREQUIPA: 'vivo-arequipa',
        VIVO_PROVINCIA: 'vivo-provincia',
        BENEFICIADO_AREQUIPA: 'beneficiado-arequipa',
        BENEFICIADO_PROVINCIA: 'beneficiado-provincia'
    },

    MENSAJES: {
        EXITO: {
            GUARDADO: '✓ Registro guardado exitosamente',
            ACTUALIZADO: '✓ Registro actualizado exitosamente',
            ELIMINADO: '✓ Registro eliminado exitosamente'
        },
        ERROR: {
            CARGAR_DATOS: 'Error al cargar los datos',
            GUARDAR: 'Error al guardar el registro',
            ACTUALIZAR: 'Error al actualizar el registro',
            ELIMINAR: 'Error al eliminar el registro',
            SELECCIONAR_TIPO: 'Por favor, selecciona primero un tipo de datos',
            SELECCIONAR_REGISTRO: 'Por favor selecciona un registro primero',
            CONEXION: 'Error de conexión con el servidor',
            SIN_ID: 'Error: No se pudo obtener el ID del registro'
        },
        CONFIRMACION: {
            ELIMINAR: '¿Estás seguro de eliminar este registro?\n\nEsta acción no se puede deshacer.'
        }
    },

    UI: {
        ANIMATION_DURATION: 300,
        TABLE_MAX_HEIGHT: '500px',
        MODAL_CLOSE_ESC: true
    }
};

window.AppConfig = AppConfig;
