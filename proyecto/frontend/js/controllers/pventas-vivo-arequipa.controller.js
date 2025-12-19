class PVentasVivoArequipaController {
    constructor() {
        this.service = new PVentasVivoArequipaService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.catalogos = {
            provincias: [],
            zonas: [],
            tiposCliente: []
        };
        this.dataTable = null;
        this.columnasVisibles = {};
        
        // Configuración de columnas embebida
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
            { nombre: 'Rosario', campo: 'rosario', visible: false },
            { nombre: 'Pollo Lima', campo: 'pollo_lima', visible: false },
            { nombre: 'Otras Granjas', campo: 'otras_granjas_chicas', visible: false },
            { nombre: 'Pot. Mínimo', campo: 'potencial_minimo', visible: true },
            { nombre: 'Pot. Máximo', campo: 'potencial_maximo', visible: true },
            { nombre: 'Cond. PT Min', campo: 'condicion_ptmin', visible: false },
            { nombre: 'Cond. PT Max', campo: 'condicion_ptmax', visible: false },
            { nombre: 'Observaciones', campo: 'observaciones', visible: false }
        ];

        // Configuración de DataTables embebida
        this.dataTablesConfig = {
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
        };
    }

    async init() {
        console.log('🚀 Inicializando PVentasVivoArequipa Controller...');
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
            
            // Extraer valores únicos de los datos para los catálogos
            const provinciasUnicas = [...new Set(this.datos.map(d => d.provincia))].filter(p => p);
            const zonasUnicas = [...new Set(this.datos.map(d => d.zona))].filter(z => z);
            const tiposClienteUnicos = [...new Set(this.datos.map(d => d.tipo_cliente))].filter(t => t);
            
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
                <input type="checkbox" class="column-checkbox" 
                    data-column="${index}" ${checked}>
                <span>${columna.nombre}</span>
            `;
            dropdownContent.appendChild(label);
        });

        // Agregar columna de opciones (siempre visible)
        const labelOpciones = document.createElement('label');
        labelOpciones.className = 'column-toggle';
        labelOpciones.innerHTML = `
            <input type="checkbox" class="column-checkbox" 
                data-column="${this.columnas.length}" checked disabled>
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
                      col.campo.includes('rosario') || col.campo.includes('pollo_lima') || col.campo.includes('otras_granjas') 
                      ? 'text-center text-sm px-2' : 'text-sm px-2',
            defaultContent: col.campo.includes('potencial') || col.campo.includes('grs') || col.campo.includes('rp') || 
                          col.campo.includes('renzo') || col.campo.includes('fafo') || col.campo.includes('santa_angela') ||
                          col.campo.includes('rosario') || col.campo.includes('pollo_lima') || col.campo.includes('otras_granjas')
                          ? '0' : '-',
            visible: this.columnasVisibles[index] !== false,
            render: col.campo === 'id' ? 
                (data) => data ? `<span class="text-xs">${data}</span>` : '' :
                col.campo.includes('potencial') || col.campo.includes('grs') || col.campo.includes('rp') || 
                col.campo.includes('renzo') || col.campo.includes('fafo') || col.campo.includes('santa_angela') ||
                col.campo.includes('rosario') || col.campo.includes('pollo_lima') || col.campo.includes('otras_granjas') ?
                (data) => data || '0' : null
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

        this.datosFiltrados = this.datos.filter(registro => {
            let cumple = true;
            
            if (ano && registro.ano) {
                cumple = cumple && registro.ano == ano;
            }
            
            if (mes && registro.mes) {
                cumple = cumple && registro.mes === mes;
            }
            
            if (provincia && registro.provincia) {
                cumple = cumple && registro.provincia === provincia;
            }
            
            if (zona && registro.zona) {
                cumple = cumple && registro.zona === zona;
            }
            
            if (tipoCliente && registro.tipo_cliente) {
                cumple = cumple && registro.tipo_cliente === tipoCliente;
            }
            
            return cumple;
        });

        console.log(`✅ Filtrados: ${this.datosFiltrados.length} de ${this.datos.length} registros`);

        if (this.dataTable) {
            this.dataTable.destroy();
            this.renderizarTablaCliente();
        }

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
            this.renderizarTablaCliente();
        }
        
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
        if (!this.registroSeleccionado) return;

        document.getElementById('modalTitle').textContent = 'Modificar Registro';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;

        console.log('Cargando en formulario:', r);

        // Información básica
        document.getElementById('modalAno').value = r.ano || '';
        document.getElementById('modalMes').value = r.mes || '';
        this.setSelectValue('modalProvincia', r.provincia);
        this.setSelectValue('modalZona', r.zona);
        document.getElementById('modalCompra').value = r.compra || '';
        this.setSelectValue('modalTipoCliente', r.tipo_cliente);
        document.getElementById('modalNombre').value = r.nombre || '';
        
        // Granjas
        document.getElementById('modalGrs').value = r.grs || '';
        document.getElementById('modalRp').value = r.rp || '';
        document.getElementById('modalRenzo').value = r.renzo || '';
        document.getElementById('modalFafo').value = r.fafo || '';
        document.getElementById('modalSantaAngela').value = r.santa_angela || '';
        document.getElementById('modalRosario').value = r.rosario || '';
        document.getElementById('modalPolloLima').value = r.pollo_lima || '';
        document.getElementById('modalOtrasGranjas').value = r.otras_granjas_chicas || '';
        
        // Potenciales
        document.getElementById('modalPotencialMinimo').value = r.potencial_minimo || '';
        document.getElementById('modalPotencialMaximo').value = r.potencial_maximo || '';
        document.getElementById('modalCondicionPtmin').value = r.condicion_ptmin || '';
        document.getElementById('modalCondicionPtmax').value = r.condicion_ptmax || '';
        document.getElementById('modalObservaciones').value = r.observaciones || '';
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
            await this.cargarDatos();
            await this.cargarCatalogos();
            this.aplicarFiltros();
            
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        return {
            ano: parseInt(document.getElementById('modalAno').value) || 0,
            mes: document.getElementById('modalMes').value || null,
            provincia: document.getElementById('modalProvincia').value || null,
            zona: document.getElementById('modalZona').value || null,
            compra: document.getElementById('modalCompra').value || null,
            tipo_cliente: document.getElementById('modalTipoCliente').value || null,
            nombre: document.getElementById('modalNombre').value || null,
            grs: parseInt(document.getElementById('modalGrs').value) || 0,
            rp: parseInt(document.getElementById('modalRp').value) || 0,
            renzo: parseInt(document.getElementById('modalRenzo').value) || 0,
            fafo: parseInt(document.getElementById('modalFafo').value) || 0,
            santa_angela: parseInt(document.getElementById('modalSantaAngela').value) || 0,
            rosario: parseInt(document.getElementById('modalRosario').value) || 0,
            pollo_lima: parseInt(document.getElementById('modalPolloLima').value) || 0,
            otras_granjas_chicas: parseInt(document.getElementById('modalOtrasGranjas').value) || 0,
            potencial_minimo: parseInt(document.getElementById('modalPotencialMinimo').value) || 0,
            potencial_maximo: parseInt(document.getElementById('modalPotencialMaximo').value) || 0,
            condicion_ptmin: document.getElementById('modalCondicionPtmin').value || null,
            condicion_ptmax: document.getElementById('modalCondicionPtmax').value || null,
            observaciones: document.getElementById('modalObservaciones').value || null
        };
    }

    validarFormulario(data) {
        console.log('Validando formulario:', data);

        if (!data.ano) {
            this.mostrarNotificacion('El año es obligatorio', 'warning');
            return false;
        }

        if (!data.mes) {
            this.mostrarNotificacion('El mes es obligatorio', 'warning');
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
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
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

window.pventasVivoArequipaController = new PVentasVivoArequipaController();

