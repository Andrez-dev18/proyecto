class TamanoMercadoController {
    constructor() {
        this.service = new TamanoMercadoService();
        this.tipoActual = null;
        this.tablaActual = null;
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
    }


    async cargarCatalogos() {
        try {
            console.log('Cargando catálogos...');

            const [empresas, mercados, proveedores, provincias, condiciones, tipos, tiposPollo, tiposPolloVivo] = await Promise.all([
                this.service.getEmpresas(),
                this.service.getMercados(),
                this.service.getProveedores(),
                this.service.getProvincias(),
                this.service.getCondiciones(),
                this.service.getTipos(),
                this.service.getTipoPollo(),
                this.service.getTipoPolloVivo()
            ]);

            console.log('Catálogos cargados:', {
                empresas: empresas.length,
                mercados: mercados.length,
                proveedores: proveedores.length,
                provincias: provincias.length,
                condiciones: condiciones.length,
                tipos: tipos.length,
                tiposPollo: tiposPollo.length,
                tiposPolloVivo: tiposPolloVivo.length,
            });

            this.catalogos = {
                empresas,
                mercados,
                proveedores,
                provincias,
                condiciones,
                tipos,
                tiposPollo,
                tiposPolloVivo
            };

            this.poblarSelects();
            console.log('✅ Catálogos poblados correctamente');
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            this.mostrarNotificacion('❌ Error al cargar catálogos: ' + error.message, 'error');
        }
    }

    poblarSelects() {
        // Filtros
        this.poblarSelect('filterMercado', this.catalogos.mercados, 'id', 'mercado');
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('filterProveedor', this.catalogos.proveedores, 'id', 'proveedor');
        this.poblarSelect('filterCondicion', this.catalogos.condiciones, 'id', 'condicion');
        this.poblarSelect('filterTipoPollo', this.catalogos.tiposPollo, 'id', 'tipoPollo');
        this.poblarSelect('filterTipoLinea', this.catalogos.tipos, 'id', 'tipo');
        this.poblarSelect('filterZona', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('filterEmpresa', this.catalogos.empresas, 'id', 'empresa');
        this.poblarSelect('filterProducto', this.catalogos.tiposPolloVivo, 'id', 'tipoPolloVivo');

        // Modal
        this.poblarSelect('modalEmpresa', this.catalogos.empresas, 'id', 'empresa');
        this.poblarSelect('modalMercado', this.catalogos.mercados, 'id', 'mercado');
        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('modalZona', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'id', 'proveedor');
        this.poblarSelect('modalCondicion', this.catalogos.condiciones, 'id', 'condicion');
        this.poblarSelect('modalTipo', this.catalogos.tipos, 'id', 'tipo');
        this.poblarSelect('modalTipoPollo', this.catalogos.tiposPollo, 'id', 'tipoPollo');
        this.poblarSelect('modalTipoPolloVivo', this.catalogos.tiposPolloVivo, 'id', 'tipoPolloVivo');
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

    mostrarModalNuevo() {

        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro';
        this.limpiarFormulario();
        //this.mostrarCamposSegunTipo();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
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

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    setupEventListeners() {
        // Botones acción
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnModificar')?.addEventListener('click', () => this.modificarSeleccionado());
        document.getElementById('btnEliminar')?.addEventListener('click', () => this.eliminarSeleccionado());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());

        // Filtros
        document.getElementById('filterFechaInicio')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterFechaFin')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterTipoPollo')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterTipoLinea')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProvincia')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterZona')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterEmpresa')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProveedor')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProducto')?.addEventListener('change', () => this.aplicarFiltros());
        // Modal
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
                console.log('Actualizando registro ID:', data.id);
                console.log('Datos a enviar:', data);

                const resultado = await this.service.actualizar(data);
                console.log('Resultado actualización:', resultado);

                this.mostrarNotificacion('✅ Registro actualizado exitosamente', 'success');
            } else {
                console.log('Creando nuevo registro');
                console.log('Datos a enviar:', data);

                const resultado = await this.service.crear(data);
                console.log('Resultado creación:', resultado);

                this.mostrarNotificacion('✅ Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos(this.tipoActual);
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('❌ Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        // Obtener IDs (enviamos códigos/IDs al backend)
        const tipoPolloId = parseInt(document.getElementById('modalTipoPollo').value) || null;
        const tipoLineaId = parseInt(document.getElementById('modalTipo').value) || null;
        const provinciaId = parseInt(document.getElementById('modalProvincia').value) || null;
        const zonaId = parseInt(document.getElementById('modalZona').value) || null;
        const empresaId = parseInt(document.getElementById('modalEmpresa').value) || null;
        const proveedorId = parseInt(document.getElementById('modalProveedor').value) || null;
        const productTipoPolloVivo = parseInt(document.getElementById('modalTipoPolloVivo').value) || null;

        const data = {
            fecha: document.getElementById('modalFecha').value,
            // Enviar códigos (IDs) para relaciones en lugar de nombres
            tipo: tipoPolloId,
            linea: tipoLineaId,
            provincia: provinciaId,
            zona: zonaId,
            empresa: empresaId,
            proveedor: proveedorId,
            producto: productTipoPolloVivo,
            cantidad: document.getElementById('modalCantidad').value || '',
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            prom: parseFloat(document.getElementById('modalPromedio').value) || 0,
            precio: parseFloat(document.getElementById('modalPrecio').value) || 0,
        };

        return data;
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }
        if (!data.proveedor) {
            this.mostrarNotificacion('El proveedor es obligatorio', 'warning');
            return false;
        }
        return true;
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);

            this.datos = await this.service.getAll();

            console.log(`Datos cargados:`, this.datos);

            // Verificar si los datos son un array
            if (!Array.isArray(this.datos)) {
                throw new Error('La respuesta no es un array válido');
            }
            this.renderizarTabla();
            this.mostrarNotificacion(`✅ ${this.datos.length} registros cargados`, 'success');
        } catch (error) {
            console.error('Error detallado:', error);
            this.mostrarNotificacion('❌ ' + error.message, 'error');
            this.datos = []; // Resetear datos en caso de error
            this.renderizarTabla(); // Mostrar tabla vacía
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    renderizarTabla() {
        const table = $('.min-w-full'); // referencia rápida
        const tbody = document.getElementById('tableBody');
        const thead = document.querySelector('thead tr');
        if (!tbody || !thead) return;

        // 🧹 Si la tabla ya tiene un DataTable activo, destruirlo antes de regenerar contenido
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        tbody.innerHTML = '';
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="30" class="text-center py-4 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        // Detectar columnas según tipo
        let columnas = [];
        columnas = [
            'id', 'fecha', 'tipo', 'linea', 'provincia', 'zona',
            'empresa', 'proveedor',
            'producto', 'cantidad', 'peso', 'prom',
            'precio', 'info_mercado', 'nom_db'
        ];
        // Agregar columna "Opciones"
        const columnasConOpciones = [...columnas, 'Opciones'];

        // Generar encabezado
        thead.innerHTML = columnasConOpciones
            .map(c => `<th class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-left">${c.replace(/([A-Z])/g, ' $1')}</th>`)
            .join('');

        // Generar filas con botones de acción
        tbody.innerHTML = this.datos
            .map((registro, i) => `
            <tr class="hover:bg-blue-50 transition-colors">
                ${columnas.map(col => `<td class="px-2 py-1 border-b text-sm text-gray-700">${registro[col] ?? '-'}</td>`).join('')}
                <td class="px-2 py-1 border-b text-sm text-center space-x-2">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" data-index="${i}">
                        <i class="fas fa-edit"></i> 
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" data-index="${i}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `)
            .join('');

        // Asignar eventos a los botones Editar y Eliminar
        tbody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.registroSeleccionado = this.datos[index];
                this.modificarSeleccionado();
            });
        });

        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.registroSeleccionado = this.datos[index];
                await this.eliminarSeleccionado();
            });
        });
        // 🟢 Inicializar DataTable (después de renderizar filas)
        if ($.fn.DataTable.isDataTable('.min-w-full')) {
            $('.min-w-full').DataTable().destroy(); // evitar duplicar instancias
        }
        $('.min-w-full').DataTable({
            pageLength: 10,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
            },
            responsive: true,
            order: [[0, 'desc']],
        });
    }

    exportarExcel() {

        if (this.datos.length === 0) {
            this.mostrarNotificacion('No hay datos para exportar', 'warning');
            return;
        }

        try {
            this.service.exportarCSV();
            this.mostrarNotificacion('✅ Iniciando descarga de CSV...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Registro';
        this.cargarDatosEnFormulario();
        // this.mostrarCamposSegunTipo();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        console.log('Cargando datos en formulario:', r);

        document.getElementById('modalFecha').value = r.fecha;
        // Convertir nombres a IDs para los select

        //buscar id de tipo pollo
        const tipoPolloObj = this.catalogos.tiposPollo.find(e => e.tipoPollo == r.tipo);
        document.getElementById('modalTipoPollo').value = tipoPolloObj ? tipoPolloObj.id : '';

        // Buscar ID de empresa por nombre
        const empresaObj = this.catalogos.empresas.find(e => e.empresa === r.empresa);
        document.getElementById('modalEmpresa').value = empresaObj ? empresaObj.id : '';

        // Buscar ID de provincia por nombre
        const provinciaObj = this.catalogos.provincias.find(p => p.provincia === r.provincia);
        document.getElementById('modalProvincia').value = provinciaObj ? provinciaObj.id : '';

        const zonaObj = this.catalogos.provincias.find(z => z.provincia === r.zona);
        document.getElementById('modalZona').value = zonaObj ? zonaObj.id : '';

        // Buscar ID de tipoLinea por nombre
        const tipoObj = this.catalogos.tipos.find(t => t.tipo === r.linea);
        document.getElementById('modalTipo').value = tipoObj ? tipoObj.id : '';

        // Buscar ID de proveedor por nombre
        const proveedorObj = this.catalogos.proveedores.find(p => p.proveedor === r.proveedor);
        document.getElementById('modalProveedor').value = proveedorObj ? proveedorObj.id : '';

        const TipoPolloVivoObj = this.catalogos.tiposPolloVivo.find(pv => pv.tipoPolloVivo === r.producto);
        document.getElementById('modalTipoPolloVivo').value = TipoPolloVivoObj ? TipoPolloVivoObj.id : '';

        document.getElementById('modalCantidad').value = r.cantidad || '';
        document.getElementById('modalPeso').value = r.peso || '';
        document.getElementById('modalPromedio').value = r.prom || '';
        document.getElementById('modalPrecio').value = r.precio || '';
    }

    async eliminarSeleccionado() {
        console.log('=== ELIMINAR REGISTRO ===');
        console.log('Registro seleccionado:', this.registroSeleccionado);
        console.log('Tabla actual:', this.tablaActual);

        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('⚠️ Selecciona un registro de la tabla', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        try {
            this.mostrarCargando(true);
            console.log('Eliminando ID:', this.registroSeleccionado.id);

            await this.service.eliminar(this.registroSeleccionado.id);
            this.mostrarNotificacion('✅ Registro eliminado exitosamente', 'success');
            this.registroSeleccionado = null;
            await this.cargarDatos(this.tipoActual);
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('❌ Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`[${tipo}] ${mensaje}`);

        // Crear contenedor si no existe
        let container = document.getElementById('notificaciones-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificaciones-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
            document.body.appendChild(container);
        }

        // Crear notificación
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

        // Auto-eliminar después de 4 segundos
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
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

    async aplicarFiltros() {
        try {
            this.mostrarCargando(true);

            const filtros = {};
            const fechaInicio = document.getElementById('filterFechaInicio').value;
            const fechaFin = document.getElementById('filterFechaFin').value;

            // Solo agregar si tiene valor
            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;

            const tipoPollo = document.getElementById('filterTipoPollo').value;
            const tipoLinea = document.getElementById('filterTipoLinea').value;
            const provincia = document.getElementById('filterProvincia').value;
            const zona = document.getElementById('filterZona').value;
            const empresa = document.getElementById('filterEmpresa').value;
            const proveedor = document.getElementById('filterProveedor').value;
            const producto = document.getElementById('filterProducto').value;

            if (tipoPollo) filtros.tipo = tipoPollo;
            if (tipoLinea) filtros.linea = tipoLinea;
            if(provincia) filtros.provincia = provincia;
            if (zona) filtros.zona = zona;
            if (empresa) filtros.empresa = empresa;
            if (proveedor) filtros.proveedor = proveedor;
            if (producto) filtros.producto = producto;
     
            const result = await this.service.filtrar(filtros);      
            this.datos = result.data || [];
            this.renderizarTabla();
            this.mostrarNotificacion(`✅ Filtrados: ${this.datos.length} registros`, 'success');
        } catch (error) {
            console.error('Error completo:', error);
            this.mostrarNotificacion('❌ ' + error.message, 'error');
            this.datos = [];
            this.renderizarTabla();
        } finally {
            this.mostrarCargando(false);
        }
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        document.getElementById('filterTipoPollo').value = '';
        document.getElementById('filterTipoLinea').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterZona').value = '';
        document.getElementById('filterEmpresa').value = '';
        document.getElementById('filterProveedor').value = '';
        document.getElementById('filterProducto').value = '';

        this.cargarDatos(this.tipoActual);
        
    }

}

window.tamanoMercadoController = new TamanoMercadoController();