const PVentasBeneficiadoArequipaConfig = {
    API: {
        BASE_URL: window.AppConfig ? window.AppConfig.API.BASE_URL : 'http://localhost/proyecto/backend',
        ENDPOINTS: {
            ALL: '/beneficiado/arequipa/all',
            FILTRO: '/beneficiado/arequipa',
            CREAR: '/beneficiado/crear',
            ACTUALIZAR: '/beneficiado/actualizar',
            ELIMINAR: '/beneficiado/borrar',
            EXCEL: '/reporte/beneficiado/arequipa/excel'
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

window.PVentasBeneficiadoArequipaConfig = PVentasBeneficiadoArequipaConfig;
