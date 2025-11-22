class ClientePvController {
    constructor() {
        this.config = window.clientePvConfig;
        this.service = new clientePvService();
        this.tipoActual = null;
        this.tablaActual = null;
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        this.setupEventListeners();
        this.setupColumnToggle();
    }


    // MÉTODO: Setup de toggle de columnas
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


    async cargarCatalogos() {
        try {

        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            this.mostrarNotificacion('Error al cargar catálogos: ' + error.message, 'error');
        }
    }

    poblarSelects() {
        // Filtros

        // Modal
        this.poblarSelect('modalEmpresa', this.catalogos.empresas, 'id', 'empresa');
        this.poblarSelect('modalMercado', this.catalogos.mercados, 'id', 'mercado');
        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('modalZona', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'id', 'proveedor');
        this.poblarSelect('modalCondicion', this.catalogos.condiciones, 'id', 'condicion');
        this.poblarSelect('modalTipo', this.catalogos.tipos, 'id', 'tipo');
        this.poblarSelect('modalTipoPollo', this.catalogos.tiposPollo, 'id', 'tipoPollo');
        this.poblarSelect('modalTipoPolloVivo', this.catalogos.tiposPolloVivo, 'id', 'tipoPolloVivo');
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
        document.getElementById('modalTitle').textContent = 'Nuevo Registro';
        this.limpiarFormulario();
        //this.mostrarCamposSegunTipo();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
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

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    setupEventListeners() {
        // Botones acción
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnModificar')?.addEventListener('click', () => this.modificarSeleccionado());
        document.getElementById('btnEliminar')?.addEventListener('click', () => this.eliminarSeleccionado());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());

        //etl
        document.getElementById('btnETL').addEventListener('click', () => this.abrirModalETL());
        document.getElementById('cancelarETL').addEventListener('click', () => this.cerrarModalETL());
        document.getElementById('confirmarETL').addEventListener('click', () => this.ejecutarETL());

        // Filtro btn
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());

        // Modal
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
                console.log('Actualizando registro ID:', data.id);
                console.log('Datos a enviar:', data);

                const resultado = await this.service.actualizar(data);
                console.log('Resultado actualización:', resultado);

                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                console.log('Creando nuevo registro');
                console.log('Datos a enviar:', data);

                const resultado = await this.service.crear(data);
                console.log('Resultado creación:', resultado);

                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos(this.tipoActual);
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {

        const carne_unidad = parseFloat(document.getElementById('modalCarneUnidad').value) || 0;
        const carne_kilos = parseFloat(document.getElementById('modalCarneKilos').value) || 0;
        const carne_soles = parseFloat(document.getElementById('modalCarneSoles').value) || 0;

        const brasa_unidad = parseFloat(document.getElementById('modalBrasaUnidad').value) || 0;
        const brasa_kilos = parseFloat(document.getElementById('modalBrasaKilos').value) || 0;
        const brasa_soles = parseFloat(document.getElementById('modalBrasaSoles').value) || 0;

        return {

            fecha: document.getElementById('modalFecha').value,
            zona: document.getElementById('modalZona').value,
            subzona: document.getElementById('modalSubzona').value,
            cliente: document.getElementById('modalCliente').value,
            coorporativo: document.getElementById('modalCoorporativo').value,
            carne_unidad,
            carne_kilos,
            carne_soles,
            brasa_unidad,
            brasa_kilos,
            brasa_soles,
        };
    }



    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
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

        // Destruir cualquier DataTable previo
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        // Definir columnas base
        const columnas = [
            "id", "fecha",
            "zona", "subzona", "cliente", "coorporativo",
            "carne_unidad", "carne_kilos", "carne_soles", "brasa_unidad",
            "brasa_kilos", "brasa_soles", "total_unidad", "total_kilos",
            "total_soles",
        ];

        // Diccionario para nombres bonitos
        const nombresColumnas = {
            id: "ID",
            fecha: "Fecha",

            zona: "Zona",
            subzona: "Sub Zona",
            cliente: "Cliente",
            coorporativo: "Coorporativo",
            carne_unidad: "Carne Unidad",
            carne_kilos: "Carne Kilos",

            carne_soles: "Carne Soles",
            brasa_unidad: "Brasa Unidad",
            brasa_kilos: "Brasa Kilos",

            brasa_soles: "Brasa Soles",
            total_unidad: "Total Unidad",
            total_kilos: "Total Kilos",
            total_soles: "Total Soles",
        };

        // Agregar columna de opciones
        const columnasConOpciones = [...columnas, 'Opciones'];

        // Generar dinámicamente las cabeceras del thead
        thead.innerHTML = columnasConOpciones
            .map(c => {
                const titulo = nombresColumnas[c] || c; // usa bonito si existe
                return `<th class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-left">${titulo}</th>`;
            })
            .join('');

        // Inicializar DataTable con AJAX y filtros
        this.dataTable = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: this.service.baseURL + this.config.API.ENDPOINTS.FILTRO,
                type: 'GET',
                data: function (d) {
                    const filtros = {};
                    const campos = [
                        'FechaInicio', 'FechaFin'
                    ];

                    // Extraer filtros desde los inputs del formulario
                    campos.forEach(campo => {
                        const el = document.getElementById(`filter${campo}`);
                        if (el && el.value.trim() !== '') {
                            const key = campo.charAt(0).toLowerCase() + campo.slice(1);
                            filtros[key] = el.value.trim();
                        }
                    });

                    // Combinar los parámetros de DataTables + filtros personalizados
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
                // Aplicar visibilidad de columnas después de cada redibujado
                Object.keys(this.columnasVisibles).forEach(columnIndex => {
                    const column = this.dataTable.column(parseInt(columnIndex));
                    if (column) {
                        column.visible(this.columnasVisibles[columnIndex]);
                    }
                });
            }
        });

        // Aplicar visibilidad inicial
        Object.keys(this.columnasVisibles).forEach(columnIndex => {
            const column = this.dataTable.column(parseInt(columnIndex));
            if (column) {
                column.visible(this.columnasVisibles[columnIndex]);
            }
        });

        // Delegar eventos para los botones de acción
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

        document.getElementById('modalTitle').textContent = 'Modificar Registro';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;

        document.getElementById("modalFecha").value = r.fecha || "";
        document.getElementById("modalZona").value = r.zona || "";
        document.getElementById("modalSubzona").value = r.subzona || "";
        document.getElementById("modalCliente").value = r.cliente || "";
        document.getElementById("modalCoorporativo").value = r.coorporativo || "";

        document.getElementById("modalCarneUnidad").value = r.carne_unidad || "";
        document.getElementById("modalCarneKilos").value = r.carne_kilos || "";
        document.getElementById("modalCarneSoles").value = r.carne_soles || "";

        document.getElementById("modalBrasaUnidad").value = r.brasa_unidad || "";
        document.getElementById("modalBrasaKilos").value = r.brasa_kilos || "";
        document.getElementById("modalBrasaSoles").value = r.brasa_soles || "";
    }


    async eliminarSeleccionado() {
        console.log('=== ELIMINAR REGISTRO ===');
        console.log('Registro seleccionado:', this.registroSeleccionado);
        console.log('Tabla actual:', this.tablaActual);

        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        try {
            this.mostrarCargando(true);
            console.log('Eliminando ID:', this.registroSeleccionado.id);

            await this.service.eliminar(this.registroSeleccionado.id);

            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            this.registroSeleccionado = null;
            await this.cargarDatos(this.tipoActual);
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`[${tipo}] ${mensaje}`);

        // Crear contenedor si no existe
        let container = document.getElementById('notificaciones-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificaciones-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
            document.body.appendChild(container);
        }

        // Crear notificación
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

        // Auto-eliminar después de 4 segundos
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
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

    async aplicarFiltros() {
        this.renderizarTablaFiltrada();
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';

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
            this.mostrarNotificacion('Debe ingresar ambas fechas inicio y fin.', 'warning');
            return;
        }

        try {
            this.mostrarCargando(true);

            const resultado = await this.service.ejecutarETL({ fechaInicio, fechaFin });
            console.log('Resultado ETL:', resultado);

            if (resultado.success) {
                const total = resultado.resumen?.total_registros_procesados ?? 0;
                this.mostrarAlertaETL(total);
                this.cerrarModalETL();
                await this.cargarDatos(); // Recarga tabla
            } else {
                this.mostrarNotificacion('Error en la ejecución del ETL.', 'error');
            }

        } catch (error) {
            console.error('Error en ETL:', error);
            this.mostrarNotificacion('Error al ejecutar ETL: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }


    mostrarAlertaETL(total) {
        // Crear fondo oscuro
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';

        // Crear ventana modal
        const modal = document.createElement('div');
        modal.style.backgroundColor = '#fff';
        modal.style.borderRadius = '12px';
        modal.style.padding = '25px 35px';
        modal.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
        modal.style.textAlign = 'center';
        modal.style.maxWidth = '400px';
        modal.style.fontFamily = 'Arial, sans-serif';
        modal.style.animation = 'fadeIn 0.3s ease';

        // Contenido del mensaje
        modal.innerHTML = `
    <h3 style="color: #2e7d32; margin-bottom: 10px;">ETL completado exitosamente</h3>
    <p style="margin-bottom: 20px; font-size: 15px; color: #333;">
      Se procesaron un total de <strong>${total}</strong> registros.<br><br>
      Todo se ejecutó correctamente.
    </p>
    <button id="cerrarModal" style="
      background-color: #2e7d32;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 15px;
      cursor: pointer;
    ">Cerrar</button>
  `;

        // Insertar modal al overlay
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Cerrar modal al hacer clic en el botón
        document.getElementById('cerrarModal').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Animación de aparición (opcional)
        const style = document.createElement('style');
        style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
        document.head.appendChild(style);
    }


}

window.clientePvController = new ClientePvController();