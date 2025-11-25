class IngresosLimaController {
    constructor() {
        this.service = new IngresosLimaService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.catalogos = { empresas: [] };
        this.config = window.IngresosLimaConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando IngresosLima Controller...');
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

        checkboxes.forEach(checkbox => {
            const columnIndex = parseInt(checkbox.dataset.column);
            this.columnasVisibles[columnIndex] = checkbox.checked;
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
            this.datosFiltrados = [...this.datos];
            
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
            console.log('📋 Cargando catálogos...');
            
            // Cargar empresas desde el endpoint
            const empresas = await this.service.getEmpresas();
            this.catalogos.empresas = empresas;
            
            console.log('✅ Empresas cargadas:', this.catalogos.empresas);
            this.poblarSelects();
            
        } catch (error) {
            console.error('❌ Error al cargar catálogos:', error);
            // Si falla, extraer empresas únicas de los datos
            const empresasUnicas = [...new Set(this.datos.map(d => d.empresa))].filter(e => e);
            this.catalogos.empresas = empresasUnicas.map(empresa => ({
                codigo: empresa,
                nombre: empresa
            }));
            this.poblarSelects();
        }
    }

    poblarSelects() {
        const selectFilterEmpresa = document.getElementById('filterEmpresa');
        const selectModalEmpresa = document.getElementById('modalEmpresa');
        
        if (selectFilterEmpresa) {
            selectFilterEmpresa.innerHTML = '<option value="">Todas las empresas</option>';
            this.catalogos.empresas.forEach(empresa => {
                selectFilterEmpresa.innerHTML += `<option value="${empresa.codigo}">${empresa.nombre}</option>`;
            });
        }
        
        if (selectModalEmpresa) {
            selectModalEmpresa.innerHTML = '<option value="">Seleccionar...</option>';
            this.catalogos.empresas.forEach(empresa => {
                selectModalEmpresa.innerHTML += `<option value="${empresa.codigo}">${empresa.nombre}</option>`;
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

    aplicarFiltros() {
        console.log('🔍 Aplicando filtros localmente...');
        
        const fechaInicio = document.getElementById('filterFechaInicio')?.value;
        const fechaFin = document.getElementById('filterFechaFin')?.value;
        const empresa = document.getElementById('filterEmpresa')?.value;

        this.datosFiltrados = this.datos.filter(registro => {
            let cumple = true;
            
            if (fechaInicio && registro.fecha) {
                cumple = cumple && registro.fecha >= fechaInicio;
            }
            
            if (fechaFin && registro.fecha) {
                cumple = cumple && registro.fecha <= fechaFin;
            }
            
            if (empresa) {
                // Comparar tanto por código como por nombre
                const empresaObj = this.catalogos.empresas.find(e => e.codigo == empresa);
                if (empresaObj) {
                    cumple = cumple && (registro.empresa === empresaObj.nombre || registro.empresa == empresa);
                } else {
                    cumple = cumple && registro.empresa == empresa;
                }
            }
            
            return cumple;
        });

        console.log(`✅ Filtrados: ${this.datosFiltrados.length} de ${this.datos.length} registros`);

        if (this.dataTable) {
            this.dataTable.destroy();
            this.renderizarTablaCliente();
        } else {
            this.renderizarTablaCliente();
        }

        this.mostrarNotificacion(`${this.datosFiltrados.length} registros encontrados`, 'info');
    }

    limpiarFiltros() {
        console.log('🧹 Limpiando filtros...');
        
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterEmpresa').value = '';
        
        this.datosFiltrados = [...this.datos];
        
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
        
        const table = $('#dataTable');
        
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        $('#tableBody').empty();

        this.dataTable = table.DataTable({
            data: this.datosFiltrados,
            processing: false,
            serverSide: false,
            destroy: false,
            scrollX: false,
            scrollCollapse: false,
            paging: true,
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
                    data: 'empresa', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'unidad_fija', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                { 
                    data: 'unidad_movil', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0'
                },
                { 
                    data: 'kilos', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? parseFloat(data).toFixed(2) : '0.00';
                    }
                },
                { 
                    data: 'peso_promedio', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? parseFloat(data).toFixed(2) : '0.00';
                    }
                },
                { 
                    data: 'precio_campo', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? `S/. ${parseFloat(data).toFixed(2)}` : 'S/. 0.00';
                    }
                },
                { 
                    data: 'precio_granja', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? `S/. ${parseFloat(data).toFixed(2)}` : 'S/. 0.00';
                    }
                },
                { 
                    data: 'soles', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? `S/. ${parseFloat(data).toFixed(2)}` : 'S/. 0.00';
                    }
                },
                { 
                    data: 'participacion', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? `${parseFloat(data).toFixed(2)}%` : '0.00%';
                    }
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
            responsive: false,
            autoWidth: false,
            dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"<"flex items-center"l><"flex items-center"f>>rtip',
            drawCallback: () => {
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
                $('.dataTables_wrapper').addClass('w-full');
            }
        });

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
            
            await this.cargarDatos();
            await this.cargarCatalogos();
            
            const fechaInicio = document.getElementById('filterFechaInicio')?.value;
            const fechaFin = document.getElementById('filterFechaFin')?.value;
            const empresa = document.getElementById('filterEmpresa')?.value;
            
            if (fechaInicio || fechaFin || empresa) {
                this.aplicarFiltros();
            } else {
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

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;

        console.log('Cargando en formulario:', r);

        document.getElementById('modalFecha').value = r.fecha || '';
        
        // Para la empresa, buscar el código correcto
        const selectEmpresa = document.getElementById('modalEmpresa');
        if (selectEmpresa) {
            let found = false;
            // Buscar por nombre
            const empresaObj = this.catalogos.empresas.find(e => e.nombre === r.empresa);
            if (empresaObj) {
                selectEmpresa.value = empresaObj.codigo;
                found = true;
            }
            
            // Si no se encuentra, agregar como opción temporal
            if (!found && r.empresa) {
                const newOption = document.createElement('option');
                newOption.value = r.empresa;
                newOption.text = r.empresa;
                selectEmpresa.add(newOption);
                selectEmpresa.value = r.empresa;
            }
        }

        document.getElementById('modalUnidadFija').value = r.unidad_fija || '';
        document.getElementById('modalUnidadMovil').value = r.unidad_movil || '';
        document.getElementById('modalKilos').value = r.kilos || '';
        document.getElementById('modalPesoPromedio').value = r.peso_promedio || '';
        document.getElementById('modalPrecioCampo').value = r.precio_campo || '';
        document.getElementById('modalPrecioGranja').value = r.precio_granja || '';
        document.getElementById('modalSoles').value = r.soles || '';
        document.getElementById('modalParticipacion').value = r.participacion || '';
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
                delete data.id;
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            
            await this.cargarDatos();
            await this.cargarCatalogos();
            
            const fechaInicio = document.getElementById('filterFechaInicio')?.value;
            const fechaFin = document.getElementById('filterFechaFin')?.value;
            const empresa = document.getElementById('filterEmpresa')?.value;
            
            if (fechaInicio || fechaFin || empresa) {
                this.aplicarFiltros();
            } else {
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

    obtenerDatosFormulario() {
        const empresaId = document.getElementById('modalEmpresa').value;

        return {
            fecha: document.getElementById('modalFecha').value,
            empresa: parseInt(empresaId) || null,
            unidad_fija: parseInt(document.getElementById('modalUnidadFija').value) || 0,
            unidad_movil: parseInt(document.getElementById('modalUnidadMovil').value) || 0,
            kilos: parseFloat(document.getElementById('modalKilos').value) || 0,
            peso_promedio: parseFloat(document.getElementById('modalPesoPromedio').value) || 0,
            precio_campo: parseFloat(document.getElementById('modalPrecioCampo').value) || 0,
            precio_granja: parseFloat(document.getElementById('modalPrecioGranja').value) || 0,
            soles: parseFloat(document.getElementById('modalSoles').value) || 0,
            participacion: parseFloat(document.getElementById('modalParticipacion').value) || 0,
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

        if (!data.empresa) {
            this.mostrarNotificacion('La empresa es obligatoria', 'warning');
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

window.ingresosLimaController = new IngresosLimaController();
