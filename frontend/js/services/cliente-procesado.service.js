class ClienteProcesadoService {
    constructor() {
        this.config = window.ClienteProcesadoConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

   async getFiltered(params = {}) {
    try {
        const queryParams = new URLSearchParams();
        
        // Parámetros de DataTables
        if (params.draw) queryParams.append('draw', params.draw);
        if (params.start !== undefined) queryParams.append('start', params.start);
        if (params.length !== undefined) queryParams.append('length', params.length);
        if (params.search?.value) queryParams.append('search', params.search.value);
        
        // Ordenamiento
        if (params.order && params.order.length > 0) {
            const orderColumn = params.columns[params.order[0].column].data;
            queryParams.append('orderBy', orderColumn);
            queryParams.append('orderDir', params.order[0].dir);
        }
        
        
        if (params.fechaInicio && params.fechaInicio.trim() !== '') {
            queryParams.append('fechaInicio', params.fechaInicio);
        }
        if (params.fechaFin && params.fechaFin.trim() !== '') {
            queryParams.append('fechaFin', params.fechaFin);
        }
        if (params.distrito && params.distrito.trim() !== '') {
            queryParams.append('distrito', params.distrito);
        }
        if (params.zona && params.zona.trim() !== '') {
            queryParams.append('zona', params.zona);
        }
        if (params.canal && params.canal.trim() !== '') {
            queryParams.append('canal', params.canal);
        }
        if (params.linea && params.linea.trim() !== '') {
            queryParams.append('linea', params.linea);
        }
        if (params.sublinea && params.sublinea.trim() !== '') {
            queryParams.append('sublinea', params.sublinea);
        }
        if (params.vendedor && params.vendedor.trim() !== '') {
            queryParams.append('vendedor', params.vendedor);
        }
        if (params.cliente && params.cliente.trim() !== '') {
            queryParams.append('cliente', params.cliente);
        }

        const url = `${this.baseUrl}${this.config.API.ENDPOINTS.FILTRO}?${queryParams}`;
        console.log('URL de filtrado:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Respuesta recibida:', data);
        return data;
    } catch (error) {
        console.error('Error en getFiltered:', error);
        throw error;
    }
}


    async getValoresUnicos() {
        try {
            // Obtener una muestra de datos sin filtros para extraer valores únicos
            const params = new URLSearchParams();
            params.append('start', '0');
            params.append('length', '1000'); // Obtener suficientes registros para tener variedad
            
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.FILTRO}?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Error al obtener valores únicos');
            
            const result = await response.json();
            const data = result.data || [];
            
            // Extraer valores únicos de cada campo
            const valoresUnicos = {
                distritos: [...new Set(data.map(item => item.distrito).filter(Boolean))].sort(),
                zonas: [...new Set(data.map(item => item.zona).filter(Boolean))].sort(),
                canales: [...new Set(data.map(item => item.canal).filter(Boolean))].sort(),
                lineas: [...new Set(data.map(item => item.linea).filter(Boolean))].sort(),
                sublineas: [...new Set(data.map(item => item.sublinea).filter(Boolean))].sort(),
                vendedores: [...new Set(data.map(item => item.vendedor).filter(Boolean))].sort()
            };
            
            console.log('Valores únicos extraídos:', valoresUnicos);
            return valoresUnicos;
            
        } catch (error) {
            console.error('Error al obtener valores únicos:', error);
            return {
                distritos: [],
                zonas: [],
                canales: [],
                lineas: [],
                sublineas: [],
                vendedores: []
            };
        }
    }

    async create(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.CREAR}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al crear');
            return await response.json();
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ACTUALIZAR}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const fallbackResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!fallbackResponse.ok) throw new Error('Error al actualizar');
                return await fallbackResponse.json();
            }
            return await response.json();
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}/${id}`;
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const fallbackResponse = await fetch(url, { method: 'POST' });
                if (!fallbackResponse.ok) throw new Error('Error al eliminar');
                return await fallbackResponse.json();
            }
            return await response.json();
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    async exportToExcel(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
            if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
            if (filters.distrito) params.append('distrito', filters.distrito);
            if (filters.zona) params.append('zona', filters.zona);
            if (filters.canal) params.append('canal', filters.canal);
            if (filters.linea) params.append('linea', filters.linea);
            if (filters.sublinea) params.append('sublinea', filters.sublinea);
            if (filters.vendedor) params.append('vendedor', filters.vendedor);
            if (filters.cliente) params.append('cliente', filters.cliente);

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXCEL}?${params}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al exportar:', error);
            throw error;
        }
    }

    async ejecutarETL(fechaInicio, fechaFin) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ETL}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fechaInicio, fechaFin })
            });
            if (!response.ok) throw new Error('Error al ejecutar ETL');
            return await response.json();
        } catch (error) {
            console.error('Error en ejecutarETL:', error);
            throw error;
        }
    }
}

window.ClienteProcesadoService = ClienteProcesadoService;

