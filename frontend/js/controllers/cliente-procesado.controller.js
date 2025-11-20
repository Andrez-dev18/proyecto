class ClienteProcesadoController {
    constructor() {
        this.service = new ClienteProcesadoService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando Cliente Procesado Controller (clienteProce)...');
        this.setupEventListeners();
        this.setupColumnToggle();
        this.renderizarTablaFiltrada();
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

        // Manejar cambios en checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const columnIndex = parseInt(e.target.dataset.column);
                this.columnasVisibles[columnIndex] = e.target.checked;
                
                if (this.dataTable) {
                    const column = this.dataTable.column(columnIndex);
                    column.visible(e.target.checked);
                }
            });
        });
    }

    setupEventListeners() {
        // Botones acción
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());

        // ETL
        document.getElementById('btnETL')?.addEventListener('click', () => this.abrirModalETL());
        document.getElementById('cancelarETL')?.addEventListener('click', () => this.cerrarModalETL());
        document.getElementById('confirmarETL')?.addEventListener('click', () => this.ejecutarETL());

        // Filtro btn
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());

        // Modal
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());

        // Toggle filtros
        document.getElementById('btnToggleFiltros')?.addEventListener('click', () => this.toggleFiltros());
    }

    toggleFiltros() {
        const filterContent = document.getElementById('filterContent');
        const toggleIcon = document.querySelector('#btnToggleFiltros i');
        
        if (filterContent.style.maxHeight) {
            filterContent.style.maxHeight = null;
            toggleIcon.classList.remove('fa-chevron-down');
            toggleIcon.classList.add('fa-chevron-up');
        } else {
            filterContent.style.maxHeight = '0';
            toggleIcon.classList.remove('fa-chevron-up');
            toggleIcon.classList.add('fa-chevron-down');
        }
    }

    renderizarTablaFiltrada() {
        const table = $('#dataTable');
        
        // Destruir cualquier DataTable previo
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        // Inicializar DataTable con AJAX y filtros
        this.dataTable = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: this.service.baseUrl + this.service.config.API.ENDPOINTS.FILTRO,
                type: 'GET',
                data: function (d) {
                    // Extraer filtros desde los inputs del formulario
                    const fechaInicio = document.getElementById('filterFechaInicio')?.value;
                    const fechaFin = document.getElementById('filterFechaFin')?.value;
                    
                    if (fechaInicio) d.fechaInicio = fechaInicio;
                    if (fechaFin) d.fechaFin = fechaFin;

                    return d;
                },
                dataSrc: function(json) {
                    return json.data || [];
                }
            },
            columns: [
                { data: 'id', className: 'text-center text-sm' },
                { data: 'fecha', className: 'text-center text-sm' },
                { data: 'distrito', className: 'text-sm' },
                { data: 'zona', className: 'text-sm' },
                { data: 'canal', className: 'text-sm' },
                { data: 'codigo', className: 'text-center text-sm' },
                { data: 'linea', className: 'text-sm' },
                { data: 'sublinea', className: 'text-sm' },
                { data: 'vendedor', className: 'text-sm' },
                { data: 'cliente', className: 'text-sm' },
                { data: 'descripcion', className: 'text-sm' },
                { data: 'ruta', className: 'text-center text-sm' },
                { data: 'nomruta', className: 'text-sm' },
                { data: 'unidad', className: 'text-right text-sm' },
                { data: 'peso', className: 'text-right text-sm' },
                { data: 'importe', className: 'text-right text-sm' },
                { data: 'nom_db', className: 'text-center text-sm' },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    render: (data, type, row, meta) => `
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
            responsive: false,
            scrollX: true,
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
            drawCallback: () => {
                // Aplicar visibilidad de columnas después de cada redibujado
                Object.keys(this.columnasVisibles).forEach(columnIndex => {
                    const column = this.dataTable.column(parseInt(columnIndex));
                    if (column) {
                        column.visible(this.columnasVisibles[columnIndex]);
                    }
                });
            }
        });

        // Aplicar visibilidad inicial
        Object.keys(this.columnasVisibles).forEach(columnIndex => {
            const column = this.dataTable.column(parseInt(columnIndex));
            if (column) {
                column.visible(this.columnasVisibles[columnIndex]);
            }
        });

        // Delegar eventos para los botones de acción
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
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro Cliente Procesado';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Registro Cliente Procesado';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        console.log('Cargando datos en formulario:', r);

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
                console.log('Actualizando registro ID:', data.id);
                console.log('Datos a enviar:', data);

                const resultado = await this.service.actualizar(data);
                console.log('Resultado actualización:', resultado);

                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                console.log('Creando nuevo registro');
                console.log('Datos a enviar:', data);

                const resultado = await this.service.crear(data);
                console.log('Resultado creación:', resultado);

                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            this.dataTable.ajax.reload();
            
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        const data = {
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
            nom_db: 'grs',
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString()
        };

        return data;
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

    async eliminarSeleccionado() {
        console.log('=== ELIMINAR REGISTRO CLIENTE PROCESADO ===');
        console.log('Registro seleccionado:', this.registroSeleccionado);

        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        try {
            this.mostrarCargando(true);
            console.log('Eliminando ID:', this.registroSeleccionado.id);

            await this.service.eliminar(this.registroSeleccionado.id);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            this.registroSeleccionado = null;
            this.dataTable.ajax.reload();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
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
        try {
            this.service.exportarCSV();
            this.mostrarNotificacion('Iniciando descarga de Excel...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    async aplicarFiltros() {
        this.dataTable.ajax.reload();
        this.mostrarNotificacion('Filtros aplicados', 'info');
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        this.dataTable.ajax.reload();
        this.mostrarNotificacion('Filtros limpiados', 'info');
    }

    abrirModalETL() {
        // Establecer fechas por defecto
        const hoy = new Date();
        const ayer = new Date();
        ayer.setDate(hoy.getDate() - 1);
        
        document.getElementById('fechaInicio').value = ayer.toISOString().split('T')[0];
        document.getElementById('fechaFin').value = hoy.toISOString().split('T')[0];
        
        document.getElementById('modalETL').classList.remove('hidden');
    }

    cerrarModalETL() {
        document.getElementById('modalETL').classList.add('hidden');
    }

    async ejecutarETL() {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;

        console.log('=== EJECUTANDO ETL CLIENTE PROCESADO (clienteProce) ===');
        console.log('Fecha Inicio:', fechaInicio);
        console.log('Fecha Fin:', fechaFin);

        if (!fechaInicio || !fechaFin) {
            this.mostrarNotificacion('Debe ingresar ambas fechas inicio y fin.', 'warning');
            return;
        }

        // Validar que fecha inicio sea menor o igual a fecha fin
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            this.mostrarNotificacion('La fecha inicio debe ser menor o igual a la fecha fin.', 'warning');
            return;
        }

        try {
            this.mostrarCargando(true);

            const resultado = await this.service.ejecutarETL({ 
                fechaInicio: fechaInicio, 
                fechaFin: fechaFin 
            });
            
            console.log('Resultado ETL clienteProce recibido:', resultado);

            if (resultado && resultado.success) {
                const total = resultado.resumen?.total || 
                             resultado.resumen?.insertados || 
                             resultado.resumen?.total_registros_procesados || 0;
                
                this.mostrarAlertaETL(total);
                this.cerrarModalETL();
                
                // Recargar la tabla después del ETL
                if (this.dataTable) {
                    this.dataTable.ajax.reload();
                }
            } else {
                const errorMsg = resultado?.mensaje || resultado?.error || 'Error en la ejecución del ETL';
                this.mostrarNotificacion(errorMsg, 'error');
            }

        } catch (error) {
            console.error('Error en ETL clienteProce:', error);
            this.mostrarNotificacion('Error al ejecutar ETL: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarAlertaETL(total) {
        // Crear fondo oscuro
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';

        // Crear ventana modal
        const modal = document.createElement('div');
        modal.style.backgroundColor = '#fff';
        modal.style.borderRadius = '12px';
        modal.style.padding = '25px 35px';
        modal.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
        modal.style.textAlign = 'center';
        modal.style.maxWidth = '400px';
        modal.style.fontFamily = 'Arial, sans-serif';
        modal.style.animation = 'fadeIn 0.3s ease';

        // Contenido del mensaje
        modal.innerHTML = `
            <h3 style="color: #2e7d32; margin-bottom: 10px;">
                <i class="fas fa-check-circle" style="font-size: 48px;"></i><br>
                ETL Cliente Procesado Completado
            </h3>
            <p style="margin-bottom: 20px; font-size: 15px; color: #333;">
                Se procesaron un total de <strong style="color: #2e7d32; font-size: 18px;">${total}</strong> registros.<br><br>
                El proceso ETL se ejecutó correctamente.
            </p>
            <button id="cerrarModalETL" style="
                background-color: #2e7d32;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 15px;
                cursor: pointer;
                transition: background-color 0.3s;
            " onmouseover="this.style.backgroundColor='#1b5e20'" 
               onmouseout="this.style.backgroundColor='#2e7d32'">
                Cerrar
            </button>
        `;

        // Insertar modal al overlay
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Cerrar modal al hacer clic en el botón
        document.getElementById('cerrarModalETL').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Animación de aparición
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
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

        // Auto-eliminar después de 4 segundos
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }
}

window.clienteProcesadoController = new ClienteProcesadoController();
