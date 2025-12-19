class TipoAlternoController {
    constructor() {
        this.service = new TipoAlternoService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.config = window.TipoAlternoConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando Tipo Alterno Controller...');
        this.setupEventListeners();
        this.setupColumnToggle();
        await this.cargarDatos();
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
            console.log('📥 Cargando datos desde el backend...');
            
            const response = await this.service.getAll();
            console.log('✅ Respuesta recibida:', response);
            
            this.datos = Array.isArray(response) ? response : [];
            console.log(`✅ ${this.datos.length} registros cargados`);
            
            this.renderizarTabla();
            
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos: ' + error.message, 'error');
            this.datos = [];
            this.renderizarTabla();
        } finally {
            this.mostrarCargando(false);
        }
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    renderizarTabla() {
        console.log('🔄 Renderizando tabla con', this.datos.length, 'registros...');
        
        const table = $('#dataTable');
        
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        this.dataTable = table.DataTable({
            data: this.datos,
            columns: [
                { 
                    data: 'codigo',
                    className: 'col-codigo px-4 py-2',
                    render: (data) => data || '-'
                },
                { 
                    data: 'nombre',
                    className: 'col-nombre px-4 py-2',
                    render: (data) => data || '-'
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'col-opciones px-4 py-2',
                    render: (data, type, row) => `
                        <div class="flex gap-2 justify-center">
                            <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded edit-btn" 
                                    data-id="${row.codigo}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded delete-btn" 
                                    data-id="${row.codigo}" title="Eliminar">
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
            drawCallback: () => {
                Object.keys(this.columnasVisibles).forEach(columnIndex => {
                    const index = parseInt(columnIndex);
                    if (this.dataTable && this.dataTable.column(index).length) {
                        this.dataTable.column(index).visible(this.columnasVisibles[index]);
                    }
                });
            }
        });

        $('#dataTable tbody')
            .off('click')
            .on('click', '.edit-btn', (e) => {
                e.stopPropagation();
                const id = $(e.currentTarget).data('id');
                this.registroSeleccionado = this.datos.find(d => d.codigo == id);
                console.log('📝 Editando:', this.registroSeleccionado);
                this.modificarSeleccionado();
            })
            .on('click', '.delete-btn', async (e) => {
                e.stopPropagation();
                const id = $(e.currentTarget).data('id');
                this.registroSeleccionado = this.datos.find(d => d.codigo == id);
                console.log('🗑️ Eliminando:', this.registroSeleccionado);
                await this.eliminarSeleccionado();
            });

        console.log('✅ Tabla renderizada correctamente');
    }

    exportarExcel() {
    try {
        console.log('📊 Exportando a Excel...');
        
        if (!this.datos || this.datos.length === 0) {
            this.mostrarNotificacion('No hay datos para exportar', 'warning');
            return;
        }

        const url = `${this.service.baseUrl}${this.config.API.ENDPOINTS.EXCEL}`;
        console.log('🔗 URL de exportación:', url);
        
        window.open(url, '_blank');
        this.mostrarNotificacion('Iniciando descarga de Excel...', 'info');
        
    } catch (error) {
        console.error('❌ Error al exportar:', error);
        this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
    }
}



    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Tipo Alterno';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro para editar', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Tipo Alterno';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro para eliminar', 'warning');
            return;
        }

        const nombreRegistro = this.registroSeleccionado.nombre || 'este registro';
        
        if (!confirm(`¿Estás seguro de eliminar "${nombreRegistro}"?`)) {
            console.log('❌ Eliminación cancelada por el usuario');
            return;
        }

        try {
            this.mostrarCargando(true);
            console.log('🗑️ Eliminando registro con código:', this.registroSeleccionado.codigo);
            
            await this.service.delete(this.registroSeleccionado.codigo);
            
            console.log('✅ Registro eliminado del backend');
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            
            this.registroSeleccionado = null;
            await this.cargarDatos();
            
        } catch (error) {
            console.error('❌ Error al eliminar:', error);
            this.mostrarNotificacion(error.message || 'Error al eliminar el registro', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;
        console.log('📋 Cargando datos en formulario:', r);
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
                console.log('✏️ Actualizando registro:', data);
                await this.service.update(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                console.log('➕ Creando nuevo registro:', data);
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
            
        } catch (error) {
            console.error('❌ Error al guardar:', error);
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
        if (!data.nombre) {
            this.mostrarNotificacion('El nombre del tipo alterno es obligatorio', 'warning');
            return false;
        }
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

window.tipoAlternoController = new TipoAlternoController();
