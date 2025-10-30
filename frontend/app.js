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

window.editarSeleccionado = function() {
    uiController.mostrarModalEditar();
};

window.eliminarSeleccionado = async function() {
    await dataController.eliminarRegistro();
};

window.generarReporteSeleccionado = function() {
    dataController.generarReporte();
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
