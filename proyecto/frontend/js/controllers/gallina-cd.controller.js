class GallinaCDController {
    constructor() {
        this.service = new GallinaCDService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.catalogos = { tipos: [] };
        this.config = window.GallinaCDConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando GallinaCD Controller...');
        await this.cargarDatos();
        await this.cargarCatalogos();
        this.setupEventListeners();
        this.setupColumnToggle();
        this.setupToggleFiltros();
        this.renderizarTablaCliente();
    }

    setupColumnToggle() {
        const btnToggle = document.getElementById('btnToggleColumns');
        const dropdown = document.getElementById('columnDropdown');
        const btnClose = document.getElementById('btnCloseDropdown');
        const checkboxes = document.querySelectorAll('.column-checkbox');

        // Inicializar columna ID como visible
        checkboxes.forEach(checkbox => {
            const columnIndex = parseInt(checkbox.dataset.column);
            // Hacer visible la columna ID (índice 0) por defecto
            if (columnIndex === 0) {
                checkbox.checked = true;
                this.columnasVisibles[columnIndex] = true;
            } else {
                this.columnasVisibles[columnIndex] = checkbox.checked;
            }
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

    setupToggleFiltros() {
        const btnToggle = document.getElementById('btnToggleFiltros');
        const filterContent = document.getElementById('filterContent');

        if (!btnToggle || !filterContent) return;

        // Iniciar abierto
        filterContent.classList.add('show');

        btnToggle.addEventListener('click', () => {
            const isOpen = filterContent.classList.contains('show');
            const icon = btnToggle.querySelector('i');

            if (isOpen) {
                filterContent.classList.remove('show');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                filterContent.classList.add('show');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            console.log('📊 Cargando todos los datos...');

            this.datos = await this.service.getAll();
            this.datosFiltrados = [...this.datos]; // Copia de los datos para filtrar

            console.log(`✅ ${this.datos.length} registros cargados`);

        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos', 'error');
            this.datos = [];
            this.datosFiltrados = [];
        } finally {
            this.mostrarCargando(false);
        }
    }

    async cargarCatalogos() {
        try {
            console.log('📋 Cargando catálogos desde el backend…');

            // Obtener tipos desde el endpoint
            const tipos = await this.service.getTipos();

            // Asignar al catálogo
            this.catalogos.tipos = tipos;

            console.log('✅ Tipos cargados del backend:', this.catalogos.tipos);

            // Poblar los selects con la data recibida
            this.poblarSelects();

        } catch (error) {
            console.error('❌ Error al cargar catálogos:', error);
        }
    }

    poblarSelects() {
        const selectFilterTipo = document.getElementById('filterTipo');
        const selectModalTipo = document.getElementById('modalTipo');

        if (selectFilterTipo) {
            selectFilterTipo.innerHTML = '<option value="">Todos los tipos</option>';
            this.catalogos.tipos.forEach(tipo => {
                selectFilterTipo.innerHTML += `<option value="${tipo.codigo}">${tipo.nombre}</option>`;
            });
        }

        if (selectModalTipo) {
            selectModalTipo.innerHTML = '<option value="">Seleccionar...</option>';
            this.catalogos.tipos.forEach(tipo => {
                selectModalTipo.innerHTML += `<option value="${tipo.codigo}">${tipo.nombre}</option>`;
            });
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

    async aplicarFiltros() {
        console.log("🔍 Aplicando filtros desde BACKEND...");

        const fechaInicio = document.getElementById('filterFechaInicio')?.value || "";
        const fechaFin = document.getElementById('filterFechaFin')?.value || "";
        const tipo = document.getElementById('filterTipo')?.value || "";

        const filtros = { fechaInicio, fechaFin, tipo };

        try {
            const respuesta = await this.service.getFiltered(filtros);

            this.datosFiltrados = respuesta.data || [];
            console.log("📥 Registros filtrados obtenidos del servidor:", this.datosFiltrados.length);

            // Actualiza DataTable usando datos desde el servidor
            this.renderizarTablaClienteDesdeBackend();

            this.mostrarNotificacion(`${this.datosFiltrados.length} registros encontrados`, 'info');

        } catch (e) {
            console.error("❌ Error al filtrar desde backend:", e);
            this.mostrarNotificacion("Error al obtener datos filtrados", "error");
        }
    }

    renderizarTablaClienteDesdeBackend() {

        const table = $('#dataTable');

        // destruir DT si existe
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        this.dataTable = table.DataTable({
            data: this.datosFiltrados,   // ✔ ahora usa datos del backend
            processing: false,
            serverSide: false,
            scrollX: true,

            columns: [
                { data: "id" },
                { data: "fecha" },
                { data: "tipo" },
                { data: "unidades" },
                { data: "kilos" },
                { data: "peso" },
                { data: "precio_granja_1" },
                { data: "precio_granja_2" },
                { data: "precio_granja_3" },
                { data: "precio_granja_4" },
                { data: "precio_granja_5" },
                { data: "precio_cd_1" },
                { data: "precio_cd_2" },
                { data: "precio_cd_3" },
                { data: "precio_cd_4" },
                { data: "precio_cd_5" },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: (data, type, row, meta) => `
                    <div class="flex gap-1 justify-center">
                        <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn">✏</button>
                        <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn">🗑</button>
                    </div>
                `
                }
            ],

            order: [[1, "desc"]],
            pageLength: 10,

            drawCallback: () => {
                Object.keys(this.columnasVisibles).forEach(index => {
                    this.dataTable.column(parseInt(index)).visible(this.columnasVisibles[index]);
                });
            }
        });

        // eventos
        $('#dataTable tbody')
            .off('click')
            .on('click', '.edit-btn', (e) => {
                const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
                this.registroSeleccionado = rowData;
                this.modificarSeleccionado();
            })
            .on('click', '.delete-btn', async (e) => {
                const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
                this.registroSeleccionado = rowData;
                await this.eliminarSeleccionado();
            });
    }



    limpiarFiltros() {
        console.log('🧹 Limpiando filtros...');

        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterTipo').value = '';

        // Restaurar todos los datos
        this.datosFiltrados = [...this.datos];

        console.log(`✅ Mostrando todos los registros: ${this.datosFiltrados.length}`);

        // Destruir y recrear la tabla
        if (this.dataTable) {
            this.dataTable.destroy();
            this.renderizarTablaCliente();
        } else {
            this.renderizarTablaCliente();
        }

        this.mostrarNotificacion(`Mostrando ${this.datosFiltrados.length} registros`, 'success');
    }


    renderizarTablaCliente() {
        console.log('📊 Renderizando tabla con', this.datosFiltrados.length, 'registros...');

        const table = $('#dataTable'); // Cambiar selector

        // Destruir DataTable previo si existe
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        // Limpiar el tbody antes de reinicializar
        $('#tableBody').empty();

        // Inicializar DataTable con CLIENT-SIDE processing
        this.dataTable = table.DataTable({
            data: this.datosFiltrados,
            processing: false,
            serverSide: false,
            destroy: true,
            scrollX: true, // Habilitar scroll horizontal
            scrollCollapse: true,
            columns: [
                {
                    data: 'id',
                    className: 'text-center text-xs px-2',
                    visible: true,
                    render: (data) => {
                        if (!data) return '';
                        return `<span class="text-xs" title="${data}">${data.substring(0, 8)}...</span>`;
                    }
                },
                {
                    data: 'fecha',
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                {
                    data: 'tipo',
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                {
                    data: 'unidades',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'kilos',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'peso',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_granja_1',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_granja_2',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_granja_3',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_granja_4',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_granja_5',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_cd_1',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_cd_2',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_cd_3',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_cd_4',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: 'precio_cd_5',
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center px-2',
                    defaultContent: '',
                    render: (data, type, row) => `
                    <div class="flex gap-1 justify-center">
                        <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn text-sm" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn text-sm" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
                }
            ],
            order: [[1, 'desc']],
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
            responsive: false, // Desactivar responsive para usar scrollX
            autoWidth: false,
            dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"<"flex items-center"l><"flex items-center"f>>rtip',
            drawCallback: () => {
                // Aplicar visibilidad de columnas guardada
                Object.keys(this.columnasVisibles).forEach(columnIndex => {
                    const index = parseInt(columnIndex);
                    try {
                        if (this.dataTable && this.dataTable.column(index)) {
                            this.dataTable.column(index).visible(this.columnasVisibles[index]);
                        }
                    } catch (e) {
                        // Ignorar errores
                    }
                });
            },
            initComplete: () => {
                console.log('✅ Tabla renderizada con', this.datosFiltrados.length, 'registros');

                // Ajustar el contenedor después de inicializar
                $('.dataTables_wrapper').addClass('w-full');
            }
        });

        // Re-vincular eventos después de recrear la tabla
        $('#dataTable tbody')
            .off('click')
            .on('click', '.edit-btn', (e) => {
                e.stopPropagation();
                const row = $(e.currentTarget).closest('tr');
                const rowData = this.dataTable.row(row).data();
                this.registroSeleccionado = rowData;
                console.log('📝 Editando:', rowData);
                this.modificarSeleccionado();
            })
            .on('click', '.delete-btn', async (e) => {
                e.stopPropagation();
                const row = $(e.currentTarget).closest('tr');
                const rowData = this.dataTable.row(row).data();
                this.registroSeleccionado = rowData;
                console.log('🗑️ Eliminando:', rowData);
                await this.eliminarSeleccionado();
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
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');

            // Recargar datos
            await this.cargarDatos();
            await this.cargarCatalogos();

            // Aplicar filtros actuales si existen
            const fechaInicio = document.getElementById('filterFechaInicio')?.value;
            const fechaFin = document.getElementById('filterFechaFin')?.value;
            const tipo = document.getElementById('filterTipo')?.value;

            if (fechaInicio || fechaFin || tipo) {
                this.aplicarFiltros();
            } else {
                // Si no hay filtros, destruir y recrear tabla
                if (this.dataTable) {
                    this.dataTable.destroy();
                }
                this.renderizarTablaCliente();
            }

        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar el registro', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
                await this.service.update(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                delete data.id;
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();

            // Recargar datos
            await this.cargarDatos();
            await this.cargarCatalogos();

            // Aplicar filtros actuales si existen
            const fechaInicio = document.getElementById('filterFechaInicio')?.value;
            const fechaFin = document.getElementById('filterFechaFin')?.value;
            const tipo = document.getElementById('filterTipo')?.value;

            if (fechaInicio || fechaFin || tipo) {
                this.aplicarFiltros();
            } else {
                // Si no hay filtros, destruir y recrear tabla
                if (this.dataTable) {
                    this.dataTable.destroy();
                }
                this.renderizarTablaCliente();
            }

        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }


    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;

        console.log('Cargando en formulario:', r);

        document.getElementById('modalFecha').value = r.fecha || '';

        // Para el tipo
        const selectTipo = document.getElementById('modalTipo');
        if (selectTipo) {
            // Buscar si existe la opción
            let found = false;
            for (let option of selectTipo.options) {
                if (option.value === r.tipo) {
                    selectTipo.value = r.tipo;
                    found = true;
                    break;
                }
            }

            // Si no existe, agregarla
            if (!found && r.tipo) {
                const newOption = document.createElement('option');
                newOption.value = r.tipo;
                newOption.text = r.tipo;
                selectTipo.add(newOption);
                selectTipo.value = r.tipo;
            }
        }

        // Campos numéricos
        document.getElementById('modalUnidades').value = r.unidades || '';
        document.getElementById('modalKilos').value = r.kilos || '';
        document.getElementById('modalPeso').value = r.peso || '';

        // Precios Granja
        document.getElementById('modalPrecioGranja1').value = r.precio_granja_1 || '';
        document.getElementById('modalPrecioGranja2').value = r.precio_granja_2 || '';
        document.getElementById('modalPrecioGranja3').value = r.precio_granja_3 || '';
        document.getElementById('modalPrecioGranja4').value = r.precio_granja_4 || '';
        document.getElementById('modalPrecioGranja5').value = r.precio_granja_5 || '';

        // Precios CD
        document.getElementById('modalPrecioCd1').value = r.precio_cd_1 || '';
        document.getElementById('modalPrecioCd2').value = r.precio_cd_2 || '';
        document.getElementById('modalPrecioCd3').value = r.precio_cd_3 || '';
        document.getElementById('modalPrecioCd4').value = r.precio_cd_4 || '';
        document.getElementById('modalPrecioCd5').value = r.precio_cd_5 || '';
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
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                // No enviar ID para crear nuevo
                delete data.id;
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();

            // Recargar datos y actualizar tabla
            await this.cargarDatos();
            await this.cargarCatalogos();

            if (this.dataTable) {
                this.dataTable.clear();
                this.dataTable.rows.add(this.datosFiltrados);
                this.dataTable.draw();
            }

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
            tipo: document.getElementById('modalTipo').value || null,
            unidades: parseInt(document.getElementById('modalUnidades').value) || 0,
            kilos: parseFloat(document.getElementById('modalKilos').value) || 0,
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            precio_granja_1: parseFloat(document.getElementById('modalPrecioGranja1').value) || 0,
            precio_granja_2: parseFloat(document.getElementById('modalPrecioGranja2').value) || 0,
            precio_granja_3: parseFloat(document.getElementById('modalPrecioGranja3').value) || 0,
            precio_granja_4: parseFloat(document.getElementById('modalPrecioGranja4').value) || 0,
            precio_granja_5: parseFloat(document.getElementById('modalPrecioGranja5').value) || 0,
            precio_cd_1: parseFloat(document.getElementById('modalPrecioCd1').value) || 0,
            precio_cd_2: parseFloat(document.getElementById('modalPrecioCd2').value) || 0,
            precio_cd_3: parseFloat(document.getElementById('modalPrecioCd3').value) || 0,
            precio_cd_4: parseFloat(document.getElementById('modalPrecioCd4').value) || 0,
            precio_cd_5: parseFloat(document.getElementById('modalPrecioCd5').value) || 0,
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' '),
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        console.log('Validando formulario:', data);

        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }

        if (!data.tipo) {
            this.mostrarNotificacion('El tipo de gallina es obligatorio', 'warning');
            return false;
        }

        console.log('✅ Validación exitosa');
        return true;
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    exportarExcel() {
        const url = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.EXCEL}`;
        console.log('📊 Exportando a Excel:', url);
        window.open(url, '_blank');
        this.mostrarNotificacion('Exportando a Excel...', 'info');
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

// Inicializar el controlador
window.gallinaCDController = new GallinaCDController();
