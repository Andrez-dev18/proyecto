const CondicionConfig = {
    API: {
        BASE_URL: AppConfig.API.BASE_URL,  // Cambia esto según tu configuración
        ENDPOINTS: {
            ALL: '/condicion/all'
        }
    },
    UI: {
        DATATABLES_LANGUAGE: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json'
    }
};

window.CondicionConfig = CondicionConfig;
