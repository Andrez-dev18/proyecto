class ProductoSustitutoController {
    constructor() {
        this.service = new ProductoSustitutoService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.datosFiltrados = [];
        this.catalogos = { productos: [] };
        this.config = window.ProductoSustitutoConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('🚀 Inicializando ProductoSustituto Controller...');
        await this.cargarCatalogos();  // Cargar catálogos primero
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

    async cargarCatalogos() {
        try {
            console.log('Cargando tipos de productos desde API...');
            
            // Cargar tipos de productos desde el endpoint
            const tiposProducto = await this.service.getTiposProducto();
            
            this.catalogos.productos = tiposProducto.map(tipo => ({
                codigo: tipo.codigo,
                nombre: tipo.nombre
            }));
            
            console.log('Tipos de productos cargados:', this.catalogos.productos);
            this.poblarSelects();
            
        } catch (error) {
            console.error('❌ Error al cargar catálogos:', error);
            this.mostrarNotificacion('Error al cargar tipos de productos', 'error');
        }
    }

    poblarSelects() {
        const selectFilterProducto = document.getElementById('filterProducto');
        const selectModalProducto = document.getElementById('modalProducto');
        
        if (selectFilterProducto) {
            selectFilterProducto.innerHTML = '<option value="">Todos los productos</option>';
            this.catalogos.productos.forEach(producto => {
                selectFilterProducto.innerHTML += `
                    <option value="${producto.codigo}">${producto.nombre}</option>
                `;
            });
        }
        
        if (selectModalProducto) {
            selectModalProducto.innerHTML = '<option value="">Seleccionar...</option>';
            this.catalogos.productos.forEach(producto => {
                selectModalProducto.innerHTML += `
                    <option value="${producto.codigo}">${producto.nombre}</option>
                `;
            });
        }
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
    }

    aplicarFiltros() {
        console.log('Aplicando filtros localmente...');
        
        const fechaInicio = document.getElementById('filterFechaInicio')?.value;
        const fechaFin = document.getElementById('filterFechaFin')?.value;
        const productoSeleccionado = document.getElementById('filterProducto')?.value;

        this.datosFiltrados = this.datos.filter(registro => {
            let cumple = true;
            
            if (fechaInicio && registro.fecha) {
                cumple = cumple && registro.fecha >= fechaInicio;
            }
            
            if (fechaFin && registro.fecha) {
                cumple = cumple && registro.fecha <= fechaFin;
            }
            
            if (productoSeleccionado) {
                // Buscar el nombre del producto basado en el código
                const productoInfo = this.catalogos.productos.find(p => p.codigo == productoSeleccionado);
                if (productoInfo) {
                    cumple = cumple && registro.producto === productoInfo.nombre;
                }
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
        document.getElementById('filterProducto').value = '';
        
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
            destroy: false,
            scrollX: false,
            scrollCollapse: false,
            paging: true,
            columns: [
                { 
                    data: 'id', 
                    className: 'text-center text-xs px-2',
                    visible: true,
                    render: (data) => {
                        if (!data) return '';
                        return `<span class="text-xs" title="${data}">${data.substring(0, 8)}...</span>`;
                    }
                },
                { 
                    data: 'fecha', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
                },
                { 
                    data: 'producto', 
                    className: 'text-sm px-2',
                    defaultContent: '-'
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
                    data: 'precio', 
                    className: 'text-center text-sm px-2',
                    defaultContent: '0',
                    render: (data) => {
                        return data ? `S/. ${parseFloat(data).toFixed(2)}` : 'S/. 0.00';
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
            const producto = document.getElementById('filterProducto')?.value;
            
            if (fechaInicio || fechaFin || producto) {
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
        
        const selectProducto = document.getElementById('modalProducto');
        if (selectProducto && r.producto) {
            // Buscar el código del producto basado en el nombre
            const productoInfo = this.catalogos.productos.find(p => p.nombre === r.producto);
            if (productoInfo) {
                selectProducto.value = productoInfo.codigo;
            } else {
                // Si no se encuentra, intentar con el valor directo
                selectProducto.value = r.producto;
            }
        }

        document.getElementById('modalPeso').value = r.peso || '';
        document.getElementById('modalPrecio').value = r.precio || '';
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
            const producto = document.getElementById('filterProducto')?.value;
            
            if (fechaInicio || fechaFin || producto) {
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
            producto: document.getElementById('modalProducto').value || null,
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            precio: parseFloat(document.getElementById('modalPrecio').value) || 0,
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' '),
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        console.log('Validando formulario:', data);

        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }

        if (!data.producto) {
            this.mostrarNotificacion('El producto es obligatorio', 'warning');
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
        const url = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.EXCEL}`;
        console.log('📊 Exportando a Excel:', url);
        window.open(url, '_blank');
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

window.productoSustitutoController = new ProductoSustitutoController();
