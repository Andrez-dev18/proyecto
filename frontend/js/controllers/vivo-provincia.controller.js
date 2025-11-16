class VivoProvinciaController {
    constructor() {
        this.service = new VivoProvinciaService();
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

        // Inicializar estado de columnas
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
            console.log('Cargando catálogos...');

            const [provincias, proveedores, tipos] = await Promise.all([
                this.service.getProvincias(),
                this.service.getProveedores(),
                this.service.getTipos()
            ]);

            this.catalogos = {
                provincias,
                proveedores,
                tipos
            };

            this.poblarSelects();
            console.log('✅ Catálogos poblados correctamente');
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            this.mostrarNotificacion('❌ Error al cargar catálogos: ' + error.message, 'error');
        }
    }

    poblarSelects() {
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('filterProveedor', this.catalogos.proveedores, 'id', 'proveedor');
        this.poblarSelect('filterTipo', this.catalogos.tipos, 'id', 'tipo');

        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'id', 'proveedor');
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
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            this.renderizarTablaServerSide();
            this.mostrarNotificacion('Datos cargados correctamente', 'success');
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.mostrarNotificacion('❌ ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    async aplicarFiltros() {
        if (this.dataTable) {
            // Solo recargar los datos, no recrear la tabla
            this.dataTable.ajax.reload(() => {
                // Después de recargar, aplicar visibilidad de columnas
                this.aplicarVisibilidadColumnas();
            });
        } else {
            this.renderizarTablaServerSide();
        }
    }

    aplicarVisibilidadColumnas() {
        if (!this.dataTable) return;
        
        Object.keys(this.columnasVisibles).forEach(columnIndex => {
            try {
                const column = this.dataTable.column(parseInt(columnIndex));
                column.visible(this.columnasVisibles[columnIndex]);
            } catch(err) {
                console.log('Error aplicando visibilidad:', err);
            }
        });
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterProveedor').value = '';
        document.getElementById('filterTipo').value = '';
        this.aplicarFiltros();
    }

    renderizarTablaServerSide() {
        const table = $('.min-w-full');
        const thead = document.querySelector('thead tr');
        if (!thead) return;

        // Si ya existe la tabla, solo recargar datos
        if ($.fn.DataTable.isDataTable(table)) {
            this.dataTable.ajax.reload(() => {
                this.aplicarVisibilidadColumnas();
            });
            return;
        }

        const columnas = [
            'id', 'fecha', 'provincia', 'proveedor', 'ruc_proveedor',
            'tipo', 'linea',
            'precioMayCarMin', 'precioMayCarMax',
            'precioPubMin', 'precioPubMax',
            'cantidad'
        ];

        const columnasConOpciones = [...columnas, 'Opciones'];

        thead.innerHTML = columnasConOpciones
            .map(c => `<th class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-left">${c.replace(/([A-Z])/g, ' $1')}</th>`)
            .join('');

        this.dataTable = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: this.service.baseURL + '/vivoProvincia/filtro',
                type: 'GET',
                data: (d) => {
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
            responsive: false,
            pageLength: 10,
            scrollX: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
            },
            drawCallback: () => {
                // Aplicar visibilidad después de cada redibujado
                this.aplicarVisibilidadColumnas();
                
                // Re-vincular eventos de botones
                $('.min-w-full tbody .edit-btn').off('click').on('click', (e) => {
                    const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
                    this.registroSeleccionado = rowData;
                    this.modificarSeleccionado();
                });

                $('.min-w-full tbody .delete-btn').off('click').on('click', async (e) => {
                    const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
                    this.registroSeleccionado = rowData;
                    await this.eliminarSeleccionado();
                });
            },
            initComplete: () => {
                // Aplicar visibilidad inicial
                this.aplicarVisibilidadColumnas();
            }
        });
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
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
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
            this.mostrarNotificacion('⚠️ Selecciona un registro de la tabla', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        try {
            this.mostrarCargando(true);
            await this.service.eliminar(this.registroSeleccionado.id);
            this.mostrarNotificacion('✅ Registro eliminado exitosamente', 'success');
            this.registroSeleccionado = null;
            
            // Recargar solo los datos, no recrear la tabla
            if (this.dataTable) {
                this.dataTable.ajax.reload(() => {
                    this.aplicarVisibilidadColumnas();
                });
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('❌ Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        
        document.getElementById('modalFecha').value = r.fecha;
        
        const provinciaObj = this.catalogos.provincias.find(p => p.provincia === r.provincia);
        document.getElementById('modalProvincia').value = provinciaObj ? provinciaObj.id : '';
        
        const tipoObj = this.catalogos.tipos.find(t => t.tipo === r.tipo);
        document.getElementById('modalTipo').value = tipoObj ? tipoObj.id : '';
        
        const proveedorObj = this.catalogos.proveedores.find(p => p.proveedor === r.proveedor);
        document.getElementById('modalProveedor').value = proveedorObj ? proveedorObj.id : '';
        
        document.getElementById('modalLinea').value = r.linea || '';
        document.getElementById('modalPrecioMayCarMin').value = r.precioMayCarMin || '';
        document.getElementById('modalPrecioMayCarMax').value = r.precioMayCarMax || '';
        document.getElementById('modalPrecioMayBraMin').value = r.precioMayBraMin || '';
        document.getElementById('modalPrecioMayBraMax').value = r.precioMayBraMax || '';
        document.getElementById('modalPrecioPubMin').value = r.precioPubMin || '';
        document.getElementById('modalPrecioPubMax').value = r.precioPubMax || '';
        document.getElementById('modalPesoMachoPromMin').value = r.pesoMachoPromMin || '';
        document.getElementById('modalPesoMachoPromMax').value = r.pesoMachoPromMax || '';
        document.getElementById('modalPesoHembraPromMin').value = r.pesoHembraPromMin || '';
        document.getElementById('modalPesoHembraPromMax').value = r.pesoHembraPromMax || '';
        document.getElementById('modalColorMin').value = r.colorMin || '';
        document.getElementById('modalColorMax').value = r.colorMax || '';
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
                await this.service.actualizar(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                await this.service.crear(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            
            // Recargar solo los datos
            if (this.dataTable) {
                this.dataTable.ajax.reload(() => {
                    this.aplicarVisibilidadColumnas();
                });
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        const usuario = 'admin';
        const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');

        return {
            fecha: document.getElementById('modalFecha').value,
            provincia: parseInt(document.getElementById('modalProvincia').value) || null,
            tipo: parseInt(document.getElementById('modalTipo').value) || null,
            proveedor: parseInt(document.getElementById('modalProveedor').value) || null,
            linea: document.getElementById('modalLinea').value || '',
            precioMayCarMin: parseFloat(document.getElementById('modalPrecioMayCarMin').value) || 0,
            precioMayCarMax: parseFloat(document.getElementById('modalPrecioMayCarMax').value) || 0,
            precioMayBraMin: parseFloat(document.getElementById('modalPrecioMayBraMin').value) || 0,
            precioMayBraMax: parseFloat(document.getElementById('modalPrecioMayBraMax').value) || 0,
            precioPubMin: parseFloat(document.getElementById('modalPrecioPubMin').value) || 0,
            precioPubMax: parseFloat(document.getElementById('modalPrecioPubMax').value) || 0,
            pesoMachoPromMin: parseFloat(document.getElementById('modalPesoMachoPromMin').value) || 0,
            pesoMachoPromMax: parseFloat(document.getElementById('modalPesoMachoPromMax').value) || 0,
            pesoHembraPromMin: parseFloat(document.getElementById('modalPesoHembraPromMin').value) || 0,
            pesoHembraPromMax: parseFloat(document.getElementById('modalPesoHembraPromMax').value) || 0,
            pesoBrasaPromMin: 0,
            pesoBrasaPromMax: 0,
            colorMin: parseFloat(document.getElementById('modalColorMin').value) || 0,
            colorMax: parseFloat(document.getElementById('modalColorMax').value) || 0,
            cantidad: parseFloat(document.getElementById('modalCantidad').value) || 0,
            usuarioRegistro: usuario,
            fechaHoraRegistro: ahora,
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: ahora
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
        try {
            this.service.exportarCSV();
            this.mostrarNotificacion('Iniciando descarga de Excel...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
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
        }, 4000);
    }
}

window.vivoProvinciaController = new VivoProvinciaController();
