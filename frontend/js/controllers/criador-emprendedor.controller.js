class CriadorEmprendedorController {
    constructor() {
        this.service = new CriadorEmprendedorService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
        this.config = window.CriadorEmprendedorConfig;
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
        await this.cargarDatos();
    }

    async cargarCatalogos() {
        try {
            console.log('📦 Cargando catálogos...');
            const [provincias, proveedores, tipos] = await Promise.all([
                this.service.getProvincias(),
                this.service.getProveedores(),
                this.service.getTipos()
            ]);

            this.catalogos = { provincias, proveedores, tipos };
            console.log('✅ Catálogos cargados:', this.catalogos);
            this.poblarSelects();
        } catch (error) {
            console.error('❌ Error al cargar catálogos:', error);
        }
    }

    poblarSelects() {
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'codigo', 'nombre');
        this.poblarSelect('filterProveedor', this.catalogos.proveedores, 'codigo', 'nombre');
        this.poblarSelect('filterTipo', this.catalogos.tipos, 'codigo', 'nombre');

        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'codigo', 'nombre');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'codigo', 'nombre');
        this.poblarSelect('modalTipo', this.catalogos.tipos, 'codigo', 'nombre');
    }

    poblarSelect(selectId, datos, valueField, textField) {
        const select = document.getElementById(selectId);
        if (!select) return;

        const opciones = datos.map(item =>
            `<option value="${item[valueField]}">${item[textField]}</option>`
        ).join('');

        if (selectId.startsWith('filter')) {
            select.innerHTML = `<option value="">Todos</option>${opciones}`;
        } else {
            select.innerHTML = `<option value="">Seleccionar...</option>${opciones}`;
        }
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());

        // Filtro btn
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            this.renderizarTablaFiltro();
            this.mostrarNotificacion(`Datos cargados correctamente`, 'success');
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion(' Error al cargar datos', 'error');
            this.datos = [];
            this.renderizarTablaFiltro();
        } finally {
            this.mostrarCargando(false);
        }
    }

    async aplicarFiltros() {
        this.renderizarTablaFiltro();
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterProveedor').value = '';
        document.getElementById('filterTipo').value = '';
        this.cargarDatos();
    }

    renderizarTablaFiltro() {
        const table = $('.min-w-full');
        const thead = document.querySelector('thead tr');
        if (!thead) return;

        //  Destruir DataTable previo si ya existe
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        //  Definir las columnas de tu tabla (ajústalas según tu backend)
        const columnas = [
            'id', 'fecha', 'provincia', 'proveedor', 'tipo', 'cantidad', 'precio', 'observaciones'
        ];

        //  Agregar columna de opciones
        const columnasConOpciones = [...columnas, 'Opciones'];

        //  Renderizar cabeceras
        thead.innerHTML = columnasConOpciones
            .map(c => `<th class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-left">${c}</th>`)
            .join('');

        //  Inicializar DataTable con procesamiento del lado del servidor
        const dt = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.FILTRO}`,
                type: 'GET',
                data: function (d) {
                    const filtros = {};
                    const campos = [
                        'FechaInicio', 'FechaFin', 'Provincia', 'Proveedor', 'Tipo'
                    ];

                    // Obtener valores de filtros (si existen)
                    campos.forEach(campo => {
                        const el = document.getElementById(`filter${campo}`);
                        if (el && el.value.trim() !== '') {
                            const key = campo.charAt(0).toLowerCase() + campo.slice(1);
                            filtros[key] = el.value.trim();
                        }
                    });

                    // Combinar parámetros del DataTable con los filtros personalizados
                    return Object.assign(d, filtros);
                },
                dataSrc: json => json.data
            },
            columns: [
                { data: 'id', className: 'text-center' },
                { data: 'fecha', className: 'text-sm' },
                { data: 'provincia', className: 'text-sm' },
                { data: 'proveedor', className: 'text-sm' },
                { data: 'tipo', className: 'text-sm' },
                { data: 'cantidad', className: 'text-center text-sm' },
                { data: 'precio', className: 'text-center text-sm' },
                { data: 'observaciones', className: 'text-sm' },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    render: (data, type, row, meta) => `
                    <div class="space-x-2">
                        <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" data-index="${meta.row}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" data-index="${meta.row}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
                }
            ],
            order: [[1, 'desc']],
            responsive: true,
            pageLength: 10,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
            }
        });

        // Delegar eventos para botones (funcionan incluso tras recargar la tabla)
        $('.min-w-full tbody')
            .off('click')
            .on('click', '.edit-btn', (e) => {
                const rowData = dt.row($(e.currentTarget).closest('tr')).data();
                this.registroSeleccionado = rowData;
                console.log('📝 Editando:', rowData);
                this.modificarSeleccionado();
            })
            .on('click', '.delete-btn', async (e) => {
                const rowData = dt.row($(e.currentTarget).closest('tr')).data();
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
            this.mostrarNotificacion('Registro eliminado', 'success');
            await this.cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al eliminar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        console.log('Cargando en formulario:', r);

        document.getElementById('modalFecha').value = r.fecha || '';

        const provinciaObj = this.catalogos.provincias.find(p => p.nombre === r.provincia);
        const proveedorObj = this.catalogos.proveedores.find(p => p.nombre === r.proveedor);
        const tipoObj = this.catalogos.tipos.find(t => t.nombre === r.tipo);

        document.getElementById('modalProvincia').value = provinciaObj ? provinciaObj.codigo : '';
        document.getElementById('modalProveedor').value = proveedorObj ? proveedorObj.codigo : '';
        document.getElementById('modalTipo').value = tipoObj ? tipoObj.codigo : '';

        document.getElementById('modalCantidad').value = r.cantidad || '';
        document.getElementById('modalPrecio').value = r.precio || '';
        document.getElementById('modalObservaciones').value = r.observaciones || '';
    }

    limpiarFormulario() {
        document.querySelectorAll('#modalForm input, #modalForm select, #modalForm textarea').forEach(input => {
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
                this.mostrarNotificacion('Registro actualizado', 'success');
            } else {
                
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
        } catch (error) {
            console.error(' Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        const provinciaId = document.getElementById('modalProvincia').value;
        const proveedorId = document.getElementById('modalProveedor').value;
        const tipoId = document.getElementById('modalTipo').value;

        return {
            fecha: document.getElementById('modalFecha').value,
            provincia: parseInt(provinciaId) || null,
            proveedor: parseInt(proveedorId) || null,
            tipo: parseInt(tipoId) || null,
            cantidad: parseInt(document.getElementById('modalCantidad').value) || 0,
            precio: parseFloat(document.getElementById('modalPrecio').value) || 0,
            observaciones: document.getElementById('modalObservaciones').value || '',
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        console.log('🔍 Validando formulario:', data);

        if (!data.fecha) {
            this.mostrarNotificacion('⚠️ La fecha es obligatoria', 'warning');
            return false;
        }

        console.log('Validación exitosa');
        return true;
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    exportarExcel() {
        
        window.open(`${this.service.baseUrl}/reporte/criador/exportar`, '_blank');
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
        notif.innerHTML = `
            <span style="font-size: 20px;">${iconos[tipo]}</span>
            <span>${mensaje}</span>
        `;
        container.appendChild(notif);

        setTimeout(() => notif.remove(), 4000);
    }
}

window.criadorEmprendedorController = new CriadorEmprendedorController();