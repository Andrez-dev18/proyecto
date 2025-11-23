class TipoGallinaController {
    constructor() {
        this.service = new TipoGallinaService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.dataTable = null;
        this.columnasVisibles = {};
         this.datosYaCargados = false;
    }

    async init() {
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
            });
        }
        
        this.setupEventListeners();
        this.setupColumnToggle();
        await this.cargarDatos();
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
                    const column = this.dataTable.column(columnIndex);
                    column.visible(e.target.checked);
                }
            });
        });
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async cargarDatos() {
    try {
        console.log('Cargando tipos de gallina...');
        this.mostrarCargando(true);
        
        // Destruir tabla existente antes de cargar nuevos datos
        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').DataTable().destroy();
        }
        
        this.datos = await this.service.getAll();
        console.log(`${this.datos.length} tipos de gallina cargados`);
        
        this.renderizarTabla();
        this.mostrarNotificacion('Datos cargados correctamente', 'success');
    } catch (error) {
        console.error('Error al cargar datos:', error);
        this.mostrarNotificacion(error.message, 'error');
    } finally {
        this.mostrarCargando(false);
    }
}


    renderizarTabla() {
    console.log(`Renderizando tabla con ${this.datos.length} registros...`);
    
    // Verificar que jQuery y DataTables estén disponibles
    if (typeof $ === 'undefined' || !$.fn.DataTable) {
        console.error('jQuery o DataTables no está disponible');
        return;
    }

    // Verificar que el elemento tabla existe
    const tableElement = document.getElementById('dataTable');
    if (!tableElement) {
        console.error('Elemento tabla no encontrado');
        return;
    }

    // IMPORTANTE: Destruir DataTable existente si ya fue inicializado
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
        // Limpiar el HTML de la tabla
        $('#dataTable').empty();
    }

    // Limpiar el tbody manualmente
    const tbody = document.getElementById('tableBody');
    if (tbody) {
        tbody.innerHTML = '';
    }

    // Verificar que hay datos
    if (!this.datos || this.datos.length === 0) {
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center py-8 text-gray-500">No hay datos disponibles</td></tr>';
        }
        return;
    }

    try {
        // Inicializar DataTable con configuración completa
        this.dataTable = $('#dataTable').DataTable({
            data: this.datos,
            destroy: true, // Permite reinicializar
            retrieve: false, // No reutilizar instancia existente
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            autoWidth: false,
            responsive: true,
            columns: [
                { 
                    data: 'codigo',
                    className: 'text-center',
                    width: '20%',
                    defaultContent: '',
                    render: function(data) {
                        return data || '';
                    }
                },
                { 
                    data: 'nombre',
                    className: 'text-left',
                    width: '60%',
                    defaultContent: '',
                    render: function(data) {
                        return data || '';
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    width: '20%',
                    defaultContent: '',
                    render: function(data, type, row) {
                        if (!row || !row.codigo) return '';
                        return `
                            <div class="flex justify-center gap-2">
                                <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg transition-colors btn-editar" 
                                        data-id="${row.codigo}"
                                        title="Editar">
                                    <i class="fas fa-edit text-sm"></i>
                                </button>
                                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors btn-eliminar" 
                                        data-id="${row.codigo}"
                                        title="Eliminar">
                                    <i class="fas fa-trash text-sm"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            order: [[0, 'desc']],
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            language: {
                lengthMenu: "Mostrar _MENU_ registros por página",
                zeroRecords: "No se encontraron registros",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "No hay registros disponibles",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                search: "Buscar:",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior"
                },
                processing: "Procesando..."
            },
            dom: '<"flex flex-col sm:flex-row justify-between mb-4"lf>rtip',
            drawCallback: function(settings) {
                console.log('Tabla dibujada con', settings.aoData.length, 'filas');
            },
            initComplete: function(settings, json) {
                console.log('DataTable inicializado correctamente');
                
                // Personalizar estilos después de inicializar
                const searchInput = document.querySelector('.dataTables_filter input');
                if (searchInput) {
                    searchInput.setAttribute('placeholder', 'Buscar tipo de gallina...');
                    searchInput.className = 'px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 ml-2';
                }
                
                const lengthSelect = document.querySelector('.dataTables_length select');
                if (lengthSelect) {
                    lengthSelect.className = 'px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mx-2';
                }
            }
        });

        // Configurar eventos con delegación
        this.configurarEventosTabla();
        
        console.log('Tabla renderizada exitosamente');
    } catch (error) {
        console.error('Error al inicializar DataTable:', error);
        // Mostrar mensaje de error en la tabla
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center py-8 text-red-500">Error al cargar la tabla</td></tr>';
        }
    }
}

configurarEventosTabla() {
    // Limpiar eventos anteriores para evitar duplicados
    $('#dataTable tbody').off('click', '.btn-editar');
    $('#dataTable tbody').off('click', '.btn-eliminar');
    
    // Event delegation para botón editar
    $('#dataTable tbody').on('click', '.btn-editar', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const id = $(e.currentTarget).data('id');
        console.log('Editando tipo gallina ID:', id);
        
        const registro = this.datos.find(p => p.codigo == id);
        if (registro) {
            this.registroSeleccionado = registro;
            this.modificarSeleccionado();
        }
    });

    // Event delegation para botón eliminar
    $('#dataTable tbody').on('click', '.btn-eliminar', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const id = $(e.currentTarget).data('id');
        console.log('Eliminando tipo gallina ID:', id);
        
        const registro = this.datos.find(p => p.codigo == id);
        if (registro) {
            this.registroSeleccionado = registro;
            await this.eliminarSeleccionado();
        }
    });
}


    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Tipo de Gallina';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Tipo de Gallina';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro', 'warning');
            return;
        }

        if (!confirm(`¿Estás seguro de eliminar "${this.registroSeleccionado.nombre}"?`)) return;

        try {
            this.mostrarCargando(true);
            await this.service.delete(this.registroSeleccionado.codigo);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            this.registroSeleccionado = null;
            await this.cargarDatos();
        } catch (error) {
            console.error('❌ Error al eliminar:', error);
            this.mostrarNotificacion(error.message || 'Error al eliminar el registro', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;
        
        document.getElementById('modalNombre').value = r.nombre || '';
    }

    limpiarFormulario() {
        document.getElementById('modalNombre').value = '';
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.codigo = this.registroSeleccionado.codigo;
                await this.service.update(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
            
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            this.mostrarNotificacion(error.message || 'Error al guardar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        return {
            nombre: document.getElementById('modalNombre').value.trim()
        };
    }

    validarFormulario(data) {
        if (!data.nombre) {
            this.mostrarNotificacion('El nombre del tipo de gallina es obligatorio', 'warning');
            return false;
        }
        return true;
    }

    exportarExcel() {
        try {
            this.service.exportToExcel();
            this.mostrarNotificacion('Iniciando descarga de Excel...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
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

window.tipoGallinaController = new TipoGallinaController();

