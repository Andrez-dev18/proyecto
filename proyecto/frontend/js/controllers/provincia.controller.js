/**
 * Controller para gestión de Provincias
 */
class ProvinciaController {
    constructor() {
        console.log('🚀 Inicializando Provincia Controller...');
        
        // Verificar que ProvinciaConfig esté disponible
        if (typeof ProvinciaConfig === 'undefined') {
            console.error('ProvinciaConfig no está definido');
            return;
        }
        
        this.service = new ProvinciaService();
        this.registroSeleccionado = null;
        this.dataTable = null;
        this.datos = [];
        this.columnasVisibles = ProvinciaConfig.TABLA.COLUMNAS_VISIBLES;
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

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (this.dataTable) {
                    this.dataTable.search(e.target.value).draw();
                }
            });
        }
    }

    async cargarDatos() {
        try {
            console.log('Cargando provincias...');
            this.mostrarCargando(true);
            
            this.datos = await this.service.getAll();
            console.log(`${this.datos.length} provincias cargadas`);
            
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

    const tableElement = document.getElementById('dataTable');
    if (!tableElement) {
        console.error('Elemento tabla no encontrado');
        return;
    }

    // Limpiar tabla existente
    if (this.dataTable) {
        this.dataTable.destroy();
        this.dataTable = null;
    }

    // Limpiar el tbody manualmente
    const tbody = document.getElementById('tableBody');
    if (tbody) {
        tbody.innerHTML = '';
    }

    // Verificar que hay datos
    if (!this.datos || this.datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center py-8 text-gray-500">No hay datos disponibles</td></tr>';
        return;
    }

    try {
        // Inicializar DataTable
        this.dataTable = $('#dataTable').DataTable({
            data: this.datos,
            destroy: true, // Permite reinicializar
            columns: [
                { 
                    data: 'codigo',
                    className: 'text-center',
                    width: '20%',
                    defaultContent: ''
                },
                { 
                    data: 'nombre',
                    className: 'text-left',
                    width: '60%',
                    defaultContent: ''
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
            responsive: true,
            autoWidth: false,
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
            initComplete: function(settings, json) {
                console.log('DataTable inicializado correctamente');
                
                // Personalizar estilos después de inicializar
                const searchInput = document.querySelector('.dataTables_filter input');
                if (searchInput) {
                    searchInput.setAttribute('placeholder', 'Buscar provincia...');
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

setupColumnToggle() {
    const btnToggle = document.getElementById('btnToggleColumns');
    const dropdown = document.getElementById('columnDropdown');
    const btnClose = document.getElementById('btnCloseDropdown');
    const checkboxes = document.querySelectorAll('.column-checkbox');

    if (!btnToggle || !dropdown) {
        console.warn('Elementos de toggle de columnas no encontrados');
        return;
    }

    // Inicializar estado de columnas
    checkboxes.forEach(checkbox => {
        const columnIndex = parseInt(checkbox.dataset.column);
        this.columnasVisibles[columnIndex] = checkbox.checked;
    });

    // Toggle dropdown
    btnToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // Cerrar dropdown
    if (btnClose) {
        btnClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.remove('show');
        });
    }

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


configurarEventosTabla() {
    // Limpiar eventos anteriores
    $('#dataTable tbody').off('click');
    
    // Event delegation para botón editar
    $('#dataTable tbody').on('click', '.btn-editar', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const id = $(e.currentTarget).data('id');
        console.log('Editando provincia ID:', id);
        
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
        console.log('Eliminando provincia ID:', id);
        
        const registro = this.datos.find(p => p.codigo == id);
        if (registro) {
            this.registroSeleccionado = registro;
            await this.eliminarSeleccionado();
        }
    });
}


    mostrarModalNuevo() {
        console.log('Mostrando modal nuevo registro');
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nueva Provincia';
        this.limpiarFormulario();
        this.abrirModal();
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro', 'warning');
            return;
        }

        console.log('Editando provincia:', this.registroSeleccionado);
        document.getElementById('modalTitle').textContent = 'Modificar Provincia';
        document.getElementById('modalNombre').value = this.registroSeleccionado.nombre || '';
        this.abrirModal();
    }

    async guardarRegistro() {
        const nombre = document.getElementById('modalNombre').value.trim();

        if (!nombre) {
            this.mostrarNotificacion('El nombre es obligatorio', 'warning');
            return;
        }

        if (nombre.length < 3) {
            this.mostrarNotificacion('El nombre debe tener al menos 3 caracteres', 'warning');
            return;
        }

        try {
            this.mostrarCargando(true);
            
            const data = { nombre };

            if (this.registroSeleccionado) {
                data.codigo = this.registroSeleccionado.codigo;
                console.log('Actualizando:', data);
                await this.service.actualizar(data);
                this.mostrarNotificacion('Provincia actualizada exitosamente', 'success');
            } else {
                console.log('Creando:', data);
                await this.service.crear(data);
                this.mostrarNotificacion('Provincia creada exitosamente', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion(error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro', 'warning');
            return;
        }

        const confirmacion = confirm(`¿Estás seguro de eliminar la provincia "${this.registroSeleccionado.nombre}"?`);
        if (!confirmacion) return;

        try {
            this.mostrarCargando(true);
            console.log('Eliminando provincia ID:', this.registroSeleccionado.codigo);
            
            await this.service.eliminar(this.registroSeleccionado.codigo);
            this.mostrarNotificacion('Provincia eliminada exitosamente', 'success');
            this.registroSeleccionado = null;
            await this.cargarDatos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion(error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    exportarExcel() {
        try {
            this.service.exportar();
            this.mostrarNotificacion('Iniciando descarga...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    limpiarFormulario() {
        document.getElementById('modalNombre').value = '';
    }

    abrirModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
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
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
            document.body.appendChild(container);
        }

        const notif = document.createElement('div');
        const colores = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        notif.className = `${colores[tipo]} text-white px-6 py-3 rounded-lg shadow-lg mb-2`;
        notif.textContent = mensaje;
        container.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 3000);
    }
}

// Instancia global
window.provinciaController = new ProvinciaController();

// Función global para compatibilidad con el iframe
window.cargarDatos = async function() {
    if (window.provinciaController && typeof window.provinciaController.cargarDatos === 'function') {
        await window.provinciaController.cargarDatos();
    } else {
        console.error('provinciaController.cargarDatos no está disponible');
    }
};
