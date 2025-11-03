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
            // Validar fecha
            const fecha = document.getElementById('filterFecha').value;
            if (!fecha) {
                this.mostrarNotificacion('⚠️ La fecha es obligatoria', 'warning');
                return;
            }

            this.mostrarCargando(true);

            const filtros = {
                fecha: fecha
            };

            if (this.tipoActual === 'vivo-aqp') {
                const mercado = document.getElementById('filterMercado').value;
                const proveedor = document.getElementById('filterProveedor').value;
                const condicion = document.getElementById('filterCondicion').value;

                if (mercado) filtros.mercado = mercado;
                if (proveedor) filtros.proveedor = proveedor;
                if (condicion) filtros.condicion = condicion;
                
                console.log('Filtros Arequipa:', filtros);
                const result = await this.service.filtrarVivoAqp(filtros);
                console.log('Respuesta del servidor:', result);
                this.datos = result.data || [];
            } else {
                const provincia = document.getElementById('filterProvincia').value;
                const proveedor = document.getElementById('filterProveedor').value;
                const tipo = document.getElementById('filterTipo').value;

                if (provincia) filtros.provincia = provincia;
                if (proveedor) filtros.proveedor = proveedor;
                if (tipo) filtros.tipo = tipo;
                
                console.log('Filtros Provincia:', filtros);
                const response = await this.service.filtrarVivoProvincia(filtros);
                this.datos = Array.isArray(response.data) ? response.data : [];
            }

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
            tbody.innerHTML = '<tr><td colspan="13" class="text-center py-4 text-gray-500">No hay registros para mostrar</td></tr>';
            return;
        }

        tbody.innerHTML = this.datos.map((registro, index) => {
            const nombreEmpresa = this.obtenerNombreCatalogo('empresas', registro.empresa);
            const nombreMercado = this.obtenerNombreCatalogo('mercados', registro.mercado);
            const nombreProvincia = registro.provincia || '-';
            const nombreProveedor = registro.proveedor || '-';
            const nombreCondicion = this.obtenerNombreCatalogo('condiciones', registro.condicion);
            const nombreTipo = registro.tipo || '-';

            // Determinar qué columnas mostrar según el tipo
            const ubicacion = this.tipoActual === 'vivo-aqp' 
                ? `${nombreMercado || '-'}` 
                : nombreProvincia;
            
            // Para provincias, usamos los campos específicos de precios
            const precioMayMin = this.tipoActual === 'vivo-aqp' ? registro.precioMayMin : registro.precioMayCarMin;
            const precioMayMax = this.tipoActual === 'vivo-aqp' ? registro.precioMayMax : registro.precioMayCarMax;
            
            const infoAdicional = this.tipoActual === 'vivo-aqp'
                ? `${nombreEmpresa || '-'} / ${nombreCondicion || '-'}`
                : nombreTipo;

                // fila principal y fila de detalles (inicialmente oculta)
                return `
                    <tr class="cursor-pointer hover:bg-blue-50 transition-colors" data-index="${index}" onclick="comercializacionController.seleccionarRegistro(event, ${registro.id})" onkeydown="if(event.key==='Enter') comercializacionController.toggleDetalle(event,this)">
                        <td class="px-2 py-2 border-b text-center">
                            <button type="button" class="text-blue-600 hover:text-blue-800" onclick="event.stopPropagation(); comercializacionController.toggleDetalle(event,this)">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            ${registro.id || '-'}
                        </td>
                        <td class="px-2 py-2 border-b text-left">${registro.fecha || '-'}</td>
                        <td class="px-2 py-2 border-b text-left font-medium text-blue-600">${ubicacion}</td>
                        <td class="px-2 py-2 border-b text-left">${nombreEmpresa || '-'}</td>
                        <td class="px-2 py-2 border-b text-left">${registro.ruc_empresa || '-'}</td>
                        <td class="px-2 py-2 border-b text-left">${nombreProveedor}</td>
                        <td class="px-2 py-2 border-b text-left text-sm text-gray-600">${infoAdicional}</td>
                        <td class="px-2 py-2 border-b text-center">
                            <span class="text-green-600 font-semibold">S/ ${precioMayMin || 0}</span> - 
                            <span class="text-green-600 font-semibold">S/ ${precioMayMax || 0}</span>
                        </td>
                        <td class="px-2 py-2 border-b text-center">
                            <span class="text-blue-600 font-semibold">S/ ${registro.precioPubMin || 0}</span> - 
                            <span class="text-blue-600 font-semibold">S/ ${registro.precioPubMax || 0}</span>
                        </td>
                        <td class="px-2 py-2 border-b text-center">${registro.pesoMachoMin || 0} - ${registro.pesoMachoMax || 0}</td>
                        <td class="px-2 py-2 border-b text-center">${registro.pesoMachoPromMin || 0} - ${registro.pesoMachoPromMax || 0}</td>
                        <td class="px-2 py-2 border-b text-center">${registro.colorMin || 0} - ${registro.colorMax || 0}</td>
                        <td class="px-2 py-2 border-b text-center font-bold text-gray-700">${registro.cantidad || 0}</td>
                    </tr>
                    <tr class="detail-row text-sm text-gray-600 bg-gray-50" style="display:none;" data-index-detail="${index}">
                        <td class="px-3 py-2 border-b" colspan="13">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div><strong>RUC Proveedor:</strong> ${registro.ruc_proveedor || '-'}</div>
                                ${this.tipoActual === 'vivo-aqp' ? `
                                    <div><strong>Peso Hembra (mín - máx):</strong> ${registro.pesoHembMin || 0} - ${registro.pesoHembMax || 0}</div>
                                    <div><strong>Peso Hembra Prom (mín - máx):</strong> ${registro.pesoHembraPromMin || 0} - ${registro.pesoHembraPromMax || 0}</div>
                                ` : `
                                    <div><strong>Precio Brasa (mín - máx):</strong> S/ ${registro.precioMayBraMin || 0} - S/ ${registro.precioMayBraMax || 0}</div>
                                    <div><strong>Peso Brasa Prom (mín - máx):</strong> ${registro.pesoBrasaPromMin || 0} - ${registro.pesoBrasaPromMax || 0}</div>
                                `}
                            </div>
                            <div class="mt-2 text-xs text-gray-500">
                                ${registro.usuarioRegistro ? `Registro: ${registro.usuarioRegistro} | ${registro.fechaHoraRegistro || '-'}` : ''}
                                ${registro.usuarioTransferencia ? ` | Transfer: ${registro.usuarioTransferencia} | ${registro.fechaHoraTransferencia}` : ''}
                            </div>
                        </td>
                    </tr>
                `;
        }).join('');
    }

        toggleDetalle(event, el) {
            // el puede ser el botón dentro de la fila; buscamos la fila principal y alternamos la siguiente fila de detalles
            const btn = el instanceof Element ? el : (event && event.currentTarget);
            const tr = btn.closest('tr');
            if (!tr) return;
            const next = tr.nextElementSibling;
            if (!next || !next.classList.contains('detail-row')) return;
            next.style.display = next.style.display === 'none' ? 'table-row' : 'none';
            // alternar icono
            const icon = tr.querySelector('i.fas');
            if (icon) icon.classList.toggle('fa-chevron-up');
        }

    obtenerNombreCatalogo(catalogo, id) {
        if (!id) return '-';
        const item = this.catalogos[catalogo]?.find(c => c.id == id);
        return item ? Object.values(item)[1] : id;
    }

    seleccionarRegistro(event, id) {
        // Permitir llamada sin evento (compatibilidad)
        if (typeof event !== 'object' || !event) {
            id = event;
            event = null;
        }

        this.registroSeleccionado = this.datos.find(d => d.id == id);
        console.log('Registro seleccionado:', this.registroSeleccionado);

        // Remover resaltado en todas las filas principales y detalle
        document.querySelectorAll('#tableBody tr').forEach(tr => {
            tr.classList.remove('bg-blue-100');
        });

        // Resaltar la fila principal y la de detalle asociada (si existe)
        if (event) {
            const tr = event.currentTarget || event.target.closest('tr');
            if (tr) {
                tr.classList.add('bg-blue-100');
                const det = tr.nextElementSibling;
                if (det && det.classList.contains('detail-row')) det.classList.add('bg-blue-100');
            }
        } else {
            // Si no hay evento, buscar por índice del registro
            const row = Array.from(document.querySelectorAll('#tableBody tr')).find(r => r.textContent.includes(String(id)));
            if (row) row.classList.add('bg-blue-100');
        }
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
        this.mostrarCamposSegunTipo();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
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
            
            await this.service.eliminar(this.tablaActual, this.registroSeleccionado.id);
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
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        console.log('Cargando datos en formulario:', r);
        
        document.getElementById('modalFecha').value = r.fecha;
        
        // Convertir nombres a IDs para los selects
        if (this.tipoActual === 'vivo-aqp') {
            // Buscar ID de empresa por nombre
            const empresaObj = this.catalogos.empresas.find(e => e.empresa === r.empresa);
            document.getElementById('modalEmpresa').value = empresaObj ? empresaObj.id : '';
            
            // Buscar ID de mercado por nombre
            const mercadoObj = this.catalogos.mercados.find(m => m.mercado === r.mercado);
            document.getElementById('modalMercado').value = mercadoObj ? mercadoObj.id : '';
            
            document.getElementById('modalRucEmpr').value = r.ruc_empr || '';
            
            // Buscar ID de condicion por nombre
            const condicionObj = this.catalogos.condiciones.find(c => c.condicion === r.condicion);
            document.getElementById('modalCondicion').value = condicionObj ? condicionObj.id : '';
        } else {
            // Buscar ID de provincia por nombre
            const provinciaObj = this.catalogos.provincias.find(p => p.provincia === r.provincia);
            document.getElementById('modalProvincia').value = provinciaObj ? provinciaObj.id : '';
            
            // Buscar ID de tipo por nombre
            const tipoObj = this.catalogos.tipos.find(t => t.tipo === r.tipo);
            document.getElementById('modalTipo').value = tipoObj ? tipoObj.id : '';
        }
        
        // Buscar ID de proveedor por nombre
        const proveedorObj = this.catalogos.proveedores.find(p => p.proveedor === r.proveedor);
        document.getElementById('modalProveedor').value = proveedorObj ? proveedorObj.id : '';
        
        document.getElementById('modalRucProv').value = r.ruc_prov || '';
        
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
            this.mostrarCargando(true);
            
            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
                console.log('Actualizando registro ID:', data.id);
                console.log('Datos a enviar:', data);
                
                const resultado = await this.service.actualizar(this.tablaActual, data);
                console.log('Resultado actualización:', resultado);
                
                this.mostrarNotificacion('✅ Registro actualizado exitosamente', 'success');
            } else {
                console.log('Creando nuevo registro');
                console.log('Datos a enviar:', data);
                
                const resultado = await this.service.crear(this.tablaActual, data);
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
        const usuario = 'admin'; // Obtener del sistema de login
        const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Obtener ID del proveedor (enviamos códigos/IDs al backend)
        const proveedorId = parseInt(document.getElementById('modalProveedor').value) || null;

        const data = {
            fecha: document.getElementById('modalFecha').value,
            // Enviar códigos (IDs) para relaciones en lugar de nombres
            proveedor: proveedorId,
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
            // Enviar IDs para mercado/empresa/condicion
            const mercadoId = parseInt(document.getElementById('modalMercado').value) || null;
            const empresaId = parseInt(document.getElementById('modalEmpresa').value) || null;
            const condicionId = parseInt(document.getElementById('modalCondicion').value) || null;

            data.mercado = mercadoId;
            data.empresa = empresaId;
            data.ruc_empr = document.getElementById('modalRucEmpr').value || '';
            data.condicion = condicionId;
        } else {
            // Enviar IDs para provincia/tipo
            const provinciaId = parseInt(document.getElementById('modalProvincia').value) || null;
            const tipoId = parseInt(document.getElementById('modalTipo').value) || null;

            data.provincia = provinciaId;
            data.tipo = tipoId;

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
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    exportarExcel() {
        if (!this.tipoActual) {
            this.mostrarNotificacion('Primero selecciona un tipo de datos', 'warning');
            return;
        }
        
        if (this.datos.length === 0) {
            this.mostrarNotificacion('No hay datos para exportar', 'warning');
            return;
        }
        
        try {
            this.service.exportarCSV(this.tablaActual);
            this.mostrarNotificacion('✅ Iniciando descarga de CSV...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar: ' + error.message, 'error');
        }
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
