const ProductoConfig = {
    ENDPOINTS: {
        ALL: '/producto/all',
        CREAR: '/producto/crear',
        ACTUALIZAR: '/producto/actualizar',
        ELIMINAR: '/producto/borrar',
        FILTRO: '/producto/filtro',
        EXPORTAR: '/producto/exportar'
    },
    
    MENSAJES: {
        EXITO: {
            GUARDADO: '✅ Producto guardado exitosamente',
            ACTUALIZADO: '✅ Producto actualizado exitosamente',
            ELIMINADO: '✅ Producto eliminado exitosamente'
        },
        ERROR: {
            CARGAR_DATOS: 'Error al cargar los datos',
            GUARDAR: 'Error al guardar el producto',
            ACTUALIZAR: 'Error al actualizar el producto',
            ELIMINAR: 'Error al eliminar el producto',
            DESCRIPCION_DUPLICADA: 'Ya existe un producto con esa descripción'
        },
        CONFIRMACION: {
            ELIMINAR: '¿Estás seguro de eliminar este producto?\n\nEsta acción no se puede deshacer.'
        },
        VALIDACION: {
            DESCRIPCION_REQUERIDA: 'La descripción es obligatoria'
        }
    }
};

window.ProductoConfig = ProductoConfig;
