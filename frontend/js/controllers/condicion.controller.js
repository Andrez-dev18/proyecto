class CondicionController {
    constructor() {
        this.service = new CondicionService();
        this.datos = [];
        this.config = window.CondicionConfig;
        this.dataTable = null;
    }

    async init() {
        console.log('Inicializando Condicion Controller');
        await this.cargarDatos();
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            
            console.log('Cargando condiciones...');
            this.datos = await this.service.getAll();
            console.log('Condiciones cargadas:', this.datos);
            
            this.renderizarTabla();
            this.mostrarNotificacion(`${this.datos.length} registros cargados`, 'success');
        } catch (error) {
            console.error('Error al cargar:', error);
            this.mostrarNotificacion('Error al cargar datos: ' + error.message, 'error');
            this.datos = [];
            this.renderizarTabla();
        } finally {
            this.mostrarCargando(false);
        }
    }

    renderizarTabla() {
        const tbody = document.getElementById('tableBody');
        const tableElement = document.querySelector('.min-w-full');
        
        if (!tbody || !tableElement) {
            console.error('No se encontró tbody o table');
            return;
        }

        if (this.dataTable) {
            try {
                this.dataTable.destroy();
                this.dataTable = null;
            } catch (e) {
                console.warn('Error al destruir DataTable:', e);
            }
        }

        tbody.innerHTML = '';
        
        if (!this.datos || this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        this.datos.forEach((registro) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-blue-50 transition-colors';
            tr.innerHTML = `
                <td class="px-2 py-2 text-sm text-center">${registro.codigo || '-'}</td>
                <td class="px-2 py-2 text-sm">${registro.nombre || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
        
        setTimeout(() => {
            try {
                this.dataTable = $(tableElement).DataTable({
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
                    responsive: true,
                    autoWidth: false,
                    order: [[0, 'asc']],
                    scrollX: true,
                    columnDefs: [
                        { width: '20%', targets: 0, className: 'text-center' },
                        { width: '80%', targets: 1 }
                    ]
                });
                console.log('DataTable inicializado');
            } catch (error) {
                console.error('Error al inicializar DataTable:', error);
            }
        }, 200);
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
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center gap-3`;
        notif.style.animation = 'slideInRight 0.3s ease';
        notif.innerHTML = `
            <i class="fas ${iconos[tipo]} text-xl"></i>
            <span>${mensaje}</span>
        `;
        container.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }
}

window.condicionController = new CondicionController();
