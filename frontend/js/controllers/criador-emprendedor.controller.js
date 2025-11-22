class CriadorEmprendedorController {
    constructor() {
        this.service = new CriadorEmprendedorService();
        this.registroSeleccionado = null;
        this.catalogos = {};
        this.dataTable = null; 
        this.columnasVisibles = {};
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
        this.setupColumnToggle();
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

    async cargarCatalogos() {
        try {
            console.log('Cargando catálogos...');

            const [tiposCriador, zonas, estados, categorias] = await Promise.all([
                this.service.getTiposCriador(),
                this.service.getZonas(),
                this.service.getEstados(),
                this.service.getCategorias()
            ]);

            console.log('Catálogos cargados:', {
                tiposCriador: tiposCriador.length,
                zonas: zonas.length,
                estados: estados.length,
                categorias: categorias.length
            });

            this.catalogos = {
                tiposCriador,
                zonas,
                estados,
                categorias
            };

            this.poblarSelects();
            console.log('Catálogos poblados correctamente');
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            this.mostrarNotificacion('Error al cargar catálogos: ' + error.message, 'error');
        }
    }

    poblarSelects() {
        this.poblarSelect('filterTipoCriador', this.catalogos.tiposCriador, 'id', 'tipoCriador');
        this.poblarSelect('filterZona', this.catalogos.zonas, 'id', 'zona');
        this.poblarSelect('filterEstado', this.catalogos.estados, 'id', 'estado');
        this.poblarSelect('filterCategoria', this.catalogos.categorias, 'id', 'categoria');

        this.poblarSelect('modalTipoCriador', this.catalogos.tiposCriador, 'id', 'tipoCriador');
        this.poblarSelect('modalZona', this.catalogos.zonas, 'id', 'zona');
        this.poblarSelect('modalEstado', this.catalogos.estados, 'id', 'estado');
        this.poblarSelect('modalCategoria', this.catalogos.categorias, 'id', 'categoria');
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

    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Criador';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
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

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());

        document.getElementById('btnETL').addEventListener('click', () => this.abrirModalETL());
        document.getElementById('cancelarETL').addEventListener('click', () => this.cerrarModalETL());
        document.getElementById('confirmarETL').addEventListener('click', () => this.ejecutarETL());

        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());

        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
                console.log('Actualizando criador ID:', data.id);
                console.log('Datos a enviar:', data);

                const resultado = await this.service.actualizar(data);
                console.log('Resultado actualización:', resultado);

                this.mostrarNotificacion('Criador actualizado exitosamente', 'success');
            } else {
                console.log('Creando nuevo criador');
                console.log('Datos a enviar:', data);

                const resultado = await this.service.crear(data);
                console.log('Resultado creación:', resultado);

                this.mostrarNotificacion('Criador creado exitosamente', 'success');
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
        const tipoCriadorId = parseInt(document.getElementById('modalTipoCriador').value) || null;
        const zonaId = parseInt(document.getElementById('modalZona').value) || null;
        const estadoId = parseInt(document.getElementById('modalEstado').value) || null;
        const categoriaId = parseInt(document.getElementById('modalCategoria').value) || null;

        const data = {
            fecha_registro: document.getElementById('modalFechaRegistro').value,
            nombre_criador: document.getElementById('modalNombreCriador').value,
            ruc: document.getElementById('modalRuc').value,
            tipo_criador: tipoCriadorId,
            zona: zonaId,
            direccion: document.getElementById('modalDireccion').value,
            telefono: document.getElementById('modalTelefono').value,
            email: document.getElementById('modalEmail').value,
            capacidad_produccion: parseFloat(document.getElementById('modalCapacidad').value) || 0,
            estado: estadoId,
            categoria: categoriaId,
            observaciones: document.getElementById('modalObservaciones').value
        };

        return data;
    }

    validarFormulario(data) {
        if (!data.fecha_registro) {
            this.mostrarNotificacion('La fecha de registro es obligatoria', 'warning');
            return false;
        }
        if (!data.nombre_criador) {
            this.mostrarNotificacion('El nombre del criador es obligatorio', 'warning');
            return false;
        }
        if (!data.ruc) {
            this.mostrarNotificacion('El RUC es obligatorio', 'warning');
            return false;
        }
        return true;
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            this.renderizarTablaFiltrada();
            this.mostrarNotificacion(`Datos cargados correctamente`, 'success');
        } catch (error) {
            console.error('Error detallado:', error);
            this.mostrarNotificacion(error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    renderizarTablaFiltrada() {
        const table = $('.min-w-full');
        const thead = document.querySelector('thead tr');
        if (!thead) return;

        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        const columnas = CriadorEmprendedorConfig.TABLA.COLUMNAS;
        const columnasConOpciones = [...columnas, 'Opciones'];

        thead.innerHTML = columnasConOpciones
            .map(c => `<th class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-left">${c.replace(/_/g, ' ')}</th>`)
            .join('');

        this.dataTable = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: this.service.baseURL + this.service.endpoints.FILTRO,
                type: 'GET',
                data: function (d) {
                    const filtros = {};
                    const campos = [
                        'FechaInicio', 'FechaFin', 'TipoCriador', 'Zona', 'Estado', 'Categoria'
                    ];

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
            responsive: true,
            pageLength: 10,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
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

    exportarExcel() {
        try {
            this.service.exportarCSV();
            this.mostrarNotificacion('Iniciando descarga de CSV...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Criador';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        console.log('Cargando datos en formulario:', r);

        document.getElementById('modalFechaRegistro').value = r.fecha_registro;
        document.getElementById('modalNombreCriador').value = r.nombre_criador || '';
        document.getElementById('modalRuc').value = r.ruc || '';
        document.getElementById('modalDireccion').value = r.direccion || '';
        document.getElementById('modalTelefono').value = r.telefono || '';
        document.getElementById('modalEmail').value = r.email || '';
        document.getElementById('modalCapacidad').value = r.capacidad_produccion || '';
        document.getElementById('modalObservaciones').value = r.observaciones || '';

        const tipoCriadorObj = this.catalogos.tiposCriador.find(t => t.tipoCriador === r.tipo_criador);
        document.getElementById('modalTipoCriador').value = tipoCriadorObj ? tipoCriadorObj.id : '';

        const zonaObj = this.catalogos.zonas.find(z => z.zona === r.zona);
        document.getElementById('modalZona').value = zonaObj ? zonaObj.id : '';

        const estadoObj = this.catalogos.estados.find(e => e.estado === r.estado);
        document.getElementById('modalEstado').value = estadoObj ? estadoObj.id : '';

        const categoriaObj = this.catalogos.categorias.find(c => c.categoria === r.categoria);
        document.getElementById('modalCategoria').value = categoriaObj ? categoriaObj.id : '';
    }

    async eliminarSeleccionado() {
        console.log('=== ELIMINAR CRIADOR ===');
        console.log('Registro seleccionado:', this.registroSeleccionado);

        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este criador?')) return;

        try {
            this.mostrarCargando(true);
            console.log('Eliminando ID:', this.registroSeleccionado.id);

            await this.service.eliminar(this.registroSeleccionado.id);
            this.mostrarNotificacion('Criador eliminado exitosamente', 'success');
            this.registroSeleccionado = null;
            await this.cargarDatos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
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
            warning: '⚠',
            info: 'ℹ'
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

    async aplicarFiltros() {
        this.renderizarTablaFiltrada();
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterTipoCriador').value = '';
        document.getElementById('filterZona').value = '';
        document.getElementById('filterEstado').value = '';
        document.getElementById('filterCategoria').value = '';

        this.cargarDatos();
    }

    abrirModalETL() {
        document.getElementById('modalETL').classList.remove('hidden');
    }

    cerrarModalETL() {
        document.getElementById('modalETL').classList.add('hidden');
    }

    async ejecutarETL() {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;

        if (!fechaInicio || !fechaFin) {
            this.mostrarNotificacion('Debe seleccionar ambas fechas', 'warning');
            return;
        }

        try {
            this.mostrarCargando(true);
            const resultado = await this.service.ejecutarETL({ fechaInicio, fechaFin });
            
            if (resultado.success) {
                this.mostrarNotificacion('ETL ejecutado exitosamente', 'success');
                this.cerrarModalETL();
                this.cargarDatos();
            } else {
                this.mostrarNotificacion('Error en ETL: ' + resultado.mensaje, 'error');
            }
        } catch (error) {
            console.error('Error al ejecutar ETL:', error);
            this.mostrarNotificacion('Error al ejecutar ETL: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }
}

const criadorEmprendedorController = new CriadorEmprendedorController();

