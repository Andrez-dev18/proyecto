const ProveedorConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,
        ENDPOINTS: {
            ALL: '/proveedor/all',
            CREAR: '/proveedor/crear',
            ACTUALIZAR: '/proveedor/actualizar',
            ELIMINAR: '/proveedor/borrar',
            EXCEL: '/proveedor/exportar'
        }
    }
};

window.ProveedorConfig = ProveedorConfig;

