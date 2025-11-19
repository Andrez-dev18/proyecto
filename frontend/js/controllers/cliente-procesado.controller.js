class ClienteProcesadoController {
    constructor() {
        this.service = new ClienteProcesadoService();
        this.dataTable = null;
        this.registroSeleccionado = null;
        this.columnasVisibles = {};
    }

    async init() {
        console.log('Inicializando ClienteProcesadoController...');
        this.setupEventListeners();
        this.setupColumnToggle();
        await this.cargarDatosInicial();
    }

    async cargarDatosInicial() {
        try {
            this.mostrarCargando(true);
            
            // Primero intentar cargar datos directos
            const datos = await this.service.getAll();
            console.log('Datos iniciales cargados:', datos.length, 'registros');
            
            // Luego inicializar DataTable con servidor
            this.inicializarDataTable();
            
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            this.mostrarNotificacion('Error al cargar datos: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    inicializarDataTable() {
        const table = $('#tablaClientes');
        
        // Si ya existe, destruir
        if (this.dataTable) {
            this.dataTable.destroy();
        }

        // Configurar DataTable
        this.dataTable = table.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${this.service.baseURL}${this.service.endpoints.FILTRO}`,
                type: 'GET',
                data: (d) => {
                    // Agregar filtros personalizados
                    const fechaInicio = document.getElementById('filterFechaInicio')?.value;
                    const fechaFin = document.getElementById('filterFechaFin')?.value;
                    
                    if (fechaInicio) d.fechaInicio = fechaInicio;
                    if (fechaFin) d.fechaFin = fechaFin;
                    
                    console.log('Parámetros enviados:', d);
                    return d;
                },
                dataSrc: function(json) {
                    console.log('Respuesta del servidor:', json);
                    return json.data || [];
                },
                error: function(xhr, error, thrown) {
                    console.error('Error en DataTables:', error, thrown);
                    console.error('Response:', xhr.responseText);
                }
            },
            columns: [
                { data: 'id', title: 'ID' },
                { data: 'fecha', title: 'Fecha' },
                { data: 'distrito', title: 'Distrito' },
                { data: 'zona', title: 'Zona' },
                { data: 'canal', title: 'Canal' },
                { data: 'codigo', title: 'Código' },
                { data: 'linea', title: 'Línea' },
                { data: 'sublinea', title: 'Sublínea' },
                { data: 'vendedor', title: 'Vendedor' },
                { data: 'cliente', title: 'Cliente' },
                { data: 'descripcion', title: 'Descripción' },
                { data: 'ruta', title: 'Ruta' },
                { data: 'nomruta', title: 'Nom. Ruta' },
                { 
                    data: 'unidad', 
                    title: 'Unidad',
                    render: function(data) {
                        return parseFloat(data).toFixed(2);
                    }
                },
                { 
                    data: 'peso', 
                    title: 'Peso',
                    render: function(data) {
                        return parseFloat(data).toFixed(2);
                    }
                },
                { 
                    data: 'importe', 
                    title: 'Importe',
                    render: function(data) {
                        return parseFloat(data).toFixed(2);
                    }
                },
                { data: 'nom_db', title: 'BD' },
                {
                    data: null,
                    title: 'Acciones',
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row) {
                        return `
                            <div class="flex gap-2 justify-center">
                                <button onclick="clienteProcesadoController.editarRegistro(${row.id})" 
                                        class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="clienteProcesadoController.eliminarRegistro(${row.id})" 
                                        class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            order: [[1, 'desc']],
            pageLength: 10,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
            },
            drawCallback: () => {
                this.aplicarVisibilidadColumnas();
            }
        });
    }

    setupEventListeners() {
        // Botones principales
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportar());
        document.getElementById('btnETL')?.addEventListener('click', () => this.abrirModalETL());
        
        // Filtros
        document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => this.aplicarFiltros());
        document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        
        // Modal
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
        
        // ETL
        document.getElementById('cancelarETL')?.addEventListener('click', () => this.cerrarModalETL());
        document.getElementById('confirmarETL')?.addEventListener('click', () => this.ejecutarETL());
    }

    setupColumnToggle() {
        const btnToggle = document.getElementById('btnToggleColumns');
        const dropdown = document.getElementById('columnDropdown');
        const btnClose = document.getElementById('btnCloseDropdown');
        const checkboxes = document.querySelectorAll('.column-checkbox');

        // Inicializar visibilidad
        checkboxes.forEach(checkbox => {
            const columnIndex = parseInt(checkbox.dataset.column);
            this.columnasVisibles[columnIndex] = checkbox.checked;
            
            checkbox.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.column);
                this.columnasVisibles[index] = e.target.checked;
                
                if (this.dataTable) {
                    this.dataTable.column(index).visible(e.target.checked);
                }
            });
        });

        btnToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        btnClose?.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-columns')) {
                dropdown?.classList.remove('show');
            }
        });
    }

    aplicarVisibilidadColumnas() {
        Object.keys(this.columnasVisibles).forEach(index => {
            if (this.dataTable) {
                this.dataTable.column(parseInt(index)).visible(this.columnasVisibles[index]);
            }
        });
    }

    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Registro';
        this.limpiarFormulario();
        this.mostrarModal();
    }

    async editarRegistro(id) {
        try {
            // Obtener el registro de la tabla
            const data = this.dataTable.rows().data();
            let registro = null;
            
            data.each(function(row) {
                if (row.id == id) {
                    registro = row;
                    return false;
                }
            });
            
            if (registro) {
                this.registroSeleccionado = registro;
                document.getElementById('modalTitle').textContent = 'Editar Registro';
                this.cargarDatosEnFormulario(registro);
                this.mostrarModal();
            }
        } catch (error) {
            console.error('Error al editar:', error);
            this.mostrarNotificacion('Error al cargar registro', 'error');
        }
    }

    async eliminarRegistro(id) {
        if (!confirm('¿Está seguro de eliminar este registro?')) return;
        
        try {
            this.mostrarCargando(true);
            await this.service.eliminar(id);
            this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
            this.dataTable.ajax.reload();
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.mostrarNotificacion('Error al eliminar registro', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();
        
        if (!this.validarFormulario(data)) return;
        
        try {
            this.mostrarCargando(true);
            
            if (this.registroSeleccionado) {
                data.id = this.registroSeleccionado.id;
                await this.service.actualizar(data);
                this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
            } else {
                await this.service.crear(data);
                this.mostrarNotificacion('Registro creado exitosamente', 'success');
            }
            
            this.cerrarModal();
            this.dataTable.ajax.reload();
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarNotificacion('Error al guardar registro: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        return {
            fecha: document.getElementById('modalFecha').value,
            distrito: document.getElementById('modalDistrito').value || '',
            zona: document.getElementById('modalZona').value || '',
            canal: document.getElementById('modalCanal').value || '',
            codigo: document.getElementById('modalCodigo').value || '',
            linea: document.getElementById('modalLinea').value || '',
            sublinea: document.getElementById('modalSublinea').value || '',
            vendedor: document.getElementById('modalVendedor').value || '',
            cliente: document.getElementById('modalCliente').value || '',
            descripcion: document.getElementById('modalDescripcion').value || '',
            ruta: document.getElementById('modalRuta').value || '',
            nomruta: document.getElementById('modalNomruta').value || '',
            unidad: parseFloat(document.getElementById('modalUnidad').value) || 0,
            peso: parseFloat(document.getElementById('modalPeso').value) || 0,
            importe: parseFloat(document.getElementById('modalImporte').value) || 0,
            nom_db: 'grs',
            usuarioRegistro: 'sistema',
            fechaHoraRegistro: new Date().toISOString()
        };
    }

    cargarDatosEnFormulario(registro) {
        document.getElementById('modalFecha').value = registro.fecha || '';
        document.getElementById('modalDistrito').value = registro.distrito || '';
        document.getElementById('modalZona').value = registro.zona || '';
        document.getElementById('modalCanal').value = registro.canal || '';
        document.getElementById('modalCodigo').value = registro.codigo || '';
        document.getElementById('modalLinea').value = registro.linea || '';
        document.getElementById('modalSublinea').value = registro.sublinea || '';
        document.getElementById('modalVendedor').value = registro.vendedor || '';
        document.getElementById('modalCliente').value = registro.cliente || '';
        document.getElementById('modalDescripcion').value = registro.descripcion || '';
        document.getElementById('modalRuta').value = registro.ruta || '';
        document.getElementById('modalNomruta').value = registro.nomruta || '';
        document.getElementById('modalUnidad').value = registro.unidad || '';
        document.getElementById('modalPeso').value = registro.peso || '';
        document.getElementById('modalImporte').value = registro.importe || '';
    }

    validarFormulario(data) {
        if (!data.fecha) {
            this.mostrarNotificacion('La fecha es obligatoria', 'warning');
            return false;
        }
        return true;
    }

    limpiarFormulario() {
        document.getElementById('modalForm').reset();
        document.getElementById('modalFecha').value = new Date().toISOString().split('T')[0];
    }

    aplicarFiltros() {
        if (this.dataTable) {
            this.dataTable.ajax.reload();
        }
    }

    limpiarFiltros() {
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';
        this.aplicarFiltros();
    }

    async exportar() {
        try {
            this.service.exportar();
            this.mostrarNotificacion('Descargando archivo Excel...', 'success');
        } catch (error) {
            this.mostrarNotificacion('Error al exportar', 'error');
        }
    }

    async ejecutarETL() {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        
        if (!fechaInicio || !fechaFin) {
            this.mostrarNotificacion('Debe ingresar ambas fechas', 'warning');
            return;
        }
        
        // Validar que fecha inicio no sea mayor que fecha fin
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            this.mostrarNotificacion('La fecha inicio no puede ser mayor que la fecha fin', 'warning');
            return;
        }
        
        try {
            this.mostrarCargando(true);
            console.log('Ejecutando ETL con fechas:', { fechaInicio, fechaFin });
            
            const resultado = await this.service.ejecutarETL({ 
                fechaInicio: fechaInicio, 
                fechaFin: fechaFin 
            });
            
            console.log('Resultado ETL:', resultado);
            
            if (resultado && resultado.success) {
                // Mostrar detalles del ETL
                const eliminados = resultado.resumen?.eliminados || 0;
                const insertados = resultado.resumen?.insertados || 0;
                const total = resultado.resumen?.total || 0;
                
                this.mostrarAlertaETLExitoso(eliminados, insertados, total);
                this.cerrarModalETL();
                
                // Recargar la tabla
                if (this.dataTable) {
                    this.dataTable.ajax.reload();
                }
            } else {
                // Mostrar error detallado
                const mensajeError = resultado?.mensaje || resultado?.error || 'Error desconocido en ETL';
                this.mostrarNotificacion(`Error en ETL: ${mensajeError}`, 'error');
                console.error('Error en ETL:', resultado);
            }
        } catch (error) {
            console.error('Error al ejecutar ETL:', error);
            this.mostrarNotificacion(`Error al ejecutar ETL: ${error.message}`, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    mostrarAlertaETLExitoso(eliminados, insertados, total) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        // Crear modal de éxito
        const modal = document.createElement('div');
        modal.style.cssText = `
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 450px;
            animation: slideDown 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="margin-bottom: 20px;">
                <i class="fas fa-check-circle" style="font-size: 60px; color: #10b981;"></i>
            </div>
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 24px; font-weight: bold;">
                ETL Completado Exitosamente
            </h3>
            <div style="margin-bottom: 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                <p style="margin: 10px 0;">
                    <strong>Registros eliminados:</strong> ${eliminados.toLocaleString()}
                </p>
                <p style="margin: 10px 0;">
                    <strong>Registros insertados:</strong> ${insertados.toLocaleString()}
                </p>
                <p style="margin: 10px 0; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                    <strong>Total procesados:</strong> ${total.toLocaleString()}
                </p>
            </div>
            <button id="btnCerrarAlertaETL" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Aceptar
            </button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Agregar animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        // Cerrar al hacer clic en el botón
        document.getElementById('btnCerrarAlertaETL').addEventListener('click', () => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        });
    }

    mostrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    cerrarModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        this.registroSeleccionado = null;
    }

    abrirModalETL() {
        document.getElementById('modalETL').classList.remove('hidden');
        // Establecer fechas por defecto
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        
        document.getElementById('fechaInicio').value = ayer.toISOString().split('T')[0];
        document.getElementById('fechaFin').value = hoy.toISOString().split('T')[0];
    }

    cerrarModalETL() {
        document.getElementById('modalETL').classList.add('hidden');
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
        
        // Crear contenedor si no existe
        let container = document.getElementById('notificaciones-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificaciones-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 400px;';
            document.body.appendChild(container);
        }
        
        const notif = document.createElement('div');
        const colores = {
            success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        };
        
        const iconos = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notif.style.cssText = `
            background: ${colores[tipo]};
            color: white;
            padding: 16px 20px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.3s ease;
            font-size: 14px;
            font-weight: 500;
        `;
        
        notif.innerHTML = `
            <i class="fas ${iconos[tipo]}" style="font-size: 20px;"></i>
            <span>${mensaje}</span>
        `;
        
        container.appendChild(notif);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 5000);
    }
}

// Instanciar el controlador
window.clienteProcesadoController = new ClienteProcesadoController();
