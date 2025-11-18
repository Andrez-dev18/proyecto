class CriadorEmprendedorController {
    constructor() {
        this.service = new CriadorEmprendedorService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
        this.config = window.CriadorEmprendedorConfig;
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

    // MÉTODO: Toggle de columnas
    setupColumnToggle() {
        const btnToggle = document.getElementById('btnToggleColumns');
        const dropdown = document.getElementById('columnDropdown');
        const btnClose = document.getElementById('btnCloseDropdown');
        const checkboxes = document.querySelectorAll('.column-checkbox');

        // Inicializar estado de columnas
        checkboxes.forEach(checkbox => {
            const columnIndex = parseInt(checkbox.dataset.column);
            this.columnasVisibles[columnIndex] = checkbox.checked;
        });

        // Toggle dropdown
        btnToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // Cerrar dropdown
        btnClose?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.remove('show');
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-columns')) {
                dropdown.classList.remove('show');
            }
        });

        // Manejar cambios en checkboxes
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

    // MÉTODO: Toggle de filtros
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
            console.log('Cargando catálogos...');
            
            const [provincias, proveedores, tipos] = await Promise.all([
                this.service.getProvincias(),
                this.service.getProveedores(),
                this.service.getTipos()
            ]);
            
            this.catalogos = { provincias, proveedores, tipos };
            
            console.log('Catálogos cargados:', this.catalogos);
            
            this.poblarSelects();
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
        }
    }

    poblarSelects() {
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'codigo', 'nombre');
        this.poblarSelect('filterProveedor', this.catalogos.proveedores, 'codigo', 'nombre');
        this.poblarSelect('filterTipo', this.catalogos.tipos, 'codigo', 'nombre');
        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'codigo', 'nombre');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'codigo', 'nombre');
        this.poblarSelect('modalTipo', this.catalogos.tipos, 'codigo', 'nombre');
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
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
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
            console.log('=== INICIANDO FILTRADO ===');

            const filtros = {};
            const fechaInicio = document.getElementById('filterFechaInicio').value;
            const fechaFin = document.getElementById('filterFechaFin').value;
            const provincia = document.getElementById('filterProvincia').value;
            const proveedor = document.getElementById('filterProveedor').value;
            const tipo = document.getElementById('filterTipo').value;

            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (provincia) filtros.provincia = provincia;
            if (proveedor) filtros.proveedor = proveedor;
            if (tipo) filtros.tipo = tipo;

            console.log('Filtros a aplicar:', filtros);
            
            // Si no hay filtros, cargar todos los datos
            if (!fechaInicio && !fechaFin && !provincia && !proveedor && !tipo) {
                console.log('Sin filtros, cargando todos los datos');
                await this.cargarDatos();
                return;
            }
            
            // Aplicar filtros
            const resultado = await this.service.getFiltered(filtros);
            
            // Procesar resultado
            if (Array.isArray(resultado)) {
                this.datos = resultado;
            } else if (resultado && Array.isArray(resultado.data)) {
                this.datos = resultado.data;
            } else {
                this.datos = [];
            }
            
            console.log(`Filtrado completado: ${this.datos.length} registros`);
            
            // Renderizar la tabla
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
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterProveedor').value = '';
        document.getElementById('filterTipo').value = '';
        this.cargarDatos();
    }

    renderizarTabla() {
        console.log('Renderizando tabla con', this.datos.length, 'registros');
        
        const tbody = document.getElementById('tableBody');
        if (!tbody) {
            console.error('No se encontró tbody');
            return;
        }

        // Destruir DataTable si existe
        const table = $('#dataTable');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        // Limpiar tbody
        tbody.innerHTML = '';
        
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        // Crear filas mostrando el ID que viene del backend
        this.datos.forEach((registro, i) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-blue-50 transition-colors';
            tr.innerHTML = `
                <td class="px-2 py-1 border-b text-sm text-center font-semibold">${registro.id}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.fecha || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.provincia || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.proveedor || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.tipo || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.cantidad || 0}</td>
                <td class="px-2 py-1 border-b text-sm text-center">S/. ${registro.precio || '0'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.observaciones || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center space-x-2">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            // Agregar eventos directamente
            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');
            
            editBtn.onclick = () => {
                this.registroSeleccionado = this.datos[i];
                console.log('Editando:', this.registroSeleccionado);
                this.modificarSeleccionado();
            };
            
            deleteBtn.onclick = async () => {
                this.registroSeleccionado = this.datos[i];
                console.log('Eliminando:', this.registroSeleccionado);
                await this.eliminarSeleccionado();
            };
            
            tbody.appendChild(tr);
        });
        
        // Re-inicializar DataTable después
        setTimeout(() => {
            try {
                this.dataTable = $('#dataTable').DataTable({
                    pageLength: 10,
                    language: {
                        url: 'assets/i18n/es-ES.json'
                    },
                    responsive: true,
                    order: [[1, 'desc']], // Ordenar por fecha
                    scrollX: true,
                    drawCallback: () => {
                        // Aplicar visibilidad de columnas después de cada redibujado
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
            // Usar el ID que viene del backend
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
        console.log('Cargando en formulario:', r);
        
        document.getElementById('modalFecha').value = r.fecha || '';
        
        // Buscar los códigos por nombre si es necesario
        const provinciaObj = this.catalogos.provincias.find(p => p.nombre === r.provincia);
        const proveedorObj = this.catalogos.proveedores.find(p => p.nombre === r.proveedor);
        const tipoObj = this.catalogos.tipos.find(t => t.nombre === r.tipo);
        
        document.getElementById('modalProvincia').value = provinciaObj ? provinciaObj.codigo : '';
        document.getElementById('modalProveedor').value = proveedorObj ? proveedorObj.codigo : '';
        document.getElementById('modalTipo').value = tipoObj ? tipoObj.codigo : '';
        document.getElementById('modalCantidad').value = r.cantidad || '';
        document.getElementById('modalPrecio').value = r.precio || '';
        document.getElementById('modalObservaciones').value = r.observaciones || '';
    }

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input, #modalForm select, #modalForm textarea').forEach(input => {
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
                // Para actualizar, incluir el ID existente
                data.id = this.registroSeleccionado.id;
                await this.service.update(data);
                this.mostrarNotificacion('Registro actualizado', 'success');
            } else {
                // Para crear nuevo, NO enviar ID - el backend lo genera
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al guardar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        const provinciaId = document.getElementById('modalProvincia').value;
        const proveedorId = document.getElementById('modalProveedor').value;
        const tipoId = document.getElementById('modalTipo').value;
        
        // NO incluir ID en los datos del formulario para nuevos registros
        const datos = {
            fecha: document.getElementById('modalFecha').value,
            provincia: provinciaId || null,
            proveedor: proveedorId || null,
            tipo: tipoId || null,
            cantidad: parseInt(document.getElementById('modalCantidad').value) || 0,
            precio: parseFloat(document.getElementById('modalPrecio').value) || 0,
            observaciones: document.getElementById('modalObservaciones').value || '',
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' '),
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        
        return datos;
    }

    validarFormulario(data) {
        console.log('Validando formulario:', data);
        
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }
        
        if (!data.provincia) {
            this.mostrarNotificacion('La provincia es obligatoria', 'warning');
            return false;
        }
        
        if (!data.tipo) {
            this.mostrarNotificacion('El tipo es obligatorio', 'warning');
            return false;
        }
        
        console.log('Validación exitosa');
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
        window.open(`${this.service.baseUrl}${this.config.API.ENDPOINTS.EXCEL}`, '_blank');
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

window.criadorEmprendedorController = new CriadorEmprendedorController();

