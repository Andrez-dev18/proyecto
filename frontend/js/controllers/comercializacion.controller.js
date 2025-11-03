class ComercializacionController {
    constructor() {
        this.service = new ComercializacionService();
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
            
            const [empresas, mercados, proveedores, provincias, condiciones, tipos] = await Promise.all([
                this.service.getEmpresas(),
                this.service.getMercados(),
                this.service.getProveedores(),
                this.service.getProvincias(),
                this.service.getCondiciones(),
                this.service.getTipos()
            ]);

            console.log('Catálogos cargados:', {
                empresas: empresas.length,
                mercados: mercados.length,
                proveedores: proveedores.length,
                provincias: provincias.length,
                condiciones: condiciones.length,
                tipos: tipos.length
            });

            this.catalogos = {
                empresas,
                mercados,
                proveedores,
                provincias,
                condiciones,
                tipos
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
        this.poblarSelect('filterTipo', this.catalogos.tipos, 'id', 'tipo');

        // Modal
        this.poblarSelect('modalEmpresa', this.catalogos.empresas, 'id', 'empresa');
        this.poblarSelect('modalMercado', this.catalogos.mercados, 'id', 'mercado');
        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'id', 'provincia');
        this.poblarSelect('modalProveedor', this.catalogos.proveedores, 'id', 'proveedor');
        this.poblarSelect('modalCondicion', this.catalogos.condiciones, 'id', 'condicion');
        this.poblarSelect('modalTipo', this.catalogos.tipos, 'id', 'tipo');
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
        // Botones tipo
        document.getElementById('btnVivoAqp')?.addEventListener('click', () => this.cargarDatos('vivo-aqp'));
        document.getElementById('btnVivoProvincia')?.addEventListener('click', () => this.cargarDatos('vivo-provincia'));

        // Botones acción
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnModificar')?.addEventListener('click', () => this.modificarSeleccionado());
        document.getElementById('btnEliminar')?.addEventListener('click', () => this.eliminarSeleccionado());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());

        // Filtros
        document.getElementById('filterFecha')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterMercado')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProvincia')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterProveedor')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterCondicion')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filterTipo')?.addEventListener('change', () => this.aplicarFiltros());

        // Modal
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    async cargarDatos(tipo) {
        try {
            this.tipoActual = tipo;
            this.tablaActual = tipo === 'vivo-aqp' ? 'com_db_vivo_aqp' : 'com_db_vivo_provincia';
            
            this.mostrarCargando(true);
            
            console.log(`Cargando datos de tipo: ${tipo}`);
            
            if (tipo === 'vivo-aqp') {
                this.datos = await this.service.getVivoAqp();
                this.mostrarFiltrosAqp();
            } else {
                this.datos = await this.service.getVivoProvincia();
                this.mostrarFiltrosProvincia();
            }

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

    mostrarFiltrosAqp() {
        document.getElementById('filterMercado').parentElement.style.display = 'block';
        document.getElementById('filterProvincia').parentElement.style.display = 'none';
        document.getElementById('filterCondicion').parentElement.style.display = 'block';
        document.getElementById('filterTipo').parentElement.style.display = 'none';
    }

    mostrarFiltrosProvincia() {
        document.getElementById('filterMercado').parentElement.style.display = 'none';
        document.getElementById('filterProvincia').parentElement.style.display = 'block';
        document.getElementById('filterCondicion').parentElement.style.display = 'none';
        document.getElementById('filterTipo').parentElement.style.display = 'block';
    }

    async aplicarFiltros() {
        if (!this.tipoActual) return;

        try {
            this.mostrarCargando(true);

            const filtros = {
                fecha: document.getElementById('filterFecha').value,
                proveedor: document.getElementById('filterProveedor').value
            };

            if (this.tipoActual === 'vivo-aqp') {
                filtros.mercado = document.getElementById('filterMercado').value;
                filtros.condicion = document.getElementById('filterCondicion').value;
                this.datos = await this.service.filtrarVivoAqp(filtros);
            } else {
                filtros.provincia = document.getElementById('filterProvincia').value;
                filtros.tipo = document.getElementById('filterTipo').value;
                this.datos = await this.service.filtrarVivoProvincia(filtros);
            }

            this.renderizarTabla();
            this.mostrarNotificacion(`Filtrados: ${this.datos.length} registros`, 'info');
        } catch (error) {
            this.mostrarNotificacion('Error al filtrar: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    limpiarFiltros() {
        document.getElementById('filterFecha').value = '';
        document.getElementById('filterMercado').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterProveedor').value = '';
        document.getElementById('filterCondicion').value = '';
        document.getElementById('filterTipo').value = '';
        
        if (this.tipoActual) {
            this.cargarDatos(this.tipoActual);
        }
    }

    renderizarTabla() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        if (this.datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="100%" class="text-center py-4">No hay registros</td></tr>';
            return;
        }

        tbody.innerHTML = this.datos.map(registro => {
            const nombreMercado = this.obtenerNombreCatalogo('mercados', registro.mercado);
            const nombreProvincia = this.obtenerNombreCatalogo('provincias', registro.provincia);
            const nombreProveedor = this.obtenerNombreCatalogo('proveedores', registro.proveedor);

            return `
                <tr class="cursor-pointer hover:bg-gray-50" onclick="comercializacionController.seleccionarRegistro(${registro.id})">
                    <td class="px-4 py-2">${registro.id}</td>
                    <td class="px-4 py-2">${registro.fecha}</td>
                    <td class="px-4 py-2">${nombreMercado || nombreProvincia || '-'}</td>
                    <td class="px-4 py-2">${nombreProveedor}</td>
                    <td class="px-4 py-2">${registro.precioMayMin} - ${registro.precioMayMax}</td>
                    <td class="px-4 py-2">${registro.precioPubMin} - ${registro.precioPubMax}</td>
                    <td class="px-4 py-2">${registro.cantidad}</td>
                </tr>
            `;
        }).join('');
    }

    obtenerNombreCatalogo(catalogo, id) {
        if (!id) return '-';
        const item = this.catalogos[catalogo]?.find(c => c.id == id);
        return item ? Object.values(item)[1] : id;
    }

    seleccionarRegistro(id) {
        this.registroSeleccionado = this.datos.find(d => d.id === id);
        
        // Resaltar fila
        document.querySelectorAll('#tableBody tr').forEach(tr => {
            tr.classList.remove('bg-blue-100');
        });
        event.currentTarget.classList.add('bg-blue-100');
    }

    mostrarModalNuevo() {
        if (!this.tipoActual) {
            this.mostrarNotificacion('Primero selecciona un tipo de datos', 'warning');
            return;
        }

        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro';
        this.limpiarFormulario();
        this.mostrarCamposSegunTipo();
        document.getElementById('modal').classList.remove('hidden');
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Modificar Registro';
        this.cargarDatosEnFormulario();
        this.mostrarCamposSegunTipo();
        document.getElementById('modal').classList.remove('hidden');
    }

    async eliminarSeleccionado() {
        if (!this.registroSeleccionado) {
            this.mostrarNotificacion('Selecciona un registro de la tabla', 'warning');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        try {
            await this.service.eliminar(this.tablaActual, this.registroSeleccionado.id);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            this.cargarDatos(this.tipoActual);
            this.registroSeleccionado = null;
        } catch (error) {
            this.mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
        }
    }

    mostrarCamposSegunTipo() {
        const esAqp = this.tipoActual === 'vivo-aqp';
        
        // Campos de Arequipa
        document.getElementById('campoEmpresa').style.display = esAqp ? 'block' : 'none';
        document.getElementById('campoMercado').style.display = esAqp ? 'block' : 'none';
        document.getElementById('campoCondicion').style.display = esAqp ? 'block' : 'none';
        document.getElementById('campoRucEmpr').style.display = esAqp ? 'block' : 'none';
        
        // Campos de Provincia
        document.getElementById('campoProvincia').style.display = esAqp ? 'none' : 'block';
        document.getElementById('campoTipo').style.display = esAqp ? 'none' : 'block';
        document.getElementById('campoPrecioMayorCar').style.display = esAqp ? 'none' : 'block';
        document.getElementById('campoPrecioMayorBra').style.display = esAqp ? 'none' : 'block';
        document.getElementById('campoPesoBrasa').style.display = esAqp ? 'none' : 'block';
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        
        document.getElementById('modalFecha').value = r.fecha;
        document.getElementById('modalEmpresa').value = r.empresa || '';
        document.getElementById('modalMercado').value = r.mercado || '';
        document.getElementById('modalProvincia').value = r.provincia || '';
        document.getElementById('modalRucEmpr').value = r.ruc_empr || '';
        document.getElementById('modalCondicion').value = r.condicion || '';
        document.getElementById('modalProveedor').value = r.proveedor || '';
        document.getElementById('modalRucProv').value = r.ruc_prov || '';
        document.getElementById('modalTipo').value = r.tipo || '';
        
        document.getElementById('modalPrecioMayMin').value = r.precioMayMin || '';
        document.getElementById('modalPrecioMayMax').value = r.precioMayMax || '';
        document.getElementById('modalPrecioPubMin').value = r.precioPubMin || '';
        document.getElementById('modalPrecioPubMax').value = r.precioPubMax || '';
        
        document.getElementById('modalPesoMachoMin').value = r.pesoMachoMin || '';
        document.getElementById('modalPesoMachoMax').value = r.pesoMachoMax || '';
        document.getElementById('modalPesoHembMin').value = r.pesoHembMin || '';
        document.getElementById('modalPesoHembMax').value = r.pesoHembMax || '';
        
        document.getElementById('modalColorMin').value = r.colorMin || '';
        document.getElementById('modalColorMax').value = r.colorMax || '';
        
        document.getElementById('modalPesoMachoPromMin').value = r.pesoMachoPromMin || '';
        document.getElementById('modalPesoMachoPromMax').value = r.pesoMachoPromMax || '';
        document.getElementById('modalPesoHembraPromMin').value = r.pesoHembraPromMin || '';
        document.getElementById('modalPesoHembraPromMax').value = r.pesoHembraPromMax || '';
        
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
            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
                await this.service.actualizar(this.tablaActual, data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                await this.service.crear(this.tablaActual, data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }

            this.cerrarModal();
            this.cargarDatos(this.tipoActual);
        } catch (error) {
            this.mostrarNotificacion('Error al guardar: ' + error.message, 'error');
        }
    }

    obtenerDatosFormulario() {
        const usuario = 'admin'; // Obtener del sistema de login
        const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const data = {
            fecha: document.getElementById('modalFecha').value,
            proveedor: parseInt(document.getElementById('modalProveedor').value) || null,
            ruc_prov: document.getElementById('modalRucProv').value || '',
            precioMayMin: parseFloat(document.getElementById('modalPrecioMayMin').value) || 0,
            precioMayMax: parseFloat(document.getElementById('modalPrecioMayMax').value) || 0,
            precioPubMin: parseFloat(document.getElementById('modalPrecioPubMin').value) || 0,
            precioPubMax: parseFloat(document.getElementById('modalPrecioPubMax').value) || 0,
            pesoMachoMin: parseFloat(document.getElementById('modalPesoMachoMin').value) || 0,
            pesoMachoMax: parseFloat(document.getElementById('modalPesoMachoMax').value) || 0,
            pesoHembMin: parseFloat(document.getElementById('modalPesoHembMin').value) || 0,
            pesoHembMax: parseFloat(document.getElementById('modalPesoHembMax').value) || 0,
            colorMin: parseFloat(document.getElementById('modalColorMin').value) || 0,
            colorMax: parseFloat(document.getElementById('modalColorMax').value) || 0,
            pesoMachoPromMin: parseFloat(document.getElementById('modalPesoMachoPromMin').value) || 0,
            pesoMachoPromMax: parseFloat(document.getElementById('modalPesoMachoPromMax').value) || 0,
            pesoHembraPromMin: parseFloat(document.getElementById('modalPesoHembraPromMin').value) || 0,
            pesoHembraPromMax: parseFloat(document.getElementById('modalPesoHembraPromMax').value) || 0,
            cantidad: parseFloat(document.getElementById('modalCantidad').value) || 0,
            usuarioRegistro: usuario,
            fechaHoraRegistro: ahora,
            usuarioTransferencia: 'sistema',
            fechaHoraTransferencia: ahora
        };

        if (this.tipoActual === 'vivo-aqp') {
            data.mercado = parseInt(document.getElementById('modalMercado').value) || null;
            data.empresa = parseInt(document.getElementById('modalEmpresa').value) || null;
            data.ruc_empr = document.getElementById('modalRucEmpr').value || '';
            data.condicion = parseInt(document.getElementById('modalCondicion').value) || null;
        } else {
            data.provincia = parseInt(document.getElementById('modalProvincia').value) || null;
            data.tipo = parseInt(document.getElementById('modalTipo').value) || null;
            data.precioMayCarMin = data.precioMayMin;
            data.precioMayCarMax = data.precioMayMax;
            data.precioMayBraMin = 0;
            data.precioMayBraMax = 0;
            data.pesoBrasaPromMin = 0;
            data.pesoBrasaPromMax = 0;
        }

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

    cerrarModal() {
        document.getElementById('modal').classList.add('hidden');
        this.registroSeleccionado = null;
    }

    exportarExcel() {
        if (this.datos.length === 0) {
            this.mostrarNotificacion('No hay datos para exportar', 'warning');
            return;
        }
        
        this.mostrarNotificacion('Función de exportar en desarrollo', 'info');
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
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
}

// Instancia global
const comercializacionController = new ComercializacionController();
