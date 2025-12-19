class MercadoController {
    constructor() {
        this.service = new MercadoService();
        this.registroSeleccionado = null;
        this.datos = [];
        this.config = window.MercadoConfig;
        this.dataTable = null;
        this.columnasVisibles = {};
    }

    async init() {
        await this.cargarCatalogos();
        this.setupEventListeners();
        this.setupColumnToggle();
        await this.cargarDatos();
    }

    async cargarCatalogos() {
        try {
            console.log('Cargando catálogos...');

            const [provincias] = await Promise.all([
                this.service.getProvincias(),
            ]);

            this.catalogos = { provincias };

            console.log('Catálogos cargados:', this.catalogos);

            this.poblarSelects();
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
        }
    }

    poblarSelects() {

        this.poblarSelect('modalProvincia', this.catalogos.provincias, 'codigo', 'nombre');
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

                if (columnIndex === 2) {
                    e.target.checked = true;
                    return;
                }

                this.columnasVisibles[columnIndex] = e.target.checked;

                if (this.dataTable) {
                    const column = this.dataTable.column(columnIndex);
                    column.visible(e.target.checked);
                }
            });
        });
    }

    async cargarDatos() {
        try {
            this.mostrarCargando(true);
            const response = await this.service.getAll();
            this.datos = Array.isArray(response) ? response : [];
            this.renderizarTabla();
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.mostrarNotificacion('Error al cargar datos', 'error');
            this.datos = [];
            this.renderizarTabla();
        } finally {
            this.mostrarCargando(false);
        }
    }

    setupEventListeners() {
        document.getElementById('btnNuevo')?.addEventListener('click', () => this.mostrarModalNuevo());
        document.getElementById('btnExportar')?.addEventListener('click', () => this.exportarExcel());
        document.getElementById('btnGuardar')?.addEventListener('click', () => this.guardarRegistro());
        document.getElementById('btnCancelar')?.addEventListener('click', () => this.cerrarModal());
    }

    renderizarTabla() {
        const table = $('#dataTable');

        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().clear().destroy();
        }

        this.dataTable = table.DataTable({
            data: this.datos,
            columns: [
                {
                    data: 'codigo',
                    className: 'col-codigo px-4 py-2 text-center'
                },
                {
                    data: 'nombre',
                    className: 'col-nombre px-4 py-2'
                },
                {
                    data: 'provincia',
                    className: 'col-nombre px-4 py-2'
                },
                {
                    data: 'activo',
                    className: 'col-nombre px-4 py-2',
                    render: (data) => {
                        if (data == 1) return 'Sí';
                        if (data == 0) return 'No';
                        return '-';
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'col-opciones px-4 py-2 text-center',
                    render: (data, type, row) => `
                        <div class="flex gap-2 justify-center">
                            <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded edit-btn" 
                                    data-codigo="${row.codigo}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded delete-btn" 
                                    data-codigo="${row.codigo}" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `
                }
            ],
            order: [[0, 'desc']],
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
            }
        });

        $('#dataTable tbody')
            .off('click')
            .on('click', '.edit-btn', (e) => {
                const codigo = $(e.currentTarget).data('codigo');
                this.registroSeleccionado = this.datos.find(d => d.codigo == codigo);
                this.modificarSeleccionado();
            })
            .on('click', '.delete-btn', async (e) => {
                const codigo = $(e.currentTarget).data('codigo');
                this.registroSeleccionado = this.datos.find(d => d.codigo == codigo);
                await this.eliminarSeleccionado();
            });
    }

    mostrarModalNuevo() {
        this.registroSeleccionado = null;
        document.getElementById('modalTitle').textContent = 'Nuevo Mercado';
        this.limpiarFormulario();
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        // Ocultar campo activo cuando es nuevo registro
        document.getElementById('inputActivo').classList.add('hidden');
    }

    modificarSeleccionado() {
        if (!this.registroSeleccionado) return;

        document.getElementById('modalTitle').textContent = 'Modificar Mercado';
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
            await this.service.delete(this.registroSeleccionado.codigo);
            this.mostrarNotificacion('Registro eliminado', 'success');
            this.registroSeleccionado = null;
            await this.cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion(error.message || 'Error al eliminar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    cargarDatosEnFormulario() {
        const r = this.registroSeleccionado;
        if (!r) return;

        console.log("Datos recibidos:", r);

        // Mostrar el campo Activo
        document.getElementById("inputActivo").classList.remove("hidden");

        // Nombre
        document.getElementById("modalNombre").value = r.nombre ?? "";

        // Provincia (buscar por nombre → devolver código)
        const provinciaObj = this.catalogos.provincias.find(
            p => p.nombre === r.provincia   // <-- tu backend probablemente manda el nombre
        );

        document.getElementById("modalProvincia").value =
            provinciaObj ? provinciaObj.codigo : "";

        // Activo (1 o 0)
        document.getElementById("modalActivo").value = r.activo ?? "";
    }

    limpiarFormulario() {
        document.getElementById('modalNombre').value = '';
    }

    async guardarRegistro() {
        const data = this.obtenerDatosFormulario();

        if (!this.validarFormulario(data)) return;

        try {
            this.mostrarCargando(true);

            if (this.registroSeleccionado) {
                data.codigo = this.registroSeleccionado.codigo;
                await this.service.update(data);
                this.mostrarNotificacion('Registro actualizado', 'success');
            } else {
                await this.service.create(data);
                this.mostrarNotificacion('Registro creado', 'success');
            }

            this.cerrarModal();
            await this.cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion(error.message || 'Error al guardar', 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    obtenerDatosFormulario() {
        return {
            nombre: document.getElementById('modalNombre').value.trim(),
            provincia: document.getElementById('modalProvincia').value,
            activo: document.getElementById('modalActivo').value ?? 1
        };
    }

    validarFormulario(data) {
        if (!data.nombre) {
            this.mostrarNotificacion('El nombre es obligatorio', 'warning');
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
        try {
            if (!this.datos || this.datos.length === 0) {
                this.mostrarNotificacion('No hay datos para exportar', 'warning');
                return;
            }

            window.open(`${this.service.baseUrl}${this.config.API.ENDPOINTS.EXCEL}`, '_blank');
            this.mostrarNotificacion('Descargando Excel...', 'info');
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al exportar', 'error');
        }
    }

    mostrarCargando(mostrar) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
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

        notif.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center gap-3`;
        notif.innerHTML = `<span>${mensaje}</span>`;
        container.appendChild(notif);

        setTimeout(() => notif.remove(), 4000);
    }
}

window.mercadoController = new MercadoController();

