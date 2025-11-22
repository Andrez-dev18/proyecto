class ClienteProcesadoController {
    constructor() {
        this.service = new ClienteProcesadoService();
        this.registroSeleccionado = null;
        this.dataTable = null;
        this.columnasVisibles = {};
        this.todosLosDatos = [];
    }

    async init() {
        this.setupEventListeners();
        this.setupColumnToggle();
        // Cargar todos los datos al inicio
        await this.cargarTodosLosDatos();
    }

    async cargarTodosLosDatos() {
        try {
            this.mostrarCargando(true);
            
            // Obtener todos los datos del backend
            const datos = await this.service.getAll();
            this.todosLosDatos = datos;
            
            // Inicializar la tabla con los datos
            this.inicializarTablaConDatos(datos);
            
            this.mostrarNotificacion('Datos cargados correctamente', 'success');
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    inicializarTablaConDatos(datos) {
        // Verificar que jQuery y DataTables estén cargados
        if (typeof $ === 'undefined' || !$.fn.DataTable) {
            console.error('jQuery o DataTables no están cargados');
            setTimeout(() => this.inicializarTablaConDatos(datos), 100);
            return;
        }

        // Si ya existe DataTable, destruirla
        if ($.fn.DataTable.isDataTable('#tablaClientes')) {
            $('#tablaClientes').DataTable().clear().destroy();
            $('#tablaClientes').empty();
        }

        try {
            // Inicializar DataTable con datos locales
            this.dataTable = $('#tablaClientes').DataTable({
                data: datos,
                columns: [
                    { 
                        data: 'id', 
                        title: 'ID',
                        defaultContent: ''
                    },
                    { 
                        data: 'fecha', 
                        title: 'Fecha',
                        defaultContent: ''
                    },
                    { 
                        data: 'distrito', 
                        title: 'Distrito',
                        defaultContent: ''
                    },
                    { 
                        data: 'zona', 
                        title: 'Zona',
                        defaultContent: ''
                    },
                    { 
                        data: 'canal', 
                        title: 'Canal',
                        defaultContent: ''
                    },
                    { 
                        data: 'codigo', 
                        title: 'Código',
                        defaultContent: ''
                    },
                    { 
                        data: 'linea', 
                        title: 'Línea',
                        defaultContent: ''
                    },
                    { 
                        data: 'sublinea', 
                        title: 'Sublínea',
                        defaultContent: ''
                    },
                    { 
                        data: 'vendedor', 
                        title: 'Vendedor',
                        defaultContent: ''
                    },
                    { 
                        data: 'cliente', 
                        title: 'Cliente',
                        defaultContent: ''
                    },
                    { 
                        data: 'descripcion', 
                        title: 'Descripción',
                        defaultContent: ''
                    },
                    { 
                        data: 'ruta', 
                        title: 'Ruta',
                        defaultContent: ''
                    },
                    { 
                        data: 'nomruta', 
                        title: 'Nom. Ruta',
                        defaultContent: ''
                    },
                    { 
                        data: 'unidad', 
                        title: 'Unidad',
                        defaultContent: '0',
                        render: function(data) {
                            return parseFloat(data || 0).toFixed(2);
                        }
                    },
                    { 
                        data: 'peso', 
                        title: 'Peso',
                        defaultContent: '0',
                        render: function(data) {
                            return parseFloat(data || 0).toFixed(2);
                        }
                    },
                    { 
                        data: 'importe', 
                        title: 'Importe',
                        defaultContent: '0',
                        render: function(data) {
                            return `S/. ${parseFloat(data || 0).toFixed(2)}`;
                        }
                    },
                    {
                        data: null,
                        title: 'Acciones',
                        orderable: false,
                        searchable: false,
                        defaultContent: '',
                        render: function() {
                            return `
                                <div class="flex gap-2 justify-center">
                                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded btn-editar" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded btn-eliminar" title="Eliminar">
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
                language: {
                    processing: "Procesando...",
                    lengthMenu: "Mostrar _MENU_ registros",
                    zeroRecords: "No se encontraron resultados",
                    emptyTable: "Ningún dato disponible en esta tabla",
                    info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                    infoFiltered: "(filtrado de un total de _MAX_ registros)",
                    search: "Buscar:",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente",
                        previous: "Anterior"
                    }
                },
                responsive: true,
                dom: '<"top"lf>rt<"bottom"ip><"clear">',
                initComplete: () => {
                    console.log('DataTable inicializada correctamente');
                    this.aplicarVisibilidadColumnas();
                },
                drawCallback: () => {
                    this.aplicarVisibilidadColumnas();
                }
            });

            // Event handlers para botones de acción
            $('#tablaClientes tbody').off('click').on('click', '.btn-editar', (e) => {
                const data = this.dataTable.row($(e.currentTarget).closest('tr')).data();
                this.editarRegistro(data);
            });

            $('#tablaClientes tbody').on('click', '.btn-eliminar', (e) => {
                const data = this.dataTable.row($(e.currentTarget).closest('tr')).data();
                this.eliminarRegistro(data);
            });

        } catch (error) {
            console.error('Error al inicializar DataTable:', error);
            throw error;
        }
    }

    aplicarFiltros() {
        if (!this.dataTable) return;

        // Obtener valores de los filtros
        const fechaInicio = document.getElementById('filterFechaInicio').value;
        const fechaFin = document.getElementById('filterFechaFin').value;
        const distrito = document.getElementById('filterDistrito').value.toLowerCase();
        const zona = document.getElementById('filterZona').value.toLowerCase();
        const canal = document.getElementById('filterCanal').value.toLowerCase();
        const linea = document.getElementById('filterLinea').value.toLowerCase();
        const sublinea = document.getElementById('filterSublinea').value.toLowerCase();
        const vendedor = document.getElementById('filterVendedor').value.toLowerCase();
        const cliente = document.getElementById('filterCliente').value.toLowerCase();

        // Filtrar los datos
        let datosFiltrados = this.todosLosDatos.filter(item => {
            let cumple = true;

            if (fechaInicio && item.fecha < fechaInicio) cumple = false;
            if (fechaFin && item.fecha > fechaFin) cumple = false;
            if (distrito && !item.distrito?.toLowerCase().includes(distrito)) cumple = false;
            if (zona && !item.zona?.toLowerCase().includes(zona)) cumple = false;
            if (canal && !item.canal?.toLowerCase().includes(canal)) cumple = false;
            if (linea && !item.linea?.toLowerCase().includes(linea)) cumple = false;
            if (sublinea && !item.sublinea?.toLowerCase().includes(sublinea)) cumple = false;
            if (vendedor && !item.vendedor?.toLowerCase().includes(vendedor)) cumple = false;
            if (cliente && !item.cliente?.toLowerCase().includes(cliente)) cumple = false;

            return cumple;
        });

        // Actualizar la tabla con los datos filtrados
        this.dataTable.clear();
        this.dataTable.rows.add(datosFiltrados);
        this.dataTable.draw();

        this.mostrarNotificacion(`Se encontraron ${datosFiltrados.length} registros`, 'info');
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterDistrito').value = '';
        document.getElementById('filterZona').value = '';
        document.getElementById('filterCanal').value = '';
        document.getElementById('filterLinea').value = '';
        document.getElementById('filterSublinea').value = '';
        document.getElementById('filterVendedor').value = '';
        document.getElementById('filterCliente').value = '';

        // Restaurar todos los datos
        if (this.dataTable) {
            this.dataTable.clear();
            this.dataTable.rows.add(this.todosLosDatos);
            this.dataTable.draw();
        }

        this.mostrarNotificacion('Filtros limpiados', 'info');
    }

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

        btnToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        btnClose?.addEventListener('click', (e) => {
            e.preventDefault();
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
                e.stopPropagation();
                const columnIndex = parseInt(e.target.dataset.column);
                this.columnasVisibles[columnIndex] = e.target.checked;
                
                if (this.dataTable) {
                    try {
                        const column = this.dataTable.column(columnIndex);
                        if (column) {
                            column.visible(e.target.checked);
                        }
                    } catch (error) {
                        console.error('Error al cambiar visibilidad de columna:', error);
                    }
                }
            });
        });
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnETL')?.addEventListener('click', () => this.abrirModalETL());
        document.getElementById('btnCancelarETL')?.addEventListener('click', () => this.cerrarModalETL());
        document.getElementById('btnEjecutarETLConfirm')?.addEventListener('click', () => this.ejecutarETL());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());

        // Toggle filtros
        document.getElementById('btnToggleFiltros')?.addEventListener('click', () => {
            const filterContent = document.getElementById('filterContent');
            const icon = document.querySelector('#btnToggleFiltros i');
            
            if (filterContent.classList.contains('hidden')) {
                filterContent.classList.remove('hidden');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                filterContent.classList.add('hidden');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    }

    aplicarVisibilidadColumnas() {
        if (!this.dataTable) return;
        
        Object.keys(this.columnasVisibles).forEach(columnIndex => {
            try {
                const column = this.dataTable.column(parseInt(columnIndex));
                if (column) {
                    column.visible(this.columnasVisibles[columnIndex]);
                }
            } catch (error) {
                console.error('Error al aplicar visibilidad de columna:', error);
            }
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

    editarRegistro(data) {
        if (!data) {
            this.mostrarNotificacion('No se pudo obtener los datos del registro', 'error');
            return;
        }
        
        this.registroSeleccionado = data;
        document.getElementById('modalTitle').textContent = 'Editar Registro';
        this.cargarDatosEnFormulario(data);
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cargarDatosEnFormulario(data) {
        document.getElementById('modalFecha').value = data.fecha || '';
        document.getElementById('modalDistrito').value = data.distrito || '';
        document.getElementById('modalZona').value = data.zona || '';
        document.getElementById('modalCanal').value = data.canal || '';
        document.getElementById('modalCodigo').value = data.codigo || '';
        document.getElementById('modalLinea').value = data.linea || '';
        document.getElementById('modalSublinea').value = data.sublinea || '';
        document.getElementById('modalVendedor').value = data.vendedor || '';
        document.getElementById('modalCliente').value = data.cliente || '';
        document.getElementById('modalDescripcion').value = data.descripcion || '';
        document.getElementById('modalRuta').value = data.ruta || '';
        document.getElementById('modalNomruta').value = data.nomruta || '';
        document.getElementById('modalUnidad').value = data.unidad || '';
        document.getElementById('modalPeso').value = data.peso || '';
        document.getElementById('modalImporte').value = data.importe || '';
    }

    async eliminarRegistro(data) {
        if (!data || !data.id) {
            this.mostrarNotificacion('No se pudo obtener el ID del registro', 'error');
            return;
        }

        if (!confirm('¿Está seguro de eliminar este registro?')) return;

        try {
            this.mostrarCargando(true);
            await this.service.eliminar(data.id);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            
            // Recargar datos
            await this.cargarTodosLosDatos();
        } catch (error) {
            this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado && this.registroSeleccionado.id) {
                data.id = this.registroSeleccionado.id;
                await this.service.actualizar(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                await this.service.crear(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            
            // Recargar datos
            await this.cargarTodosLosDatos();
        } catch (error) {
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        return {
            fecha: document.getElementById('modalFecha').value,
            distrito: document.getElementById('modalDistrito').value,
            zona: document.getElementById('modalZona').value,
            canal: document.getElementById('modalCanal').value,
            codigo: document.getElementById('modalCodigo').value,
            linea: document.getElementById('modalLinea').value,
            sublinea: document.getElementById('modalSublinea').value,
            vendedor: document.getElementById('modalVendedor').value,
            cliente: document.getElementById('modalCliente').value,
            descripcion: document.getElementById('modalDescripcion').value,
            ruta: document.getElementById('modalRuta').value,
            nomruta: document.getElementById('modalNomruta').value,
            unidad: parseFloat(document.getElementById('modalUnidad').value) || 0,
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            importe: parseFloat(document.getElementById('modalImporte').value) || 0,
            nom_db: 'grs'
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

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input, #modalForm textarea').forEach(input => {
            if (input.type === 'date') {
                input.value = new Date().toISOString().split('T')[0];
            } else if (input.id !== 'modalNomDb') {
                input.value = '';
            }
        });
    }

    async exportarExcel() {
        try {
            await this.service.exportarExcel();
            this.mostrarNotificacion('Exportación iniciada', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    abrirModalETL() {
        const hoy = new Date();
        const ayer = new Date();
        ayer.setDate(hoy.getDate() - 1);

        const formatDate = (date) => date.toISOString().split('T')[0];

        document.getElementById('etlFechaInicio').value = formatDate(ayer);
        document.getElementById('etlFechaFin').value = formatDate(hoy);
        document.getElementById('modalETL').classList.remove('hidden');
    }

    cerrarModalETL() {
        document.getElementById('modalETL').classList.add('hidden');
    }

    async ejecutarETL() {
        const fechaInicio = document.getElementById('etlFechaInicio').value;
        const fechaFin = document.getElementById('etlFechaFin').value;
        
        if (!fechaInicio || !fechaFin) {
            this.mostrarNotificacion('Por favor seleccione ambas fechas', 'warning');
            return;
        }
        
        try {
            this.mostrarCargando(true);
            const resultado = await this.service.ejecutarETL({ fechaInicio, fechaFin });
            
            if (resultado.success) {
                this.mostrarNotificacion('ETL ejecutado exitosamente', 'success');
                
                if (resultado.resumen) {
                    const mensaje = `Eliminados: ${resultado.resumen.eliminados}, Insertados: ${resultado.resumen.insertados}`;
                    this.mostrarNotificacion(mensaje, 'info');
                }
            } else {
                this.mostrarNotificacion(resultado.mensaje || 'Error en ETL', 'error');
            }
            
            this.cerrarModalETL();
            
            // Recargar datos
            await this.cargarTodosLosDatos();
        } catch (error) {
            this.mostrarNotificacion('Error al ejecutar ETL: ' + error.message, 'error');
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
            warning: '⚠',
            info: 'ℹ'
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

// Crear instancia global
const clienteProcesadoController = new ClienteProcesadoController();

