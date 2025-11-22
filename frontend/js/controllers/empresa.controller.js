class EmpresaController {
    constructor() {
        this.service = new EmpresaService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.config = window.EmpresaConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('Inicializando EmpresaController');
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
                
                if (columnIndex === 3) {
                    e.target.checked = true;
                    this.mostrarNotificacion('La columna de opciones no se puede ocultar', 'warning');
                    return;
                }
                
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
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            this.datos = await this.service.getAll();
            console.log(`${this.datos.length} empresas cargadas`);
            this.renderizarTabla();
            this.mostrarNotificacion(`${this.datos.length} registros cargados`, 'success');
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos', 'error');
            this.datos = [];
            this.renderizarTabla();
        } finally {
            this.mostrarCargando(false);
        }
    }

    renderizarTabla() {
        const tbody = document.getElementById('tableBody');
        const tableElement = document.getElementById('dataTable');
        
        if (!tbody || !tableElement) {
            console.error('No se encontró la tabla o tbody');
            return;
        }

        if (this.dataTable) {
            try {
                this.dataTable.destroy();
                this.dataTable = null;
            } catch (e) {
                console.warn('Error al destruir DataTable:', e);
            }
        }

        tbody.innerHTML = '';
        
        if (!this.datos || this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        this.datos.forEach((registro, index) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-blue-50 transition-colors';
            tr.innerHTML = `
                <td class="px-2 py-2 text-sm text-center">${registro.codigo || '-'}</td>
                <td class="px-2 py-2 text-sm">${registro.nombre || '-'}</td>
                <td class="px-2 py-2 text-sm text-center">${registro.ruc || '-'}</td>
                <td class="px-2 py-2 text-sm text-center">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn ml-1" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');
            
            editBtn.onclick = (e) => {
                e.preventDefault();
                this.registroSeleccionado = this.datos[index];
                this.modificarSeleccionado();
            };
            
            deleteBtn.onclick = async (e) => {
                e.preventDefault();
                this.registroSeleccionado = this.datos[index];
                await this.eliminarSeleccionado();
            };
            
            tbody.appendChild(tr);
        });
        
        setTimeout(() => {
            try {
                this.dataTable = $(tableElement).DataTable({
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
                    order: [[0, 'desc']],
                    responsive: true,
                    autoWidth: false,
                    scrollX: true,
                    columnDefs: [
                        { width: '10%', targets: 0, className: 'text-center' },
                        { width: '50%', targets: 1 },
                        { width: '25%', targets: 2, className: 'text-center' },
                        { width: '15%', targets: 3, className: 'text-center', orderable: false }
                    ],
                    drawCallback: () => {
                        Object.keys(this.columnasVisibles).forEach(columnIndex => {
                            const index = parseInt(columnIndex);
                            if (index !== 3 && this.dataTable && this.dataTable.column(index)) {
                                this.dataTable.column(index).visible(this.columnasVisibles[index]);
                            }
                        });
                        
                        if (this.dataTable && this.dataTable.column(3)) {
                            this.dataTable.column(3).visible(true);
                        }
                    }
                });
                console.log('DataTable inicializado correctamente');
            } catch (error) {
                console.error('Error al inicializar DataTable:', error);
            }
        }, 200);
    }

    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nueva Empresa';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) return;

        document.getElementById('modalTitle').textContent = 'Modificar Empresa';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            console.error('No hay registro seleccionado');
            return;
        }
        
        const nombreEmpresa = this.registroSeleccionado.nombre || 'esta empresa';
        
        if (!confirm(`¿Está seguro de eliminar "${nombreEmpresa}"?`)) {
            console.log('Eliminación cancelada');
            return;
        }

        try {
            this.mostrarCargando(true);
            
            console.log('Eliminando empresa:', {
                codigo: this.registroSeleccionado.codigo,
                nombre: this.registroSeleccionado.nombre
            });
            
            const resultado = await this.service.eliminar(this.registroSeleccionado.codigo);
            
            console.log('Resultado eliminación:', resultado);
            
            this.mostrarNotificacion('Empresa eliminada correctamente', 'success');
            
            this.registroSeleccionado = null;
            
            await this.cargarDatos();
            
        } catch (error) {
            console.error('Error completo al eliminar:', {
                message: error.message,
                stack: error.stack,
                error: error
            });
            
            let mensajeError = 'Error al eliminar la empresa';
            if (error.message && error.message !== 'Error al eliminar la empresa') {
                mensajeError = error.message;
            }
            
            this.mostrarNotificacion(mensajeError, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        document.getElementById('modalNombre').value = r.nombre || '';
        document.getElementById('modalRuc').value = r.ruc || '';
    }

    limpiarFormulario() {
        document.getElementById('modalNombre').value = '';
        document.getElementById('modalRuc').value = '';
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.codigo = this.registroSeleccionado.codigo;
                await this.service.actualizar(data);
                this.mostrarNotificacion('Empresa actualizada correctamente', 'success');
            } else {
                await this.service.crear(data);
                this.mostrarNotificacion('Empresa creada correctamente', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
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
            ruc: document.getElementById('modalRuc').value.trim()
        };
    }

    validarFormulario(data) {
        if (!data.nombre) {
            this.mostrarNotificacion('El nombre es obligatorio', 'warning');
            return false;
        }

        if (data.nombre.length < 3) {
            this.mostrarNotificacion('El nombre debe tener al menos 3 caracteres', 'warning');
            return false;
        }

        if (data.ruc && data.ruc.length !== 11) {
            this.mostrarNotificacion('El RUC debe tener exactamente 11 dígitos', 'warning');
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
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center gap-3`;
        notif.style.animation = 'slideInRight 0.3s ease';
        notif.innerHTML = `
            <i class="fas ${iconos[tipo]} text-xl"></i>
            <span>${mensaje}</span>
        `;
        container.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }
}

window.empresaController = new EmpresaController();
