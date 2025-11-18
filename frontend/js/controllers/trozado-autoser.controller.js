class TrozadoAutoserController {
    constructor() {
        this.service = new TrozadoAutoserService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
        this.config = window.TrozadoAutoserConfig;
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

        console.log('🔧 Configurando toggle de columnas...');

        // Inicializar estado de columnas
        checkboxes.forEach(checkbox => {
            const columnIndex = parseInt(checkbox.dataset.column);
            this.columnasVisibles[columnIndex] = checkbox.checked;
        });

        // Abrir/cerrar dropdown
        if (btnToggle) {
            btnToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isVisible = dropdown.classList.contains('show');
                
                if (isVisible) {
                    dropdown.classList.remove('show');
                } else {
                    dropdown.classList.add('show');
                }
            });
        }

        // Cerrar con botón X
        if (btnClose) {
            btnClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.remove('show');
            });
        }

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-columns')) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
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

    setupToggleFiltros() {
        const btnToggle = document.getElementById('btnToggleFiltros');
        const filterContent = document.getElementById('filterContent');

        if (!btnToggle || !filterContent) return;

        // Estado inicial: cerrado
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
            
            const cortes = await this.service.getCortes();
            
            this.catalogos = { cortes };
            
            console.log('Cortes cargados:', cortes);
            
            this.poblarSelects();
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            this.mostrarNotificacion('Error al cargar catálogos', 'error');
        }
    }

    poblarSelects() {
        this.poblarSelect('filterCorte', this.catalogos.cortes, 'id', 'corte');
        this.poblarSelect('modalCorte', this.catalogos.cortes, 'id', 'corte');
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
        document.getElementById('filterCorte')?.addEventListener('change', () => this.aplicarFiltros());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            console.log('Cargando todos los datos...');
            
            this.datos = await this.service.getAll();
            
            console.log('Datos cargados:', this.datos.length, 'registros');
            
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
            const corteId = document.getElementById('filterCorte').value;

            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (corteId) filtros.corte = parseInt(corteId);

            console.log('Filtros a aplicar:', filtros);
            
            // Si no hay filtros, cargar todos
            if (!fechaInicio && !fechaFin && !corteId) {
                console.log('Sin filtros, cargando todos los datos');
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
            
            console.log(`Filtrado completado: ${this.datos.length} registros`);
            
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
        document.getElementById('filterCorte').value = '';
        this.cargarDatos();
    }

    // MÉTODO CORREGIDO - Se eliminó el typo "Copy"
    renderizarTabla() {
        console.log('Renderizando tabla con', this.datos.length, 'registros');
        
        const tbody = document.getElementById('tableBody');
        if (!tbody) {
            console.error('No se encontró tbody');
            return;
        }

        const table = $('.min-w-full');
        
        // Destruir DataTable anterior si existe
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        tbody.innerHTML = '';
        
        // Si no hay datos
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="11" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        // Llenar la tabla con datos
        this.datos.forEach((registro, i) => {
            // Obtener nombre del corte
            let nombreCorte = registro.corte;
            
            if (!isNaN(registro.corte)) {
                const corteObj = this.catalogos.cortes.find(c => c.id == registro.corte);
                nombreCorte = corteObj ? corteObj.corte : registro.corte;
            }
            
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-blue-50 transition-colors';
            tr.innerHTML = `
                <td class="px-2 py-1 border-b text-sm text-center">${i + 1}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.fecha || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${nombreCorte || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioSuper || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioPlazaVea || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioTottus || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioMetro || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioTiendaPalomar || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioTiendaRicoPollo || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioAvelino || '-'}</td>
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
            
            editBtn.addEventListener('click', () => {
                this.registroSeleccionado = this.datos[i];
                console.log('Editando:', this.registroSeleccionado);
                this.modificarSeleccionado();
            });
            
            deleteBtn.addEventListener('click', async () => {
                this.registroSeleccionado = this.datos[i];
                console.log('Eliminando:', this.registroSeleccionado);
                await this.eliminarSeleccionado();
            });
            
            tbody.appendChild(tr);
        });
        
        // Inicializar DataTable después de llenar la tabla
        setTimeout(() => {
            try {
                this.dataTable = $('.min-w-full').DataTable({
                    pageLength: 10,
                    language: {
                        url: 'assets/i18n/es-ES.json'
                    },
                    responsive: true,
                    order: [[1, 'desc']],
                    scrollX: true,
                    drawCallback: () => {
                        // Restaurar visibilidad de columnas después de cada redibujado
                        Object.keys(this.columnasVisibles).forEach(columnIndex => {
                            try {
                                const column = this.dataTable.column(parseInt(columnIndex));
                                column.visible(this.columnasVisibles[columnIndex]);
                            } catch(err) {
                                console.log('Error al restaurar columna:', columnIndex);
                            }
                        });
                    }
                });
                
                console.log('✅ DataTable inicializado correctamente');
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
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Registro';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro', 'warning');
            return;
        }
        
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
        console.log('Cargando en formulario:', r);
        
        document.getElementById('modalFecha').value = r.fecha || '';
        
        // Buscar el ID del corte
        let corteId = '';
        if (!isNaN(r.corte)) {
            corteId = r.corte;
        } else {
            const corteObj = this.catalogos.cortes.find(c => c.corte === r.corte);
            corteId = corteObj ? corteObj.id : '';
        }
        document.getElementById('modalCorte').value = corteId;
        
        document.getElementById('modalPrecioSuper').value = r.precioSuper || '';
        document.getElementById('modalPrecioPlazaVea').value = r.precioPlazaVea || '';
        document.getElementById('modalPrecioTottus').value = r.precioTottus || '';
        document.getElementById('modalPrecioMetro').value = r.precioMetro || '';
        document.getElementById('modalPrecioTiendaPalomar').value = r.precioTiendaPalomar || '';
        document.getElementById('modalPrecioTiendaRicoPollo').value = r.precioTiendaRicoPollo || '';
        document.getElementById('modalPrecioAvelino').value = r.precioAvelino || '';
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
            console.error('Error:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        const corteId = document.getElementById('modalCorte').value;
        
        return {
            fecha: document.getElementById('modalFecha').value,
            corte: parseInt(corteId) || null,
            precioSuper: parseFloat(document.getElementById('modalPrecioSuper').value) || 0,
            precioPlazaVea: parseFloat(document.getElementById('modalPrecioPlazaVea').value) || 0,
            precioTottus: parseFloat(document.getElementById('modalPrecioTottus').value) || 0,
            precioMetro: parseFloat(document.getElementById('modalPrecioMetro').value) || 0,
            precioTiendaPalomar: parseFloat(document.getElementById('modalPrecioTiendaPalomar').value) || 0,
            precioTiendaRicoPollo: parseFloat(document.getElementById('modalPrecioTiendaRicoPollo').value) || 0,
            precioAvelino: parseFloat(document.getElementById('modalPrecioAvelino').value) || 0,
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' '),
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }
        if (!data.corte) {
            this.mostrarNotificacion('El corte es obligatorio', 'warning');
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
        window.open(`${this.service.baseURL}${this.config.API.ENDPOINTS.EXCEL}`, '_blank');
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
        notif.style.animation = 'slideInRight 0.3s ease';
        notif.innerHTML = `
            <span style="font-size: 20px;">${iconos[tipo]}</span>
            <span>${mensaje}</span>
        `;
        container.appendChild(notif);

        setTimeout(() => notif.remove(), 4000);
    }
}

window.trozadoAutoserController = new TrozadoAutoserController();
