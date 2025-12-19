
class InfoGRSController {
    constructor() {
        this.service = new InfoGRSService();
        this.registroSeleccionado = null;
        this.catalogos = {};
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
        this.setupColumnToggle();
        this.setupFiltrosToggle();
        await this.cargarDatos();
    }

    async cargarCatalogos() {
        try {
            const [provincias, zonas, tipos, categorias, lineas, mercados] = await Promise.all([
                this.service.getProvincias(),
                this.service.getZonas(),
                this.service.getTipos(),
                this.service.getCategorias(),
                this.service.getLineas(),
                this.service.getMercados()
            ]);

            this.catalogos = {
                provincias,
                zonas,
                tipos,
                categorias,
                lineas,
                mercados
            };

            this.poblarSelects();
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            this.mostrarNotificacion('Error al cargar catálogos: ' + error.message, 'error');
        }
    }

    poblarSelects() {
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'id', 'nombre');
        this.poblarSelect('filterZona', this.catalogos.zonas, 'id', 'nombre');
        this.poblarSelect('filterTipo', this.catalogos.tipos, 'id', 'nombre');
        this.poblarSelect('filterCategoria', this.catalogos.categorias, 'id', 'nombre');
        this.poblarSelect('filterLinea', this.catalogos.lineas, 'id', 'nombre');
        this.poblarSelect('filterMercado', this.catalogos.mercados, 'id', 'nombre');

        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'nombre', 'nombre');
        this.poblarSelect('modalZona', this.catalogos.zonas, 'nombre', 'nombre');
        this.poblarSelect('modalTipo', this.catalogos.tipos, 'nombre', 'nombre');
        this.poblarSelect('modalCategoria', this.catalogos.categorias, 'nombre', 'nombre');
        this.poblarSelect('modalLinea', this.catalogos.lineas, 'nombre', 'nombre');
        this.poblarSelect('modalMercado', this.catalogos.mercados, 'id', 'nombre');
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
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
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

    setupFiltrosToggle() {
        const btnToggleFiltros = document.getElementById('btnToggleFiltros');
        const filterContent = document.getElementById('filterContent');
        
        btnToggleFiltros?.addEventListener('click', () => {
            filterContent.classList.toggle('hidden');
            const icon = btnToggleFiltros.querySelector('i');
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
        });
    }

    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro InfoGRS';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
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
        return {
            fecha: document.getElementById('modalFecha').value,
            provincia: document.getElementById('modalProvincia').value,
            zona: document.getElementById('modalZona').value,
            tipo: document.getElementById('modalTipo').value,
            categoria: document.getElementById('modalCategoria').value,
            linea: document.getElementById('modalLinea').value,
            codigo: document.getElementById('modalCodigo').value,
            descripcion: document.getElementById('modalDescripcion').value,
            cantidad: parseInt(document.getElementById('modalCantidad').value) || 0,
            precio: parseFloat(document.getElementById('modalPrecio').value) || 0,
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            importe: parseFloat(document.getElementById('modalImporte').value) || 0,
            peso_prom: parseFloat(document.getElementById('modalPesoProm').value) || 0,
            mercado: parseInt(document.getElementById('modalMercado').value) || 0
        };
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }
        if (!data.descripcion) {
            this.mostrarNotificacion('La descripción es obligatoria', 'warning');
            return false;
        }
        return true;
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            this.renderizarTabla();
            this.mostrarNotificacion('Datos cargados correctamente', 'success');
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.mostrarNotificacion(error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    renderizarTabla() {
        const table = $('.min-w-full');
        const thead = document.querySelector('thead tr');
        if (!thead) return;

        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        const columnas = [
            'id', 'fecha', 'provincia', 'zona', 'tipo', 'categoria',
            'linea', 'codigo', 'descripcion', 'cantidad', 'precio',
            'peso', 'importe', 'peso_prom', 'mercado', 'nom_db'
        ];

        const columnasConOpciones = [...columnas, 'Opciones'];

        thead.innerHTML = columnasConOpciones
            .map(c => `<th class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-left">${c.replace(/_/g, ' ')}</th>`)
            .join('');

        this.dataTable = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: this.service.baseURL + InfoGRSConfig.API.ENDPOINTS.INFOGRS.FILTRO,
                type: 'GET',
                data: (d) => {
                    const filtros = {};
                    const campos = ['FechaInicio', 'FechaFin', 'Provincia', 'Zona', 'Tipo', 'Categoria', 'Linea', 'Mercado'];

                    campos.forEach(campo => {
                        const el = document.getElementById(`filter${campo}`);
                        if (el && el.value.trim() !== '') {
                            const key = campo.charAt(0).toLowerCase() + campo.slice(1);
                            filtros[key] = el.value.trim();
                        }
                    });

                    return Object.assign(d, filtros);
                },
                dataSrc: json => json.data
            },
            columns: [
                ...columnas.map(col => ({ data: col })),
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: (data, type, row, meta) => `
                        <div class="text-center space-x-2">
                            <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" data-index="${meta.row}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" data-index="${meta.row}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `
                }
            ],
            order: [[1, 'desc']],
            responsive: InfoGRSConfig.DATATABLES.RESPONSIVE,
            pageLength: InfoGRSConfig.DATATABLES.PAGE_LENGTH,
            language: {
                url: InfoGRSConfig.DATATABLES.LANGUAGE_URL
            },
            drawCallback: () => {
                Object.keys(this.columnasVisibles).forEach(columnIndex => {
                    const column = this.dataTable.column(parseInt(columnIndex));
                    if (column) {
                        column.visible(this.columnasVisibles[columnIndex]);
                    }
                });
            }
        });

        Object.keys(this.columnasVisibles).forEach(columnIndex => {
            const column = this.dataTable.column(parseInt(columnIndex));
            if (column) {
                column.visible(this.columnasVisibles[columnIndex]);
            }
        });

        $('.min-w-full tbody').off('click').on('click', '.edit-btn', (e) => {
            const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
            this.registroSeleccionado = rowData;
            this.modificarSeleccionado();
        });

        $('.min-w-full tbody').on('click', '.delete-btn', async (e) => {
            const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
            this.registroSeleccionado = rowData;
            await this.eliminarSeleccionado();
        });
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Registro InfoGRS';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        
        document.getElementById('modalFecha').value = r.fecha;
        document.getElementById('modalProvincia').value = r.provincia || '';
        document.getElementById('modalZona').value = r.zona || '';
        document.getElementById('modalTipo').value = r.tipo || '';
        document.getElementById('modalCategoria').value = r.categoria || '';
        document.getElementById('modalLinea').value = r.linea || '';
        document.getElementById('modalCodigo').value = r.codigo || '';
        document.getElementById('modalDescripcion').value = r.descripcion || '';
        document.getElementById('modalCantidad').value = r.cantidad || '';
        document.getElementById('modalPrecio').value = r.precio || '';
        document.getElementById('modalPeso').value = r.peso || '';
        document.getElementById('modalImporte').value = r.importe || '';
        document.getElementById('modalPesoProm').value = r.peso_prom || '';
        
        const mercadoObj = this.catalogos.mercados.find(m => m.id == r.mercado);
        document.getElementById('modalMercado').value = mercadoObj ? mercadoObj.id : '';
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        try {
            this.mostrarCargando(true);
            await this.service.eliminar(this.registroSeleccionado.id);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            this.registroSeleccionado = null;
            await this.cargarDatos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    exportarExcel() {
        try {
            this.service.exportarExcel();
            this.mostrarNotificacion('Iniciando descarga de Excel...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    async aplicarFiltros() {
        this.renderizarTabla();
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterZona').value = '';
        document.getElementById('filterTipo').value = '';
        document.getElementById('filterCategoria').value = '';
        document.getElementById('filterLinea').value = '';
        document.getElementById('filterMercado').value = '';
        
        this.cargarDatos();
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

        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, InfoGRSConfig.NOTIFICACIONES.DURACION);
    }
}

const infoGRSController = new InfoGRSController();

