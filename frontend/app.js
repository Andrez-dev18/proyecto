document.addEventListener('DOMContentLoaded', () => {
    inicializarAplicacion();
});

function inicializarAplicacion() {
    notificationService.init();
    uiController.init();
    filterController.init();
}

window.cargarDatos = async function(tipo) {
    await dataController.cargarDatos(tipo);
};

window.seleccionarFila = function(index, element) {
    dataController.seleccionarFila(index);
};

window.mostrarModalNuevo = function() {
    uiController.mostrarModalNuevo();
};

window.generarReporteSeleccionado = async function() {
    await dataController.generarReporte();
};

window.guardarRegistro = async function() {
    await formController.guardar();
};

window.cerrarModal = function() {
    uiController.cerrarModal();
};

window.aplicarFiltros = async function() {
    await dataController.aplicarFiltros();
};

window.limpiarFiltros = async function() {
    await filterController.limpiarFiltros();
};

window.editarRegistro = function(index) {
    const registro = dataController.obtenerRegistroPorIndex(index);
    if (!registro) {
        uiController.mostrarAlerta("No se pudo obtener el registro.");
        return;
    }
    uiController.mostrarModalEditar(registro);
};

window.eliminarRegistro = async function(index) {
    const registro = dataController.obtenerRegistroPorIndex(index);
    if (!registro) return;
    await dataController.eliminarRegistro(registro.id);
};

