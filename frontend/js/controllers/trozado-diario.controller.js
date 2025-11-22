class TrozadoDiarioController {
    constructor() {
        this.service = new TrozadoDiarioService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.config = window.TrozadoDiarioConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando TrozadoDiario Controller...');
        await this.cargarDatos();
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
            console.log('Cargando todos los datos...');
            
            this.datos = await this.service.getAll();
            this.datosFiltrados = [...this.datos];
            
            console.log(`${this.datos.length} registros cargados`);
            
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos', 'error');
            this.datos = [];
            this.datosFiltrados = [];
        } finally {
            this.mostrarCargando(false);
        }
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnEjecutarETL')?.addEventListener('click', () => this.mostrarModalETL());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        
        // ETL Modal
        document.getElementById('btnEjecutarETLConfirm')?.addEventListener('click', () => this.ejecutarETL());
        document.getElementById('btnCancelarETL')?.addEventListener('click', () => this.cerrarModalETL());
    }

    aplicarFiltros() {
        console.log('Aplicando filtros localmente...');
        
        const fechaInicio = document.getElementById('filterFechaInicio')?.value;
        const fechaFin = document.getElementById('filterFechaFin')?.value;

        this.datosFiltrados = this.datos.filter(registro => {
            let cumple = true;
            
            if (fechaInicio && registro.fecha) {
                cumple = cumple && registro.fecha >= fechaInicio;
            }
            
            if (fechaFin && registro.fecha) {
                cumple = cumple && registro.fecha <= fechaFin;
            }
            
            return cumple;
        });

        console.log(`Filtrados: ${this.datosFiltrados.length} de ${this.datos.length} registros`);

        if (this.dataTable) {
            this.dataTable.destroy();
            this.renderizarTablaCliente();
        } else {
            this.renderizarTablaCliente();
        }

        this.mostrarNotificacion(`${this.datosFiltrados.length} registros encontrados`, 'info');
    }

    limpiarFiltros() {
        console.log('Limpiando filtros...');
        
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        
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
        console.log('Renderizando tabla con', this.datosFiltrados.length, 'registros...');
        
        const table = $('#dataTable');
        
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        $('#tableBody').empty();

        this.dataTable = table.DataTable({
            data: this.datosFiltrados,
            processing: false,
            serverSide: false,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            columns: [
                { 
                    data: 'id', 
                    className: 'text-center text-xs px-2',
                    visible: true,
                    defaultContent: ''
                },
                { 
                    data: 'fecha', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'zona', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'linea', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'codigo', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'producto', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'cantidad', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? parseInt(data).toLocaleString() : '0';
                    }
                },
                { 
                    data: 'precio', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? `S/. ${parseFloat(data).toFixed(2)}` : 'S/. 0.00';
                    }
                },
                { 
                    data: 'peso', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? parseFloat(data).toFixed(2) : '0.00';
                    }
                },
                { 
                    data: 'importe', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? `S/. ${parseFloat(data).toFixed(2)}` : 'S/. 0.00';
                    }
                },
                { 
                    data: 'pprom', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? parseFloat(data).toFixed(2) : '0.00';
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

    mostrarModalETL() {
        // Establecer fechas por defecto (último mes)
        const hoy = new Date();
        const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        
        document.getElementById('etlFechaInicio').value = primerDia.toISOString().split('T')[0];
        document.getElementById('etlFechaFin').value = hoy.toISOString().split('T')[0];
        
        const modal = document.getElementById('modalETL');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    async ejecutarETL() {
        const fechaInicio = document.getElementById('etlFechaInicio').value;
        const fechaFin = document.getElementById('etlFechaFin').value;

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
                // Recargar datos
                await this.cargarDatos();
                if (this.dataTable) {
                    this.dataTable.destroy();
                }
                this.renderizarTablaCliente();
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
        modal.style.display = 'none';
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
            
            const fechaInicio = document.getElementById('filterFechaInicio')?.value;
            const fechaFin = document.getElementById('filterFechaFin')?.value;
            
            if (fechaInicio || fechaFin) {
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
        document.getElementById('modalZona').value = r.zona || '';
        document.getElementById('modalLinea').value = r.linea || '';
        document.getElementById('modalCodigo').value = r.codigo || '';
        document.getElementById('modalProducto').value = r.producto || '';
        document.getElementById('modalCantidad').value = r.cantidad || '';
        document.getElementById('modalPrecio').value = r.precio || '';
        document.getElementById('modalPeso').value = r.peso || '';
        document.getElementById('modalImporte').value = r.importe || '';
        document.getElementById('modalPprom').value = r.pprom || '';
        document.getElementById('modalNomDb').value = r.nom_db || '';
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
            
            await this.cargarDatos();
            
            const fechaInicio = document.getElementById('filterFechaInicio')?.value;
            const fechaFin = document.getElementById('filterFechaFin')?.value;
            
            if (fechaInicio || fechaFin) {
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
        return {
            fecha: document.getElementById('modalFecha').value,
            zona: document.getElementById('modalZona').value || null,
            linea: document.getElementById('modalLinea').value || null,
            codigo: document.getElementById('modalCodigo').value || null,
            producto: document.getElementById('modalProducto').value || null,
            cantidad: parseFloat(document.getElementById('modalCantidad').value) || 0,
            precio: parseFloat(document.getElementById('modalPrecio').value) || 0,
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            importe: parseFloat(document.getElementById('modalImporte').value) || 0,
            pprom: parseFloat(document.getElementById('modalPprom').value) || 0,
            nom_db: document.getElementById('modalNomDb').value || null,
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        console.log('Validando formulario:', data);

        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
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
        notif.innerHTML = `
            <span style="font-size: 20px;">${iconos[tipo]}</span>
            <span>${mensaje}</span>
        `;
        container.appendChild(notif);

        setTimeout(() => notif.remove(), 4000);
    }
}

window.trozadoDiarioController = new TrozadoDiarioController();
