class AlternoController {
    constructor() {
        this.service = new AlternoService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
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

        // Iniciar con filtros visibles
        filterContent.classList.add('show');
        
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
            const [provincias, mercados, tipos] = await Promise.all([
                this.service.getProvincias(),
                this.service.getMercados(),
                this.service.getTipos()
            ]);

            this.catalogos = {
                provincias,
                mercados,
                tipos
            };

            this.poblarSelects();
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            this.mostrarNotificacion('Error al cargar catálogos', 'error');
        }
    }

    poblarSelects() {
        // Filtros
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('filterMercado', this.catalogos.mercados, 'id', 'mercado');
        this.poblarSelect('filterTipo', this.catalogos.tipos, 'id', 'tipo');

        // Modal
        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('modalMercado', this.catalogos.mercados, 'id', 'mercado');
        this.poblarSelect('modalTipo', this.catalogos.tipos, 'id', 'tipo');
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
        // Botón nuevo en la tabla
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());

        /* Auto-filtrar cuando cambian los campos
        document.getElementById('filterFechaInicio')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterFechaFin')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProvincia')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterMercado')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterTipo')?.addEventListener('change', () => this.aplicarFiltros());*/
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            this.datos = await this.service.getAll();
            this.renderizarTabla();
            //this.actualizarContadorRegistros();
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
            const provincia = document.getElementById('filterProvincia').value;
            const mercado = document.getElementById('filterMercado').value;
            const tipo = document.getElementById('filterTipo').value;

            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (provincia) filtros.provincia = parseInt(provincia);
            if (mercado) filtros.mercado = parseInt(mercado);
            if (tipo) filtros.tipo = parseInt(tipo);

            // Si no hay filtros, cargar todo
            if (!fechaInicio && !fechaFin && !provincia && !mercado && !tipo) {
                await this.cargarDatos();
                return;
            }

            const resultado = await this.service.filtrar(filtros);
            
            if (Array.isArray(resultado)) {
                this.datos = resultado;
            } else if (resultado && Array.isArray(resultado.data)) {
                this.datos = resultado.data;
            } else {
                this.datos = [];
            }

            this.renderizarTabla();
           // this.actualizarContadorRegistros();
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
        document.getElementById('filterMercado').value = '';
        document.getElementById('filterTipo').value = '';
        this.cargarDatos();
    }

    renderizarTabla() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    const table = $('.min-w-full');
    
    // Destruir DataTable si existe
    if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
    }

    tbody.innerHTML = '';
    
    if (this.datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
        return;
    }

    // Renderizar filas
    this.datos.forEach((registro, i) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-blue-50 transition-colors';
        
        // Formatear fecha
        const fecha = registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-PE') : '-';
        
        // Formatear precios
        const formatPrecio = (precio) => {
            return precio ? `S/ ${parseFloat(precio).toFixed(2)}` : 'S/ 0.00';
        };

        tr.innerHTML = `
            <td class="px-2 py-1 border-b text-sm text-center">${registro.id || '-'}</td>
            <td class="px-2 py-1 border-b text-sm text-center">${fecha}</td>
            <td class="px-2 py-1 border-b text-sm">${registro.provincia || '-'}</td>
            <td class="px-2 py-1 border-b text-sm">${registro.mercado || '-'}</td>
            <td class="px-2 py-1 border-b text-sm">${registro.tipo || '-'}</td>
            <td class="px-2 py-1 border-b text-sm text-center">${formatPrecio(registro.precioMin)}</td>
            <td class="px-2 py-1 border-b text-sm text-center">${formatPrecio(registro.precioMax)}</td>
            <td class="px-2 py-1 border-b text-sm">${registro.usuarioRegistro || 'sistema'}</td>
            <td class="px-2 py-1 border-b text-sm text-center space-x-2">
                <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        // Agregar eventos a botones
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
    
    // Inicializar DataTable con configuración estándar
    setTimeout(() => {
        try {
            this.dataTable = $('.min-w-full').DataTable({
                pageLength: 10,
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
                },
                responsive: true,
                order: [[1, 'desc']], // Ordenar por fecha
                scrollX: true,
                drawCallback: () => {
                    // Aplicar visibilidad de columnas
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

   /* actualizarContadorRegistros() {
        const btnNuevo = document.getElementById('btnNuevo');
        if (btnNuevo) {
            btnNuevo.innerHTML = `
                <i class="fas fa-plus mr-1"></i>
                ${this.datos.length} registros cargados
            `;
        }
    }*/

    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro Alterno';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) return;

        document.getElementById('modalTitle').textContent = 'Modificar Registro Alterno';
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
            await this.service.eliminar(this.registroSeleccionado.id);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            await this.cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        
        // Formatear fecha para input date
        if (r.fecha) {
            const fecha = new Date(r.fecha);
            document.getElementById('modalFecha').value = fecha.toISOString().split('T')[0];
        }
        
        // Buscar IDs por nombres
        const provinciaObj = this.catalogos.provincias.find(p => p.provincia === r.provincia);
        document.getElementById('modalProvincia').value = provinciaObj ? provinciaObj.id : '';
        
        const mercadoObj = this.catalogos.mercados.find(m => m.mercado === r.mercado);
        document.getElementById('modalMercado').value = mercadoObj ? mercadoObj.id : '';
        
        const tipoObj = this.catalogos.tipos.find(t => t.tipo === r.tipo);
        document.getElementById('modalTipo').value = tipoObj ? tipoObj.id : '';
        
        document.getElementById('modalPrecioMin').value = r.precioMin || '';
        document.getElementById('modalPrecioMax').value = r.precioMax || '';
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
                await this.service.actualizar(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
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
        const provinciaId = parseInt(document.getElementById('modalProvincia').value) || null;
        const mercadoId = parseInt(document.getElementById('modalMercado').value) || null;
        const tipoId = parseInt(document.getElementById('modalTipo').value) || null;

        return {
            fecha: document.getElementById('modalFecha').value,
            provincia: provinciaId,
            mercado: mercadoId,
            tipo: tipoId,
            precioMin: parseFloat(document.getElementById('modalPrecioMin').value) || 0,
            precioMax: parseFloat(document.getElementById('modalPrecioMax').value) || 0,
            usuarioRegistro: 'sistema'
        };
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }
        if (!data.provincia) {
            this.mostrarNotificacion('La provincia es obligatoria', 'warning');
            return false;
        }
        if (!data.mercado) {
            this.mostrarNotificacion('El mercado es obligatorio', 'warning');
            return false;
        }
        if (!data.tipo) {
            this.mostrarNotificacion('El tipo es obligatorio', 'warning');
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

   exportarExcel() {
        try {
            this.service.exportarCSV();
            this.mostrarNotificacion('Iniciando descarga de CSV...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }
}

// Instanciar controlador
window.alternoController = new AlternoController();
