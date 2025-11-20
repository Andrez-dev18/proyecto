const ClienteProcesadoConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/clienteProce/all',
            CREAR: '/clienteProce/crear',
            EDITAR: '/clienteProce/actualizar',
            BORRAR: '/clienteProce/borrar',
            FILTRO: '/clienteProce/filtro',
            EXPORTA: '/clienteProce/exportar',
            ETL: '/clienteProce/etl'
        }
    },
    MENSAJES: {
        EXITO: {
            GUARDADO: '✓ Registro guardado exitosamente',
            ACTUALIZADO: '✓ Registro actualizado exitosamente',
            ELIMINADO: '✓ Registro eliminado exitosamente',
            ETL_COMPLETADO: '✓ ETL ejecutado exitosamente'
        },
        ERROR: {
            CARGAR_DATOS: 'Error al cargar los datos',
            GUARDAR: 'Error al guardar el registro',
            ACTUALIZAR: 'Error al actualizar el registro',
            ELIMINAR: 'Error al eliminar el registro',
            CONEXION: 'Error de conexión con el servidor'
        }
    }
};

window.ClienteProcesadoConfig = ClienteProcesadoConfig;
