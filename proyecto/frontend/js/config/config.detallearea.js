const DetalleAreaConfig = {
    ENDPOINTS: {
        ALL: '/detallearea/all',
        CREAR: '/detallearea/crear',
        EDITAR: '/detallearea/actualizar',
        BORRAR: '/detallearea/borrar',
        FILTRO: '/detallearea/filtro?',
        EXPORTAR: '/detallearea/exportar'
    },
    AREAS: [
        { id: 'INFORMACION_MERCADO', nombre: '1.- Información del Mercado' },
        { id: 'CRIADORES_EMPRENDEDORES', nombre: '2.- Criadores Emprendedores' },
        { id: 'INGRESOS_LIMA', nombre: '3.- Ingresos Lima' },
        { id: 'GALLINA_CD', nombre: '4.- Gallina CD' },
        { id: 'PRODUCTO_SUSTITUTO', nombre: '5.- Producto Sustituto' },
        { id: 'PUESTO_MERCADO', nombre: '6.- Puesto Mercado y Tiendas Aledañas' },
        { id: 'TAMANO_MERCADO', nombre: '7.- Tamaño Mercado' },
        { id: 'POTENCIAL_VENTA', nombre: '8.- Potencial de Venta' },
        { id: 'CLIENTES_PROCESADOS', nombre: '9.- Clientes Procesados' },
        { id: 'BASE_DATOS_OFICIAL', nombre: '10.- Base de datos oficial' },
        { id: 'CONTROL_CLIENTES_PV', nombre: '11.- Control de Clientes Pollo Vivo' },
        { id: 'INFORMACION_GRS', nombre: '12.- Informacion GRS' },
        { id: 'TROZADO_DIARIO', nombre: '13.- Trozado Diario' },
        /*{ id: 'DETALLE_AREA', nombre: '14.- Detalle Area' },
        { id: 'MAESTROS_SISTEMA', nombre: '15.- Maestros del Sistema' }*/
    ]
};

// Agregar al objeto global de configuración
if (!window.AppConfig.API.ENDPOINTS.DETALLE_AREA) {
    window.AppConfig.API.ENDPOINTS.DETALLE_AREA = DetalleAreaConfig.ENDPOINTS;
}

