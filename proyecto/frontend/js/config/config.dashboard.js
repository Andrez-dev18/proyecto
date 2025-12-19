/**
 * Configuración del Dashboard Principal
 * Sistema de Gestión Avícola GRS
 */

const DASHBOARD_CONFIG = {
    // URL base del API
    API_BASE_URL: 'http://localhost/proyecto/backend',
    
    // Endpoints del Dashboard
    ENDPOINTS: {
        RESUMEN_GENERAL: '/dashboard/resumen-general',
        VIVO_AQP_RESUMEN: '/dashboard/vivo-aqp/resumen',
        VIVO_AQP_ZONA: '/dashboard/vivo-aqp/zona',
        VIVO_AQP_PROVEEDOR: '/dashboard/vivo-aqp/proveedor',
        BENEFICIADO_RESUMEN: '/dashboard/beneficiado/resumen',
        TROZADO_RESUMEN: '/dashboard/trozado/resumen',
        TROZADO_PRODUCTO: '/dashboard/trozado/producto',
        CLIENTE_TOP: '/dashboard/cliente/top',
        CLIENTE_LINEA: '/dashboard/cliente/linea',
        HUEVO_RESUMEN: '/dashboard/huevo/resumen',
        GALLINA_RESUMEN: '/dashboard/gallina/resumen'
         CRIADORES_RESUMEN: '/dashboard/criadores/resumen',      
    PRODUCTO_SUSTITUTO: '/dashboard/producto-sustituto/resumen'  
    },
    
    // Configuración de gráficas
    CHART_COLORS: {
        PRIMARY: 'rgba(102, 126, 234, 0.8)',
        SECONDARY: 'rgba(118, 75, 162, 0.8)',
        SUCCESS: 'rgba(17, 153, 142, 0.8)',
        INFO: 'rgba(79, 172, 254, 0.8)',
        WARNING: 'rgba(240, 147, 251, 0.8)',
        DANGER: 'rgba(245, 87, 108, 0.8)',
        LIGHT: 'rgba(56, 239, 125, 0.8)',
        DARK: 'rgba(0, 242, 254, 0.8)'
    },
    
    // Paleta de colores para gráficas múltiples
    CHART_PALETTE: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(17, 153, 142, 0.8)',
        'rgba(56, 239, 125, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(245, 87, 108, 0.8)',
        'rgba(79, 172, 254, 0.8)',
        'rgba(0, 242, 254, 0.8)'
    ],
    
    // Configuración global de Chart.js
    CHART_DEFAULT_OPTIONS: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        }
    },
    
    // Configuración de tablas
    TABLE_CONFIG: {
        MAX_ROWS: 50,
        PAGINATION: true,
        SEARCH: true
    },
    
    // Configuración de filtros por defecto
    DEFAULT_FILTERS: {
        FECHA_INICIO: null, // Se establecerá dinámicamente
        FECHA_FIN: null,    // Se establecerá dinámicamente
        DIAS_ATRAS: 30      // Últimos 30 días por defecto
    },
    
    // Mensajes del sistema
    MESSAGES: {
        LOADING: 'Cargando datos...',
        NO_DATA: 'No hay datos disponibles',
        ERROR_LOAD: 'Error al cargar datos',
        SUCCESS_LOAD: 'Datos cargados exitosamente',
        ERROR_CONNECTION: 'Error de conexión con el servidor',
        ERROR_TIMEOUT: 'Tiempo de espera agotado'
    },
    
    // Configuración de formato
    FORMAT: {
        LOCALE: 'es-PE',
        CURRENCY: 'PEN',
        DECIMAL_PLACES: 2,
        DATE_FORMAT: 'DD/MM/YYYY'
    },
    
    // Timeout para peticiones HTTP (milisegundos)
    HTTP_TIMEOUT: 30000,
    
    // Configuración de refresh automático (opcional)
    AUTO_REFRESH: {
        ENABLED: false,
        INTERVAL: 300000 // 5 minutos
    },
    
    // Límites de datos
    LIMITS: {
        TOP_CLIENTES: 20,
        TOP_PROVEEDORES: 10,
        TOP_PRODUCTOS: 15,
        DIAS_HISTORIA: 30
    }
};

// Función para obtener la URL completa de un endpoint
function getDashboardEndpoint(endpointKey) {
    return DASHBOARD_CONFIG.API_BASE_URL + DASHBOARD_CONFIG.ENDPOINTS[endpointKey];
}

// Función para obtener colores de la paleta
function getChartColor(index) {
    return DASHBOARD_CONFIG.CHART_PALETTE[index % DASHBOARD_CONFIG.CHART_PALETTE.length];
}

// Función para formatear números
function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return '0.00';
    
    return parseFloat(value).toLocaleString(DASHBOARD_CONFIG.FORMAT.LOCALE, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Función para formatear moneda
function formatCurrency(value) {
    if (value === null || value === undefined || isNaN(value)) return 'S/ 0.00';
    
    return 'S/ ' + formatNumber(value, DASHBOARD_CONFIG.FORMAT.DECIMAL_PLACES);
}

// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString(DASHBOARD_CONFIG.FORMAT.LOCALE);
    } catch (error) {
        return dateString;
    }
}

// Función para obtener fecha por defecto (últimos N días)
function getDefaultDates(diasAtras = DASHBOARD_CONFIG.DEFAULT_FILTERS.DIAS_ATRAS) {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - diasAtras);
    
    return {
        fechaInicio: inicio.toISOString().split('T')[0],
        fechaFin: hoy.toISOString().split('T')[0]
    };
}

// Exportar configuración (si se usa módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DASHBOARD_CONFIG;
}
