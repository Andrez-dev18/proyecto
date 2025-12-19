const PVentasVivoArequipaConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/vivo/arequipa/all',
            FILTRO: '/vivo/arequipa',
            CREAR: '/vivo/crear',
            ACTUALIZAR: '/vivo/actualizar',
            ELIMINAR: '/vivo/borrar',
            EXCEL: '/reporte/vivo/arequipa/excel'
        }
    },

    UI: {
        DATATABLES_LANGUAGE: {
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
    }
};

window.PVentasVivoArequipaConfig = PVentasVivoArequipaConfig;
