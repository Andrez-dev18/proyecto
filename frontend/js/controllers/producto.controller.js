class ProductoController {
    constructor() {
        this.service = new ProductoService();
        this.dataTable = null;
        this.datos = [];
        this.productoSeleccionado = null;
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
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarProducto());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
        
        // Enter key en formulario
        document.getElementById('modalForm')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.guardarProducto();
            }
        });
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

        const columnas = ['ID', 'Código', 'Descripción', 'Línea', 'Sublínea', 'Opciones'];
        
        container.innerHTML = '';
        
        columnas.forEach((col, index) => {
            const label = document.createElement('label');
            label.className = 'column-toggle';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'column-checkbox';
            checkbox.dataset.column = index;
            checkbox.checked = true;
            
            // No permitir ocultar la columna de opciones
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
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">No hay productos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = this.datos.map((producto, index) => `
            <tr class="hover:bg-emerald-50 transition-colors">
                <td class="px-4 py-2 text-center text-sm font-medium">${producto.id}</td>
                <td class="px-4 py-2 text-sm">
                    ${producto.codigo ? `<span class="bg-gray-100 px-2 py-1 rounded text-xs font-mono">${producto.codigo}</span>` : '-'}
                </td>
                <td class="px-4 py-2 text-sm font-medium">${producto.descripcion || '-'}</td>
                <td class="px-4 py-2 text-sm">${producto.linea || '-'}</td>
                <td class="px-4 py-2 text-sm">${producto.sublinea || '-'}</td>
                <td class="px-4 py-2 text-center">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2 transition-colors" 
                            onclick="productoController.editarProducto(${index})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors" 
                            onclick="productoController.eliminarProducto(${producto.id})" title="Eliminar">
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
                order: [[2, 'asc']], // Ordenar por descripción
                columnDefs: [
                    { orderable: false, targets: 5 } // Desactivar orden en columna de opciones
                ],
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
        this.productoSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Producto';
        document.getElementById('productoId').value = '';
        document.getElementById('modalCodigo').value = '';
        document.getElementById('modalDescripcion').value = '';
        document.getElementById('modalLinea').value = '';
        document.getElementById('modalSublinea').value = '';
        
        // Focus en el primer campo
        setTimeout(() => {
            document.getElementById('modalCodigo').focus();
        }, 100);
        
        this.abrirModal();
    }

    editarProducto(index) {
        this.productoSeleccionado = this.datos[index];
        
        document.getElementById('modalTitle').textContent = 'Editar Producto';
        document.getElementById('productoId').value = this.productoSeleccionado.id;
        document.getElementById('modalCodigo').value = this.productoSeleccionado.codigo || '';
        document.getElementById('modalDescripcion').value = this.productoSeleccionado.descripcion || '';
        document.getElementById('modalLinea').value = this.productoSeleccionado.linea || '';
        document.getElementById('modalSublinea').value = this.productoSeleccionado.sublinea || '';
        
        // Focus en descripción
        setTimeout(() => {
            document.getElementById('modalDescripcion').focus();
        }, 100);
        
        this.abrirModal();
    }

    async guardarProducto() {
        const data = {
            id: document.getElementById('productoId').value,
            codigo: document.getElementById('modalCodigo').value.trim(),
            descripcion: document.getElementById('modalDescripcion').value.trim(),
            linea: document.getElementById('modalLinea').value.trim(),
            sublinea: document.getElementById('modalSublinea').value.trim()
        };

        // Validación
        if (!data.descripcion) {
            this.mostrarNotificacion(ProductoConfig.MENSAJES.VALIDACION.DESCRIPCION_REQUERIDA, 'warning');
            document.getElementById('modalDescripcion').focus();
            return;
        }

        try {
            this.mostrarCargando(true);

            if (data.id) {
                await this.service.actualizar(data);
                this.mostrarNotificacion(ProductoConfig.MENSAJES.EXITO.ACTUALIZADO, 'success');
            } else {
                delete data.id;
                await this.service.crear(data);
                this.mostrarNotificacion(ProductoConfig.MENSAJES.EXITO.GUARDADO, 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
        } catch (error) {
            // Manejo especial para descripción duplicada
            if (error.message.includes('ya existe')) {
                this.mostrarNotificacion(ProductoConfig.MENSAJES.ERROR.DESCRIPCION_DUPLICADA, 'error');
            } else {
                this.mostrarNotificacion(error.message, 'error');
            }
        } finally {
            this.mostrarCargando(false);
        }
    }

    async eliminarProducto(id) {
        if (!confirm(ProductoConfig.MENSAJES.CONFIRMACION.ELIMINAR)) return;

        try {
            this.mostrarCargando(true);
            await this.service.eliminar(id);
            this.mostrarNotificacion(ProductoConfig.MENSAJES.EXITO.ELIMINADO, 'success');
            await this.cargarDatos();
        } catch (error) {
            this.mostrarNotificacion(error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    abrirModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        
        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
    }

    exportarExcel() {
        this.service.exportarExcel();
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`[${tipo}] ${mensaje}`);

        // Crear o buscar contenedor de notificaciones
        let container = document.getElementById('notificaciones-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificaciones-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
            document.body.appendChild(container);
        }

        const notif = document.createElement('div');
        const colores = {
            success: 'bg-emerald-500',
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

        // Auto-eliminar después de 4 segundos
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }
}

// Instanciar controlador global
window.productoController = new ProductoController();
