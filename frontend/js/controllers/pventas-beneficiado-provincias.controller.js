class PVentasBeneficiadoProvinciasController {
    constructor() {
        this.service = new PVentasBeneficiadoProvinciasService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.catalogos = {
            anos: [],
            provincias: [],
            zonas: [],
            tiposCliente: []
        };
        this.dataTable = null;
        this.columnasVisibles = {};

        // Configuración de columnas
        this.columnas = [
            { nombre: 'ID', campo: 'id', visible: false },
            { nombre: 'Año', campo: 'ano', visible: true },
            { nombre: 'Mes', campo: 'mes', visible: true },
            { nombre: 'Provincia', campo: 'provincia', visible: true },
            { nombre: 'Zona', campo: 'zona', visible: true },
            { nombre: 'Compra', campo: 'compra', visible: false },
            { nombre: 'Tipo Cliente', campo: 'tipo_cliente', visible: true },
            { nombre: 'Nombre', campo: 'nombre', visible: true },
            { nombre: 'GRS', campo: 'grs', visible: true },
            { nombre: 'RP', campo: 'rp', visible: true },
            { nombre: 'GRS Vivo', campo: 'grs_vivo', visible: false },
            { nombre: 'Santa Elena', campo: 'santa_elena', visible: false },
            { nombre: 'Granjas Chicas', campo: 'granjas_chicas', visible: false },
            { nombre: 'Rosario', campo: 'rosario', visible: false },
            { nombre: 'Sanfern Lima', campo: 'sanfern_lima', visible: false },
            { nombre: 'Avícola Renzo', campo: 'avicola_renzo', visible: false },
            { nombre: 'Otros', campo: 'otros', visible: false },
            { nombre: 'Pot. Mínimo', campo: 'potencial_minimo', visible: true },
            { nombre: 'Pot. Máximo', campo: 'potencial_maximo', visible: true },
            { nombre: 'Cond. PT Min', campo: 'condicion_ptmin', visible: false },
            { nombre: 'Cond. PT Max', campo: 'condicion_ptmax', visible: false },
            { nombre: 'Observaciones', campo: 'observaciones', visible: false }
        ];

        this.dataTablesConfig = PVentasBeneficiadoProvinciasConfig.UI.DATATABLES_LANGUAGE;
    }

    async init() {
        console.log('🚀 Inicializando PVentasBeneficiadoProvincias Controller...');
        
        try {
            // Primero cargar los datos
            await this.cargarDatos();
            
            // Luego extraer catálogos de los datos cargados
            this.extraerCatalogos();
            
            // Configurar UI
            this.setupEventListeners();
            this.setupColumnToggle();
            this.setupToggleFiltros();
            
            // Generar opciones y tabla
            this.generarOpcionesColumnas();
            this.generarHeaderTabla();
            
            // Renderizar tabla con datos
            this.renderizarTablaCliente();
            
            console.log('✅ Inicialización completada');
        } catch (error) {
            console.error('❌ Error durante la inicialización:', error);
            this.mostrarNotificacion('Error al inicializar el módulo', 'error');
        }
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            console.log('📊 Cargando todos los datos...');
            
            // Llamar al servicio para obtener datos
            const respuesta = await this.service.getAll();
            
            // Validar respuesta
            if (Array.isArray(respuesta)) {
                this.datos = respuesta;
            } else if (respuesta && respuesta.data && Array.isArray(respuesta.data)) {
                this.datos = respuesta.data;
            } else {
                console.warn('Formato de respuesta inesperado:', respuesta);
                this.datos = [];
            }
            
            this.datosFiltrados = [...this.datos];
            
            console.log(`✅ ${this.datos.length} registros cargados`);
            
            if (this.datos.length > 0) {
                console.log('Ejemplo de registro:', this.datos[0]);
            }
            
            return this.datos;
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos: ' + error.message, 'error');
            this.datos = [];
            this.datosFiltrados = [];
            throw error;
        } finally {
            this.mostrarCargando(false);
        }
    }

    extraerCatalogos() {
        try {
            console.log('📋 Extrayendo catálogos de los datos...');
            
            // Reiniciar catálogos
            this.catalogos = {
                anos: [],
                provincias: [],
                zonas: [],
                tiposCliente: []
            };
            
            if (!this.datos || this.datos.length === 0) {
                console.warn('No hay datos para extraer catálogos');
                return;
            }
            
            // Usar Sets para valores únicos
            const anosSet = new Set();
            const provinciasSet = new Set();
            const zonasSet = new Set();
            const tiposClienteSet = new Set();
            
            this.datos.forEach(registro => {
                if (registro.ano) anosSet.add(registro.ano);
                if (registro.provincia) provinciasSet.add(registro.provincia);
                if (registro.zona) zonasSet.add(registro.zona);
                if (registro.tipo_cliente) tiposClienteSet.add(registro.tipo_cliente);
            });
            
            // Convertir Sets a Arrays y ordenar
            this.catalogos.anos = Array.from(anosSet).sort((a, b) => b - a);
            this.catalogos.provincias = Array.from(provinciasSet).sort();
            this.catalogos.zonas = Array.from(zonasSet).sort();
            this.catalogos.tiposCliente = Array.from(tiposClienteSet).sort();
            
            console.log('✅ Catálogos extraídos:', this.catalogos);
            
            // Poblar los selectores
            this.poblarSelects();
        } catch (error) {
            console.error('❌ Error al extraer catálogos:', error);
        }
    }

    poblarSelects() {
        try {
            // Años - usar input con datalist
            const selectFilterAno = document.getElementById('filterAno');
            if (selectFilterAno && this.catalogos.anos.length > 0) {
                // Remover datalist anterior si existe
                const oldDatalist = document.getElementById('anosDatalist');
                if (oldDatalist) oldDatalist.remove();
                
                const datalist = document.createElement('datalist');
                datalist.id = 'anosDatalist';
                this.catalogos.anos.forEach(ano => {
                    const option = document.createElement('option');
                    option.value = ano;
                    datalist.appendChild(option);
                });
                selectFilterAno.setAttribute('list', 'anosDatalist');
                selectFilterAno.parentNode.appendChild(datalist);
            }

            // Provincias
            this.poblarSelect('filterProvincia', this.catalogos.provincias, 'Todas las provincias');
            this.poblarSelect('modalProvincia', this.catalogos.provincias, 'Seleccionar...');
            
            // Zonas
            this.poblarSelect('filterZona', this.catalogos.zonas, 'Todas las zonas');
            this.poblarSelect('modalZona', this.catalogos.zonas, 'Seleccionar...');
            
            // Tipos de Cliente
            this.poblarSelect('filterTipoCliente', this.catalogos.tiposCliente, 'Todos los tipos');
            this.poblarSelect('modalTipoCliente', this.catalogos.tiposCliente, 'Seleccionar...');
            
            console.log('✅ Selectores poblados');
        } catch (error) {
            console.error('❌ Error al poblar selectores:', error);
        }
    }

    poblarSelect(idSelect, opciones, textoDefault) {
        const select = document.getElementById(idSelect);
        if (!select) return;
        
        // Guardar valor actual
        const valorActual = select.value;
        
        // Limpiar opciones existentes
        select.innerHTML = `<option value="">${textoDefault}</option>`;
        
        // Agregar nuevas opciones
        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion;
            option.textContent = opcion;
            select.appendChild(option);
        });
        
        // Restaurar valor si existía
        if (valorActual && opciones.includes(valorActual)) {
            select.value = valorActual;
        }
    }

    generarOpcionesColumnas() {
        const dropdownContent = document.querySelector('#columnDropdown .p-2');
        if (!dropdownContent) return;

        dropdownContent.innerHTML = '';

        this.columnas.forEach((columna, index) => {
            const checked = columna.visible ? 'checked' : '';
            this.columnasVisibles[index] = columna.visible;

            const label = document.createElement('label');
            label.className = 'column-toggle';
            label.innerHTML = `
                <input type="checkbox" class="column-checkbox" data-column="${index}" ${checked}>
                <span>${columna.nombre}</span>
            `;
            dropdownContent.appendChild(label);
        });

        // Columna de opciones (siempre visible)
        const labelOpciones = document.createElement('label');
        labelOpciones.className = 'column-toggle';
        labelOpciones.innerHTML = `
            <input type="checkbox" class="column-checkbox" data-column="${this.columnas.length}" checked disabled>
            <span>Opciones</span>
        `;
        dropdownContent.appendChild(labelOpciones);
        this.columnasVisibles[this.columnas.length] = true;

        // Event listeners para checkboxes
        dropdownContent.querySelectorAll('.column-checkbox:not([disabled])').forEach(checkbox => {
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

    generarHeaderTabla() {
        const tableHeader = document.getElementById('tableHeader');
        if (!tableHeader) return;

        let headerHTML = '';
        this.columnas.forEach(columna => {
            headerHTML += `<th class="px-3 py-3 text-xs font-semibold uppercase">${columna.nombre}</th>`;
        });
        headerHTML += `<th class="px-3 py-3 text-center text-xs font-semibold uppercase">Opciones</th>`;
        
        tableHeader.innerHTML = headerHTML;
    }

    renderizarTablaCliente() {
        console.log('📊 Renderizando tabla con', this.datosFiltrados.length, 'registros...');

        const table = $('#dataTable');
        
        // Destruir tabla existente si existe
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }
        
        // Limpiar tbody
        $('#tableBody').empty();

        // Si no hay datos, mostrar mensaje
        if (this.datosFiltrados.length === 0) {
            $('#tableBody').html(`
                <tr>
                    <td colspan="${this.columnas.length + 1}" class="text-center py-8 text-gray-500">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
            return;
        }

        // Configurar columnas para DataTables
        const columnsConfig = this.columnas.map((col, index) => ({
            data: col.campo,
            className: this.esColumnaNumericaProveedor(col.campo) 
                ? 'text-center text-sm px-2' 
                : 'text-sm px-2',
            defaultContent: this.esColumnaNumericaProveedor(col.campo) ? '0' : '-',
            visible: this.columnasVisibles[index] !== false,
            render: this.getRenderFunction(col.campo)
        }));

        // Agregar columna de opciones
        columnsConfig.push({
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
        });

        // Inicializar DataTable
        this.dataTable = table.DataTable({
            data: this.datosFiltrados,
            columns: columnsConfig,
            processing: false,
            serverSide: false,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            order: [[1, 'desc'], [2, 'desc']], // Ordenar por año y mes
            pageLength: 10,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
            language: this.dataTablesConfig,
            responsive: false,
            autoWidth: false,
            dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"<"flex items-center"l><"flex items-center"f>>rtip',
            initComplete: () => {
                console.log('✅ Tabla renderizada exitosamente');
                $('.dataTables_wrapper').addClass('w-full');
            }
        });

        // Event handlers
        this.configurarEventosTabla();
    }

    esColumnaNumericaProveedor(campo) {
        const camposNumericos = [
            'grs', 'rp', 'grs_vivo', 'santa_elena', 'granjas_chicas',
            'rosario', 'sanfern_lima', 'avicola_renzo', 'otros',
            'potencial_minimo', 'potencial_maximo'
        ];
        return camposNumericos.includes(campo);
    }

    getRenderFunction(campo) {
        if (campo === 'id') {
            return (data) => data ? `<span class="text-xs">${data}</span>` : '';
        }
        if (this.esColumnaNumericaProveedor(campo)) {
            return (data) => data || '0';
        }
        return null;
    }

    configurarEventosTabla() {
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

    aplicarFiltros() {
        console.log('🔍 Aplicando filtros...');
        
        const filtros = {
            ano: document.getElementById('filterAno')?.value || '',
            mes: document.getElementById('filterMes')?.value || '',
            provincia: document.getElementById('filterProvincia')?.value || '',
            zona: document.getElementById('filterZona')?.value || '',
            tipoCliente: document.getElementById('filterTipoCliente')?.value || ''
        };

        console.log('Filtros:', filtros);

        this.datosFiltrados = this.datos.filter(registro => {
            if (filtros.ano && registro.ano != filtros.ano) return false;
            if (filtros.mes && registro.mes !== filtros.mes) return false;
            if (filtros.provincia && registro.provincia !== filtros.provincia) return false;
            if (filtros.zona && registro.zona !== filtros.zona) return false;
            if (filtros.tipoCliente && registro.tipo_cliente !== filtros.tipoCliente) return false;
            return true;
        });

        console.log(`✅ ${this.datosFiltrados.length} registros después del filtrado`);
        
        // Destruir y recrear tabla
        if (this.dataTable) {
            this.dataTable.destroy();
            $('#tableBody').empty();
        }
        
        this.renderizarTablaCliente();
        
        this.mostrarNotificacion(`${this.datosFiltrados.length} registros encontrados`, 'info');
    }

    limpiarFiltros() {
        console.log('🧹 Limpiando filtros...');
        
        // Limpiar inputs
        document.getElementById('filterAno').value = '';
        document.getElementById('filterMes').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterZona').value = '';
        document.getElementById('filterTipoCliente').value = '';
        
        // Restaurar todos los datos
        this.datosFiltrados = [...this.datos];
        
        // Recrear tabla
        if (this.dataTable) {
            this.dataTable.destroy();
            $('#tableBody').empty();
        }
        
        this.renderizarTablaCliente();
        
        this.mostrarNotificacion(`Mostrando todos los registros (${this.datosFiltrados.length})`, 'success');
    }

    setupColumnToggle() {
        const btnToggle = document.getElementById('btnToggleColumns');
        const dropdown = document.getElementById('columnDropdown');
        const btnClose = document.getElementById('btnCloseDropdown');

        if (btnToggle && dropdown) {
            btnToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
        }

        if (btnClose && dropdown) {
            btnClose.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.remove('show');
            });
        }

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (dropdown && !e.target.closest('.dropdown-columns')) {
                dropdown.classList.remove('show');
            }
        });
    }

    setupToggleFiltros() {
        const btnToggle = document.getElementById('btnToggleFiltros');
        const filterContent = document.getElementById('filterContent');
        
        if (!btnToggle || !filterContent) return;
        
        // Mostrar filtros por defecto
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

    setupEventListeners() {
        // Botones principales
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
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
            console.error('No hay registro seleccionado');
            return;
        }
        
        console.log('Modificando registro:', this.registroSeleccionado);
        
        document.getElementById('modalTitle').textContent = 'Modificar Registro';
        
        // Cargar datos en el formulario
        setTimeout(() => {
            this.cargarDatosEnFormulario();
        }, 100);
        
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        
        // Scroll al top
        const modalContent = modal.querySelector('.bg-white');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;
        
        console.log('Cargando en formulario:', r);
        
        // Helper para establecer valores
        const setValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value || '';
            }
        };
        
        // Información básica
        setValue('modalAno', r.ano);
        setValue('modalMes', r.mes);
        this.setSelectValue('modalProvincia', r.provincia);
        this.setSelectValue('modalZona', r.zona);
        setValue('modalCompra', r.compra);
        this.setSelectValue('modalTipoCliente', r.tipo_cliente);
        setValue('modalNombre', r.nombre);
        
        // Proveedores
        setValue('modalGrs', r.grs);
        setValue('modalRp', r.rp);
        setValue('modalGrsVivo', r.grs_vivo);
        setValue('modalSantaElena', r.santa_elena);
        setValue('modalGranjasChicas', r.granjas_chicas);
        setValue('modalRosario', r.rosario);
        setValue('modalSanfernLima', r.sanfern_lima);
        setValue('modalAvicolaRenzo', r.avicola_renzo);
        setValue('modalOtros', r.otros);
        
        // Potenciales y condiciones
        setValue('modalPotencialMinimo', r.potencial_minimo);
        setValue('modalPotencialMaximo', r.potencial_maximo);
        setValue('modalCondicionPtmin', r.condicion_ptmin);
        setValue('modalCondicionPtmax', r.condicion_ptmax);
        setValue('modalObservaciones', r.observaciones);
    }

    setSelectValue(selectId, value) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        if (!value) {
            select.value = '';
            return;
        }
        
        // Intentar establecer el valor
        select.value = value;
        
        // Si no funcionó, agregar la opción
        if (select.value !== value) {
            const newOption = document.createElement('option');
            newOption.value = value;
            newOption.text = value;
            select.add(newOption);
            select.value = value;
        }
    }

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input, #modalForm select, #modalForm textarea').forEach(input => {
            if (input.type === 'number') {
                input.value = '0';
            } else {
                input.value = '';
            }
        });
        
        // Año actual por defecto
        document.getElementById('modalAno').value = new Date().getFullYear();
    }

    async guardarRegistro() {
        try {
            const data = this.obtenerDatosFormulario();
            
            if (!this.validarFormulario(data)) return;
            
            console.log('📝 Guardando:', data);
            
            this.mostrarCargando(true);
            
            let response;
            
            if (this.registroSeleccionado && this.registroSeleccionado.id) {
                data.id = this.registroSeleccionado.id;
                response = await this.service.update(data);
                this.mostrarNotificacion('✅ Registro actualizado exitosamente', 'success');
            } else {
                delete data.id;
                response = await this.service.create(data);
                this.mostrarNotificacion('✅ Registro creado exitosamente', 'success');
            }
            
            console.log('Respuesta:', response);
            
            this.cerrarModal();
            
            // Recargar datos
            await this.cargarDatos();
            this.extraerCatalogos();
            this.limpiarFiltros();
            
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            this.mostrarNotificacion(`❌ Error: ${error.message}`, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value || null : null;
        };
        
        const getIntValue = (id) => {
            const value = getValue(id);
            if (value === null || value === '') return 0;
            const parsed = parseInt(value);
            return isNaN(parsed) ? 0 : parsed;
        };
        
        return {
            ano: getIntValue('modalAno'),
            mes: getValue('modalMes'),
            provincia: getValue('modalProvincia'),
            zona: getValue('modalZona'),
            compra: getValue('modalCompra'),
            tipo_cliente: getValue('modalTipoCliente'),
            nombre: getValue('modalNombre'),
            grs: getIntValue('modalGrs'),
            rp: getIntValue('modalRp'),
            grs_vivo: getIntValue('modalGrsVivo'),
            santa_elena: getIntValue('modalSantaElena'),
            granjas_chicas: getIntValue('modalGranjasChicas'),
            rosario: getIntValue('modalRosario'),
            sanfern_lima: getIntValue('modalSanfernLima'),
            avicola_renzo: getIntValue('modalAvicolaRenzo'),
            otros: getIntValue('modalOtros'),
            potencial_minimo: getIntValue('modalPotencialMinimo'),
            potencial_maximo: getIntValue('modalPotencialMaximo'),
            condicion_ptmin: getValue('modalCondicionPtmin'),
            condicion_ptmax: getValue('modalCondicionPtmax'),
            observaciones: getValue('modalObservaciones')
        };
    }

    validarFormulario(data) {
        if (!data.ano || data.ano === 0) {
            this.mostrarNotificacion('⚠️ El año es obligatorio', 'warning');
            return false;
        }
        
        if (!data.mes || data.mes === '') {
            this.mostrarNotificacion('⚠️ El mes es obligatorio', 'warning');
            return false;
        }
        
        if (!data.nombre || data.nombre === '') {
            this.mostrarNotificacion('⚠️ El nombre es obligatorio', 'warning');
            return false;
        }
        
        return true;
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) return;
        
        if (!confirm('¿Estás seguro de eliminar este registro?')) return;
        
        try {
            this.mostrarCargando(true);
            await this.service.delete(this.registroSeleccionado.id);
            this.mostrarNotificacion('✅ Registro eliminado exitosamente', 'success');
            
            // Recargar datos
            await this.cargarDatos();
            this.extraerCatalogos();
            this.aplicarFiltros();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('❌ Error al eliminar el registro', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            this.limpiarFormulario();
            this.registroSeleccionado = null;
        }
    }

    exportarExcel() {
        console.log('📊 Exportando a Excel...');
        this.service.exportToExcel();
        this.mostrarNotificacion('Generando archivo Excel...', 'info');
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
        
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transform = 'translateX(100%)';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }
}

window.pventasBeneficiadoProvinciasController = new PVentasBeneficiadoProvinciasController();
