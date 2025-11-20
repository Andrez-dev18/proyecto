class TipoPolloController {
    constructor() {
        this.service = new TipoPolloService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.config = window.TipoPolloConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando Tipo Pollo Controller...');
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
        
        const table = $('#dataTable');
        
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        $('#tableBody').empty();

        this.dataTable = table.DataTable({
            data: this.datosFiltrados,
            processing: false,
            serverSide: false,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            columns: [
                { 
                    data: 'codigo', 
                    className: 'text-center text-sm px-2',
                    defaultContent: ''
                },
                { 
                    data: 'nombre', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center px-2',
                    defaultContent: '',
                    render: (data, type, row) => `
                        <div class="flex gap-1 justify-center">
                            <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn text-sm" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn text-sm" title="Eliminar">
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
                processing: "Procesando...",
                search: "Buscar:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "Mostrando 0 a 0 de 0 registros",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                loadingRecords: "Cargando...",
                zeroRecords: "No se encontraron registros",
                emptyTable: "No hay datos disponibles",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior"
                }
            },
            responsive: false,
            autoWidth: false,
            dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"<"flex items-center"l><"flex items-center"f>>rtip',
            drawCallback: () => {
                Object.keys(this.columnasVisibles).forEach(columnIndex => {
                    const index = parseInt(columnIndex);
                    try {
                        if (this.dataTable && this.dataTable.column(index)) {
                            this.dataTable.column(index).visible(this.columnasVisibles[index]);
                        }
                    } catch (e) {
                        // Ignorar errores
                    }
                });
            },
            initComplete: () => {
                console.log('✅ Tabla renderizada con', this.datosFiltrados.length, 'registros');
                $('.dataTables_wrapper').addClass('w-full');
            }
        });

        $('#dataTable tbody')
            .off('click')
            .on('click', '.edit-btn', (e) => {
                e.stopPropagation();
                const row = $(e.currentTarget).closest('tr');
                const rowData = this.dataTable.row(row).data();
                this.registroSeleccionado = rowData;
                console.log('📝 Editando:', rowData);
                this.modificarSeleccionado();
            })
            .on('click', '.delete-btn', async (e) => {
                e.stopPropagation();
                const row = $(e.currentTarget).closest('tr');
                const rowData = this.dataTable.row(row).data();
                this.registroSeleccionado = rowData;
                console.log('🗑️ Eliminando:', rowData);
                await this.eliminarSeleccionado();
            });
    }

    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Tipo Pollo';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) return;

        document.getElementById('modalTitle').textContent = 'Modificar Tipo Pollo';
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
    }

    limpiarFormulario() {
        document.getElementById('modalNombre').value = '';
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
            nombre: document.getElementById('modalNombre').value.trim()
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

window.tipoPolloController = new TipoPolloController();

