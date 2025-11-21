class bdOficialController {
    constructor() {
        this.config = window.bdOficialConfig;
        this.service = new bdOficialService();
        this.tipoActual = null;
        this.tablaActual = null;
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
        this.initAutocomplete();
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

        const data = {

            // DATOS PRINCIPALES
            fecha: document.getElementById('modalFecha').value,

            // DATOS DEL CLIENTE
            ccod_cli: document.getElementById('modalCcodCli').value || '',
            crazn_soci: document.getElementById('modalCraznSoci').value || '',
            cdesc_giro: document.getElementById('modalcdesc_giro').value || '',
            cdireccion: document.getElementById('modalCdireccion').value || '',
            cnom_ubige: document.getElementById('modalCnomUbige').value || '',
            provincia: document.getElementById('modalprovincia').value || '',
            cnom_departamento: document.getElementById('modaldepartamento').value || '',
            dfec_alta: document.getElementById('modaldfec_alta').value || '',
            ccod_ruta: document.getElementById('modalccod_ruta').value || '',

            // DATOS DEL VENDEDOR
            ccod_vend: document.getElementById('modalccod_vend').value || '',
            cnom_vend: document.getElementById('modalCnomVend').value || '',
            ccod_fuerz: document.getElementById('modalccod_fuerz').value || '',

            // PRODUCTO
            ccod_prod_distribuidor: document.getElementById('modaldistribuidor').value || '',
            cnom_prod: document.getElementById('modalCnomProd').value || '',
            cnom_categ: document.getElementById('modalcateg').value || '',
            cnom_lin: document.getElementById('modalcnom_lin').value || '',
            cnom_sublin: document.getElementById('modalcnom_sublin').value || '',

            // CANTIDAD / PESO / PRECIO / TIPO DE VENTA
            ncant: parseFloat(document.getElementById('modalNcant').value) || 0,
            npeso: parseFloat(document.getElementById('modalNpeso').value) || 0,
            precio: parseFloat(document.getElementById('modalPrecio').value) || 0,
            tipo_venta: document.getElementById('modalTipoVenta').value || 'unit',

            // CLIENTE EXTRA
            cruc_cli: document.getElementById('modalcruc_cli').value || '',
            cdni_cli: document.getElementById('modalcdni_cli').value || '',

            ccod_movil: document.getElementById('modalccod_movil').value || '',
            cdesc_movi: document.getElementById('modalcdesc_movi').value || '',
            cdesc_cana: document.getElementById('modalcdesc_cana').value || '',
            cdia_visit: document.getElementById('modalcdia_visit').value || '',

            // PRODUCTO SF
            ccod_prod_sf: document.getElementById('modalccod_prod_sf').value || '',
            cnom_prod_sf: document.getElementById('modalcnom_prod_sf').value || '',
            categoria_sf: document.getElementById('modalCategoriaSf').value || '',
            familia_sf: document.getElementById('modalFamiliaSf').value || '',
            subfamilia_sf: document.getElementById('modalSubfamiliaSf').value || '',

            // CAMPOS FIJOS
            //nom_db: 'excel',       // como en tu BD oficial
            //usuarioRegistro: localStorage.getItem('usuario') || 'desconocido'
        };

        return data;
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
            "ccod_cli", "ccod_cli_comp", "crazn_soci", "cdesc_giro",
            "cdireccion", "cnom_ubige", "provincia", "cnom_departamento",
            "dfec_alta", "ccod_ruta", "ccod_vend", "cnom_vend",
            "ccod_fuerz", "ccod_prod_distribuidor",
            "cnom_prod", "cnom_categ", "cnom_lin", "cnom_subli",
            "ncant", "npeso", "peso_final",
            "impte_igv", "impte_base",
            "cruc_cli", "cdni_cli",
            "ccod_movil", "cdesc_movi", "cdesc_cana",
            "cdia_visit", "frec", "id_prov",
            "dap",
            "ccod_prod_sf", "cnom_prod_sf",
            "categoria_sf", "familia_sf", "subfamilia_sf",
            "cond"
        ];

        // Diccionario para nombres bonitos
        const nombresColumnas = {
            id: "ID",
            fecha: "Fecha",

            ccod_cli: "Código Cliente",
            ccod_cli_comp: "Código Cliente Comp",
            crazn_soci: "Razón Social",
            cdesc_giro: "Giro",
            cdireccion: "Dirección",
            cnom_ubige: "Ubigeo",

            provincia: "Provincia",
            cnom_departamento: "Departamento",
            dfec_alta: "Fecha Alta",

            ccod_ruta: "Cod. Ruta",
            ccod_vend: "Cod. Vendedor",
            cnom_vend: "Vendedor",
            ccod_fuerz: "Cod. Fuerza",
            ccod_prod_distribuidor: "Cod. Prod. Distribuidor",

            cnom_prod: "Producto",
            cnom_categ: "Categoría",
            cnom_lin: "Línea",
            cnom_subli: "Sub Línea",

            ncant: "Cantidad",
            npeso: "Peso",
            peso_final: "Peso Final",

            impte_igv: "Importe c/IGV",
            impte_base: "Importe s/IGV",

            cruc_cli: "RUC Cliente",
            cdni_cli: "DNI Cliente",

            ccod_movil: "Cod. Móvil",
            cdesc_movi: "Desc. Móvil",
            cdesc_cana: "Canal",

            cdia_visit: "Día Visita",
            frec: "Frecuencia",
            id_prov: "ID Proveedor",
            dap: "Distribuidora",

            ccod_prod_sf: "Cod. Prod SF",
            cnom_prod_sf: "Producto SF",

            categoria_sf: "Categoría SF",
            familia_sf: "Familia SF",
            subfamilia_sf: "Subfamilia SF",

            cond: "Condición"
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
                type: 'POST',
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
    console.log("Cargando datos en formulario:", r);

    // Fecha
    document.getElementById("modalFecha").value = r.fecha || "";

    // Textos simples (autocompletados)
    document.getElementById("modalCcodCli").value = r.ccod_cli || "";
    document.getElementById("modalCraznSoci").value = r.crazn_soci || "";
    document.getElementById("modalcdesc_giro").value = r.cdesc_giro || "";
    document.getElementById("modalCdireccion").value = r.cdireccion || "";
    document.getElementById("modalCnomUbige").value = r.cnom_ubige || "";
    document.getElementById("modalprovincia").value = r.provincia || "";
    document.getElementById("modaldepartamento").value = r.cnom_departamento || "";
    document.getElementById("modaldfec_alta").value = r.dfec_alta || "";
    document.getElementById("modalccod_ruta").value = r.ccod_ruta || "";
    document.getElementById("modalccod_vend").value = r.ccod_vend || "";
    document.getElementById("modalCnomVend").value = r.cnom_vend || "";
    document.getElementById("modalccod_fuerz").value = r.ccod_fuerz || "";
    document.getElementById("modaldistribuidor").value = r.ccod_prod_distribuidor || "";
    document.getElementById("modalCnomProd").value = r.cnom_prod || "";
    document.getElementById("modalcateg").value = r.cnom_categ || "";
    document.getElementById("modalcnom_lin").value = r.cnom_lin || "";
    document.getElementById("modalcnom_sublin").value = r.cnom_sublin || "";
    document.getElementById("modalcruc_cli").value = r.cruc_cli || "";
    document.getElementById("modalcdni_cli").value = r.cdni_cli || "";
    document.getElementById("modalccod_movil").value = r.ccod_movil || "";
    document.getElementById("modalcdesc_movi").value = r.cdesc_movi || "";
    document.getElementById("modalcdesc_cana").value = r.cdesc_cana || "";
    document.getElementById("modalcdia_visit").value = r.cdia_visit || "";
    document.getElementById("modalccod_prod_sf").value = r.ccod_prod_sf || "";
    document.getElementById("modalcnom_prod_sf").value = r.cnom_prod_sf || "";
    document.getElementById("modalCategoriaSf").value = r.categoria_sf || "";
    document.getElementById("modalFamiliaSf").value = r.familia_sf || "";
    document.getElementById("modalSubfamiliaSf").value = r.subfamilia_sf || "";

    // Numéricos
    document.getElementById("modalNcant").value = r.ncant || "";
    document.getElementById("modalNpeso").value = r.npeso || "";
    document.getElementById("modalPrecio").value = r.impte_base || ""; // precio sin IGV

    // Tipo de venta (si no existe, default "unit")
    document.getElementById("modalTipoVenta").value = r.tipo_venta || "unit";
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

    initAutocomplete() {
        const inputs = document.querySelectorAll('.autocomplete-input');

        inputs.forEach(input => {

            // Evento de escritura → cargar sugerencias
            input.addEventListener('input', async () => {

                const campo = input.getAttribute('data-campo');
                const query = input.value.trim();

                if (!campo || query.length < 2) return;

                const sugerencias = await this.service.autocomplete(campo, query);

                this.mostrarSugerencias(input, sugerencias);
            });

            // Evento perder el foco → cerrar sugerencias
            input.addEventListener("blur", () => {
                setTimeout(() => {
                    const box = input.nextElementSibling;
                    if (box && box.classList.contains("autocomplete-box")) {
                        box.remove();
                    }
                }, 150);
            });

        });
    }

    mostrarSugerencias(input, lista) {
        // eliminar anteriores
        let caja = input.nextElementSibling;
        if (caja && caja.classList.contains("autocomplete-box")) {
            caja.remove();
        }

        if (!lista.length) return;

        caja = document.createElement("div");
        caja.classList.add("autocomplete-box");
        caja.style.position = "absolute";
        caja.style.zIndex = "1000";
        caja.style.background = "white";
        caja.style.border = "1px solid #ccc";
        caja.style.width = input.offsetWidth + "px";
        caja.style.maxHeight = "180px";
        caja.style.overflowY = "auto";

        lista.forEach(item => {
            const opcion = document.createElement("div");
            opcion.classList.add("px-2", "py-1", "hover:bg-gray-200", "cursor-pointer");
            opcion.textContent = item;
            opcion.onclick = () => {
                input.value = item;

                const box = input.nextElementSibling;
                if (box) box.remove();
            };
            caja.appendChild(opcion);
        });

        input.parentNode.appendChild(caja);
    }




}

window.bdoficialController = new bdOficialController();