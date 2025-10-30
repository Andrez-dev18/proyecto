class FilterController {
    constructor() {
        this.filtrosActivos = {
            ano: '',
            mes: '',
            provincia: '',
            zona: '',
            tipoCliente: ''
        };
        this.valoresUnicos = {
            anos: new Set(),
            provincias: new Set(),
            zonas: new Set(),
            tiposCliente: new Set()
        };
    }

    init() {
        this.mostrarSeccionFiltros(false);
    }

    mostrarSeccionFiltros(mostrar) {
        const seccion = document.getElementById('filterSection');
        if (seccion) {
            seccion.style.display = mostrar ? 'block' : 'none';
        }
    }

    extraerValoresUnicos(datos) {
        this.valoresUnicos = {
            anos: new Set(),
            provincias: new Set(),
            zonas: new Set(),
            tiposCliente: new Set()
        };

        datos.forEach(registro => {
            if (registro.ano) this.valoresUnicos.anos.add(registro.ano);
            if (registro.provincia) this.valoresUnicos.provincias.add(registro.provincia);
            if (registro.zona) this.valoresUnicos.zonas.add(registro.zona);
            
            const tipoCliente = registro.tipoCliente || registro.tipo_cliente;
            if (tipoCliente) this.valoresUnicos.tiposCliente.add(tipoCliente);
        });

        this.actualizarSelectores();
    }

    actualizarSelectores() {
        this.actualizarSelector('filterAno', Array.from(this.valoresUnicos.anos).sort((a, b) => b - a));
        this.actualizarSelector('filterProvincia', Array.from(this.valoresUnicos.provincias).sort());
        this.actualizarSelector('filterZona', Array.from(this.valoresUnicos.zonas).sort());
        this.actualizarSelector('filterTipoCliente', Array.from(this.valoresUnicos.tiposCliente).sort());
    }

    actualizarSelector(idSelector, opciones) {
        const selector = document.getElementById(idSelector);
        if (!selector) return;

        const valorActual = selector.value;
        
        while (selector.options.length > 1) {
            selector.remove(1);
        }

        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion;
            option.textContent = opcion;
            selector.appendChild(option);
        });

        if (valorActual && opciones.includes(valorActual)) {
            selector.value = valorActual;
        }
    }

    obtenerFiltrosActivos() {
        this.filtrosActivos = {
            ano: document.getElementById('filterAno')?.value || '',
            mes: document.getElementById('filterMes')?.value || '',
            provincia: document.getElementById('filterProvincia')?.value || '',
            zona: document.getElementById('filterZona')?.value || '',
            tipoCliente: document.getElementById('filterTipoCliente')?.value || ''
        };
        return this.filtrosActivos;
    }

    aplicarFiltros(datos) {
        const filtros = this.obtenerFiltrosActivos();
        
        let datosFiltrados = datos.filter(registro => {
            if (filtros.ano && registro.ano != filtros.ano) return false;
            if (filtros.mes && registro.mes !== filtros.mes) return false;
            if (filtros.provincia && registro.provincia !== filtros.provincia) return false;
            if (filtros.zona && registro.zona !== filtros.zona) return false;
            
            const tipoCliente = registro.tipoCliente || registro.tipo_cliente;
            if (filtros.tipoCliente && tipoCliente !== filtros.tipoCliente) return false;
            
            return true;
        });

        this.actualizarInfoFiltros(datos.length, datosFiltrados.length);
        
        return datosFiltrados;
    }

    async aplicarFiltrosBackend() {
        if (window.dataController && window.dataController.tipoActual) {
            await window.dataController.cargarDatosConFiltros();
        }
    }

    actualizarInfoFiltros(totalOriginal, totalFiltrado) {
        const infoElement = document.getElementById('filterInfo');
        if (!infoElement) return;

        const filtrosActivos = Object.values(this.filtrosActivos).filter(v => v !== '').length;
        
        if (filtrosActivos === 0) {
            infoElement.textContent = `Mostrando todos los registros (${totalOriginal})`;
        } else {
            infoElement.textContent = `Mostrando ${totalFiltrado} de ${totalOriginal} registros (${filtrosActivos} filtro${filtrosActivos > 1 ? 's' : ''} activo${filtrosActivos > 1 ? 's' : ''})`;
        }
    }

    async limpiarFiltros() {
        document.getElementById('filterAno').value = '';
        document.getElementById('filterMes').value = '';
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterZona').value = '';
        document.getElementById('filterTipoCliente').value = '';

        this.filtrosActivos = {
            ano: '',
            mes: '',
            provincia: '',
            zona: '',
            tipoCliente: ''
        };

        if (window.dataController && window.dataController.tipoActual) {
            await this.aplicarFiltrosBackend();
        }
    }

    hayFiltrosActivos() {
        return Object.values(this.filtrosActivos).some(v => v !== '');
    }
}

window.filterController = new FilterController();
