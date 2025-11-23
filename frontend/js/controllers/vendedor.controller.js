class VendedorController {
    constructor() {
        this.service = new VendedorService();
        this.dataTable = null;
        this.datos = [];
        this.vendedorSeleccionado = null;
        this.columnasVisibles = {};
    }

    async init() {
        this.setupEventListeners();
        this.setupColumnToggle();
        await this.cargarDatos();
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarVendedor());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    setupColumnToggle() {
        const btnToggle = document.getElementById('btnToggleColumns');
        const dropdown = document.getElementById('columnDropdown');
        const btnClose = document.getElementById('btnCloseDropdown');

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

        this.generarCheckboxesColumnas();
    }

    generarCheckboxesColumnas() {
        const container = document.getElementById('columnCheckboxContainer');
        if (!container) return;

        const columnas = ['ID', 'Vendedor', 'Canal', 'Zona', 'Opciones'];
        
        container.innerHTML = '';
        
        columnas.forEach((col, index) => {
            const label = document.createElement('label');
            label.className = 'column-toggle';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'column-checkbox';
            checkbox.dataset.column = index;
            checkbox.checked = true;
            
            if (index === columnas.length - 1) {
                checkbox.disabled = true;
            }
            
            this.columnasVisibles[index] = true;
            
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const columnIndex = parseInt(e.target.dataset.column);
                this.columnasVisibles[columnIndex] = e.target.checked;
                
                if (this.dataTable) {
                    const column = this.dataTable.column(columnIndex);
                    column.visible(e.target.checked);
                }
            });
            
            const span = document.createElement('span');
            span.textContent = col;
            
            label.appendChild(checkbox);
            label.appendChild(span);
            container.appendChild(label);
        });
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            
            this.datos = await this.service.getAll();
            console.log('Datos cargados:', this.datos);
            this.renderizarTabla();
            
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    renderizarTabla() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        const table = $('.min-w-full');
        
        // Destruir DataTable si existe
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        // Renderizar datos
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No hay vendedores registrados</td></tr>';
            return;
        }

        tbody.innerHTML = this.datos.map((vendedor, index) => `
            <tr class="hover:bg-blue-50 transition-colors">
                <td class="px-4 py-2 text-center text-sm">${vendedor.id}</td>
                <td class="px-4 py-2 text-sm">${vendedor.vendedor || '-'}</td>
                <td class="px-4 py-2 text-sm">${vendedor.canal || '-'}</td>
                <td class="px-4 py-2 text-sm">${vendedor.zona || '-'}</td>
                <td class="px-4 py-2 text-center">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-2" 
                            onclick="vendedorController.editarVendedor(${index})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" 
                            onclick="vendedorController.eliminarVendedor(${vendedor.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Inicializar DataTable
        setTimeout(() => {
            this.dataTable = table.DataTable({
                pageLength: 10,
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
                },
                responsive: true,
                order: [[0, 'asc']],
                dom: '<"top"lf>rt<"bottom"ip><"clear">',
                drawCallback: () => {
                    // Aplicar visibilidad de columnas
                    Object.keys(this.columnasVisibles).forEach(columnIndex => {
                        const column = this.dataTable.column(parseInt(columnIndex));
                        column.visible(this.columnasVisibles[columnIndex]);
                    });
                }
            });
        }, 100);
    }

    mostrarModalNuevo() {
        this.vendedorSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Vendedor';
        document.getElementById('vendedorId').value = '';
        document.getElementById('modalVendedor').value = '';
        document.getElementById('modalCanal').value = '';
        document.getElementById('modalZona').value = '';
        this.abrirModal();
    }

    editarVendedor(index) {
        this.vendedorSeleccionado = this.datos[index];
        
        document.getElementById('modalTitle').textContent = 'Editar Vendedor';
        document.getElementById('vendedorId').value = this.vendedorSeleccionado.id;
        document.getElementById('modalVendedor').value = this.vendedorSeleccionado.vendedor || '';
        document.getElementById('modalCanal').value = this.vendedorSeleccionado.canal || '';
        document.getElementById('modalZona').value = this.vendedorSeleccionado.zona || '';
        
        this.abrirModal();
    }

    async guardarVendedor() {
        const data = {
            vendedor: document.getElementById('modalVendedor').value.trim(),
            canal: document.getElementById('modalCanal').value.trim(),
            zona: document.getElementById('modalZona').value.trim()
        };

        // Validación
        if (!data.vendedor || !data.canal || !data.zona) {
            this.mostrarNotificacion('Por favor complete todos los campos', 'warning');
            return;
        }

        try {
            this.mostrarCargando(true);

            const vendedorId = document.getElementById('vendedorId').value;
            
            if (vendedorId) {
                // Actualizar
                data.id = vendedorId;
                console.log('Actualizando vendedor:', data);
                await this.service.actualizar(data);
                this.mostrarNotificacion('Vendedor actualizado exitosamente', 'success');
            } else {
                // Crear nuevo
                console.log('Creando nuevo vendedor:', data);
                await this.service.crear(data);
                this.mostrarNotificacion('Vendedor creado exitosamente', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    async eliminarVendedor(id) {
        if (!confirm('¿Está seguro de eliminar este vendedor?\n\nEsta acción no se puede deshacer.')) return;

        try {
            this.mostrarCargando(true);
            await this.service.eliminar(id);
            this.mostrarNotificacion('Vendedor eliminado exitosamente', 'success');
            await this.cargarDatos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    abrirModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }

    exportarExcel() {
        window.open(`${this.service.baseURL}/vendedor/exportar`, '_blank');
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

window.vendedorController = new VendedorController();
