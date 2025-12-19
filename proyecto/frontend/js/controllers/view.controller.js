class ViewController {
    renderizarTabla(datos) {
        tableView.render(datos);
    }

    marcarFilaSeleccionada(index) {
        tableView.marcarFilaSeleccionada(index);
    }
}

window.viewController = new ViewController();
