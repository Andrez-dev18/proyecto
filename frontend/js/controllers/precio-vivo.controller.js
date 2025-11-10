class PrecioVivoController {
    constructor() {
        this.service = new PrecioVivoService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
        this.config = window.PrecioVivoConfig;
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
        await this.cargarDatos();
    }

    async cargarCatalogos() {
        try {
            console.log('📦 Cargando catálogos...');
            const empresas = await this.service.getEmpresas();
            this.catalogos = { empresas };
            console.log('✅ Empresas cargadas:', empresas);
            this.poblarSelects();
        } catch (error) {
            console.error('❌ Error al cargar catálogos:', error);
        }
    }

    poblarSelects() {
        // CAMBIO CLAVE: Usar ID como value
        this.poblarSelect('filterEmpresa', this.catalogos.empresas, 'id', 'empresa');
        this.poblarSelect('modalEmpresa', this.catalogos.empresas, 'id', 'empresa');
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
        document.getElementById('filterEmpresa')?.addEventListener('change', () => this.aplicarFiltros());
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
            const empresaId = document.getElementById('filterEmpresa').value; // Ya es el ID

            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (empresaId) filtros.empresa = parseInt(empresaId); // Convertir a número

            console.log('📤 Filtros a aplicar:', filtros);
            
            // Si no hay filtros, cargar todos los datos
            if (!fechaInicio && !fechaFin && !empresaId) {
                console.log('📊 Sin filtros, cargando todos los datos');
                await this.cargarDatos();
                return;
            }
            
            // Aplicar filtros
            const resultado = await this.service.filtrar(filtros);
            
            // Procesar resultado
            if (Array.isArray(resultado)) {
                this.datos = resultado;
            } else if (resultado && Array.isArray(resultado.data)) {
                this.datos = resultado.data;
            } else {
                this.datos = [];
            }
            
            console.log(`✅ Filtrado completado: ${this.datos.length} registros`);
            
            // Renderizar la tabla
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
        document.getElementById('filterEmpresa').value = '';
        this.cargarDatos();
    }

    renderizarTabla() {
        console.log('🔄 Renderizando tabla con', this.datos.length, 'registros');
        
        const tbody = document.getElementById('tableBody');
        if (!tbody) {
            console.error('❌ No se encontró tbody');
            return;
        }

        // Destruir DataTable si existe
        const table = $('.min-w-full');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        // Limpiar tbody
        tbody.innerHTML = '';
        
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center py-8 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        // Crear filas
        this.datos.forEach((registro, i) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-blue-50 transition-colors';
            tr.innerHTML = `
                <td class="px-2 py-1 border-b text-sm text-center">${i + 1}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.fecha || '-'}</td>
                <td class="px-2 py-1 border-b text-sm">${registro.empresa || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioMinCentroAcopio || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioMaxCentroAcopio || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioMinMayoristaReparto || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioMaxMayoristaReparto || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioPubMin || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center">${registro.precioPubMax || '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center space-x-2">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            // Agregar eventos directamente
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
        
        // Re-inicializar DataTable después
        setTimeout(() => {
            try {
                $('.min-w-full').DataTable({
                    pageLength: 10,
                    language: {
                        url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
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
            await this.service.eliminar(this.registroSeleccionado.id);
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
        
        // Buscar el ID de la empresa por su nombre
        const empresaObj = this.catalogos.empresas.find(e => e.empresa === r.empresa);
        document.getElementById('modalEmpresa').value = empresaObj ? empresaObj.id : '';
        
        document.getElementById('modalPrecioMinCentroAcopio').value = r.precioMinCentroAcopio || '';
        document.getElementById('modalPrecioMaxCentroAcopio').value = r.precioMaxCentroAcopio || '';
        document.getElementById('modalPrecioMinMayoristaReparto').value = r.precioMinMayoristaReparto || '';
        document.getElementById('modalPrecioMaxMayoristaReparto').value = r.precioMaxMayoristaReparto || '';
        document.getElementById('modalPrecioPubMin').value = r.precioPubMin || '';
        document.getElementById('modalPrecioPubMax').value = r.precioPubMax || '';
        
        console.log('✅ Empresa ID cargado:', document.getElementById('modalEmpresa').value);
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
            console.log('💾 Guardando registro:', data);

            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
                console.log('📝 Actualizando registro ID:', data.id);
                await this.service.actualizar(data);
                this.mostrarNotificacion('✅ Registro actualizado', 'success');
            } else {
                console.log('➕ Creando nuevo registro');
                await this.service.crear(data);
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
        // Obtener directamente el ID del select
        const empresaId = document.getElementById('modalEmpresa').value;
        
        console.log('📤 Datos del formulario:');
        console.log('  - Empresa ID:', empresaId, 'Tipo:', typeof empresaId);
        
        return {
            fecha: document.getElementById('modalFecha').value,
            empresa: parseInt(empresaId) || null, // Convertir a entero
            precioMinCentroAcopio: parseFloat(document.getElementById('modalPrecioMinCentroAcopio').value) || 0,
            precioMaxCentroAcopio: parseFloat(document.getElementById('modalPrecioMaxCentroAcopio').value) || 0,
            precioMinMayoristaReparto: parseFloat(document.getElementById('modalPrecioMinMayoristaReparto').value) || 0,
            precioMaxMayoristaReparto: parseFloat(document.getElementById('modalPrecioMaxMayoristaReparto').value) || 0,
            precioPubMin: parseFloat(document.getElementById('modalPrecioPubMin').value) || 0,
            precioPubMax: parseFloat(document.getElementById('modalPrecioPubMax').value) || 0,
            usuarioRegistro: 'admin',
            fechaHoraRegistro: new Date().toISOString().slice(0, 19).replace('T', ' '),
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    }

    validarFormulario(data) {
        console.log('🔍 Validando formulario:', data);
        
        if (!data.fecha) {
            this.mostrarNotificacion('⚠️ La fecha es obligatoria', 'warning');
            return false;
        }
        if (!data.empresa) {
            this.mostrarNotificacion('⚠️ La empresa es obligatoria', 'warning');
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
        window.open(`${this.service.baseURL}/reporte/precioVivo/excel`, '_blank');
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

window.precioVivoController = new PrecioVivoController();
