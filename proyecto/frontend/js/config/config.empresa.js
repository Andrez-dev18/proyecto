const EmpresaConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/empresa/all',
            CREAR: '/empresa/crear',
            ACTUALIZAR: '/empresa/actualizar',
            ELIMINAR: '/empresa/borrar',
            EXCEL: '/empresa/exportar'
        }
    }
};

window.EmpresaConfig = EmpresaConfig;

