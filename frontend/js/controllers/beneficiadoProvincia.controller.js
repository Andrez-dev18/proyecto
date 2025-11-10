class BeneficioProvinciaController {
    constructor() {
        this.service = new BeneficioProvinciaService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.catalogos = {};
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
        await this.cargarDatos();
    }

    async cargarCatalogos() {
        try {
            console.log('Cargando catálogos...');

            const [proveedores, provincias] = await Promise.all([
                this.service.getProveedores(),
                this.service.getProvincias()
            ]);

            console.log('Catálogos cargados:', {
                proveedores: proveedores.length,
                provincias: provincias.length
            });

            this.catalogos = {
                proveedores,
                provincias
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
        this.poblarSelect('filterProvincia', this.catalogos.provincias, 'id', 'nombre');
        this.poblarSelect('filterProveedor', this.catalogos.proveedores, 'id', 'nombre');

        // Modal
        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'id', 'nombre');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'id', 'nombre');
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

        document.getElementById('filterFechaInicio')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterFechaFin')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProvincia')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProveedor')?.addEventListener('change', () => this.aplicarFiltros());

        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            console.log('Cargando datos...');

            this.datos = await this.service.getAll();
            console.log(`Datos cargados:`, this.datos);

            if (!Array.isArray(this.datos)) {
                throw new Error('La respuesta no es un array válido');
            }

            this.renderizarTabla();
            this.mostrarNotificacion(`✅ ${this.datos.length} registros cargados`, 'success');
        } catch (error) {
            console.error('Error detallado:', error);
            this.mostrarNotificacion('❌ ' + error.message, 'error');
            this.datos = [];
            this.renderizarTabla();
        } finally {
            this.mostrarCargando(false);
        }
    }

    async aplicarFiltros() {
        try {
            this.mostrarCargando(true);

            const filtros = {};
            const fechaInicio = document.getElementById('filterFechaInicio').value;
            const fechaFin = document.getElementById('filterFechaFin').value;
            const provincia = document.getElementById('filterProvincia').value;
            const proveedor = document.getElementById('filterProveedor').value;

            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (provincia) filtros.provincia = provincia;
            if (proveedor) filtros.proveedor = proveedor;

            console.log('Filtros:', filtros);
            const result = await this.service.filtrar(filtros);
            console.log('Respuesta del servidor:', result);
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
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterProveedor').value = '';
        this.cargarDatos();
    }

    renderizarTabla() {
        const table = $('.min-w-full');
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        tbody.innerHTML = '';
        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="15" class="text-center py-4 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        tbody.innerHTML = this.datos
            .map((registro, i) => `
            <tr class="hover:bg-blue-50 transition-colors">
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${i + 1}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700">${registro.fecha ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700">${registro.provincia ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700">${registro.proveedor ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.precioMayEntero ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.precioMayMejorado ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.precioMayCarcasa ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.precioPubMejorado ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.precioPubCarcasa ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.pesoPromMenor ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.pesoPromMayor ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.colorMin ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.colorMax ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-gray-700 text-center">${registro.cantidad ?? '-'}</td>
                <td class="px-2 py-1 border-b text-sm text-center space-x-2">
                    <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded edit-btn" data-index="${i}" title="Editar">
                        <i class="fas fa-edit"></i> 
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded delete-btn" data-index="${i}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `)
            .join('');

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

        if ($.fn.DataTable.isDataTable('.min-w-full')) {
            $('.min-w-full').DataTable().destroy();
        }
        $('.min-w-full').DataTable({
            pageLength: 10,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
            },
            responsive: true,
            order: [[1, 'desc']],
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
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Registro';
        this.cargarDatosEnFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    async eliminarSeleccionado() {
        console.log('=== ELIMINAR REGISTRO ===');
        console.log('Registro seleccionado:', this.registroSeleccionado);

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
            await this.cargarDatos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('❌ Error al eliminar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        console.log('Cargando datos en formulario:', r);

        document.getElementById('modalFecha').value = r.fecha;
        
        // Buscar el ID de provincia por nombre
        const provinciaItem = this.catalogos.provincias.find(p => p.nombre === r.provincia);
        document.getElementById('modalProvincia').value = provinciaItem ? provinciaItem.id : '';
        
        // Buscar el ID de proveedor por nombre
        const proveedorItem = this.catalogos.proveedores.find(p => p.nombre === r.proveedor);
        document.getElementById('modalProveedor').value = proveedorItem ? proveedorItem.id : '';
        
        document.getElementById('modalPrecioMayEntero').value = r.precioMayEntero || '';
        document.getElementById('modalPrecioMayMejorado').value = r.precioMayMejorado || '';
        document.getElementById('modalPrecioMayCarcasa').value = r.precioMayCarcasa || '';
        document.getElementById('modalPrecioPubMejorado').value = r.precioPubMejorado || '';
        document.getElementById('modalPrecioPubCarcasa').value = r.precioPubCarcasa || '';
        document.getElementById('modalPesoPromMenor').value = r.pesoPromMenor || '';
        document.getElementById('modalPesoPromMayor').value = r.pesoPromMayor || '';
        document.getElementById('modalColorMin').value = r.colorMin || '';
        document.getElementById('modalColorMax').value = r.colorMax || '';
        document.getElementById('modalCantidad').value = r.cantidad || '';
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
            await this.cargarDatos();
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('❌ Error al guardar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        const usuario = 'admin';
        const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const provinciaId = parseInt(document.getElementById('modalProvincia').value) || null;
        const proveedorId = parseInt(document.getElementById('modalProveedor').value) || null;

        const data = {
            fecha: document.getElementById('modalFecha').value,
            provincia: provinciaId,
            proveedor: proveedorId,
            precioMayEntero: parseFloat(document.getElementById('modalPrecioMayEntero').value) || 0,
            precioMayMejorado: parseFloat(document.getElementById('modalPrecioMayMejorado').value) || 0,
            precioMayCarcasa: parseFloat(document.getElementById('modalPrecioMayCarcasa').value) || 0,
            precioPubMejorado: parseFloat(document.getElementById('modalPrecioPubMejorado').value) || 0,
            precioPubCarcasa: parseFloat(document.getElementById('modalPrecioPubCarcasa').value) || 0,
            pesoPromMenor: parseFloat(document.getElementById('modalPesoPromMenor').value) || 0,
            pesoPromMayor: parseFloat(document.getElementById('modalPesoPromMayor').value) || 0,
            colorMin: parseFloat(document.getElementById('modalColorMin').value) || 0,
            colorMax: parseFloat(document.getElementById('modalColorMax').value) || 0,
            cantidad: parseFloat(document.getElementById('modalCantidad').value) || 0,
            usuarioRegistro: usuario,
            fechaHoraRegistro: ahora,
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: ahora
        };

        return data;
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }
        if (!data.provincia) {
            this.mostrarNotificacion('La provincia es obligatoria', 'warning');
            return false;
        }
        if (!data.proveedor) {
            this.mostrarNotificacion('El proveedor es obligatorio', 'warning');
            return false;
        }
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
        window.open(`${this.service.baseURL}/reporte/beneficioProvincia/exportar`, '_blank');
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

window.beneficioProvinciaController = new BeneficioProvinciaController();
