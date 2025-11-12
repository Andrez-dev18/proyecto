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

        document.getElementById('filterFechaInicio')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterFechaFin')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProvincia')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProveedor')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterTipo')?.addEventListener('change', () => this.aplicarFiltros());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            console.log('📊 Cargando datos...');
            this.datos = await this.service.getAll();
            console.log('✅ Datos cargados:', this.datos.length);
            this.renderizarTabla();
            this.mostrarNotificacion(`✅ ${this.datos.length} registros cargados`, 'success');
        } catch (error) {
            console.error('❌ Error:', error);
            this.mostrarNotificacion('❌ Error al cargar datos', 'error');
            this.datos = [];
            this.renderizarTabla();
        } finally {
            this.mostrarCargando(false);
        }
    }

    async aplicarFiltros() {
        try {
            this.mostrarCargando(true);
            console.log('🔍 === INICIANDO FILTRADO ===');

            const filtros = {};
            const fechaInicio = document.getElementById('filterFechaInicio').value;
            const fechaFin = document.getElementById('filterFechaFin').value;
            const provinciaId = document.getElementById('filterProvincia').value;
            const proveedorId = document.getElementById('filterProveedor').value;
            const tipoId = document.getElementById('filterTipo').value;

            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (provinciaId) filtros.provincia = parseInt(provinciaId);
            if (proveedorId) filtros.proveedor = parseInt(proveedorId);
            if (tipoId) filtros.tipo = parseInt(tipoId);

            console.log('📤 Filtros a aplicar:', filtros);
            
            if (!fechaInicio && !fechaFin && !provinciaId && !proveedorId && !tipoId) {
                console.log('📊 Sin filtros, cargando todos los datos');
                await this.cargarDatos();
                return;
            }
            
            const resultado = await this.service.getFiltered(filtros);
            
            if (Array.isArray(resultado)) {
                this.datos = resultado;
            } else if (resultado && Array.isArray(resultado.data)) {
                this.datos = resultado.data;
            } else {
                this.datos = [];
            }
            
            console.log(`✅ Filtrado completado: ${this.datos.length} registros`);
            
            this.renderizarTabla();
            this.mostrarNotificacion(`✅ Filtrados: ${this.datos.length} registros`, 'success');
            
        } catch (error) {
            console.error('❌ Error al filtrar:', error);
            this.mostrarNotificacion('❌ Error al filtrar: ' + error.message, 'error');
            await this.cargarDatos();
        } finally {
            this.mostrarCargando(false);
        }
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterProveedor').value = '';
        document.getElementById('filterTipo').value = '';
        this.cargarDatos();
    }

    renderizarTabla() {
        console.log('🔄 Renderizando tabla con', this.datos.length, 'registros');
        
        const tbody = document.getElementById('tableBody');
        if (!tbody) {
            console.error('❌ No se encontró tbody');
            return;
        }

        const table = $('.min-w-full');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        tbody.innerHTML = '';
        
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        this.datos.forEach((registro, i) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-orange-50 transition-colors';
            tr.innerHTML = `
                <td class="px-2 py-1 border-b text-sm text-center">${i + 1}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.fecha || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.provincia || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.proveedor || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.tipo || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.cantidad || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precio || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.observaciones || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center space-x-2">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');
            
            editBtn.onclick = () => {
                this.registroSeleccionado = this.datos[i];
                console.log('📝 Editando:', this.registroSeleccionado);
                this.modificarSeleccionado();
            };
            
            deleteBtn.onclick = async () => {
                this.registroSeleccionado = this.datos[i];
                console.log('🗑️ Eliminando:', this.registroSeleccionado);
                await this.eliminarSeleccionado();
            };
            
            tbody.appendChild(tr);
        });
        
        setTimeout(() => {
            try {
                $('.min-w-full').DataTable({
                    pageLength: 10,
                    language: {
                        url: this.config.UI.DATATABLES_LANGUAGE
                    },
                    responsive: true,
                    order: [[1, 'desc']]
                });
                console.log('✅ DataTable inicializado');
            } catch (error) {
                console.error('Error al inicializar DataTable:', error);
            }
        }, 100);
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
            this.mostrarNotificacion('✅ Registro eliminado', 'success');
            await this.cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('❌ Error al eliminar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        console.log('📝 Cargando en formulario:', r);
        
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
            console.log('💾 Guardando registro:', data);

            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
                console.log('📝 Actualizando registro ID:', data.id);
                await this.service.update(data);
                this.mostrarNotificacion('✅ Registro actualizado', 'success');
            } else {
                console.log('➕ Creando nuevo registro');
                await this.service.create(data);
                this.mostrarNotificacion('✅ Registro creado', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            this.mostrarNotificacion('❌ Error al guardar: ' + error.message, 'error');
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
        if (!data.provincia) {
            this.mostrarNotificacion('⚠️ La provincia es obligatoria', 'warning');
            return false;
        }
        if (!data.tipo) {
            this.mostrarNotificacion('⚠️ El tipo es obligatorio', 'warning');
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
        if (this.datos.length === 0) {
            this.mostrarNotificacion('⚠️ No hay datos para exportar', 'warning');
            return;
        }
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