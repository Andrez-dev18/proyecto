class UiController {
    constructor() {
        this.modal = null;
        this.loadingOverlay = null;
    }

    init() {
        this.modal = document.getElementById('formModal');
        this.crearLoadingOverlay();
        this.configurarEventosGlobales();
    }

    crearLoadingOverlay() {
        if (document.getElementById('loadingOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center';
        overlay.innerHTML = `
            <div class="bg-white rounded-2xl p-8 shadow-2xl">
                <div class="flex flex-col items-center gap-4">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    <p class="text-gray-700 font-semibold text-lg">Cargando...</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.loadingOverlay = overlay;
    }

    configurarEventosGlobales() {
        if (AppConfig.UI.MODAL_CLOSE_ESC) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
                    this.cerrarModal();
                }
            });
        }
    }

    mostrarCargando(mostrar) {
        if (this.loadingOverlay) {
            if (mostrar) {
                this.loadingOverlay.classList.remove('hidden');
                this.loadingOverlay.classList.add('flex');
            } else {
                this.loadingOverlay.classList.add('hidden');
                this.loadingOverlay.classList.remove('flex');
            }
        }
    }

    mostrarBotonesAccion(mostrar) {
        const actionButtons = document.getElementById('actionButtons');
        if (actionButtons) {
            actionButtons.style.display = mostrar ? 'block' : 'none';
        }
    }

    actualizarEstadoBotones(haySeleccion) {
        const botones = ['btnModificar', 'btnEliminar', 'btnReporte'];
        botones.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = !haySeleccion;
            }
        });
    }

    abrirModal(titulo) {
        if (!this.modal) return;
        
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = titulo;
        }
        
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    cerrarModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    mostrarExito(mensaje) {
        notificationService.success(mensaje);
    }

    mostrarError(mensaje, error) {
        const mensajeCompleto = error 
            ? `${mensaje}: ${error.message}` 
            : mensaje;
        notificationService.error(mensajeCompleto);
    }

    mostrarAlerta(mensaje) {
        notificationService.warning(mensaje);
    }

    mostrarInfo(mensaje) {
        notificationService.info(mensaje);
    }

    confirmar(mensaje) {
        return confirm(mensaje);
    }

    mostrarModalNuevo() {
        if (!dataController.tipoActual) {
            this.mostrarAlerta(AppConfig.MENSAJES.ERROR.SELECCIONAR_TIPO);
            return;
        }
        
        this.abrirModal('Nuevo Registro');
        formController.generarFormulario();
    }

    mostrarModalEditar() {
        const registro = dataController.obtenerRegistroSeleccionado();
        
        if (!registro) {
            this.mostrarAlerta(AppConfig.MENSAJES.ERROR.SELECCIONAR_REGISTRO);
            return;
        }

        if (!registro.id) {
            this.mostrarError(AppConfig.MENSAJES.ERROR.SIN_ID);
            return;
        }
        
        this.abrirModal('Modificar Registro');
        formController.generarFormulario(registro);
    }

    animarDestello(element) {
        element.classList.add('animate-pulse');
        setTimeout(() => {
            element.classList.remove('animate-pulse');
        }, AppConfig.UI.ANIMATION_DURATION);
    }
}

window.uiController = new UiController();
