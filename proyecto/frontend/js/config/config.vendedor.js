const VendedorConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/vendedor/all',
            CREAR: '/vendedor/crear',
            ACTUALIZAR: '/vendedor/actualizar',
            ELIMINAR: '/vendedor/borrar',
            FILTRO: '/vendedor/filtro'
        }
    },
    
    MENSAJES: {
        EXITO: {
            GUARDADO: '✅ Vendedor guardado exitosamente',
            ACTUALIZADO: '✅ Vendedor actualizado exitosamente',
            ELIMINADO: '✅ Vendedor eliminado exitosamente'
        },
        ERROR: {
            CARGAR_DATOS: 'Error al cargar los datos',
            GUARDAR: 'Error al guardar el vendedor',
            ACTUALIZAR: 'Error al actualizar el vendedor',
            ELIMINAR: 'Error al eliminar el vendedor'
        },
        CONFIRMACION: {
            ELIMINAR: '¿Estás seguro de eliminar este vendedor?\n\nEsta acción no se puede deshacer.'
        }
    }
};

window.VendedorConfig = VendedorConfig;
