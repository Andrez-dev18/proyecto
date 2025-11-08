class TamanoMercadoController {
    constructor() {
        this.service = new TamanoMercadoService();
        this.tipoActual = null;
        this.tablaActual = null;
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
    }

    async init() {
        //await this.cargarCatalogos();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botones acción
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnModificar')?.addEventListener('click', () => this.modificarSeleccionado());
        document.getElementById('btnEliminar')?.addEventListener('click', () => this.eliminarSeleccionado());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());

        // Filtros
        document.getElementById('filterFechaInicio')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterFechaFin')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterMercado')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProvincia')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProveedor')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterCondicion')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterTipo')?.addEventListener('change', () => this.aplicarFiltros());

        // Modal
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            
            this.datos = await this.service.getAll();

            console.log(`Datos cargados:`, this.datos);

            // Verificar si los datos son un array
            if (!Array.isArray(this.datos)) {
                throw new Error('La respuesta no es un array válido');
            }
            this.renderizarTabla();
            this.mostrarNotificacion(`✅ ${this.datos.length} registros cargados`, 'success');
        } catch (error) {
            console.error('Error detallado:', error);
            this.mostrarNotificacion('❌ ' + error.message, 'error');
            this.datos = []; // Resetear datos en caso de error
            this.renderizarTabla(); // Mostrar tabla vacía
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    renderizarTabla() {
        const table = $('.min-w-full'); // referencia rápida
        const tbody = document.getElementById('tableBody');
        const thead = document.querySelector('thead tr');
        if (!tbody || !thead) return;

        // 🧹 Si la tabla ya tiene un DataTable activo, destruirlo antes de regenerar contenido
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        tbody.innerHTML = '';
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="30" class="text-center py-4 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        // Detectar columnas según tipo
        let columnas = [];
            columnas = [
                'id', 'fecha', 'tipo', 'linea', 'provincia', 'zona',
                'empresa', 'proveedor',
                'producto', 'cantidad', 'peso', 'prom',
                'precio', 'info_mercado', 'nom_db'
            ];
        // Agregar columna "Opciones"
        const columnasConOpciones = [...columnas, 'Opciones'];

        // Generar encabezado
        thead.innerHTML = columnasConOpciones
            .map(c => `<th class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-left">${c.replace(/([A-Z])/g, ' $1')}</th>`)
            .join('');

        // Generar filas con botones de acción
        tbody.innerHTML = this.datos
            .map((registro, i) => `
            <tr class="hover:bg-blue-50 transition-colors">
                ${columnas.map(col => `<td class="px-2 py-1 border-b text-sm text-gray-700">${registro[col] ?? '-'}</td>`).join('')}
                <td class="px-2 py-1 border-b text-sm text-center space-x-2">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" data-index="${i}">
                        <i class="fas fa-edit"></i> 
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" data-index="${i}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `)
            .join('');

        // Asignar eventos a los botones Editar y Eliminar
        tbody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.registroSeleccionado = this.datos[index];
                //this.modificarSeleccionado();
            });
        });

        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.registroSeleccionado = this.datos[index];
                //await this.eliminarSeleccionado();
            });
        });
        // 🟢 Inicializar DataTable (después de renderizar filas)
        if ($.fn.DataTable.isDataTable('.min-w-full')) {
            $('.min-w-full').DataTable().destroy(); // evitar duplicar instancias
        }
        $('.min-w-full').DataTable({
            pageLength: 10,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
            },
            responsive: true,
            order: [[0, 'desc']],
        });
    }

     mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`[${tipo}] ${mensaje}`);

        // Crear contenedor si no existe
        let container = document.getElementById('notificaciones-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificaciones-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
            document.body.appendChild(container);
        }

        // Crear notificación
        const notif = document.createElement('div');
        const colores = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        const iconos = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center gap-3`;
        notif.style.animation = 'slideInRight 0.3s ease';
        notif.innerHTML = `
            <span style="font-size: 20px;">${iconos[tipo]}</span>
            <span>${mensaje}</span>
        `;

        container.appendChild(notif);

        // Auto-eliminar después de 4 segundos
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }

}

window.tamanoMercadoController = new TamanoMercadoController();