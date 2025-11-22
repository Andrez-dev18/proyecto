class ProvinciaController {
    constructor() {
        this.service = new ProvinciaService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.config = window.ProvinciaConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
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
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            this.datos = await this.service.getAll();
            this.renderizarTabla();
            this.mostrarNotificacion(`${this.datos.length} registros cargados`, 'success');
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al cargar datos', 'error');
            this.datos = [];
            this.renderizarTabla();
        } finally {
            this.mostrarCargando(false);
        }
    }

    renderizarTabla() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        const table = $('.min-w-full');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        tbody.innerHTML = '';
        
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        this.datos.forEach((registro, i) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-blue-50 transition-colors';
            tr.innerHTML = `
                <td class="px-2 py-1 border-b text-sm text-center">${i + 1}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.codigo || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.nombre || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center space-x-2">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');
            
            editBtn.onclick = () => {
                this.registroSeleccionado = this.datos[i];
                this.modificarSeleccionado();
            };
            
            deleteBtn.onclick = async () => {
                this.registroSeleccionado = this.datos[i];
                await this.eliminarSeleccionado();
            };
            
            tbody.appendChild(tr);
        });
        
        setTimeout(() => {
            try {
                this.dataTable = $('.min-w-full').DataTable({
                    pageLength: 10,
                    language: {
                        url: this.config.UI.DATATABLES_LANGUAGE
                    },
                    responsive: true,
                    order: [[1, 'desc']],
                    scrollX: true,
                    drawCallback: () => {
                        Object.keys(this.columnasVisibles).forEach(columnIndex => {
                            const column = this.dataTable.column(parseInt(columnIndex));
                            column.visible(this.columnasVisibles[columnIndex]);
                        });
                    }
                });
            } catch (error) {
                console.error('Error al inicializar DataTable:', error);
            }
        }, 100);
    }

    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nueva Provincia';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) return;

        document.getElementById('modalTitle').textContent = 'Modificar Provincia';
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
            this.mostrarNotificacion('Registro eliminado', 'success');
            await this.cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al eliminar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        document.getElementById('modalNombre').value = r.nombre || '';
    }

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input').forEach(input => {
            input.value = '';
        });
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.codigo = this.registroSeleccionado.codigo;
                await this.service.update(data);
                this.mostrarNotificacion('Registro actualizado', 'success');
            } else {
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado', 'success');
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
            nombre: document.getElementById('modalNombre').value
        };
    }

    validarFormulario(data) {
        if (!data.nombre) {
            this.mostrarNotificacion('El nombre es obligatorio', 'warning');
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

    exportarExcel() {
        if (this.datos.length === 0) {
            this.mostrarNotificacion('No hay datos para exportar', 'warning');
            return;
        }
        
        this.service.exportToExcel();
        this.mostrarNotificacion('Exportando a Excel...', 'info');
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
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

window.provinciaController = new ProvinciaController();
