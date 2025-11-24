class ClienteProcesadoService {
    constructor() {
        this.config = window.ClienteProcesadoConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getFiltered(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.draw) queryParams.append('draw', params.draw);
            if (params.start !== undefined) queryParams.append('start', params.start);
            if (params.length !== undefined) queryParams.append('length', params.length);
            if (params.search?.value) queryParams.append('search', params.search.value);
            
            if (params.order && params.order.length > 0) {
                const orderColumn = params.columns[params.order[0].column].data;
                queryParams.append('orderBy', orderColumn);
                queryParams.append('orderDir', params.order[0].dir);
            }
            
            if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
            if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
            if (params.distrito) queryParams.append('distrito', params.distrito);
            if (params.zona) queryParams.append('zona', params.zona);
            if (params.canal) queryParams.append('canal', params.canal);
            if (params.linea) queryParams.append('linea', params.linea);
            if (params.vendedor) queryParams.append('vendedor', params.vendedor);
            if (params.cliente) queryParams.append('cliente', params.cliente);

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.FILTRO}?${queryParams}`;
            console.log('Fetching:', url);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la petición');
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en getFiltered:', error);
            throw error;
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
            
            const responseText = await response.text();
            if (!response.ok) {
                const error = responseText ? JSON.parse(responseText) : { message: 'Error al crear' };
                throw new Error(error.message || 'Error al crear registro');
            }
            
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EDITAR}`;
            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (!response.ok && response.status === 405) {
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            const responseText = await response.text();
            if (!response.ok) {
                const error = responseText ? JSON.parse(responseText) : { message: 'Error al actualizar' };
                throw new Error(error.message || 'Error al actualizar registro');
            }
            
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.BORRAR}/${id}`;
            let response = await fetch(url, { method: 'DELETE' });
            
            if (!response.ok && response.status === 405) {
                response = await fetch(url, { method: 'POST' });
            }
            
            const responseText = await response.text();
            if (!response.ok) {
                const error = responseText ? JSON.parse(responseText) : { message: 'Error al eliminar' };
                throw new Error(error.message || 'Error al eliminar registro');
            }
            
            return responseText ? JSON.parse(responseText) : { success: true };
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
            
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXPORTA}?${params}`;
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
            
            const responseText = await response.text();
            if (!response.ok) {
                const error = responseText ? JSON.parse(responseText) : { message: 'Error en ETL' };
                throw new Error(error.message || 'Error al ejecutar ETL');
            }
            
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en ejecutarETL:', error);
            throw error;
        }
    }
}

window.ClienteProcesadoService = ClienteProcesadoService;
