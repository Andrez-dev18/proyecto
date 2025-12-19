class DashboardController {
    constructor() {
        this.service = new DashboardService();
        this.charts = {};
        this.fechaInicio = null;
        this.fechaFin = null;
        this.init();
    }

    init() {
        console.log('🚀 Inicializando Dashboard Controller...');
        this.setupEventListeners();
        this.cargarDashboard();
    }

    setupEventListeners() {
        document.getElementById('btnFiltrar').addEventListener('click', () => {
            this.fechaInicio = document.getElementById('fechaInicio').value;
            this.fechaFin = document.getElementById('fechaFin').value;
            this.cargarDashboard();
        });

        document.getElementById('btnLimpiar').addEventListener('click', () => {
            document.getElementById('fechaInicio').value = '';
            document.getElementById('fechaFin').value = '';
            this.fechaInicio = null;
            this.fechaFin = null;
            this.cargarDashboard();
        });
    }

    async cargarDashboard() {
        try {
            console.log('📊 Cargando dashboard...');
            
            await Promise.all([
                this.cargarResumenGeneral(),
                this.cargarVivoEvolucion(),
                this.cargarVivoZona(),
                this.cargarVivoProveedor(),
                this.cargarBeneficiadoPrecios(),
                this.cargarTrozadoProducto(),
                this.cargarTrozadoResumen(),
                this.cargarClienteTop(),
                this.cargarClienteLinea(),
                this.cargarHuevoPrecios(),
                this.cargarGallinaPrecios(),
                 this.cargarCriadores(),           // ⬅️ NUEVO
    this.cargarProductoSustituto()    // ⬅️ NUEVO
            ]);
            
            console.log('✅ Dashboard cargado exitosamente');
        } catch (error) {
            console.error('❌ Error al cargar dashboard:', error);
            alert('Error al cargar el dashboard: ' + error.message);
        }
    }

    // ==================== RESUMEN GENERAL ====================
    async cargarResumenGeneral() {
        try {
            const data = await this.service.getResumenGeneral(this.fechaInicio, this.fechaFin);
            
            // Total Vivo
            const totalVivoKg = parseFloat(data.vivo?.total_peso || 0);
            document.getElementById('totalVivoKg').textContent = 
                totalVivoKg.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kg';
            
            // Total Trozado
            const totalTrozado = parseFloat(data.trozado?.total_importe || 0);
            document.getElementById('totalTrozadoS').textContent = 
                'S/ ' + totalTrozado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            // Total Clientes
            const totalClientes = parseInt(data.clientes?.total_clientes || 0);
            document.getElementById('totalClientes').textContent = totalClientes.toLocaleString('es-PE');
            
            // Total Ventas Clientes
            const totalVentas = parseFloat(data.clientes?.total_ventas || 0);
            document.getElementById('totalVentasS').textContent = 
                'S/ ' + totalVentas.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
        } catch (error) {
            console.error('Error en cargarResumenGeneral:', error);
        }
    }

    // ==================== VIVO EVOLUCIÓN ====================
    async cargarVivoEvolucion() {
        try {
            const data = await this.service.getVivoAqpResumen(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => item.fecha).reverse();
            const cantidad = data.map(item => parseFloat(item.total_cantidad || 0)).reverse();
            const peso = data.map(item => parseFloat(item.total_peso || 0)).reverse();
            
            this.crearGrafica('chartVivoEvolucion', {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Cantidad (unidades)',
                            data: cantidad,
                            borderColor: 'rgb(102, 126, 234)',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Peso (kg)',
                            data: peso,
                            borderColor: 'rgb(118, 75, 162)',
                            backgroundColor: 'rgba(118, 75, 162, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Cantidad (unidades)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Peso (kg)'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarVivoEvolucion:', error);
        }
    }

    // ==================== VIVO POR ZONA ====================
    async cargarVivoZona() {
        try {
            const data = await this.service.getVivoAqpPorZona(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => item.zona_nombre || 'Sin zona');
            const valores = data.map(item => parseFloat(item.total_cantidad || 0));
            
            this.crearGrafica('chartVivoZona', {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.8)',
                            'rgba(118, 75, 162, 0.8)',
                            'rgba(17, 153, 142, 0.8)',
                            'rgba(56, 239, 125, 0.8)',
                            'rgba(240, 147, 251, 0.8)',
                            'rgba(245, 87, 108, 0.8)',
                            'rgba(79, 172, 254, 0.8)',
                            'rgba(0, 242, 254, 0.8)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarVivoZona:', error);
        }
    }

    // ==================== VIVO POR PROVEEDOR ====================
    async cargarVivoProveedor() {
        try {
            const data = await this.service.getVivoAqpPorProveedor(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => item.proveedor_nombre || 'Sin nombre');
            const valores = data.map(item => parseFloat(item.total_peso || 0));
            
            this.crearGrafica('chartVivoProveedor', {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Peso Total (kg)',
                        data: valores,
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: 'rgb(102, 126, 234)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Peso (kg)'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarVivoProveedor:', error);
        }
    }

    // ==================== BENEFICIADO PRECIOS ====================
    async cargarBeneficiadoPrecios() {
        try {
            const data = await this.service.getBeneficiadoProvinciaResumen(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => `${item.fecha} - ${item.provincia_nombre || 'S/N'}`);
            const precioMayEntero = data.map(item => parseFloat(item.precio_may_entero || 0));
            const precioMayMejorado = data.map(item => parseFloat(item.precio_may_mejorado || 0));
            const precioPubMejorado = data.map(item => parseFloat(item.precio_pub_mejorado || 0));
            
            this.crearGrafica('chartBeneficiadoPrecios', {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Mayorista Entero',
                            data: precioMayEntero,
                            borderColor: 'rgb(17, 153, 142)',
                            backgroundColor: 'rgba(17, 153, 142, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Mayorista Mejorado',
                            data: precioMayMejorado,
                            borderColor: 'rgb(56, 239, 125)',
                            backgroundColor: 'rgba(56, 239, 125, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Público Mejorado',
                            data: precioPubMejorado,
                            borderColor: 'rgb(245, 87, 108)',
                            backgroundColor: 'rgba(245, 87, 108, 0.1)',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Precio (S/)'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarBeneficiadoPrecios:', error);
        }
    }

    // ==================== TROZADO POR PRODUCTO ====================
    async cargarTrozadoProducto() {
        try {
            const data = await this.service.getTrozadoPorProducto(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => `Producto ${item.producto}`);
            const valores = data.map(item => parseFloat(item.total_importe || 0));
            
            this.crearGrafica('chartTrozadoProducto', {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ventas (S/)',
                        data: valores,
                        backgroundColor: 'rgba(17, 153, 142, 0.8)',
                        borderColor: 'rgb(17, 153, 142)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Importe (S/)'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarTrozadoProducto:', error);
        }
    }
    // ==================== TROZADO RESUMEN TABLA ====================
    async cargarTrozadoResumen() {
        try {
            const data = await this.service.getTrozadoDiarioResumen(this.fechaInicio, this.fechaFin);
            
            const tbody = document.getElementById('tableTrozadoBody');
            tbody.innerHTML = '';
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay datos disponibles</td></tr>';
                return;
            }
            
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.fecha}</td>
                    <td>${item.zona || 'N/A'}</td>
                    <td>${item.linea || 'N/A'}</td>
                    <td>${parseFloat(item.total_cantidad || 0).toLocaleString('es-PE')}</td>
                    <td>${parseFloat(item.total_peso || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                    <td>S/ ${parseFloat(item.total_importe || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                    <td>S/ ${parseFloat(item.precio_promedio || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error en cargarTrozadoResumen:', error);
            const tbody = document.getElementById('tableTrozadoBody');
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Error al cargar datos</td></tr>';
        }
    }

    // ==================== CLIENTE TOP ====================
    async cargarClienteTop() {
        try {
            const data = await this.service.getClienteProcesadosTop(this.fechaInicio, this.fechaFin, 20);
            
            const labels = data.map(item => item.cliente || 'Sin nombre');
            const valores = data.map(item => parseFloat(item.total_importe || 0));
            
            this.crearGrafica('chartClienteTop', {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ventas (S/)',
                        data: valores,
                        backgroundColor: 'rgba(79, 172, 254, 0.8)',
                        borderColor: 'rgb(79, 172, 254)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Importe (S/)'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarClienteTop:', error);
        }
    }

    // ==================== CLIENTE POR LÍNEA ====================
    async cargarClienteLinea() {
        try {
            const data = await this.service.getClientePorLinea(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => `Línea ${item.linea}`);
            const numClientes = data.map(item => parseInt(item.num_clientes || 0));
            const totalImporte = data.map(item => parseFloat(item.total_importe || 0));
            
            this.crearGrafica('chartClienteLinea', {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Número de Clientes',
                            data: numClientes,
                            backgroundColor: 'rgba(240, 147, 251, 0.8)',
                            borderColor: 'rgb(240, 147, 251)',
                            borderWidth: 1,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Ventas (S/)',
                            data: totalImporte,
                            backgroundColor: 'rgba(245, 87, 108, 0.8)',
                            borderColor: 'rgb(245, 87, 108)',
                            borderWidth: 1,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Número de Clientes'
                            },
                            beginAtZero: true
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Ventas (S/)'
                            },
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarClienteLinea:', error);
        }
    }

    // ==================== HUEVO PRECIOS ====================
    async cargarHuevoPrecios() {
        try {
            const data = await this.service.getHuevoResumen(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => `${item.fecha} - ${item.tipo_nombre || 'S/N'}`);
            const precioMayMin = data.map(item => parseFloat(item.precio_may_min || 0));
            const precioMayMax = data.map(item => parseFloat(item.precio_may_max || 0));
            const precioPubMin = data.map(item => parseFloat(item.precio_pub_min || 0));
            const precioPubMax = data.map(item => parseFloat(item.precio_pub_max || 0));
            
            this.crearGrafica('chartHuevoPrecios', {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Mayorista Min',
                            data: precioMayMin,
                            borderColor: 'rgb(102, 126, 234)',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Mayorista Max',
                            data: precioMayMax,
                            borderColor: 'rgb(118, 75, 162)',
                            backgroundColor: 'rgba(118, 75, 162, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Público Min',
                            data: precioPubMin,
                            borderColor: 'rgb(17, 153, 142)',
                            backgroundColor: 'rgba(17, 153, 142, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Público Max',
                            data: precioPubMax,
                            borderColor: 'rgb(56, 239, 125)',
                            backgroundColor: 'rgba(56, 239, 125, 0.1)',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Precio (S/)'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarHuevoPrecios:', error);
        }
    }
        async getCriadoresEmprendedoresResumen(fechaInicio = null, fechaFin = null) {
        try {
            const url = this.buildUrl(DASHBOARD_CONFIG.ENDPOINTS.CRIADORES_RESUMEN, {
                fechaInicio,
                fechaFin
            });
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || DASHBOARD_CONFIG.MESSAGES.ERROR_LOAD);
            }
            return data.data;
        } catch (error) {
            console.error('Error en getCriadoresEmprendedoresResumen:', error);
            throw error;
        }
    }

    async getProductoSustitutoResumen(fechaInicio = null, fechaFin = null) {
        try {
            const url = this.buildUrl(DASHBOARD_CONFIG.ENDPOINTS.PRODUCTO_SUSTITUTO, {
                fechaInicio,
                fechaFin
            });
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || DASHBOARD_CONFIG.MESSAGES.ERROR_LOAD);
            }
            return data.data;
        } catch (error) {
            console.error('Error en getProductoSustitutoResumen:', error);
            throw error;
        }
    }

        // ==================== CRIADORES EMPRENDEDORES ====================
    async cargarCriadores() {
        try {
            const data = await this.service.getCriadoresEmprendedoresResumen(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => item.fecha);
            const cantidad = data.map(item => parseFloat(item.total_cantidad || 0));
            
            this.crearGrafica('chartCriadores', {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cantidad Total',
                        data: cantidad,
                        borderColor: 'rgb(20, 184, 166)',
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Cantidad'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarCriadores:', error);
        }
    }

    // ==================== PRODUCTO SUSTITUTO ====================
    async cargarProductoSustituto() {
        try {
            const data = await this.service.getProductoSustitutoResumen(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => `${item.fecha} - ${item.producto}`);
            const precioMin = data.map(item => parseFloat(item.precio_min_prom || 0));
            const precioMax = data.map(item => parseFloat(item.precio_max_prom || 0));
            
            this.crearGrafica('chartProductoSustituto', {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Precio Mínimo',
                            data: precioMin,
                            borderColor: 'rgb(236, 72, 153)',
                            backgroundColor: 'rgba(236, 72, 153, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Precio Máximo',
                            data: precioMax,
                            borderColor: 'rgb(219, 39, 119)',
                            backgroundColor: 'rgba(219, 39, 119, 0.1)',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Precio (S/)'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarProductoSustituto:', error);
        }
    }



    // ==================== GALLINA PRECIOS ====================
    async cargarGallinaPrecios() {
        try {
            const data = await this.service.getGallinaResumen(this.fechaInicio, this.fechaFin);
            
            const labels = data.map(item => `${item.fecha} - ${item.tipo_nombre || 'S/N'}`);
            const precioMayMin = data.map(item => parseFloat(item.precio_may_min || 0));
            const precioMayMax = data.map(item => parseFloat(item.precio_may_max || 0));
            const cantidad = data.map(item => parseFloat(item.total_cantidad || 0));
            
            this.crearGrafica('chartGallinaPrecios', {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Precio Min (S/)',
                            data: precioMayMin,
                            borderColor: 'rgb(240, 147, 251)',
                            backgroundColor: 'rgba(240, 147, 251, 0.1)',
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Precio Max (S/)',
                            data: precioMayMax,
                            borderColor: 'rgb(245, 87, 108)',
                            backgroundColor: 'rgba(245, 87, 108, 0.1)',
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Cantidad',
                            data: cantidad,
                            borderColor: 'rgb(79, 172, 254)',
                            backgroundColor: 'rgba(79, 172, 254, 0.1)',
                            tension: 0.4,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Precio (S/)'
                            },
                            beginAtZero: true
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Cantidad'
                            },
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error en cargarGallinaPrecios:', error);
        }
    }

    // ==================== HELPER: CREAR GRÁFICA ====================
    crearGrafica(canvasId, config) {
        // Destruir gráfica anterior si existe
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error(`Canvas ${canvasId} no encontrado`);
            return;
        }
        
        this.charts[canvasId] = new Chart(ctx, config);
    }
}

// ==================== INICIALIZAR ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM cargado, iniciando Dashboard...');
    new DashboardController();
});


