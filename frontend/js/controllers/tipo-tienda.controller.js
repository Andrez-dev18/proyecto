class TipoTiendaController {
    constructor() {
        this.service = new TipoTiendaService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.config = window.TipoTiendaConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando Tipo Tienda Controller...');
        await this.cargarDatos();
        this.setupEventListeners();
        this.setupColumnToggle();
        this.renderizarTablaCliente();
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
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        btnClose?.addEventListener('click', (e) => {
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
                const columnIndex = parseInt(e.target.dataset.column);
                this.columnasVisibles[columnIndex] = e.target.checked;
                
                if (this.dataTable) {
                    const column = this.dataTable.column(columnIndex);
                    column.visible(e.target.checked);
                }
            });
        });
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            console.log('Cargando todos los datos...');
            
            this.datos = await this.service.getAll();
            this.datosFiltrados = [...this.datos];
            
            console.log(`${this.datos.length} registros cargados`);
            
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos', 'error');
            this.datos = [];
            this.datosFiltrados = [];
        } finally {
            this.mostrarCargando(false);
        }
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    renderizarTablaCliente() {
    console.log('Renderizando tabla con', this.datosFiltrados.length, 'registros...');
    
    const table = $('#tablaTipoTienda'); // Cambiar aquí el ID
    
    if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().clear().destroy();
    }

    this.dataTable = table.DataTable({
        data: this.datosFiltrados,
        processing: false,
        serverSide: false,
        destroy: true,
        columns: [
            { 
                data: 'codigo', 
                className: 'text-center',
                defaultContent: ''
            },
            { 
                data: 'nombre', 
                className: 'text-left',
                defaultContent: '-'
            },
            { 
                data: 'codpro', 
                className: 'text-center',
                defaultContent: '-'
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                className: 'text-center',
                defaultContent: '',
                render: (data, type, row) => `
                    <div class="flex gap-1 justify-center">
                        <button class="btn-tabla-editar edit-btn" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-tabla-eliminar delete-btn" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ],
        order: [[0, 'desc']],
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
        },
        responsive: false,
        autoWidth: false,
        drawCallback: () => {
            Object.keys(this.columnasVisibles).forEach(columnIndex => {
                const index = parseInt(columnIndex);
                if (this.dataTable && this.dataTable.column(index)) {
                    this.dataTable.column(index).visible(this.columnasVisibles[index]);
                }
            });
        }
    });

    // Eventos de botones
    $('#tablaTipoTienda tbody')
        .off('click')
        .on('click', '.edit-btn', (e) => {
            e.stopPropagation();
            const row = $(e.currentTarget).closest('tr');
            const rowData = this.dataTable.row(row).data();
            this.registroSeleccionado = rowData;
            this.modificarSeleccionado();
        })
        .on('click', '.delete-btn', async (e) => {
            e.stopPropagation();
            const row = $(e.currentTarget).closest('tr');
            const rowData = this.dataTable.row(row).data();
            this.registroSeleccionado = rowData;
            await this.eliminarSeleccionado();
        });
}


    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Tipo Tienda';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) return;

        document.getElementById('modalTitle').textContent = 'Modificar Tipo Tienda';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) return;
        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        try {
            this.mostrarCargando(true);
            await this.service.delete(this.registroSeleccionado.codigo);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            
            await this.cargarDatos();
            
            if (this.dataTable) {
                this.dataTable.destroy();
            }
            this.renderizarTablaCliente();
            
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion(error.message || 'Error al eliminar el registro', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;

        console.log('Cargando en formulario:', r);
        document.getElementById('modalNombre').value = r.nombre || '';
        document.getElementById('modalCodpro').value = r.codpro || '';
    }

    limpiarFormulario() {
        document.getElementById('modalNombre').value = '';
        document.getElementById('modalCodpro').value = '';
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.codigo = this.registroSeleccionado.codigo;
                await this.service.update(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                delete data.codigo;
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            
            await this.cargarDatos();
            
            if (this.dataTable) {
                this.dataTable.destroy();
            }
            this.renderizarTablaCliente();
            
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion(error.message || 'Error al guardar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        return {
            nombre: document.getElementById('modalNombre').value.trim(),
            codpro: document.getElementById('modalCodpro').value.trim() || null
        };
    }

    validarFormulario(data) {
        console.log('Validando formulario:', data);

        if (!data.nombre) {
            this.mostrarNotificacion('El nombre del tipo es obligatorio', 'warning');
            return false;
        }

        console.log('✅ Validación exitosa');
        return true;
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`[${tipo.toUpperCase()}] ${mensaje}`);

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
            warning: '⚠️',
            info: 'ℹ️'
        };

        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center gap-3`;
        notif.innerHTML = `
            <span style="font-size: 20px;">${iconos[tipo]}</span>
            <span>${mensaje}</span>
        `;
        container.appendChild(notif);

        setTimeout(() => notif.remove(), 4000);
    }
}

window.tipoTiendaController = new TipoTiendaController();

