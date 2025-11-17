class EnteroAutoserController {
    constructor() {
        this.service = new EnteroAutoserService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
        this.config = window.EnteroAutoserConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
        this.setupColumnToggle();
        this.setupToggleFiltros();
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

    setupToggleFiltros() {
        const btnToggle = document.getElementById('btnToggleFiltros');
        const filterContent = document.getElementById('filterContent');

        if (!btnToggle || !filterContent) return;

        filterContent.classList.remove('show');
        
        btnToggle.addEventListener('click', () => {
            const isOpen = filterContent.classList.contains('show');
            const icon = btnToggle.querySelector('i');
            
            if (isOpen) {
                filterContent.classList.remove('show');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
                btnToggle.style.transform = 'rotate(0deg)';
            } else {
                filterContent.classList.add('show');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                btnToggle.style.transform = 'rotate(180deg)';
            }
        });
    }

    async cargarCatalogos() {
        try {
            const proveedores = await this.service.getProveedores();
            this.catalogos = { proveedores };
            this.poblarSelects();
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
        }
    }

    poblarSelects() {
        this.poblarSelect('filterProveedor', this.catalogos.proveedores, 'codigo', 'nombre');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'codigo', 'nombre');
    }

    poblarSelect(selectId, datos, valueField, textField) {
        const select = document.getElementById(selectId);
        if (!select) return;

        const opciones = datos.map(item =>
            `<option value="${item[valueField]}">${item[textField]}</option>`
        ).join('');

        if (selectId.startsWith('filter')) {
            select.innerHTML = `<option value="">Todos</option>${opciones}`;
        } else {
            select.innerHTML = `<option value="">Seleccionar...</option>${opciones}`;
        }
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());

        document.getElementById('filterFechaInicio')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterFechaFin')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProveedor')?.addEventListener('change', () => this.aplicarFiltros());
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

    async aplicarFiltros() {
        try {
            this.mostrarCargando(true);

            const filtros = {};
            const fechaInicio = document.getElementById('filterFechaInicio').value;
            const fechaFin = document.getElementById('filterFechaFin').value;
            const proveedorId = document.getElementById('filterProveedor').value;

            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (proveedorId) filtros.proveedor = parseInt(proveedorId);
            
            if (!fechaInicio && !fechaFin && !proveedorId) {
                await this.cargarDatos();
                return;
            }
            
            const resultado = await this.service.getFiltered(filtros);
            
            if (Array.isArray(resultado)) {
                this.datos = resultado;
            } else if (resultado && Array.isArray(resultado.data)) {
                this.datos = resultado.data;
            } else {
                this.datos = [];
            }
            
            this.renderizarTabla();
            this.mostrarNotificacion(`Filtrados: ${this.datos.length} registros`, 'success');
            
        } catch (error) {
            console.error('Error al filtrar:', error);
            this.mostrarNotificacion('Error al filtrar: ' + error.message, 'error');
            await this.cargarDatos();
        } finally {
            this.mostrarCargando(false);
        }
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterProveedor').value = '';
        this.cargarDatos();
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
            tbody.innerHTML = '<tr><td colspan="10" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        this.datos.forEach((registro, i) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-blue-50 transition-colors';
            tr.innerHTML = `
                <td class="px-2 py-1 border-b text-sm text-center">${i + 1}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.fecha || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.proveedor || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioMayMin || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioMayMax || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioPubMin || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioPubMax || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.color || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.cantidad || '-'}</td>
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
                        url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
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
        document.getElementById('modalTitle').textContent = 'Nuevo Registro';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) return;

        document.getElementById('modalTitle').textContent = 'Modificar Registro';
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
            await this.service.delete(this.registroSeleccionado.id);
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
        
        document.getElementById('modalFecha').value = r.fecha || '';
        
        const proveedorObj = this.catalogos.proveedores.find(p => p.nombre === r.proveedor);
        document.getElementById('modalProveedor').value = proveedorObj ? proveedorObj.codigo : '';
        
        document.getElementById('modalPrecioMayMin').value = r.precioMayMin || '';
        document.getElementById('modalPrecioMayMax').value = r.precioMayMax || '';
        document.getElementById('modalPrecioPubMin').value = r.precioPubMin || '';
        document.getElementById('modalPrecioPubMax').value = r.precioPubMax || '';
        document.getElementById('modalColor').value = r.color || '';
        document.getElementById('modalCantidad').value = r.cantidad || '';
    }

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input, #modalForm select').forEach(input => {
            if (input.type === 'date') {
                input.value = new Date().toISOString().split('T')[0];
            } else {
                input.value = '';
            }
        });
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
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
        const proveedorId = document.getElementById('modalProveedor').value;
        
        return {
            fecha: document.getElementById('modalFecha').value,
            proveedor: parseInt(proveedorId) || null,
            precioMayMin: parseFloat(document.getElementById('modalPrecioMayMin').value) || 0,
            precioMayMax: parseFloat(document.getElementById('modalPrecioMayMax').value) || 0,
            precioPubMin: parseFloat(document.getElementById('modalPrecioPubMin').value) || 0,
            precioPubMax: parseFloat(document.getElementById('modalPrecioPubMax').value) || 0,
            color: document.getElementById('modalColor').value,
            cantidad: parseInt(document.getElementById('modalCantidad').value) || 0,
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }
        if (!data.proveedor) {
            this.mostrarNotificacion('El proveedor es obligatorio', 'warning');
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
        
        const filtros = {
            fechaInicio: document.getElementById('filterFechaInicio').value,
            fechaFin: document.getElementById('filterFechaFin').value,
            proveedor: document.getElementById('filterProveedor').value
        };
        
        this.service.exportToExcel(filtros);
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

window.enteroAutoserController = new EnteroAutoserController();
