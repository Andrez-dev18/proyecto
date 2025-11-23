class ComercializacionController {
    constructor() {
        this.service = new ComercializacionService();
        this.tipoActual = null;
        this.tablaActual = null;
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
        this.dataTable = null;
        this.columnasVisibles = {};
        this.columnasDefinicion = {};
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
        this.setupColumnToggle();
        this.setupToggleFiltros();
    }

    async cargarCatalogos() {
        try {
            console.log('Cargando catálogos...');

            const [empresas, mercados, proveedores, provincias, condiciones, tipos] = await Promise.all([
                this.service.getEmpresas(),
                this.service.getMercados(),
                this.service.getProveedores(),
                this.service.getProvincias(),
                this.service.getCondiciones(),
                this.service.getTipos()
            ]);

            console.log('Catálogos cargados:', {
                empresas: empresas.length,
                mercados: mercados.length,
                proveedores: proveedores.length,
                provincias: provincias.length,
                condiciones: condiciones.length,
                tipos: tipos.length
            });

            this.catalogos = {
                empresas,
                mercados,
                proveedores,
                provincias,
                condiciones,
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
        // Filtros
        this.poblarSelect('filterMercado', this.catalogos.mercados, 'id', 'mercado');
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('filterProveedor', this.catalogos.proveedores, 'id', 'proveedor');
        this.poblarSelect('filterCondicion', this.catalogos.condiciones, 'id', 'condicion');
        this.poblarSelect('filterTipo', this.catalogos.tipos, 'id', 'tipo');

        // Modal
        this.poblarSelect('modalEmpresa', this.catalogos.empresas, 'id', 'empresa');
        this.poblarSelect('modalMercado', this.catalogos.mercados, 'id', 'mercado');
        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'id', 'proveedor');
        this.poblarSelect('modalCondicion', this.catalogos.condiciones, 'id', 'condicion');
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
        // Botones acción
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());

        // Filtro btn
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());

        // Modal
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    setupColumnToggle() {
        const btnToggle = document.getElementById('btnToggleColumns');
        const dropdown = document.getElementById('columnDropdown');
        const btnClose = document.getElementById('btnCloseDropdown');

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

    generarCheckboxesColumnas(columnas) {
    const container = document.getElementById('columnCheckboxContainer');
    
    console.log('🔍 DEBUG generarCheckboxesColumnas:');
    console.log('- Container encontrado:', !!container);
    console.log('- Columnas a generar:', columnas.length);
    
    if (!container) {
        console.error('❌ Container "columnCheckboxContainer" NO encontrado en el DOM');
        console.log('Elementos con ID en el documento:', 
            Array.from(document.querySelectorAll('[id]')).map(el => el.id)
        );
        return;
    }

    container.innerHTML = '';
    this.columnasVisibles = {};
    
    columnas.forEach((col, index) => {
        const label = document.createElement('label');
        label.className = 'column-toggle';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'column-checkbox';
        checkbox.dataset.column = index;
        checkbox.checked = true;
        
        if (index === columnas.length - 1) {
            checkbox.disabled = true;
        }
        
        this.columnasVisibles[index] = true;
        
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            const columnIndex = parseInt(e.target.dataset.column);
            this.columnasVisibles[columnIndex] = e.target.checked;
            
            if (this.dataTable) {
                const column = this.dataTable.column(columnIndex);
                column.visible(e.target.checked);
            }
        });
        
        const span = document.createElement('span');
        span.textContent = col;
        
        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
    });

    console.log('✅ Checkboxes generados:', container.children.length);
    console.log('✅ HTML del container:', container.innerHTML.substring(0, 200) + '...');
}


    formatearNombreColumna(nombre) {
        return nombre
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    async cargarDatos(tipo) {
        try {
            this.tipoActual = tipo;
            this.tablaActual = tipo === 'vivo-aqp' ? 'com_db_vivo_aqp' : 'com_db_vivo_provincia';

            this.mostrarCargando(true);
            console.log(`🔄 Cargando vista de tipo: ${tipo}`);

            // Mostrar filtros correspondientes
            if (tipo === 'vivo-aqp') {
                this.mostrarFiltrosAqp();
            } else {
                this.mostrarFiltrosProvincia();
            }

            // Renderizar tabla
            this.renderizarTablaServerSide();

            this.mostrarNotificacion(`✅ Datos cargados correctamente`, 'success');

        } catch (error) {
            console.error('❌ Error al inicializar tabla:', error);
            this.mostrarNotificacion('❌ ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarFiltrosAqp() {
        const filterElements = document.querySelectorAll('.filter-arequipa, .filter-provincia');
        filterElements.forEach(el => {
            if (el.classList.contains('filter-arequipa')) {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        });
    }

    mostrarFiltrosProvincia() {
        const filterElements = document.querySelectorAll('.filter-arequipa, .filter-provincia');
        filterElements.forEach(el => {
            if (el.classList.contains('filter-provincia')) {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        });
    }

    async aplicarFiltros() {
        if (this.dataTable) {
            this.dataTable.ajax.reload();
        }
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterMercado').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterProveedor').value = '';
        document.getElementById('filterCondicion').value = '';
        document.getElementById('filterTipo').value = '';

        if (this.tipoActual && this.dataTable) {
            this.dataTable.ajax.reload();
        }
    }

    renderizarTabla() {
    const table = $('#dataTable');
    
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().clear().destroy();
        $('#dataTable').empty();
    }

    // Crear estructura de tabla con thead estilizado
    const tableHtml = `
        <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
            <tr>
                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">ID</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">AÑO</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">MES</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">PROVINCIA</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ZONA</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">COMPRA</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">TIPO CLIENTE</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">NOMBRE</th>
                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">GRS</th>
                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">RP</th>
                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">RENZO</th>
                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">FAFO</th>
                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">S.ANGELA</th>
                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">ROSA</th>
                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">OPCIONES</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200"></tbody>
    `;
    
    document.getElementById('dataTable').innerHTML = tableHtml;

    this.dataTable = table.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: `${this.service.baseURL}${PotencialVentaConfig.API.ENDPOINTS.FILTRO}`,
            type: 'GET',
            data: (d) => {
                const filtros = {};
                
                const anio = document.getElementById('filterAnio')?.value;
                const mes = document.getElementById('filterMes')?.value;
                const provincia = document.getElementById('filterProvincia')?.value;
                const zona = document.getElementById('filterZona')?.value;
                const tipoCliente = document.getElementById('filterTipoCliente')?.value;
                
                if (anio) filtros.anio = anio;
                if (mes) filtros.mes = mes;
                if (provincia) filtros.provincia = provincia;
                if (zona) filtros.zona = zona;
                if (tipoCliente) filtros.tipoCliente = tipoCliente;
                
                return Object.assign(d, filtros);
            },
            dataSrc: json => json.data || []
        },
        columns: [
            { data: 'id', className: 'text-center' },
            { data: 'anio' },
            { 
                data: 'mes', 
                render: (data) => {
                    const mesNombre = PotencialVentaConfig.MESES.find(m => m.id == data)?.nombre || data;
                    return mesNombre;
                }
            },
            { data: 'provincia' },
            { data: 'zona' },
            { 
                data: 'compra',
                className: 'text-center',
                render: (data) => {
                    if (data === 'SI') {
                        return '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">SI</span>';
                    } else {
                        return '<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">NO</span>';
                    }
                }
            },
            { data: 'tipoCliente' },
            { data: 'nombre' },
            { data: 'grs', className: 'text-center' },
            { data: 'rp', className: 'text-center' },
            { data: 'renzo', className: 'text-center' },
            { data: 'fafo', className: 'text-center' },
            { data: 'santaAngela', className: 'text-center' },
            { data: 'rosa', className: 'text-center' },
            {
                data: null,
                orderable: false,
                searchable: false,
                className: 'text-center',
                render: () => `
                    <div class="flex gap-2 justify-center">
                        <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ],
        order: [[0, 'desc']],
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        language: {
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            infoEmpty: "Mostrando 0 a 0 de 0 registros",
            infoFiltered: "(filtrado de _MAX_ registros)",
            search: "Buscar:",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        },
        dom: 'rtip', // Esto elimina los controles por defecto de DataTables
        initComplete: function() {
            // Asegurar que las clases de Tailwind se mantengan
            $('#dataTable_wrapper').find('.dataTables_processing').addClass('bg-white shadow-lg rounded-lg p-4');
        },
        drawCallback: () => {
            // Aplicar visibilidad de columnas
            Object.keys(this.columnasVisibles).forEach(columnIndex => {
                const column = this.dataTable.column(parseInt(columnIndex));
                if (column) {
                    column.visible(this.columnasVisibles[columnIndex]);
                }
            });
        }
    });

    // Eventos para botones de acción
    $('#dataTable tbody').off('click').on('click', '.edit-btn', (e) => {
        const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
        this.registroSeleccionado = rowData;
        this.modificarSeleccionado();
    });

    $('#dataTable tbody').on('click', '.delete-btn', async (e) => {
        const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
        this.registroSeleccionado = rowData;
        await this.eliminarSeleccionado();
    });
}


    mostrarModalNuevo() {
        if (!this.tipoActual) {
            this.mostrarNotificacion('Primero selecciona un tipo de datos', 'warning');
            return;
        }

        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro';
        this.limpiarFormulario();
        this.mostrarCamposSegunTipo();
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
        this.mostrarCamposSegunTipo();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    async eliminarSeleccionado() {
        console.log('=== ELIMINAR REGISTRO ===');
        console.log('Registro seleccionado:', this.registroSeleccionado);
        console.log('Tabla actual:', this.tablaActual);

        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('⚠️ Selecciona un registro de la tabla', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        try {
            this.mostrarCargando(true);
            console.log('Eliminando ID:', this.registroSeleccionado.id);

            await this.service.eliminar(this.tablaActual, this.registroSeleccionado.id);
            this.mostrarNotificacion('✅ Registro eliminado exitosamente', 'success');
            this.registroSeleccionado = null;
            
            // Recargar datos en DataTable
            if (this.dataTable) {
                this.dataTable.ajax.reload();
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('❌ Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarCamposSegunTipo() {
        const esAqp = this.tipoActual === 'vivo-aqp';

        // Campos de Arequipa
        document.getElementById('campoEmpresa').style.display = esAqp ? 'block' : 'none';
        document.getElementById('campoMercado').style.display = esAqp ? 'block' : 'none';
        document.getElementById('campoCondicion').style.display = esAqp ? 'block' : 'none';

        // Campos de Provincia
        document.getElementById('campoProvincia').style.display = esAqp ? 'none' : 'block';
        document.getElementById('campoTipo').style.display = esAqp ? 'none' : 'block';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        console.log('Cargando datos en formulario:', r);

        document.getElementById('modalFecha').value = r.fecha;

        // Convertir nombres a IDs para los selects
        if (this.tipoActual === 'vivo-aqp') {
            // Buscar ID de empresa por nombre
            const empresaObj = this.catalogos.empresas.find(e => e.empresa === r.empresa);
            document.getElementById('modalEmpresa').value = empresaObj ? empresaObj.id : '';

            // Buscar ID de mercado por nombre
            const mercadoObj = this.catalogos.mercados.find(m => m.mercado === r.mercado);
            document.getElementById('modalMercado').value = mercadoObj ? mercadoObj.id : '';

            // Buscar ID de condicion por nombre
            const condicionObj = this.catalogos.condiciones.find(c => c.condicion === r.condicion);
            document.getElementById('modalCondicion').value = condicionObj ? condicionObj.id : '';
        } else {
            // Buscar ID de provincia por nombre
            const provinciaObj = this.catalogos.provincias.find(p => p.provincia === r.provincia);
            document.getElementById('modalProvincia').value = provinciaObj ? provinciaObj.id : '';

            // Buscar ID de tipo por nombre
            const tipoObj = this.catalogos.tipos.find(t => t.tipo === r.tipo);
            document.getElementById('modalTipo').value = tipoObj ? tipoObj.id : '';
        }

        // Buscar ID de proveedor por nombre
        const proveedorObj = this.catalogos.proveedores.find(p => p.proveedor === r.proveedor);
        document.getElementById('modalProveedor').value = proveedorObj ? proveedorObj.id : '';

        document.getElementById('modalPrecioMayMin').value = r.precioMayMin || '';
        document.getElementById('modalPrecioMayMax').value = r.precioMayMax || '';
        document.getElementById('modalPrecioPubMin').value = r.precioPubMin || '';
        document.getElementById('modalPrecioPubMax').value = r.precioPubMax || '';

        document.getElementById('modalPesoMachoMin').value = r.pesoMachoMin || '';
        document.getElementById('modalPesoMachoMax').value = r.pesoMachoMax || '';
        document.getElementById('modalPesoHembMin').value = r.pesoHembMin || '';
        document.getElementById('modalPesoHembMax').value = r.pesoHembMax || '';

        document.getElementById('modalColorMin').value = r.colorMin || '';
        document.getElementById('modalColorMax').value = r.colorMax || '';

        document.getElementById('modalPesoMachoPromMin').value = r.pesoMachoPromMin || '';
        document.getElementById('modalPesoMachoPromMax').value = r.pesoMachoPromMax || '';
        document.getElementById('modalPesoHembraPromMin').value = r.pesoHembraPromMin || '';
        document.getElementById('modalPesoHembraPromMax').value = r.pesoHembraPromMax || '';

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
            
                const resultado = await this.service.actualizar(this.tablaActual, data);
                console.log('Resultado actualización:', resultado);
                this.mostrarNotificacion('✅ Registro actualizado exitosamente', 'success');
            } else {
                console.log('Creando nuevo registro');
                console.log('Datos a enviar:', data);

                const resultado = await this.service.crear(this.tablaActual, data);
                console.log('Resultado creación:', resultado);

                this.mostrarNotificacion('✅ Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            
            // Recargar datos en DataTable
            if (this.dataTable) {
                this.dataTable.ajax.reload();
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('❌ Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        const usuario = 'admin';
        const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const proveedorId = parseInt(document.getElementById('modalProveedor').value) || null;

        const data = {
            fecha: document.getElementById('modalFecha').value,
            proveedor: proveedorId,
            precioMayMin: parseFloat(document.getElementById('modalPrecioMayMin').value) || 0,
            precioMayMax: parseFloat(document.getElementById('modalPrecioMayMax').value) || 0,
            precioPubMin: parseFloat(document.getElementById('modalPrecioPubMin').value) || 0,
            precioPubMax: parseFloat(document.getElementById('modalPrecioPubMax').value) || 0,
            pesoMachoMin: parseFloat(document.getElementById('modalPesoMachoMin').value) || 0,
            pesoMachoMax: parseFloat(document.getElementById('modalPesoMachoMax').value) || 0,
            pesoHembMin: parseFloat(document.getElementById('modalPesoHembMin').value) || 0,
            pesoHembMax: parseFloat(document.getElementById('modalPesoHembMax').value) || 0,
            colorMin: parseFloat(document.getElementById('modalColorMin').value) || 0,
            colorMax: parseFloat(document.getElementById('modalColorMax').value) || 0,
            pesoMachoPromMin: parseFloat(document.getElementById('modalPesoMachoPromMin').value) || 0,
            pesoMachoPromMax: parseFloat(document.getElementById('modalPesoMachoPromMax').value) || 0,
            pesoHembraPromMin: parseFloat(document.getElementById('modalPesoHembraPromMin').value) || 0,
            pesoHembraPromMax: parseFloat(document.getElementById('modalPesoHembraPromMax').value) || 0,
            cantidad: parseFloat(document.getElementById('modalCantidad').value) || 0,
            usuarioRegistro: usuario,
            fechaHoraRegistro: ahora,
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: ahora
        };

        if (this.tipoActual === 'vivo-aqp') {
            const mercadoId = parseInt(document.getElementById('modalMercado').value) || null;
            const empresaId = parseInt(document.getElementById('modalEmpresa').value) || null;
            const condicionId = parseInt(document.getElementById('modalCondicion').value) || null;

            data.mercado = mercadoId;
            data.empresa = empresaId;
            data.condicion = condicionId;
        } else {
            const provinciaId = parseInt(document.getElementById('modalProvincia').value) || null;
            const tipoId = parseInt(document.getElementById('modalTipo').value) || null;

            data.provincia = provinciaId;
            data.tipo = tipoId;

            data.precioMayCarMin = data.precioMayMin;
            data.precioMayCarMax = data.precioMayMax;
            data.precioMayBraMin = 0;
            data.precioMayBraMax = 0;
            data.pesoBrasaPromMin = 0;
            data.pesoBrasaPromMax = 0;
        }

        return data;
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('⚠️ La fecha es obligatoria', 'warning');
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
        if (!this.tipoActual) {
            this.mostrarNotificacion('⚠️ Primero selecciona un tipo de datos', 'warning');
            return;
        }

        try {
            this.service.exportarCSV(this.tablaActual);
            this.mostrarNotificacion('✅ Iniciando descarga de Excel...', 'success');
        } catch (error) {
            this.mostrarNotificacion('❌ Error al exportar: ' + error.message, 'error');
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

window.comercializacionController = new ComercializacionController();
