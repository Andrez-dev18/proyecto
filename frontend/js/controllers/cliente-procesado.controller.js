class ClienteProcesadoController {
    constructor() {
        this.service = new ClienteProcesadoService();
        this.registroSeleccionado = null;
        this.config = window.ClienteProcesadoConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando ClienteProcesado Controller...');
        this.setupEventListeners();
        this.setupColumnToggle();
        this.setupToggleFiltros();
        this.renderizarTablaServerSide();
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
        document.getElementById('cancelarETL')?.addEventListener('click', () => this.cerrarModalETL());
        document.getElementById('confirmarETL')?.addEventListener('click', () => this.ejecutarETL());
    }

    renderizarTablaServerSide() {
        console.log('Renderizando tabla con server-side processing...');
        
        const table = $('.min-w-full');
        
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        this.dataTable = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${this.service.baseUrl}${this.config.API.ENDPOINTS.FILTRO}`,
                type: 'GET',
                data: (d) => {
                    const fechaInicio = document.getElementById('filterFechaInicio')?.value;
                    const fechaFin = document.getElementById('filterFechaFin')?.value;
                    
                    if (fechaInicio) d.fechaInicio = fechaInicio;
                    if (fechaFin) d.fechaFin = fechaFin;
                    
                    return d;
                },
                dataSrc: function(json) {
                    console.log('Datos recibidos:', json);
                    return json.data || [];
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
                    defaultContent: '-'
                },
                { 
                    data: 'distrito', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'zona', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'canal', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'codigo', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'linea', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'sublinea', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'vendedor', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'cliente', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'descripcion', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'ruta', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'nomruta', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'unidad', 
                    className: 'text-right text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? parseInt(data).toLocaleString() : '0';
                    }
                },
                { 
                    data: 'peso', 
                    className: 'text-right text-sm px-2',
                    defaultContent: '0.00',
                    render: (data) => {
                        return data ? parseFloat(data).toFixed(2) : '0.00';
                    }
                },
                { 
                    data: 'importe', 
                    className: 'text-right text-sm px-2',
                    defaultContent: 'S/. 0.00',
                    render: (data) => {
                        return data ? `S/. ${parseFloat(data).toFixed(2)}` : 'S/. 0.00';
                    }
                },
                { 
                    data: 'nom_db', 
                    className: 'text-center text-sm px-2',
                    defaultContent: 'grs'
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
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
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
                        console.error('Error aplicando visibilidad columna:', e);
                    }
                });
            },
            initComplete: () => {
                console.log('✅ Tabla inicializada con server-side processing');
                $('.dataTables_wrapper').addClass('w-full');
            }
        });

        $('.min-w-full tbody')
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
        console.log('Aplicando filtros...');
        if (this.dataTable) {
            this.dataTable.ajax.reload();
            this.mostrarNotificacion('Filtros aplicados', 'success');
        }
    }

    limpiarFiltros() {
        console.log('Limpiando filtros...');
        
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        
        if (this.dataTable) {
            this.dataTable.ajax.reload();
            this.mostrarNotificacion('Filtros limpiados', 'success');
        }
    }

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
        
        document.getElementById('fechaInicio').value = primerDia.toISOString().split('T')[0];
        document.getElementById('fechaFin').value = hoy.toISOString().split('T')[0];
        
        const modal = document.getElementById('modalETL');
        modal.classList.remove('hidden');
    }

    async ejecutarETL() {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;

        if (!fechaInicio || !fechaFin) {
            this.mostrarNotificacion('Debe seleccionar ambas fechas', 'warning');
            return;
        }

        if (fechaInicio > fechaFin) {
            this.mostrarNotificacion('La fecha inicio debe ser menor a la fecha fin', 'warning');
            return;
        }

        try {
            this.mostrarCargando(true);
            this.cerrarModalETL();
            
            const resultado = await this.service.ejecutarETL(fechaInicio, fechaFin);
            
            if (resultado.success) {
                this.mostrarNotificacion(
                    `ETL ejecutado exitosamente. ${resultado.resumen?.insertados || 0} registros procesados`, 
                    'success'
                );
                if (this.dataTable) {
                    this.dataTable.ajax.reload();
                }
            } else {
                this.mostrarNotificacion(
                    `Error en ETL: ${resultado.mensaje || 'Error desconocido'}`, 
                    'error'
                );
            }
        } catch (error) {
            console.error('Error al ejecutar ETL:', error);
            this.mostrarNotificacion('Error al ejecutar el proceso ETL', 'error');
        } finally {
            this.mostrarCargando(false);
        }
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
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            
            if (this.dataTable) {
                this.dataTable.ajax.reload();
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

    obtenerDatosFormulario() {
        return {
            fecha: document.getElementById('modalFecha').value,
            distrito: document.getElementById('modalDistrito').value || '',
            zona: document.getElementById('modalZona').value || '',
            canal: document.getElementById('modalCanal').value || '',
            codigo: document.getElementById('modalCodigo').value || '',
            linea: document.getElementById('modalLinea').value || '',
            sublinea: document.getElementById('modalSublinea').value || '',
            vendedor: document.getElementById('modalVendedor').value || '',
            cliente: document.getElementById('modalCliente').value || '',
            descripcion: document.getElementById('modalDescripcion').value || '',
            ruta: document.getElementById('modalRuta').value || '',
            nomruta: document.getElementById('modalNomruta').value || '',
            unidad: parseFloat(document.getElementById('modalUnidad').value) || 0,
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            importe: parseFloat(document.getElementById('modalImporte').value) || 0,
            nom_db: 'grs',
            usuarioRegistro: 'sistema',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        console.log('Validando formulario:', data);

        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }

        if (!data.cliente) {
            this.mostrarNotificacion('El cliente es obligatorio', 'warning');
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
        const fechaInicio = document.getElementById('filterFechaInicio')?.value;
        const fechaFin = document.getElementById('filterFechaFin')?.value;
        
        const filters = {};
        if (fechaInicio) filters.fechaInicio = fechaInicio;
        if (fechaFin) filters.fechaFin = fechaFin;
        
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

window.clienteProcesadoController = new ClienteProcesadoController();

