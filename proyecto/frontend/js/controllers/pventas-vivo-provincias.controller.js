class PVentasVivoProvinciasController {
    constructor() {
        this.service = new PVentasVivoProvinciasService();
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
            { nombre: 'Renzo', campo: 'renzo', visible: false },
            { nombre: 'Fafo', campo: 'fafo', visible: false },
            { nombre: 'Santa Angela', campo: 'santa_angela', visible: false },
            { nombre: 'Jorge Pan', campo: 'jorge_pan', visible: false },
            { nombre: 'Mirian G', campo: 'mirian_g', visible: false },
            { nombre: 'Vasquez', campo: 'vasquez', visible: false },
            { nombre: 'San Joaquin', campo: 'san_joaquin', visible: false },
            { nombre: 'Fortunato', campo: 'fortunato', visible: false },
            { nombre: 'Rosario', campo: 'rosario', visible: false },
            { nombre: 'Perca', campo: 'perca', visible: false },
            { nombre: 'Gamboa', campo: 'gamboa', visible: false },
            { nombre: 'Asoc. Sondor', campo: 'asoc_sondor', visible: false },
            { nombre: 'Otras Granjas', campo: 'otras_granjas_chicas', visible: false },
            { nombre: 'Pot. Mínimo', campo: 'potencial_minimo', visible: true },
            { nombre: 'Pot. Máximo', campo: 'potencial_maximo', visible: true },
            { nombre: 'Cond. PT Max', campo: 'condicion_ptmax', visible: false },
            { nombre: 'Observaciones', campo: 'observaciones', visible: false }
        ];

        this.dataTablesConfig = PVentasVivoProvinciasConfig.UI.DATATABLES_LANGUAGE;
    }

    async init() {
        console.log('🚀 Inicializando PVentasVivoProvincia Controller...');
        await this.cargarDatos();
        await this.cargarCatalogos();
        this.setupEventListeners();
        this.setupColumnToggle();
        this.setupToggleFiltros();
        this.generarOpcionesColumnas();
        this.generarHeaderTabla();
        this.renderizarTablaCliente();
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            console.log('📊 Cargando todos los datos...');
            this.datos = await this.service.getAll();
            this.datosFiltrados = [...this.datos];
            console.log(`✅ ${this.datos.length} registros cargados`);
            
            if (this.datos.length > 0) {
                console.log('Estructura de datos:', this.datos[0]);
            }
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
            console.log('📋 Extrayendo catálogos de los datos...');
            
            // Extraer valores únicos de los datos
            const anosUnicos = [...new Set(this.datos.map(d => d.ano))].filter(a => a).sort((a, b) => b - a);
            const provinciasUnicas = [...new Set(this.datos.map(d => d.provincia))].filter(p => p);
            const zonasUnicas = [...new Set(this.datos.map(d => d.zona))].filter(z => z);
            const tiposClienteUnicos = [...new Set(this.datos.map(d => d.tipo_cliente))].filter(t => t);

            this.catalogos.anos = anosUnicos;
            this.catalogos.provincias = provinciasUnicas.sort();
            this.catalogos.zonas = zonasUnicas.sort();
            this.catalogos.tiposCliente = tiposClienteUnicos.sort();

            console.log('✅ Catálogos extraídos:', this.catalogos);
            this.poblarSelects();
        } catch (error) {
            console.error('❌ Error al cargar catálogos:', error);
        }
    }

    poblarSelects() {
        // Años
        const selectFilterAno = document.getElementById('filterAno');
        if (selectFilterAno) {
            // Mantener el input pero agregar datalist para sugerencias
            const datalist = document.createElement('datalist');
            datalist.id = 'anosDatalist';
            this.catalogos.anos?.forEach(ano => {
                const option = document.createElement('option');
                option.value = ano;
                datalist.appendChild(option);
            });
            selectFilterAno.setAttribute('list', 'anosDatalist');
            selectFilterAno.parentNode.appendChild(datalist);
        }

        // Provincias
        const selectFilterProvincia = document.getElementById('filterProvincia');
        const selectModalProvincia = document.getElementById('modalProvincia');
        
        if (selectFilterProvincia) {
            selectFilterProvincia.innerHTML = '<option value="">Todas las provincias</option>';
            this.catalogos.provincias.forEach(provincia => {
                selectFilterProvincia.innerHTML += `<option value="${provincia}">${provincia}</option>`;
            });
        }
        
        if (selectModalProvincia) {
            selectModalProvincia.innerHTML = '<option value="">Seleccionar...</option>';
            this.catalogos.provincias.forEach(provincia => {
                selectModalProvincia.innerHTML += `<option value="${provincia}">${provincia}</option>`;
            });
        }

        // Zonas
        const selectFilterZona = document.getElementById('filterZona');
        const selectModalZona = document.getElementById('modalZona');
        
        if (selectFilterZona) {
            selectFilterZona.innerHTML = '<option value="">Todas las zonas</option>';
            this.catalogos.zonas.forEach(zona => {
                selectFilterZona.innerHTML += `<option value="${zona}">${zona}</option>`;
            });
        }
        
        if (selectModalZona) {
            selectModalZona.innerHTML = '<option value="">Seleccionar...</option>';
            this.catalogos.zonas.forEach(zona => {
                selectModalZona.innerHTML += `<option value="${zona}">${zona}</option>`;
            });
        }

        // Tipos de Cliente
        const selectFilterTipoCliente = document.getElementById('filterTipoCliente');
        const selectModalTipoCliente = document.getElementById('modalTipoCliente');
        
        if (selectFilterTipoCliente) {
            selectFilterTipoCliente.innerHTML = '<option value="">Todos los tipos</option>';
            this.catalogos.tiposCliente.forEach(tipo => {
                selectFilterTipoCliente.innerHTML += `<option value="${tipo}">${tipo}</option>`;
            });
        }
        
        if (selectModalTipoCliente) {
            selectModalTipoCliente.innerHTML = '<option value="">Seleccionar...</option>';
            this.catalogos.tiposCliente.forEach(tipo => {
                selectModalTipoCliente.innerHTML += `<option value="${tipo}">${tipo}</option>`;
            });
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

        // Agregar columna de opciones (siempre visible)
        const labelOpciones = document.createElement('label');
        labelOpciones.className = 'column-toggle';
        labelOpciones.innerHTML = `
            <input type="checkbox" class="column-checkbox" data-column="${this.columnas.length}" checked disabled>
            <span>Opciones</span>
        `;
        dropdownContent.appendChild(labelOpciones);
        this.columnasVisibles[this.columnas.length] = true;

        // Agregar evento a los checkboxes
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
        
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }
        
        $('#tableBody').empty();

        // Configurar columnas para DataTables
        const columnsConfig = this.columnas.map((col, index) => ({
            data: col.campo,
            className: col.campo.includes('potencial') || col.campo.includes('grs') || col.campo.includes('rp') || 
                       col.campo.includes('renzo') || col.campo.includes('fafo') || col.campo.includes('santa_angela') || 
                       col.campo.includes('jorge_pan') || col.campo.includes('mirian_g') || col.campo.includes('vasquez') ||
                       col.campo.includes('san_joaquin') || col.campo.includes('fortunato') || col.campo.includes('rosario') ||
                       col.campo.includes('perca') || col.campo.includes('gamboa') || col.campo.includes('asoc_sondor') ||
                       col.campo.includes('otras_granjas')
                       ? 'text-center text-sm px-2' : 'text-sm px-2',
            defaultContent: col.campo.includes('potencial') || col.campo.includes('grs') || col.campo.includes('rp') || 
                           col.campo.includes('renzo') || col.campo.includes('fafo') || col.campo.includes('santa_angela') || 
                           col.campo.includes('jorge_pan') || col.campo.includes('mirian_g') || col.campo.includes('vasquez') ||
                           col.campo.includes('san_joaquin') || col.campo.includes('fortunato') || col.campo.includes('rosario') ||
                           col.campo.includes('perca') || col.campo.includes('gamboa') || col.campo.includes('asoc_sondor') ||
                           col.campo.includes('otras_granjas')
                           ? '0' : '-',
            visible: this.columnasVisibles[index] !== false,
            render: col.campo === 'id' 
                ? (data) => data ? `<span class="text-xs">${data}</span>` : ''
                : col.campo.includes('potencial') || col.campo.includes('grs') || col.campo.includes('rp') || 
                  col.campo.includes('renzo') || col.campo.includes('fafo') || col.campo.includes('santa_angela') || 
                  col.campo.includes('jorge_pan') || col.campo.includes('mirian_g') || col.campo.includes('vasquez') ||
                  col.campo.includes('san_joaquin') || col.campo.includes('fortunato') || col.campo.includes('rosario') ||
                  col.campo.includes('perca') || col.campo.includes('gamboa') || col.campo.includes('asoc_sondor') ||
                  col.campo.includes('otras_granjas')
                ? (data) => data || '0'
                : null
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

        this.dataTable = table.DataTable({
            data: this.datosFiltrados,
            columns: columnsConfig,
            processing: false,
            serverSide: false,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            order: [[1, 'desc'], [2, 'desc']],
            pageLength: 10,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
            language: this.dataTablesConfig,
            responsive: false,
            autoWidth: false,
            dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"<"flex items-center"l><"flex items-center"f>>rtip',
            initComplete: () => {
                console.log('✅ Tabla renderizada con', this.datosFiltrados.length, 'registros');
                $('.dataTables_wrapper').addClass('w-full');
            }
        });

        // Event handlers para editar y eliminar
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
        console.log('🔍 Aplicando filtros localmente...');
        
        const ano = document.getElementById('filterAno')?.value;
        const mes = document.getElementById('filterMes')?.value;
        const provincia = document.getElementById('filterProvincia')?.value;
        const zona = document.getElementById('filterZona')?.value;
        const tipoCliente = document.getElementById('filterTipoCliente')?.value;

        console.log('Filtros aplicados:', { ano, mes, provincia, zona, tipoCliente });

        this.datosFiltrados = this.datos.filter(registro => {
            let cumple = true;
            
            // Filtro por año
            if (ano && ano !== '') {
                cumple = cumple && registro.ano && registro.ano.toString() === ano.toString();
            }
            
            // Filtro por mes
            if (mes && mes !== '') {
                cumple = cumple && registro.mes && registro.mes.toLowerCase() === mes.toLowerCase();
            }
            
            // Filtro por provincia
            if (provincia && provincia !== '') {
                cumple = cumple && registro.provincia && registro.provincia.toLowerCase().includes(provincia.toLowerCase());
            }
            
            // Filtro por zona
            if (zona && zona !== '') {
                cumple = cumple && registro.zona && registro.zona.toLowerCase().includes(zona.toLowerCase());
            }
            
            // Filtro por tipo cliente
            if (tipoCliente && tipoCliente !== '') {
                cumple = cumple && registro.tipo_cliente && registro.tipo_cliente.toLowerCase().includes(tipoCliente.toLowerCase());
            }
            
            return cumple;
        });

        console.log(`✅ Filtrados: ${this.datosFiltrados.length} de ${this.datos.length} registros`);
        
        if (this.dataTable) {
            this.dataTable.destroy();
            $('#tableBody').empty();
        }
        
        this.renderizarTablaCliente();
        
        this.mostrarNotificacion(`${this.datosFiltrados.length} registros encontrados`, 'info');
    }

    limpiarFiltros() {
        console.log('🧹 Limpiando filtros...');
        
        document.getElementById('filterAno').value = '';
        document.getElementById('filterMes').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterZona').value = '';
        document.getElementById('filterTipoCliente').value = '';
        
        this.datosFiltrados = [...this.datos];
        
        if (this.dataTable) {
            this.dataTable.destroy();
            $('#tableBody').empty();
        }
        
        this.renderizarTablaCliente();
        
        this.mostrarNotificacion(`Mostrando ${this.datosFiltrados.length} registros`, 'success');
    }

    setupColumnToggle() {
        const btnToggle = document.getElementById('btnToggleColumns');
        const dropdown = document.getElementById('columnDropdown');
        const btnClose = document.getElementById('btnCloseDropdown');

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
            } else {
                filterContent.classList.add('show');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    }

    setupEventListeners() {
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
        
        // Esperar un momento para que el DOM esté listo
        setTimeout(() => {
            this.cargarDatosEnFormulario();
        }, 100);
        
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        
        // Hacer scroll al top del modal
        const modalContent = modal.querySelector('.bg-white');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;
        
        console.log('Cargando en formulario:', r);
        
        // Función helper para establecer valores
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
        
        // Granjas
        setValue('modalGrs', r.grs);
        setValue('modalRp', r.rp);
        setValue('modalRenzo', r.renzo);
        setValue('modalFafo', r.fafo);
        setValue('modalSantaAngela', r.santa_angela);
        setValue('modalJorgePan', r.jorge_pan);
        setValue('modalMirianG', r.mirian_g);
        setValue('modalVasquez', r.vasquez);
        setValue('modalSanJoaquin', r.san_joaquin);
        setValue('modalFortunato', r.fortunato);
        setValue('modalRosario', r.rosario);
        setValue('modalPerca', r.perca);
        setValue('modalGamboa', r.gamboa);
        setValue('modalAsocSondor', r.asoc_sondor);
        setValue('modalOtrasGranjas', r.otras_granjas_chicas);
        
        // Potenciales
        setValue('modalPotencialMinimo', r.potencial_minimo);
        setValue('modalPotencialMaximo', r.potencial_maximo);
        setValue('modalCondicionPtmax', r.condicion_ptmax);
        setValue('modalObservaciones', r.observaciones);
    }

    setSelectValue(selectId, value) {
        const select = document.getElementById(selectId);
        if (!select || !value) return;
        
        let found = false;
        for (let option of select.options) {
            if (option.value === value) {
                select.value = value;
                found = true;
                break;
            }
        }
        
        if (!found && value) {
            const newOption = document.createElement('option');
            newOption.value = value;
            newOption.text = value;
            select.add(newOption);
            select.value = value;
        }
    }

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input, #modalForm select, #modalForm textarea').forEach(input => {
            input.value = '';
        });
        
        // Establecer año actual por defecto
        document.getElementById('modalAno').value = new Date().getFullYear();
    }

    async guardarRegistro() {
        try {
            const data = this.obtenerDatosFormulario();
            
            if (!this.validarFormulario(data)) return;
            
            console.log('📝 Datos del formulario:', data);
            
            this.mostrarCargando(true);
            
            let response;
            
            if (this.registroSeleccionado && this.registroSeleccionado.id) {
                // Actualizar registro existente
                data.id = this.registroSeleccionado.id;
                console.log('Actualizando registro con ID:', data.id);
                response = await this.service.update(data);
                this.mostrarNotificacion('✅ Registro actualizado exitosamente', 'success');
            } else {
                // Crear nuevo registro
                console.log('Creando nuevo registro');
                delete data.id; // Asegurar que no tenga ID para crear nuevo
                response = await this.service.create(data);
                this.mostrarNotificacion('✅ Registro creado exitosamente', 'success');
            }
            
            console.log('Respuesta del servidor:', response);
            
            // Cerrar modal y recargar datos
            this.cerrarModal();
            
            // Recargar datos
            await this.cargarDatos();
            await this.cargarCatalogos();
            
            // Limpiar filtros para mostrar todos los datos incluyendo el nuevo
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
            if (!element) {
                console.warn(`Elemento no encontrado: ${id}`);
                return null;
            }
            return element.value || null;
        };
        
        const getIntValue = (id) => {
            const value = getValue(id);
            if (value === null || value === '') return 0;
            const parsed = parseInt(value);
            return isNaN(parsed) ? 0 : parsed;
        };
        
        const data = {
            ano: getIntValue('modalAno'),
            mes: getValue('modalMes'),
            provincia: getValue('modalProvincia'),
            zona: getValue('modalZona'),
            compra: getValue('modalCompra'),
            tipo_cliente: getValue('modalTipoCliente'),
            nombre: getValue('modalNombre'),
            grs: getIntValue('modalGrs'),
            rp: getIntValue('modalRp'),
            renzo: getIntValue('modalRenzo'),
            fafo: getIntValue('modalFafo'),
            santa_angela: getIntValue('modalSantaAngela'),
            jorge_pan: getIntValue('modalJorgePan'),
            mirian_g: getIntValue('modalMirianG'),
            vasquez: getIntValue('modalVasquez'),
            san_joaquin: getIntValue('modalSanJoaquin'),
            fortunato: getIntValue('modalFortunato'),
            rosario: getIntValue('modalRosario'),
            perca: getIntValue('modalPerca'),
            gamboa: getIntValue('modalGamboa'),
            asoc_sondor: getIntValue('modalAsocSondor'),
            otras_granjas_chicas: getIntValue('modalOtrasGranjas'),
            potencial_minimo: getIntValue('modalPotencialMinimo'),
            potencial_maximo: getIntValue('modalPotencialMaximo'),
            condicion_ptmax: getValue('modalCondicionPtmax'),
            observaciones: getValue('modalObservaciones')
        };
        
        console.log('Datos obtenidos del formulario:', data);
        return data;
    }

    validarFormulario(data) {
        console.log('Validando formulario:', data);
        
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
        
        console.log('✅ Validación exitosa');
        return true;
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) return;
        
        if (!confirm('¿Estás seguro de eliminar este registro?')) return;
        
        try {
            this.mostrarCargando(true);
            await this.service.delete(this.registroSeleccionado.id);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            await this.cargarDatos();
            await this.cargarCatalogos();
            this.aplicarFiltros();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar el registro', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            
            // Limpiar el formulario al cerrar
            this.limpiarFormulario();
            this.registroSeleccionado = null;
        }
    }

    exportarExcel() {
        console.log('📊 Exportando a Excel...');
        this.service.exportToExcel();
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
        
        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center gap-3 animate-slide-in`;
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

window.pventasVivoProvinciasController = new PVentasVivoProvinciasController();
