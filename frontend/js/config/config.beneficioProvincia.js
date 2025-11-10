const BeneficioProvinciaConfig = {
    API: {
        BASE_URL: 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/beneficioProvincia/all',
            FILTRO: '/beneficioProvincia/filtro',
            CREAR: '/beneficioProvincia/crear',
            ACTUALIZAR: '/beneficioProvincia/actualizar',
            ELIMINAR: '/beneficioProvincia/borrar',
            EXCEL: '/reporte/beneficioProvincia/exportar'
        }
    },

    CATALOGOS: {
        PROVINCIAS: '/provincia/all',
        PROVEEDORES: '/proveedor/all'
    },

    CAMPOS: {
        REQUERIDOS: ['fecha', 'provincia', 'proveedor', 'cantidad'],
        OPCIONALES: [
            'precioMayEntero',
            'precioMayMejorado', 
            'precioMayCarcasa',
            'precioPubMejorado',
            'precioPubCarcasa',
            'pesoPromMenor',
            'pesoPromMayor',
            'colorMin',
            'colorMax'
        ]
    },

    MENSAJES: {
        EXITO: {
            CARGA: '✅ Datos cargados exitosamente',
            GUARDADO: '✅ Registro guardado exitosamente',
            ACTUALIZADO: '✅ Registro actualizado exitosamente',
            ELIMINADO: '✅ Registro eliminado exitosamente',
            EXPORTADO: '✅ Iniciando descarga de Excel...'
        },
        ERROR: {
            CARGAR: '❌ Error al cargar los datos',
            GUARDAR: '❌ Error al guardar el registro',
            ACTUALIZAR: '❌ Error al actualizar el registro',
            ELIMINAR: '❌ Error al eliminar el registro',
            EXPORTAR: '❌ Error al exportar',
            CATALOGOS: '❌ Error al cargar catálogos',
            CONEXION: '❌ Error de conexión con el servidor',
            FORMATO: '❌ Formato de respuesta inválido'
        },
        ADVERTENCIA: {
            SELECCIONAR: '⚠️ Selecciona un registro de la tabla',
            SIN_DATOS: '⚠️ No hay datos para exportar',
            FECHA_REQUERIDA: '⚠️ La fecha es obligatoria',
            PROVINCIA_REQUERIDA: '⚠️ La provincia es obligatoria',
            PROVEEDOR_REQUERIDO: '⚠️ El proveedor es obligatorio'
        },
        CONFIRMACION: {
            ELIMINAR: '¿Estás seguro de eliminar este registro?\n\nEsta acción no se puede deshacer.'
        }
    },

    UI: {
        ANIMATION_DURATION: 300,
        TABLE_PAGE_LENGTH: 10,
        NOTIFICATION_DURATION: 4000,
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    },

    TABLA: {
        COLUMNAS: [
            { titulo: '#', campo: 'index', tipo: 'numero', ancho: '50px' },
            { titulo: 'FECHA', campo: 'fecha', tipo: 'fecha' },
            { titulo: 'PROVINCIA', campo: 'provincia', tipo: 'texto' },
            { titulo: 'PROVEEDOR', campo: 'proveedor', tipo: 'texto' },
            { titulo: 'P.MAY ENTERO', campo: 'precioMayEntero', tipo: 'moneda' },
            { titulo: 'P.MAY MEJORADO', campo: 'precioMayMejorado', tipo: 'moneda' },
            { titulo: 'P.MAY CARCASA', campo: 'precioMayCarcasa', tipo: 'moneda' },
            { titulo: 'P.PUB MEJORADO', campo: 'precioPubMejorado', tipo: 'moneda' },
            { titulo: 'P.PUB CARCASA', campo: 'precioPubCarcasa', tipo: 'moneda' },
            { titulo: 'PESO PROM MIN', campo: 'pesoPromMenor', tipo: 'decimal' },
            { titulo: 'PESO PROM MAX', campo: 'pesoPromMayor', tipo: 'decimal' },
            { titulo: 'COLOR MIN', campo: 'colorMin', tipo: 'decimal' },
            { titulo: 'COLOR MAX', campo: 'colorMax', tipo: 'decimal' },
            { titulo: 'CANTIDAD', campo: 'cantidad', tipo: 'numero' },
            { titulo: 'OPCIONES', campo: 'acciones', tipo: 'acciones', ancho: '150px' }
        ]
    },

    VALIDACIONES: {
        FECHA: {
            MIN: '2020-01-01',
            MAX: '2030-12-31'
        },
        PRECIO: {
            MIN: 0,
            MAX: 999.99,
            DECIMALES: 2
        },
        PESO: {
            MIN: 0,
            MAX: 99.9,
            DECIMALES: 1
        },
        COLOR: {
            MIN: 0,
            MAX: 10,
            DECIMALES: 1
        },
        CANTIDAD: {
            MIN: 1,
            MAX: 999999
        }
    }
};

// Exportar configuración globalmente
window.BeneficioProvinciaConfig = BeneficioProvinciaConfig;
