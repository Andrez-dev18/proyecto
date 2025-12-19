class DataController {
    constructor() {
        this.tipoActual = '';
        this.datosActuales = [];
        this.datosOriginales = [];
        this.filaSeleccionada = null;
    }

    async cargarDatos(tipo) {
        try {
            this.tipoActual = tipo;
            this.filaSeleccionada = null;

            uiController.mostrarCargando(true);

            this.datosOriginales = await apiService.obtenerDatosSinFiltros(tipo);
            this.datosActuales = [...this.datosOriginales];

            filterController.extraerValoresUnicos(this.datosOriginales);
            filterController.mostrarSeccionFiltros(true);

            viewController.renderizarTabla(this.datosActuales);
            uiController.mostrarBotonesAccion(true);
            uiController.actualizarEstadoBotones(false);

            filterController.actualizarInfoFiltros(this.datosActuales.length, this.datosActuales.length);

        } catch (error) {
            uiController.mostrarError(AppConfig.MENSAJES.ERROR.CARGAR_DATOS, error);
        } finally {
            uiController.mostrarCargando(false);
        }
    }

    async cargarDatosConFiltros() {
        try {
            this.filaSeleccionada = null;

            uiController.mostrarCargando(true);

            const filtros = filterController.obtenerFiltrosActivos();
            const respuesta = await apiService.obtenerDatos(this.tipoActual, filtros);

            if (respuesta && respuesta.data && Array.isArray(respuesta.data)) {
                this.datosActuales = respuesta.data;
            } else if (Array.isArray(respuesta)) {
                this.datosActuales = respuesta;
            } else {
                this.datosActuales = [];
            }

            viewController.renderizarTabla(this.datosActuales);
            uiController.actualizarEstadoBotones(false);

            filterController.actualizarInfoFiltros(this.datosOriginales.length, this.datosActuales.length);

        } catch (error) {
            uiController.mostrarError(AppConfig.MENSAJES.ERROR.CARGAR_DATOS, error);
        } finally {
            uiController.mostrarCargando(false);
        }
    }

    aplicarFiltros() {
        this.cargarDatosConFiltros();
    }

    seleccionarFila(index) {
        this.filaSeleccionada = index;
        uiController.actualizarEstadoBotones(true);
        viewController.marcarFilaSeleccionada(index);
    }

    obtenerRegistroSeleccionado() {
        if (this.filaSeleccionada === null) return null;
        return this.datosActuales[this.filaSeleccionada];
    }

    obtenerRegistroPorIndex(index) {
        if (!this.datosActuales || index < 0 || index >= this.datosActuales.length) return null;
        return this.datosActuales[index];
    }


    async guardarRegistro(formData) {
        try {
            const data = this.procesarDatosFormulario(formData);
            const esModificar = data.id && data.id > 0;

            uiController.mostrarCargando(true);

            if (esModificar) {
                await apiService.actualizar(this.tipoActual, data);
                uiController.mostrarExito(AppConfig.MENSAJES.EXITO.ACTUALIZADO);
            } else {
                if (data.id === 0) delete data.id;
                await apiService.crear(this.tipoActual, data);
                uiController.mostrarExito(AppConfig.MENSAJES.EXITO.GUARDADO);
            }

            await this.cargarDatos(this.tipoActual);
            uiController.cerrarModal();

        } catch (error) {
            const mensaje = data?.id > 0
                ? AppConfig.MENSAJES.ERROR.ACTUALIZAR
                : AppConfig.MENSAJES.ERROR.GUARDAR;
            uiController.mostrarError(mensaje, error);
        } finally {
            uiController.mostrarCargando(false);
        }
    }

    obtenerDatosFiltrados() {
        return this.datosActuales;
    }

    async eliminarRegistro(id) {
        if (!id) {
            uiController.mostrarError(AppConfig.MENSAJES.ERROR.SIN_ID);
            return;
        }

        const confirmado = uiController.confirmar(
            `${AppConfig.MENSAJES.CONFIRMACION.ELIMINAR}\n`
        );

        if (!confirmado) return;

        try {
            uiController.mostrarCargando(true);
            await apiService.eliminar(this.tipoActual, id);
            uiController.mostrarExito(AppConfig.MENSAJES.EXITO.ELIMINADO);

            await this.cargarDatos(this.tipoActual);
        } catch (error) {
            uiController.mostrarError(AppConfig.MENSAJES.ERROR.ELIMINAR, error);
        } finally {
            uiController.mostrarCargando(false);
        }
    }


    generarReporte() {
        if (!this.tipoActual) {
        uiController.mostrarAlerta(AppConfig.MENSAJES.ERROR.SELECCIONAR_TIPO);
        return;
    }

    try {
        uiController.mostrarCargando(true);

        const url = apiService.obtenerUrlReporte(this.tipoActual);

        if (!url) {
            uiController.mostrarError('No se encontró una ruta válida para este tipo de reporte.');
            return;
        }

        // Abrir reporte en nueva pestaña (descarga automática del Excel)
        window.open(url, '_blank');

        uiController.mostrarInfo('Generando reporte Excel...');
    } catch (error) {
        uiController.mostrarError(AppConfig.MENSAJES.ERROR.REPORTE, error);
    } finally {
        uiController.mostrarCargando(false);
    }
    }

    procesarDatosFormulario(formData) {
        const data = {};

        formData.forEach((value, key) => {
            if (this.esCampoNumerico(key)) {
                data[key] = value === '' ? 0 : Number(value);
            } else {
                data[key] = value;
            }
        });

        return data;
    }

    esCampoNumerico(key) {
        const camposNumericos = [
            'id', 'ano', 'grs', 'rp', 'renzo', 'fafo', 'santa_angela',
            'jorge_pan', 'mirian_g', 'vasquez', 'san_joaquin', 'fortunato',
            'rosario', 'perca', 'gamboa', 'asoc_sondor', 'pollo_lima',
            'otras_granjas_chicas', 'avelino', 'peladores', 'avicruz',
            'rafael', 'matilde', 'avirox', 'julia', 'simon', 'yesica',
            'gabriel', 'arturo', 'nicolas', 'luis_f', 'mirella', 'grs_vivo',
            'santa_elena', 'granjas_chicas', 'sanfern_lima', 'avicola_renzo', 'otros'
        ];

        return camposNumericos.includes(key) ||
            key.includes('potencial') ||
            key.includes('Potencial');
    }

    esVivo() {
        return this.tipoActual.includes('vivo');
    }

    esProvincia() {
        return this.tipoActual.includes('provincia');
    }
}

window.dataController = new DataController();
