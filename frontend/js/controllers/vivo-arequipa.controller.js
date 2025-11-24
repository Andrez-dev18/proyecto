class VivoArequipaController {
    constructor() {
        this.service = new VivoArequipaService();
        this.config = window.VivoArequipaConfig;
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.catalogos = {};
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando Vivo Arequipa Controller...');
        try {
            await this.cargarDatos();
            await this.cargarCatalogos();
            this.setupEventListeners();
            this.setupColumnToggle();
            this.setupToggleFiltros();
            this.renderizarTablaCliente();
            console.log('✅ Controller inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar controller:', error);
            this.mostrarNotificacion('Error al inicializar la aplicación', 'error');
        }
    }

    setupColumnToggle() {
    const btnToggle = document.getElementById('btnToggleColumns');
    const dropdown = document.getElementById('columnDropdown');
    const btnClose = document.getElementById('btnCloseDropdown');
    const checkboxes = document.querySelectorAll('.column-checkbox');

    if (!btnToggle || !dropdown) {
        console.warn('⚠️ Elementos de toggle de columnas no encontrados');
        return;
    }

    // Inicializar TODAS las columnas como visibles por defecto
    checkboxes.forEach(checkbox => {
        const columnIndex = parseInt(checkbox.dataset.column);
        // Marcar todos los checkboxes como checked
        checkbox.checked = true;
        this.columnasVisibles[columnIndex] = true;
    });

    btnToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    btnClose?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.remove('show');
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-columns')) {
            dropdown.classList.remove('show');
        }
    });

    // Manejar cambios en checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const columnIndex = parseInt(e.target.dataset.column);
            this.columnasVisibles[columnIndex] = e.target.checked;
            
            if (this.dataTable) {
                const column = this.dataTable.column(columnIndex);
                if (column) {
                    column.visible(e.target.checked);
                }
            }
        });
    });
}


    setupToggleFiltros() {
        const btnToggle = document.getElementById('btnToggleFiltros');
        const filterContent = document.getElementById('filterContent');

        if (!btnToggle || !filterContent) {
            console.warn('⚠️ Elementos de toggle de filtros no encontrados');
            return;
        }

        // Iniciar con filtros visibles
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
            console.log('📊 Cargando datos de Vivo Arequipa...');
            
            this.datos = await this.service.getAll();
            this.datosFiltrados = [...this.datos];
            
            console.log(`✅ ${this.datos.length} registros cargados`);
            this.actualizarContadores();
            
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos: ' + error.message, 'error');
            this.datos = [];
            this.datosFiltrados = [];
        } finally {
            this.mostrarCargando(false);
        }
    }

    async cargarCatalogos() {
        try {
            console.log('📋 Cargando catálogos...');
            
            const [empresas, mercados, proveedores, condiciones] = await Promise.all([
                this.service.getEmpresas(),
                this.service.getMercados(),
                this.service.getProveedores(),
                this.service.getCondiciones()
            ]);
            
            this.catalogos = { 
                empresas: empresas || [], 
                mercados: mercados || [], 
                proveedores: proveedores || [], 
                condiciones: condiciones || [] 
            };
            
            console.log('✅ Catálogos cargados:', {
                empresas: this.catalogos.empresas.length,
                mercados: this.catalogos.mercados.length,
                proveedores: this.catalogos.proveedores.length,
                condiciones: this.catalogos.condiciones.length
            });
            
            this.poblarSelects();
            
        } catch (error) {
            console.error('❌ Error al cargar catálogos:', error);
            this.mostrarNotificacion('Error al cargar catálogos', 'warning');
        }
    }

    poblarSelects() {
        // Poblar filtros
        this.poblarSelect('filterMercado', this.catalogos.mercados, 'id', 'mercado', 'Todos los mercados');
        this.poblarSelect('filterEmpresa', this.catalogos.empresas, 'id', 'empresa', 'Todas las empresas');
        this.poblarSelect('filterProveedor', this.catalogos.proveedores, 'id', 'proveedor', 'Todos los proveedores');
        this.poblarSelect('filterCondicion', this.catalogos.condiciones, 'id', 'condicion', 'Todas las condiciones');
        
        // Poblar selects del modal
        this.poblarSelect('modalMercado', this.catalogos.mercados, 'id', 'mercado', 'Seleccionar mercado...');
        this.poblarSelect('modalEmpresa', this.catalogos.empresas, 'id', 'empresa', 'Seleccionar empresa...');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'id', 'proveedor', 'Seleccionar proveedor...');
        this.poblarSelect('modalCondicion', this.catalogos.condiciones, 'id', 'condicion', 'Seleccionar condición...');
    }

    poblarSelect(selectId, datos, valueField, textField, textoDefault = 'Seleccionar...') {
        const select = document.getElementById(selectId);
        if (!select) {
            console.warn(`⚠️ Select ${selectId} no encontrado`);
            return;
        }

        const opciones = datos.map(item =>
            `<option value="${item[valueField]}">${item[textField]}</option>`
        ).join('');

        select.innerHTML = `<option value="">${textoDefault}</option>${opciones}`;
    }

    setupEventListeners() {
        // Botones principales
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        
        // Filtros
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        
        // Modal
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
        
        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarModal();
            }
        });
        
        // Aplicar filtros al presionar Enter
        document.querySelectorAll('#filterContent input, #filterContent select').forEach(element => {
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.aplicarFiltros();
                }
            });
        });
    }

    aplicarFiltros() {
        console.log('🔍 Aplicando filtros...');
        
        const filtros = {
            fechaInicio: document.getElementById('filterFechaInicio')?.value,
            fechaFin: document.getElementById('filterFechaFin')?.value,
            mercado: document.getElementById('filterMercado')?.value,
            empresa: document.getElementById('filterEmpresa')?.value,
            proveedor: document.getElementById('filterProveedor')?.value,
            condicion: document.getElementById('filterCondicion')?.value
        };

        console.log('Filtros aplicados:', filtros);

        this.datosFiltrados = this.datos.filter(registro => {
            let cumple = true;
            
            // Filtro por fecha inicio
            if (filtros.fechaInicio && registro.fecha) {
                cumple = cumple && registro.fecha >= filtros.fechaInicio;
            }
            
            // Filtro por fecha fin
            if (filtros.fechaFin && registro.fecha) {
                cumple = cumple && registro.fecha <= filtros.fechaFin;
            }
            
            // Filtro por mercado
            if (filtros.mercado) {
                const mercadoObj = this.catalogos.mercados.find(m => m.id == filtros.mercado);
                if (mercadoObj) {
                    cumple = cumple && registro.mercado === mercadoObj.mercado;
                }
            }
            
            // Filtro por empresa
            if (filtros.empresa) {
                const empresaObj = this.catalogos.empresas.find(e => e.id == filtros.empresa);
                if (empresaObj) {
                    cumple = cumple && registro.empresa === empresaObj.empresa;
                }
            }
            
            // Filtro por proveedor
            if (filtros.proveedor) {
                const proveedorObj = this.catalogos.proveedores.find(p => p.id == filtros.proveedor);
                if (proveedorObj) {
                    cumple = cumple && registro.proveedor === proveedorObj.proveedor;
                }
            }
            
            // Filtro por condición
            if (filtros.condicion) {
                const condicionObj = this.catalogos.condiciones.find(c => c.id == filtros.condicion);
                if (condicionObj) {
                    cumple = cumple && registro.condicion === condicionObj.condicion;
                }
            }
            
            return cumple;
        });

        console.log(`✅ Filtrados: ${this.datosFiltrados.length} de ${this.datos.length} registros`);

        // Destruir y recrear tabla
        if (this.dataTable) {
            this.dataTable.destroy();
        }
        this.renderizarTablaCliente();
        
        this.actualizarContadores();
        this.mostrarNotificacion(`${this.datosFiltrados.length} registros encontrados`, 'info');
    }

    limpiarFiltros() {
        console.log('🧹 Limpiando filtros...');
        
        // Limpiar campos
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterMercado').value = '';
        document.getElementById('filterEmpresa').value = '';
        document.getElementById('filterProveedor').value = '';
        document.getElementById('filterCondicion').value = '';
        
        // Restaurar todos los datos
        this.datosFiltrados = [...this.datos];
        
        // Recrear tabla
        if (this.dataTable) {
            this.dataTable.destroy();
        }
        this.renderizarTablaCliente();
        
        this.actualizarContadores();
        this.mostrarNotificacion(`Mostrando todos los registros (${this.datosFiltrados.length})`, 'success');
    }

    renderizarTablaCliente() {
        console.log('📊 Renderizando tabla con', this.datosFiltrados.length, 'registros...');
        
        const table = $('#dataTable');
        
        if (!table.length) {
            console.error('❌ Tabla #dataTable no encontrada');
            return;
        }
        
        // Destruir DataTable previo si existe
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        // Limpiar tbody
        $('#tableBody').empty();

        // Configurar DataTable
        this.dataTable = table.DataTable({
            data: this.datosFiltrados,
            processing: false,
            serverSide: false,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            columns: this.obtenerConfiguracionColumnas(),
            order: [[1, 'desc']], // Ordenar por fecha descendente
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
            language: {
                url: this.config.UI.DATATABLES_LANGUAGE
            },
            responsive: false,
            autoWidth: false,
            dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"<"flex items-center"l><"flex items-center"f>>rtip',
            drawCallback: () => {
                // Aplicar visibilidad de columnas guardada
                Object.keys(this.columnasVisibles).forEach(columnIndex => {
                    const index = parseInt(columnIndex);
                    if (this.dataTable && this.dataTable.column(index)) {
                        try {
                            this.dataTable.column(index).visible(this.columnasVisibles[index]);
                        } catch (e) {
                            // Ignorar errores de columnas no existentes
                        }
                    }
                });
            },
            initComplete: () => {
                console.log('✅ Tabla renderizada exitosamente');
                this.vincularEventosTabla();
            }
        });
    }

    obtenerConfiguracionColumnas() {
    return [
        { 
            data: 'id', 
            title: 'ID',
            className: 'text-center text-xs px-2',
            visible: this.columnasVisibles[0] !== false
        },
        { 
            data: 'fecha',
            title: 'Fecha',
            className: 'text-sm px-2',
            defaultContent: '-',
            render: (data) => {
                if (!data) return '-';
                return new Date(data).toLocaleDateString('es-PE');
            }
        },
        { 
            data: 'mercado',
            title: 'Mercado',
            className: 'text-sm px-2', 
            defaultContent: '-'
        },
        { 
            data: 'empresa',
            title: 'Empresa', 
            className: 'text-sm px-2', 
            defaultContent: '-'
        },
        { 
            data: 'rucEmpresa',
            title: 'RUC Empresa',
            className: 'text-sm px-2', 
            defaultContent: '-', 
            visible: this.columnasVisibles[4] !== false
        },
        { 
            data: 'condicion',
            title: 'Condición',
            className: 'text-sm px-2', 
            defaultContent: '-'
        },
        { 
            data: 'proveedor',
            title: 'Proveedor',
            className: 'text-sm px-2', 
            defaultContent: '-'
        },
        { 
            data: 'rucProveedor',
            title: 'RUC Proveedor',
            className: 'text-sm px-2', 
            defaultContent: '-', 
            visible: this.columnasVisibles[7] !== false
        },
        { 
            data: 'condTipo',
            title: 'Cond/Tipo',
            className: 'text-sm px-2',
            defaultContent: '-'
        },
        { 
            data: 'precioMayMin',
            title: 'P. Mayor Mín',
            className: 'text-center text-sm px-2',
            defaultContent: '0.00',
            render: (data) => {
                const valor = parseFloat(data || 0);
                return `S/ ${valor.toFixed(2)}`;
            }
        },
        { 
            data: 'precioMayMax',
            title: 'P. Mayor Máx',
            className: 'text-center text-sm px-2',
            defaultContent: '0.00',
            render: (data) => {
                const valor = parseFloat(data || 0);
                return `S/ ${valor.toFixed(2)}`;
            }
        },
        { 
            data: 'precioPubMin',
            title: 'P. Público Mín',
            className: 'text-center text-sm px-2',
            defaultContent: '0.00',
            render: (data) => {
                const valor = parseFloat(data || 0);
                return `S/ ${valor.toFixed(2)}`;
            }
        },
        { 
            data: 'precioPubMax',
            title: 'P. Público Máx',
            className: 'text-center text-sm px-2',
            defaultContent: '0.00',
            render: (data) => {
                const valor = parseFloat(data || 0);
                return `S/ ${valor.toFixed(2)}`;
            }
        },
        { 
            data: null,
            title: 'Pesos Macho',
            className: 'text-center text-sm px-2',
            defaultContent: '0 - 0',
            render: (data, type, row) => {
                const min = row.pesoMachoMin || 0;
                const max = row.pesoMachoMax || 0;
                return `${min} - ${max}`;
            }
        },
        { 
            data: null,
            title: 'Pesos Hembra',
            className: 'text-center text-sm px-2',
            defaultContent: '0 - 0',
            render: (data, type, row) => {
                const min = row.pesoHembMin || 0;
                const max = row.pesoHembMax || 0;
                return `${min} - ${max}`;
            }
        },
        { 
            data: null,
            title: 'Prom. Peso Macho',
            className: 'text-center text-sm px-2',
            defaultContent: '0 - 0',
            render: (data, type, row) => {
                const min = row.pesoMachoPromMin || 0;
                const max = row.pesoMachoPromMax || 0;
                return `${min} - ${max}`;
            }
        },
        { 
            data: null,
            title: 'Prom. Peso Hembra',
            className: 'text-center text-sm px-2',
            defaultContent: '0 - 0',
            render: (data, type, row) => {
                const min = row.pesoHembraPromMin || 0;
                const max = row.pesoHembraPromMax || 0;
                return `${min} - ${max}`;
            }
        },
        { 
            data: null,
            title: 'Color',
            className: 'text-center text-sm px-2',
            defaultContent: '0 - 0',
            render: (data, type, row) => {
                const min = row.colorMin || 0;
                const max = row.colorMax || 0;
                return `${min} - ${max}`;
            }
        },
        { 
            data: 'cantidad',
            title: 'Cantidad',
            className: 'text-center text-sm px-2 font-bold',
            defaultContent: '0'
        },
        {
            data: null,
            title: 'Opciones',
            orderable: false,
            searchable: false,
            className: 'text-center px-2',
            defaultContent: '',
            render: () => `
                <div class="flex gap-1 justify-center">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn text-sm transition-colors" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn text-sm transition-colors" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `
        }
    ];
}



    vincularEventosTabla() {
        $('#dataTable tbody')
            .off('click')
            .on('click', '.edit-btn', (e) => {
                e.stopPropagation();
                const row = $(e.currentTarget).closest('tr');
                const rowData = this.dataTable.row(row).data();
                this.registroSeleccionado = rowData;
                console.log('📝 Editando registro:', rowData);
                this.modificarSeleccionado();
            })
            .on('click', '.delete-btn', async (e) => {
                e.stopPropagation();
                const row = $(e.currentTarget).closest('tr');
                const rowData = this.dataTable.row(row).data();
                this.registroSeleccionado = rowData;
                console.log('🗑️ Eliminando registro:', rowData);
                await this.eliminarSeleccionado();
            });
    }

    mostrarModalNuevo() {
        console.log('📝 Mostrando modal para nuevo registro');
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro - Vivo Arequipa';
        this.limpiarFormulario();
        this.mostrarModal();
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro para modificar', 'warning');
            return;
        }

        console.log('📝 Mostrando modal para editar registro:', this.registroSeleccionado.id);
        document.getElementById('modalTitle').textContent = 'Modificar Registro - Vivo Arequipa';
        this.cargarDatosEnFormulario();
        this.mostrarModal();
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro para eliminar', 'warning');
            return;
        }

        const confirmacion = await this.mostrarConfirmacion(
            '¿Estás seguro?',
            `Se eliminará el registro del ${new Date(this.registroSeleccionado.fecha).toLocaleDateString('es-PE')}`
        );

        if (!confirmacion) return;

        try {
            this.mostrarCargando(true);
            await this.service.delete(this.registroSeleccionado.id);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            
            // Recargar datos
            await this.cargarDatos();
            await this.cargarCatalogos();
            
            // Verificar si hay filtros activos
            const hayFiltros = this.hayFiltrosActivos();
            
            if (hayFiltros) {
                this.aplicarFiltros();
            } else {
                if (this.dataTable) {
                    this.dataTable.destroy();
                }
                this.renderizarTablaCliente();
            }
            
        } catch (error) {
            console.error('❌ Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar el registro: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) {
            return;
        }

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                // Actualizar
                data.id = this.registroSeleccionado.id;
                await this.service.update(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                // Crear nuevo
                delete data.id;
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            
            // Recargar datos
            await this.cargarDatos();
            await this.cargarCatalogos();
            
            // Recrear tabla
            if (this.dataTable) {
                this.dataTable.destroy();
            }
            this.renderizarTablaCliente();
            
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;

        console.log('📋 Cargando datos en formulario:', r);

        // Fecha
        document.getElementById('modalFecha').value = r.fecha || '';
        
        // Buscar IDs de catálogos
        const empresaObj = this.catalogos.empresas.find(e => e.empresa === r.empresa);
        document.getElementById('modalEmpresa').value = empresaObj ? empresaObj.id : '';
        
        const mercadoObj = this.catalogos.mercados.find(m => m.mercado === r.mercado);
        document.getElementById('modalMercado').value = mercadoObj ? mercadoObj.id : '';
        
        const condicionObj = this.catalogos.condiciones.find(c => c.condicion === r.condicion);
        document.getElementById('modalCondicion').value = condicionObj ? condicionObj.id : '';
        
        const proveedorObj = this.catalogos.proveedores.find(p => p.proveedor === r.proveedor);
        document.getElementById('modalProveedor').value = proveedorObj ? proveedorObj.id : '';

        // Precios
        document.getElementById('modalPrecioMayMin').value = r.precioMayMin || '';
        document.getElementById('modalPrecioMayMax').value = r.precioMayMax || '';
        document.getElementById('modalPrecioPubMin').value = r.precioPubMin || '';
        document.getElementById('modalPrecioPubMax').value = r.precioPubMax || '';
        
        // Pesos
        document.getElementById('modalPesoMachoMin').value = r.pesoMachoMin || '';
        document.getElementById('modalPesoMachoMax').value = r.pesoMachoMax || '';
        document.getElementById('modalPesoHembMin').value = r.pesoHembMin || '';
        document.getElementById('modalPesoHembMax').value = r.pesoHembMax || '';
        
        // Color
        document.getElementById('modalColorMin').value = r.colorMin || '';
        document.getElementById('modalColorMax').value = r.colorMax || '';
        
        // Pesos promedio
        document.getElementById('modalPesoMachoPromMin').value = r.pesoMachoPromMin || '';
        document.getElementById('modalPesoMachoPromMax').value = r.pesoMachoPromMax || '';
        document.getElementById('modalPesoHembraPromMin').value = r.pesoHembraPromMin || '';
        document.getElementById('modalPesoHembraPromMax').value = r.pesoHembraPromMax || '';
        
        // Cantidad
        document.getElementById('modalCantidad').value = r.cantidad || '';
    }

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input, #modalForm select').forEach(input => {
            if (input.type === 'date') {
                // Establecer fecha de hoy por defecto
                input.value = new Date().toISOString().split('T')[0];
            } else if (input.type === 'number') {
                input.value = '0';
            } else {
                input.value = '';
            }
        });
    }

    obtenerDatosFormulario() {
        const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        return {
            fecha: document.getElementById('modalFecha').value,
            empresa: parseInt(document.getElementById('modalEmpresa').value) || null,
            mercado: parseInt(document.getElementById('modalMercado').value) || null,
            condicion: parseInt(document.getElementById('modalCondicion').value) || null,
            proveedor: parseInt(document.getElementById('modalProveedor').value) || null,
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
            cantidad: parseInt(document.getElementById('modalCantidad').value) || 0,
            usuarioRegistro: localStorage.getItem('usuario') || 'admin',
            fechaHoraRegistro: ahora,
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: ahora
        };
    }

    validarFormulario(data) {
        console.log('🔍 Validando formulario:', data);

        const errores = [];

        if (!data.fecha) {
            errores.push('La fecha es obligatoria');
        }

        if (!data.proveedor) {
            errores.push('El proveedor es obligatorio');
        }

        if (!data.mercado) {
            errores.push('El mercado es obligatorio');
        }

        if (data.cantidad <= 0) {
            errores.push('La cantidad debe ser mayor a 0');
        }

        // Validar rangos de precios
        if (data.precioMayMin > data.precioMayMax) {
            errores.push('El precio mayorista mínimo no puede ser mayor al máximo');
        }

        if (data.precioPubMin > data.precioPubMax) {
            errores.push('El precio público mínimo no puede ser mayor al máximo');
        }

        // Validar rangos de pesos
        if (data.pesoMachoMin > data.pesoMachoMax) {
            errores.push('El peso macho mínimo no puede ser mayor al máximo');
        }

        if (data.pesoHembMin > data.pesoHembMax) {
            errores.push('El peso hembra mínimo no puede ser mayor al máximo');
        }

        if (errores.length > 0) {
            this.mostrarNotificacion(errores.join('<br>'), 'warning');
            console.log('❌ Validación fallida:', errores);
            return false;
        }

        console.log('✅ Validación exitosa');
        return true;
    }

    mostrarModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        
        // Enfocar primer campo después de un pequeño delay
        setTimeout(() => {
            const firstInput = document.getElementById('modalFecha');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

cerrarModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar scroll del body
    }
    this.registroSeleccionado = null;
}

    async exportarExcel() {
        try {
            const filtros = this.obtenerFiltrosActivos();
            console.log('📊 Exportando Excel con filtros:', filtros);
            
            await this.service.exportToExcel(filtros);
            this.mostrarNotificacion('Descarga de Excel iniciada', 'info');
        } catch (error) {
            console.error('❌ Error al exportar:', error);
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    // ========== MÉTODOS AUXILIARES ==========

    hayFiltrosActivos() {
        return !!(
            document.getElementById('filterFechaInicio')?.value ||
            document.getElementById('filterFechaFin')?.value ||
            document.getElementById('filterMercado')?.value ||
            document.getElementById('filterEmpresa')?.value ||
            document.getElementById('filterProveedor')?.value ||
            document.getElementById('filterCondicion')?.value
        );
    }

    obtenerFiltrosActivos() {
        return {
            fechaInicio: document.getElementById('filterFechaInicio')?.value || '',
            fechaFin: document.getElementById('filterFechaFin')?.value || '',
            mercado: document.getElementById('filterMercado')?.value || '',
            empresa: document.getElementById('filterEmpresa')?.value || '',
            proveedor: document.getElementById('filterProveedor')?.value || '',
            condicion: document.getElementById('filterCondicion')?.value || ''
        };
    }

    actualizarContadores() {
        const contador = document.getElementById('contadorRegistros');
        if (contador) {
            contador.textContent = `${this.datosFiltrados.length} de ${this.datos.length} registros`;
        }
    }

    async mostrarConfirmacion(titulo, mensaje) {
        // Usar confirm nativo por ahora, se puede mejorar con una modal personalizada
        return confirm(`${titulo}\n\n${mensaje}`);
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`[${tipo.toUpperCase()}] ${mensaje}`);

        // Crear o obtener contenedor
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

        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center gap-3 animate-slide-in`;
        notif.innerHTML = `
            <span style="font-size: 20px;">${iconos[tipo]}</span>
            <div>${mensaje}</div>
        `;

        container.appendChild(notif);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            notif.classList.add('animate-fade-out');
            setTimeout(() => notif.remove(), 300);
        }, 5000);
    }
}

// Hacer disponible globalmente
window.VivoArequipaController = VivoArequipaController;

// Inicializar automáticamente si el DOM está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.vivoArequipaController = new VivoArequipaController();
    });
} else {
    window.vivoArequipaController = new VivoArequipaController();
}
