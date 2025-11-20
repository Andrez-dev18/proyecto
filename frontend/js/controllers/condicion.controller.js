class CondicionController {
    constructor() {
        this.service = new CondicionService();
        this.datos = [];
        this.config = window.CondicionConfig;
        this.dataTable = null;
    }

    async init() {
        console.log('🚀 Inicializando Condicion Controller...');
        await this.cargarDatos();
        this.renderizarTablaCliente();
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            console.log('Cargando todos los datos...');
            
            this.datos = await this.service.getAll();
            
            console.log(`${this.datos.length} registros cargados`);
            
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos', 'error');
            this.datos = [];
        } finally {
            this.mostrarCargando(false);
        }
    }

    renderizarTablaCliente() {
        console.log('Renderizando tabla con', this.datos.length, 'registros...');
        
        const table = $('#dataTable');
        
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        $('#tableBody').empty();

        this.dataTable = table.DataTable({
            data: this.datos,
            processing: false,
            serverSide: false,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            columns: [
                { 
                    data: 'codigo', 
                    className: 'text-center text-sm px-2',
                    defaultContent: ''
                },
                { 
                    data: 'nombre', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                }
            ],
            order: [[0, 'desc']],
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
            initComplete: () => {
                console.log('✅ Tabla renderizada con', this.datos.length, 'registros');
                $('.dataTables_wrapper').addClass('w-full');
            }
        });
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

        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2`;
        notif.textContent = mensaje;
        container.appendChild(notif);

        setTimeout(() => notif.remove(), 4000);
    }
}

window.condicionController = new CondicionController();

