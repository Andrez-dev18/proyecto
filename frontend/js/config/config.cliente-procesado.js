const ClienteProcesadoConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            FILTRO: '/clienteProce/filtro',
            CREAR: '/clienteProce/crear',
            ACTUALIZAR: '/clienteProce/actualizar',
            ELIMINAR: '/clienteProce/borrar',
            EXCEL: '/clienteProce/exportar',
            ETL: '/clienteProce/etl',
            CATALOGOS: {
                DISTRITOS: '/clienteProce/catalogos/distritos',
                ZONAS: '/clienteProce/catalogos/zonas',
                CANALES: '/clienteProce/catalogos/canales',
                LINEAS: '/clienteProce/catalogos/lineas',
                SUBLINEAS: '/clienteProce/catalogos/sublineas',
                VENDEDORES: '/clienteProce/catalogos/vendedores'
            }
        }
    },
    UI: {
        DATATABLES_LANGUAGE: {
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            infoEmpty: "Mostrando 0 a 0 de 0 registros",
            infoFiltered: "(filtrado de _MAX_ registros totales)",
            search: "Buscar:",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    }
};

window.ClienteProcesadoConfig = ClienteProcesadoConfig;
