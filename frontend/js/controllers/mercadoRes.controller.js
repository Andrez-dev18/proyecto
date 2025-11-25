class MercadoResController {
    constructor() {
        this.config = window.MercadoResConfig;
        this.service = new MercadoResService();
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
    }

    async cargarCatalogos() {
        try {
            console.log('Cargando catálogos...');

            const [provincias] = await Promise.all([
                this.service.getProvincias(),
            ]);

            this.catalogos = { provincias };

            console.log('Catálogos cargados:', this.catalogos);

            this.poblarSelects();
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
        }
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


    poblarSelects() {
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'codigo', 'nombre');
        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'codigo', 'nombre');
        this.poblarSelect('provinciaSelect', this.catalogos.provincias, 'codigo', 'nombre');
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

        document.getElementById('provinciaSelect')?.addEventListener('change', () => this.cargarPivotMercadosProvincia());
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

                const resultado = await this.service.create(data);
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
        return {
            provincia: document.getElementById("modalProvincia").value,

            num_mercados: parseInt(document.getElementById("modalnum_mercados").value) || 0,

            tipo_establecimiento: document.getElementById("modaltipo_establecimiento").value,

            tamanio: document.getElementById("modaltamanio").value,

            total: parseFloat(document.getElementById("modaltotal").value) || 0,

            num_aves: parseInt(document.getElementById("modalnum_aves").value) || 0
        };
    }



    validarFormulario(data) {

        return true;
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);

            this.renderizarTablaFiltrada();
            this.cargarPivot();

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
        const table = $('#tablaRes');
        const thead = document.querySelector('thead tr');
        if (!thead) return;

        // Destruir cualquier DataTable previo
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        // Definir columnas base
        const columnas = [
            "fecha",
            "provincia", "provincia_nombre", "tipoEstablecimiento", "tamanio", "total",
            "numAves",
        ];

        // Diccionario para nombres bonitos
        const nombresColumnas = {
            fecha: "Fecha",
            provincia: "Provincia",
            provincia_nombre: "Nombre Provincia",

            tipoEstablecimiento: "Tipo Establecimiento",
            tamanio: "Tamaño",
            total: "Total",
            numAves: "N° Aves",
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
                url: this.config.API.BASE_URL + this.config.API.ENDPOINTS.FILTRO,
                type: 'GET',
                data: function (d) {
                    const filtros = {};
                    const campos = [
                        'Provincia', 'TipoEstablecimiento'
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
                const totalCols = this.dataTable.columns().count();

                Object.keys(this.columnasVisibles).forEach(columnIndex => {
                    const index = parseInt(columnIndex);

                    if (index < totalCols) {
                        this.dataTable.column(index).visible(this.columnasVisibles[columnIndex]);
                    }
                });
            }

        });

        // Aplicar visibilidad inicial
        const totalCols = this.dataTable.columns().count();

        Object.keys(this.columnasVisibles).forEach(columnIndex => {
            const index = parseInt(columnIndex);

            if (index < totalCols) {
                this.dataTable.column(index).visible(this.columnasVisibles[columnIndex]);
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

    cargarMercadosProvincia() {
        const cont = document.getElementById("contentSelectProvincia");
        cont.classList.remove("hidden");
    }



    async cargarPivotMercadosProvincia() {
        const provincia = document.getElementById("provinciaSelect").value;

        if (!provincia) return;

        try {
            const response = await fetch(
                `${this.config.API.BASE_URL}/mercadores/resumen/mercados?provincia=${provincia}`
            );

            const data = await response.json();

            document.querySelector(".text-xl.font-bold").textContent =
                "Resumen por Número de Mercados";

            if (!Array.isArray(data) || data.length === 0) {
                this.pintarTabla([], []);
                return;
            }

            const columnas = Object.keys(data[0])
                .filter(c => !["tipo", "categoria", "tamanio", "Total"].includes(c))
                .sort();

            this.pintarTabla(data, columnas);

        } catch (err) {
            console.error("Error obteniendo pivot:", err);
            this.pintarTabla([], []);
        }
    }


    async cargarPivot() {
    const select = document.getElementById("selectTipo");
    const provinciaBlock = document.getElementById("contentSelectProvincia");

    select.addEventListener("change", async () => {
        const tipo = select.value;

        provinciaBlock.classList.add("hidden"); // ocultar por defecto

        let endpoint = "";
        let titulo = "";

        switch (tipo) {
            case "provincias":
                endpoint = "/mercadores/resumen/provincias";
                titulo = "Resumen por Provincias";
                break;

            case "aves":
                endpoint = "/mercadores/resumen/aves";
                titulo = "Resumen por Número de Aves";
                break;

            case "mercados":
                this.cargarMercadosProvincia();
                return; // salimos porque dependencia es el select provincia
        }

        if (!endpoint) return;

        try {
            const response = await fetch(this.config.API.BASE_URL + endpoint);
            const data = await response.json();

            document.querySelector(".text-xl.font-bold").textContent = titulo;

            if (!Array.isArray(data) || data.length === 0) {
                this.pintarTabla([], []);
                return;
            }

            const columnas = Object.keys(data[0])
                .filter(c => !["tipo", "categoria", "tamanio", "Total"].includes(c))
                .sort();

            this.pintarTabla(data, columnas);

        } catch (err) {
            console.error("Error en cargar pivot:", err);
            this.pintarTabla([], []);
        }
    });

    // Valor inicial
    select.value = "provincias";
    select.dispatchEvent(new Event("change"));
}


    pintarTabla(data, provincias) {

    const head = document.getElementById("headPivot");
    const body = document.getElementById("bodyPivot");

    // Reiniciar tabla
    head.innerHTML = "";
    body.innerHTML = "";

    // Validación mínima de datos
    if (!Array.isArray(data) || data.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="20" class="text-center py-6 text-gray-500">
                    No hay datos para mostrar
                </td>
            </tr>
        `;
        return;
    }

    /* ============================
       CABECERA
    ============================ */
    head.innerHTML = `<th class="px-3 py-2 border text-xs uppercase">Categoría</th>`;
    
    provincias.forEach(prov => {
        head.innerHTML += `
            <th class="px-3 py-2 border text-xs uppercase">${prov}</th>
        `;
    });

    head.innerHTML += `
        <th class="px-3 py-2 border text-xs uppercase">Total</th>
    `;

    /* ============================
       ESTRUCTURA (MISMA QUE TENÍAS)
    ============================ */
    const estructura = [
        { titulo: "N° Mercados", indice: 0 },
        { titulo: "Puesto de mercado", filas: [1, 2, 3], total: 4 },
        { titulo: "Tiendas y puestos aledaños", filas: [5, 6, 7], total: 8 },
        { titulo: null, indice: 9 }
    ];

    /* ============================
       CONTENIDO
    ============================ */
    body.innerHTML = "";

    estructura.forEach(grupo => {

        // GRUPO CON FILAS
        if (grupo.filas) {
            body.innerHTML += `
                <tr class="bg-blue-100">
                    <td colspan="${provincias.length + 2}" class="px-3 py-2 border text-sm">
                        ${grupo.titulo}
                    </td>
                </tr>
            `;

            grupo.filas.forEach(i => {
                if (data[i]) {
                    body.innerHTML += this.crearFila(data[i], provincias);
                }
            });

            // Total del grupo
            if (data[grupo.total]) {
                body.innerHTML += this.crearFila(data[grupo.total], provincias, true);
            }

        } else {
            // FILA ÚNICA (como total final)
            const item = data[grupo.indice];
            if (item) {
                const clases = grupo.indice === 9 ? "bg-cyan-100 font-bold" : "";
                body.innerHTML += `
                    <tr class="${clases}">
                        ${this.filaHTML(item, provincias)}
                    </tr>
                `;
            }
        }

    });
}


    crearFila(item, provincias, esTotal = false) {
        const clases = esTotal ? "font-bold" : "";
        return `<tr class="${clases}">${this.filaHTML(item, provincias)}</tr>`;
    }

    filaHTML(item, provincias) {
        let html = `<td class="px-3 py-2 border text-sm">${item.categoria}</td>`;
        provincias.forEach(prov => {
            html += `<td class="px-3 py-2 border text-sm text-right">${item[prov] || 0}</td>`;
        });
        html += `<td class="px-3 py-2 border text-sm text-right">${item.Total}</td>`;
        return html;
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

        document.getElementById("modalProvincia").value = r.provincia ?? "";
        document.getElementById("modalnum_mercados").value = r.num_mercados ?? "";
        document.getElementById("modaltipo_establecimiento").value = r.tipo_establecimiento ?? "";
        document.getElementById("modaltamanio").value = r.tamanio ?? "";
        document.getElementById("modaltotal").value = r.total ?? "";
        document.getElementById("modalnum_aves").value = r.num_aves ?? "";
    }


    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro primero', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        const payload = {
            provincia: this.registroSeleccionado.provincia,
            tipo_establecimiento: this.registroSeleccionado.tipo_establecimiento,
            tamanio: this.registroSeleccionado.tamanio
        };

        try {
            this.mostrarCargando(true);

            await this.service.delete(payload);

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
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterTipoEstablecimiento').value = '0';

        this.cargarDatos();

    }

}

window.mercadoResController = new MercadoResController();