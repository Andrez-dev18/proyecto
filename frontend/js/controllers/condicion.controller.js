class CondicionController {
    constructor() {
        this.service = new CondicionService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.dataTable = null;
        this.columnasVisibles = {};
        this.filtrosVisibles = false; // Filtros ocultos por defecto
    }

    async init() {
        this.setupEventListeners();
        this.setupColumnToggle();
        this.setupFilterToggle();
        await this.cargarDatos();
    }

    setupFilterToggle() {
        const btnToggle = document.getElementById('btnToggleFiltros');
        const filterContent = document.getElementById('filterContent');
        const iconToggle = document.getElementById('iconToggle');

        btnToggle?.addEventListener('click', () => {
            this.filtrosVisibles = !this.filtrosVisibles;
            
            if (this.filtrosVisibles) {
                filterContent.classList.remove('filter-collapsed');
                filterContent.classList.add('filter-expanded');
                iconToggle.classList.remove('fa-chevron-down');
                iconToggle.classList.add('fa-chevron-up');
            } else {
                filterContent.classList.remove('filter-expanded');
                filterContent.classList.add('filter-collapsed');
                iconToggle.classList.remove('fa-chevron-up');
                iconToggle.classList.add('fa-chevron-down');
            }
        });
    }

    setupColumnToggle() {
        const btnToggle = document.getElementById('btnToggleColumns');
        const dropdown = document.getElementById('columnDropdown');
        const btnClose = document.getElementById('btnCloseDropdown');
        const checkboxes = document.querySelectorAll('.column-checkbox');

        checkboxes.forEach(checkbox => {
            const columnIndex = parseInt(checkbox.dataset.column);
            this.columnasVisibles[columnIndex] = checkbox.checked;
        });

        btnToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        btnClose?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.remove('show');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-columns')) {
                dropdown.classList.remove('show');
            }
        });

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const columnIndex = parseInt(e.target.dataset.column);
                this.columnasVisibles[columnIndex] = e.target.checked;
                
                if (this.dataTable) {
                    const column = this.dataTable.column(columnIndex);
                    column.visible(e.target.checked);
                }
            });
        });
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            this.renderizarTablaFiltrada();
            this.mostrarNotificacion('Datos cargados correctamente', 'success');
        } catch (error) {
            console.error('Error detallado:', error);
            this.mostrarNotificacion(error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }


    renderizarTablaFiltrada() {
    const table = $('#tablaTipos');
    
    if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().clear().destroy();
    }

    // Configuración de columnas con anchos fijos
    const columnDefs = [
        { 
            targets: 0,
            data: 'codigo',
            className: 'text-center',
            width: '15%',
            defaultContent: ''
        },
        { 
            targets: 1,
            data: 'nombre',
            width: '40%',
            defaultContent: ''
        },
        { 
            targets: 2,
            data: 'linea',
            width: '30%',
            defaultContent: '',
            render: function(data, type, row) {
                return data || '';
            }
        },
        {
            targets: 3,
            data: null,
            orderable: false,
            searchable: false,
            className: 'text-center',
            width: '15%',
            defaultContent: '',
            render: (data, type, row) => `
                <div class="flex justify-center gap-2">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" 
                        data-codigo="${row.codigo}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" 
                        data-codigo="${row.codigo}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `
        }
    ];

    this.dataTable = table.DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: `${this.service.baseURL}${this.service.endpoints.ALL}`,
            type: 'GET',
            dataSrc: ''
        },
        columns: [
            { data: 'codigo' },
            { data: 'nombre' },
            { data: 'linea' },
            { data: null }
        ],
        columnDefs: columnDefs,
        order: [[0, 'desc']],
        responsive: false, // Desactivar responsive para mantener anchos fijos
        autoWidth: false, // Desactivar auto width
        scrollX: true, // Habilitar scroll horizontal si es necesario
        pageLength: 10,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
        },
        dom: '<"top"lf>rt<"bottom"ip><"clear">',
        drawCallback: () => {
            // Aplicar visibilidad de columnas
            Object.keys(this.columnasVisibles).forEach(columnIndex => {
                const column = this.dataTable.column(parseInt(columnIndex));
                if (column) {
                    column.visible(this.columnasVisibles[columnIndex]);
                }
            });
            
            // Mantener estilos del header
            $('#tablaTipos thead').css({
                'background': 'linear-gradient(to right, #2563eb, #1d4ed8)',
                'color': 'white'
            });
        },
        initComplete: function() {
            // Aplicar estilos iniciales
            $('#tablaTipos thead').css({
                'background': 'linear-gradient(to right, #2563eb, #1d4ed8)',
                'color': 'white'
            });
        }
    });

    // Event handlers con delegación
    $('#tablaTipos tbody').off('click', '.edit-btn').on('click', '.edit-btn', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
        this.registroSeleccionado = rowData;
        this.modificarSeleccionado();
    });

    $('#tablaTipos tbody').off('click', '.delete-btn').on('click', '.delete-btn', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const codigo = $(e.currentTarget).data('codigo');
        console.log('Botón eliminar clickeado, código:', codigo);
        await this.eliminarPorCodigo(codigo);
    });
}



    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Tipo';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Tipo';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        document.getElementById('modalNombre').value = r.nombre || '';
        document.getElementById('modalLinea').value = r.linea || '';
    }

    limpiarFormulario() {
        document.getElementById('modalNombre').value = '';
        document.getElementById('modalLinea').value = '';
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    async guardarRegistro() {
    const data = this.obtenerDatosFormulario();

    if (!this.validarFormulario(data)) return;

    try {
        this.mostrarCargando(true);

        if (this.registroSeleccionado) {
          
            data.codigo = this.registroSeleccionado.codigo;
            console.log('Actualizando registro:', data);
            await this.service.actualizar(data);
            this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
        } else {
            
            delete data.codigo;
            console.log('Creando nuevo registro:', data);
            await this.service.crear(data);
            this.mostrarNotificacion('Registro creado exitosamente', 'success');
        }

        this.cerrarModal();
        await this.cargarDatos();
    } catch (error) {
        console.error('Error al guardar:', error);
        this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
    } finally {
        this.mostrarCargando(false);
    }
}

    obtenerDatosFormulario() {
        return {
            nombre: document.getElementById('modalNombre').value.trim(),
            linea: document.getElementById('modalLinea').value.trim()
        };
    }

    validarFormulario(data) {
        if (!data.nombre) {
            this.mostrarNotificacion('El nombre es obligatorio', 'warning');
            return false;
        }
        return true;
    }

    async eliminarPorCodigo(codigo) {
    if (!codigo) {
        this.mostrarNotificacion('Código no válido', 'warning');
        return;
    }

    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
        this.mostrarCargando(true);
        console.log('Eliminando registro con código:', codigo);
        await this.service.eliminar(codigo);
        this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
        await this.cargarDatos();
    } catch (error) {
        console.error('Error al eliminar:', error);
        this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
    } finally {
        this.mostrarCargando(false);
    }
}

    async aplicarFiltros() {
        const filtros = {
            nombre: document.getElementById('filterNombre').value.trim(),
            linea: document.getElementById('filterLinea').value.trim()
        };

        if (filtros.nombre || filtros.linea) {
            const datos = await this.service.getAll();
            const datosFiltrados = datos.filter(item => {
                let cumple = true;
                if (filtros.nombre) {
                    cumple = cumple && item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
                }
                if (filtros.linea) {
                    cumple = cumple && item.linea.toLowerCase().includes(filtros.linea.toLowerCase());
                }
                return cumple;
            });
            this.dataTable.clear().rows.add(datosFiltrados).draw();
        } else {
            this.cargarDatos();
        }
    }

    limpiarFiltros() {
        document.getElementById('filterNombre').value = '';
        document.getElementById('filterLinea').value = '';
        this.cargarDatos();
    }

    exportarExcel() {
        try {
            this.service.exportarCSV();
            this.mostrarNotificacion('Iniciando descarga de Excel...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`[${tipo}] ${mensaje}`);

        let container = document.getElementById('notificaciones-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificaciones-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
            document.body.appendChild(container);
        }

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
            warning: '⚠',
            info: 'ℹ'
        };

        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center gap-3`;
        notif.style.animation = 'slideInRight 0.3s ease';
        notif.innerHTML = `
            <span style="font-size: 20px;">${iconos[tipo]}</span>
            <span>${mensaje}</span>
        `;

        container.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }
}

const condicionController = new CondicionController();

