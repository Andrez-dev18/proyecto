class ClienteProcesadoController {
    constructor() {
        this.service = new ClienteProcesadoService();
        this.registroSeleccionado = null;
        this.config = window.ClienteProcesadoConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
        this.valoresUnicos = {
            distritos: new Set(),
            zonas: new Set(),
            canales: new Set(),
            lineas: new Set(),
            sublineas: new Set(),
            vendedores: new Set()
        };
    }

    async init() {
        console.log('🚀 Inicializando ClienteProcesado Controller...');
        this.setupEventListeners();
        this.setupColumnToggle();
        this.setupToggleFiltros();
        await this.cargarValoresUnicos();
        this.renderizarTablaServerSide();
    }

    async cargarValoresUnicos() {
        try {
            console.log('Cargando valores únicos para filtros...');
            this.mostrarCargando(true);
            
            const valores = await this.service.getValoresUnicos();
            
            Object.keys(this.valoresUnicos).forEach(key => {
                this.valoresUnicos[key].clear();
            });
            
            if (valores.distritos) {
                valores.distritos.forEach(d => this.valoresUnicos.distritos.add(d));
            }
            if (valores.zonas) {
                valores.zonas.forEach(z => this.valoresUnicos.zonas.add(z));
            }
            if (valores.canales) {
                valores.canales.forEach(c => this.valoresUnicos.canales.add(c));
            }
            if (valores.lineas) {
                valores.lineas.forEach(l => this.valoresUnicos.lineas.add(l));
            }
            if (valores.sublineas) {
                valores.sublineas.forEach(s => this.valoresUnicos.sublineas.add(s));
            }
            if (valores.vendedores) {
                valores.vendedores.forEach(v => this.valoresUnicos.vendedores.add(v));
            }
            
            console.log('Valores únicos cargados:', this.valoresUnicos);
            this.poblarSelectsFiltros();
            
        } catch (error) {
            console.error('Error al cargar valores únicos:', error);
            this.mostrarNotificacion('Error al cargar opciones de filtros', 'warning');
        } finally {
            this.mostrarCargando(false);
        }
    }

    actualizarValoresUnicosConNuevoRegistro(registro) {
        if (registro.distrito && registro.distrito.trim()) {
            this.valoresUnicos.distritos.add(registro.distrito);
        }
        if (registro.zona && registro.zona.trim()) {
            this.valoresUnicos.zonas.add(registro.zona);
        }
        if (registro.canal && registro.canal.trim()) {
            this.valoresUnicos.canales.add(registro.canal);
        }
        if (registro.linea && registro.linea.trim()) {
            this.valoresUnicos.lineas.add(registro.linea);
        }
        if (registro.sublinea && registro.sublinea.trim()) {
            this.valoresUnicos.sublineas.add(registro.sublinea);
        }
        if (registro.vendedor && registro.vendedor.trim()) {
            this.valoresUnicos.vendedores.add(registro.vendedor);
        }
        
        this.poblarSelectsFiltros();
    }

    poblarSelectsFiltros() {
        const valoresActuales = {
            distrito: document.getElementById('filterDistrito')?.value,
            zona: document.getElementById('filterZona')?.value,
            canal: document.getElementById('filterCanal')?.value,
            linea: document.getElementById('filterLinea')?.value,
            sublinea: document.getElementById('filterSublinea')?.value,
            vendedor: document.getElementById('filterVendedor')?.value
        };

        const selectDistrito = document.getElementById('filterDistrito');
        if (selectDistrito) {
            const distritosOrdenados = Array.from(this.valoresUnicos.distritos).sort();
            selectDistrito.innerHTML = '<option value="">Todos los distritos</option>';
            distritosOrdenados.forEach(distrito => {
                if (distrito) {
                    selectDistrito.innerHTML += `<option value="${distrito}">${distrito}</option>`;
                }
            });
            if (valoresActuales.distrito) {
                selectDistrito.value = valoresActuales.distrito;
            }
        }

        const selectZona = document.getElementById('filterZona');
        if (selectZona) {
            const zonasOrdenadas = Array.from(this.valoresUnicos.zonas).sort();
            selectZona.innerHTML = '<option value="">Todas las zonas</option>';
            zonasOrdenadas.forEach(zona => {
                if (zona) {
                    selectZona.innerHTML += `<option value="${zona}">${zona}</option>`;
                }
            });
            if (valoresActuales.zona) {
                selectZona.value = valoresActuales.zona;
            }
        }

        const selectCanal = document.getElementById('filterCanal');
        if (selectCanal) {
            const canalesOrdenados = Array.from(this.valoresUnicos.canales).sort();
            selectCanal.innerHTML = '<option value="">Todos los canales</option>';
            canalesOrdenados.forEach(canal => {
                if (canal) {
                    selectCanal.innerHTML += `<option value="${canal}">${canal}</option>`;
                }
            });
            if (valoresActuales.canal) {
                selectCanal.value = valoresActuales.canal;
            }
        }

        const selectLinea = document.getElementById('filterLinea');
        if (selectLinea) {
            const lineasOrdenadas = Array.from(this.valoresUnicos.lineas).sort();
            selectLinea.innerHTML = '<option value="">Todas las líneas</option>';
            lineasOrdenadas.forEach(linea => {
                if (linea) {
                    selectLinea.innerHTML += `<option value="${linea}">${linea}</option>`;
                }
            });
            if (valoresActuales.linea) {
                selectLinea.value = valoresActuales.linea;
            }
        }

        const selectSublinea = document.getElementById('filterSublinea');
        if (selectSublinea) {
            const sublineasOrdenadas = Array.from(this.valoresUnicos.sublineas).sort();
            selectSublinea.innerHTML = '<option value="">Todas las sublíneas</option>';
            sublineasOrdenadas.forEach(sublinea => {
                if (sublinea) {
                    selectSublinea.innerHTML += `<option value="${sublinea}">${sublinea}</option>`;
                }
            });
            if (valoresActuales.sublinea) {
                selectSublinea.value = valoresActuales.sublinea;
            }
        }

        const selectVendedor = document.getElementById('filterVendedor');
        if (selectVendedor) {
            const vendedoresOrdenados = Array.from(this.valoresUnicos.vendedores).sort();
            selectVendedor.innerHTML = '<option value="">Todos los vendedores</option>';
            vendedoresOrdenados.forEach(vendedor => {
                if (vendedor) {
                    selectVendedor.innerHTML += `<option value="${vendedor}">${vendedor}</option>`;
                }
            });
            if (valoresActuales.vendedor) {
                selectVendedor.value = valoresActuales.vendedor;
            }
        }

        console.log('✅ Filtros actualizados correctamente');
    }

    renderizarTablaServerSide() {
        console.log('Renderizando tabla con server-side processing...');
        
        const table = $('#tablaClientes');
        
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        table.html(`
            <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                    <th class="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">ID</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">FECHA</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">DISTRITO</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">ZONA</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">CANAL</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">CÓDIGO</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">LÍNEA</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">SUBLÍNEA</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">VENDEDOR</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">CLIENTE</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">OPCIONES</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            </tbody>
        `);

        const controller = this;

        this.dataTable = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${this.service.baseUrl}${this.config.API.ENDPOINTS.FILTRO}`,
                type: 'GET',
                data: function(d) {
                    const fechaInicio = $('#filterFechaInicio').val();
                    const fechaFin = $('#filterFechaFin').val();
                    const distrito = $('#filterDistrito').val();
                    const zona = $('#filterZona').val();
                    const canal = $('#filterCanal').val();
                    const linea = $('#filterLinea').val();
                    const sublinea = $('#filterSublinea').val();
                    const vendedor = $('#filterVendedor').val();
                    const cliente = $('#filterCliente').val();
                    
                    if (fechaInicio) d.fechaInicio = fechaInicio;
                    if (fechaFin) d.fechaFin = fechaFin;
                    if (distrito) d.distrito = distrito;
                    if (zona) d.zona = zona;
                    if (canal) d.canal = canal;
                    if (linea) d.linea = linea;
                    if (sublinea) d.sublinea = sublinea;
                    if (vendedor) d.vendedor = vendedor;
                    if (cliente) d.cliente = cliente;
                    
                    console.log('Parámetros enviados:', d);
                    return d;
                },
                dataSrc: function(json) {
                    console.log('Respuesta del servidor:', json);
                    
                    if (!json) {
                        console.error('Respuesta vacía');
                        return [];
                    }
                    
                    let data = [];
                    if (Array.isArray(json)) {
                        data = json;
                    } else if (json.data && Array.isArray(json.data)) {
                        data = json.data;
                    } else if (json.aaData && Array.isArray(json.aaData)) {
                        data = json.aaData;
                    }
                    
                    console.log(`Se recibieron ${data.length} registros`);
                    return data;
                },
                error: function(xhr, error, thrown) {
                    console.error('Error AJAX:', error);
                    console.error('Respuesta:', xhr.responseText);
                }
            },
            columns: [
                { 
                    data: 'id', 
                    className: 'text-center text-xs px-2',
                    defaultContent: ''
                },
                { 
                    data: 'fecha', 
                    className: 'text-sm px-2',
                    defaultContent: '-',
                    render: function(data) {
                        if (!data) return '-';
                        return data.split(' ')[0] || data;
                    }
                },
                { data: 'distrito', className: 'text-sm px-2', defaultContent: '-' },
                { data: 'zona', className: 'text-sm px-2', defaultContent: '-' },
                { data: 'canal', className: 'text-sm px-2', defaultContent: '-' },
                { data: 'codigo', className: 'text-center text-sm px-2', defaultContent: '-' },
                { data: 'linea', className: 'text-sm px-2', defaultContent: '-' },
                { data: 'sublinea', className: 'text-sm px-2', defaultContent: '-' },
                { data: 'vendedor', className: 'text-sm px-2', defaultContent: '-' },
                { data: 'cliente', className: 'text-sm px-2', defaultContent: '-' },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center px-2',
                    defaultContent: '',
                    render: function(data, type, row) {
                        return `
                            <div class="flex gap-1 justify-center">
                                <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn text-sm" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn text-sm" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            order: [[1, 'desc']],
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            language: this.config.UI.DATATABLES_LANGUAGE,
            responsive: false,
            autoWidth: false,
            dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"<"flex items-center"l><"flex items-center"f>>rtip',
            drawCallback: function() {
                Object.keys(controller.columnasVisibles).forEach(columnIndex => {
                    const index = parseInt(columnIndex);
                    try {
                        const column = controller.dataTable.column(index);
                        if (column) {
                            column.visible(controller.columnasVisibles[columnIndex]);
                        }
                    } catch (e) {}
                });
            },
            initComplete: function() {
                console.log('✅ Tabla inicializada con server-side processing');
            }
        });

        $('#tablaClientes tbody')
            .off('click')
            .on('click', '.edit-btn', (e) => {
                e.stopPropagation();
                const row = $(e.currentTarget).closest('tr');
                const rowData = this.dataTable.row(row).data();
                this.registroSeleccionado = rowData;
                this.modificarSeleccionado();
            })
            .on('click', '.delete-btn', async (e) => {
                e.stopPropagation();
                const row = $(e.currentTarget).closest('tr');
                const rowData = this.dataTable.row(row).data();
                this.registroSeleccionado = rowData;
                await this.eliminarSeleccionado();
            });
    }

    aplicarFiltros() {
        console.log('=== APLICANDO FILTROS ===');
        
        const filtros = {
            fechaInicio: $('#filterFechaInicio').val(),
            fechaFin: $('#filterFechaFin').val(),
            distrito: $('#filterDistrito').val(),
            zona: $('#filterZona').val(),
            canal: $('#filterCanal').val(),
            linea: $('#filterLinea').val(),
            sublinea: $('#filterSublinea').val(),
            vendedor: $('#filterVendedor').val(),
            cliente: $('#filterCliente').val()
        };
        
        console.log('Filtros actuales:', filtros);
        
        if (this.dataTable) {
            this.dataTable.ajax.reload(null, true);
            this.mostrarNotificacion('Filtros aplicados', 'success');
        } else {
            console.error('DataTable no está inicializada');
            this.mostrarNotificacion('Error al aplicar filtros', 'error');
        }
    }

    limpiarFiltros() {
        console.log('=== LIMPIANDO FILTROS ===');
        
        $('#filterFechaInicio').val('');
        $('#filterFechaFin').val('');
        $('#filterDistrito').val('');
        $('#filterZona').val('');
        $('#filterCanal').val('');
        $('#filterLinea').val('');
        $('#filterSublinea').val('');
        $('#filterVendedor').val('');
        $('#filterCliente').val('');
        
        if (this.dataTable) {
            this.dataTable.ajax.reload(null, true);
            this.mostrarNotificacion('Filtros limpiados', 'info');
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
                this.mostrarNotificacion('Registro actualizado', 'success');
            } else {
                delete data.id;
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado', 'success');
                this.actualizarValoresUnicosConNuevoRegistro(data);
            }

            this.cerrarModal();
            
            if (this.dataTable) {
                this.dataTable.ajax.reload();
            }
            
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    async ejecutarETL() {
        const fechaInicio = document.getElementById('etlFechaInicio').value;
        const fechaFin = document.getElementById('etlFechaFin').value;

        if (!fechaInicio || !fechaFin) {
            this.mostrarNotificacion('Debe seleccionar ambas fechas', 'warning');
            return;
        }

        try {
            this.mostrarCargando(true);
            this.cerrarModalETL();
            
            const resultado = await this.service.ejecutarETL(fechaInicio, fechaFin);
            
            if (resultado.success) {
                this.mostrarNotificacion(
                    `ETL ejecutado. ${resultado.resumen?.insertados || 0} registros procesados`, 
                    'success'
                );
                
                await this.cargarValoresUnicos();
                
                if (this.dataTable) {
                    this.dataTable.ajax.reload();
                }
            } else {
                this.mostrarNotificacion(
                    `Error: ${resultado.mensaje || 'Error desconocido'}`, 
                    'error'
                );
            }
        } catch (error) {
            this.mostrarNotificacion('Error al ejecutar ETL', 'error');
        } finally {
            this.mostrarCargando(false);
        }
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
        
        btnToggle.addEventListener('click', () => {
            filterContent.classList.toggle('hidden');
            const icon = btnToggle.querySelector('i');
            
            if (filterContent.classList.contains('hidden')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnETL')?.addEventListener('click', () => this.mostrarModalETL());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        document.getElementById('btnEjecutarETLConfirm')?.addEventListener('click', () => this.ejecutarETL());
        document.getElementById('btnCancelarETL')?.addEventListener('click', () => this.cerrarModalETL());
    }

    // Resto de métodos sin cambios...
    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    mostrarModalETL() {
        const hoy = new Date();
        const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        
        document.getElementById('etlFechaInicio').value = primerDia.toISOString().split('T')[0];
        document.getElementById('etlFechaFin').value = hoy.toISOString().split('T')[0];
        
        const modal = document.getElementById('modalETL');
        modal.classList.remove('hidden');
    }

    cerrarModalETL() {
        const modal = document.getElementById('modalETL');
        modal.classList.add('hidden');
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
            this.mostrarNotificacion('Registro eliminado', 'success');
            
            if (this.dataTable) {
                this.dataTable.ajax.reload();
            }
            
        } catch (error) {
            this.mostrarNotificacion('Error al eliminar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;

        document.getElementById('modalFecha').value = r.fecha || '';
        document.getElementById('modalDistrito').value = r.distrito || '';
        document.getElementById('modalZona').value = r.zona || '';
        document.getElementById('modalCanal').value = r.canal || '';
        document.getElementById('modalCodigo').value = r.codigo || '';
        document.getElementById('modalLinea').value = r.linea || '';
        document.getElementById('modalSublinea').value = r.sublinea || '';
        document.getElementById('modalVendedor').value = r.vendedor || '';
        document.getElementById('modalCliente').value = r.cliente || '';
        document.getElementById('modalDescripcion').value = r.descripcion || '';
        document.getElementById('modalRuta').value = r.ruta || '';
        document.getElementById('modalNomruta').value = r.nomruta || '';
        document.getElementById('modalUnidad').value = r.unidad || '';
        document.getElementById('modalPeso').value = r.peso || '';
        document.getElementById('modalImporte').value = r.importe || '';
    }

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input').forEach(input => {
            if (input.type === 'date') {
                input.value = new Date().toISOString().split('T')[0];
            } else {
                input.value = '';
            }
        });
    }

    obtenerDatosFormulario() {
        return {
            fecha: document.getElementById('modalFecha').value,
            distrito: document.getElementById('modalDistrito').value || null,
            zona: document.getElementById('modalZona').value || null,
            canal: document.getElementById('modalCanal').value || null,
            codigo: document.getElementById('modalCodigo').value || null,
            linea: document.getElementById('modalLinea').value || null,
            sublinea: document.getElementById('modalSublinea').value || null,
            vendedor: document.getElementById('modalVendedor').value || null,
            cliente: document.getElementById('modalCliente').value || null,
            descripcion: document.getElementById('modalDescripcion').value || null,
            ruta: document.getElementById('modalRuta').value || null,
            nomruta: document.getElementById('modalNomruta').value || null,
            unidad: parseFloat(document.getElementById('modalUnidad').value) || 0,
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            importe: parseFloat(document.getElementById('modalImporte').value) || 0,
            nom_db: 'grs',
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }

        if (!data.cliente) {
            this.mostrarNotificacion('El cliente es obligatorio', 'warning');
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
        const fechaInicio = $('#filterFechaInicio').val();
        const fechaFin = $('#filterFechaFin').val();
        const distrito = $('#filterDistrito').val();
        const zona = $('#filterZona').val();
        const canal = $('#filterCanal').val();
        const linea = $('#filterLinea').val();
        const sublinea = $('#filterSublinea').val();
        const vendedor = $('#filterVendedor').val();
        const cliente = $('#filterCliente').val();
        
        const filters = {};
        if (fechaInicio) filters.fechaInicio = fechaInicio;
        if (fechaFin) filters.fechaFin = fechaFin;
        if (distrito) filters.distrito = distrito;
        if (zona) filters.zona = zona;
        if (canal) filters.canal = canal;
        if (linea) filters.linea = linea;
        if (sublinea) filters.sublinea = sublinea;
        if (vendedor) filters.vendedor = vendedor;
        if (cliente) filters.cliente = cliente;
        
        this.service.exportToExcel(filters);
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

window.clienteProcesadoController = new ClienteProcesadoController();

