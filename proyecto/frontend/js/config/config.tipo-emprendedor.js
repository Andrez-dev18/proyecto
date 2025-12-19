
const TipoEmprendedorConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/tipoEmpren/all',
            CREAR: '/tipoEmpren/crear',
            ACTUALIZAR: '/tipoEmpren/actualizar',
            ELIMINAR: '/tipoEmpren/borrar',
            EXPORTAR: '/tipoEmpren/exportar'
        }
    }
};

window.TipoEmprendedorConfig = TipoEmprendedorConfig;
