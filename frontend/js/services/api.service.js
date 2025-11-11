class ApiService {
    constructor() {
        this.baseUrl = AppConfig.API.BASE_URL;
    }

    async request(url, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP Error ${response.status}`);
            }

            if (response.status === 204) {
                return { success: true };
            }

            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');
            
            if (contentLength === '0' || !contentType) {
                return { success: true };
            }

            if (contentType.includes('application/json')) {
                const text = await response.text();
                if (!text || text.trim().length === 0) {
                    return { success: true };
                }
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.warn('Respuesta no es JSON válido:', text);
                    return { success: true, message: text };
                }
            }

            const text = await response.text();
            return { success: true, message: text };
            
        } catch (error) {
            throw error;
        }
    }

    construirQueryString(filtros) {
        const params = new URLSearchParams();
        
        if (filtros.ano) params.append('ano', filtros.ano);
        if (filtros.mes) params.append('mes', filtros.mes);
        if (filtros.provincia) params.append('provincia', filtros.provincia);
        if (filtros.zona) params.append('zona', filtros.zona);
        if (filtros.tipoCliente) params.append('tipo_cliente', filtros.tipoCliente);
        
        const queryString = params.toString();
        return queryString ? `?${queryString}` : '';
    }

    async obtenerDatos(tipo, filtros = {}) {
        let endpoint = '';
        
        switch(tipo) {
            case AppConfig.TIPOS_DATOS.VIVO_AREQUIPA:
                endpoint = AppConfig.API.ENDPOINTS.VIVO.AREQUIPA;
                break;
            case AppConfig.TIPOS_DATOS.VIVO_PROVINCIA:
                endpoint = AppConfig.API.ENDPOINTS.VIVO.PROVINCIA;
                break;
            case AppConfig.TIPOS_DATOS.BENEFICIADO_AREQUIPA:
                endpoint = AppConfig.API.ENDPOINTS.BENEFICIADO.AREQUIPA;
                break;
            case AppConfig.TIPOS_DATOS.BENEFICIADO_PROVINCIA:
                endpoint = AppConfig.API.ENDPOINTS.BENEFICIADO.PROVINCIA;
                break;
            default:
                throw new Error('Tipo de datos no válido');
        }

        const queryString = this.construirQueryString(filtros);
        return await this.request(endpoint + queryString);
    }

    async obtenerDatosSinFiltros(tipo) {
        return await this.obtenerDatos(tipo, {});
    }

    async crear(tipo, data) {
        const esVivo = tipo.includes('vivo');
        const endpoint = esVivo 
            ? AppConfig.API.ENDPOINTS.VIVO.CREAR 
            : AppConfig.API.ENDPOINTS.BENEFICIADO.CREAR;

        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async actualizar(tipo, data) {
        const esVivo = tipo.includes('vivo');
        const endpoint = esVivo 
            ? AppConfig.API.ENDPOINTS.VIVO.ACTUALIZAR 
            : AppConfig.API.ENDPOINTS.BENEFICIADO.ACTUALIZAR;

        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async eliminar(tipo, id) {
        const esVivo = tipo.includes('vivo');
        const endpoint = esVivo 
            ? `${AppConfig.API.ENDPOINTS.VIVO.ELIMINAR}/${id}`
            : `${AppConfig.API.ENDPOINTS.BENEFICIADO.ELIMINAR}/${id}`;

        return await this.request(endpoint, {
            method: 'DELETE'
        });
    }

    obtenerUrlReporte(tipo) {
        const endpoints = {
        'vivo-arequipa': '/reporte/vivo/arequipa/excel',
        'vivo-provincia': '/reporte/vivo/provincia/excel',
        'beneficiado-arequipa': '/reporte/beneficiado/arequipa/excel',
        'beneficiado-provincia': '/reporte/beneficiado/provincia/excel'
    };

    const endpoint = endpoints[tipo];

    if (!endpoint) return null;

    return `${this.baseUrl}${endpoint}`;
    }
}

window.apiService = new ApiService();
