class ClienteProcesadoService {
    constructor() {
        this.baseURL = AppConfig.API.BASE_URL;
    }

    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL}/clienteProce/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al crear registro');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const url = `${this.baseURL}/clienteProce/update`;
            console.log('Actualizando registro:', data);

            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();

            if (!response.ok) {
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const fallbackText = await response.text();
                if (!response.ok) {
                    throw new Error('Error al actualizar registro');
                }
                return JSON.parse(fallbackText);
            }
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseURL}/clienteProce/delete/${id}`;
            console.log('Eliminando registro ID:', id);

            let response = await fetch(url, { method: 'DELETE' });

            if (!response.ok) {
                response = await fetch(url, { method: 'POST' });
                if (!response.ok) {
                    throw new Error('Error al eliminar registro');
                }
            }

            const responseText = await response.text();
            return responseText ? JSON.parse(responseText) : { success: true };
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }

    async filtrar(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.start !== undefined) queryParams.append('start', params.start);
            if (params.length !== undefined) queryParams.append('length', params.length);
            if (params.draw !== undefined) queryParams.append('draw', params.draw);
            
            if (params.search && params.search.value) {
                queryParams.append('search[value]', params.search.value);
            }
            
            if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
            if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
            if (params.distrito) queryParams.append('distrito', params.distrito);
            if (params.zona) queryParams.append('zona', params.zona);
            if (params.canal) queryParams.append('canal', params.canal);
            if (params.linea) queryParams.append('linea', params.linea);
            if (params.sublinea) queryParams.append('sublinea', params.sublinea);
            if (params.vendedor) queryParams.append('vendedor', params.vendedor);
            if (params.cliente) queryParams.append('cliente', params.cliente);

            const url = `${this.baseURL}/clienteProce/filtro?${queryParams}`;
            console.log('URL de filtrado:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }

            const result = await response.json();
            console.log('Respuesta del servidor:', result);
            
            return result;
        } catch (error) {
            console.error('Error en filtrar:', error);
            throw error;
        }
    }

    async exportarExcel() {
        try {
            window.open(`${this.baseURL}/clienteProce/exportar`, '_blank');
            return { success: true };
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const url = `${this.baseURL}/clienteProce/all`;
            console.log('Fetch URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error al obtener todos:', error);
            throw error;
        }
    }

    async ejecutarETL(data) {
        try {
            const response = await fetch(`${this.baseURL}/clienteProce/etl/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al ejecutar ETL');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en ejecutarETL:', error);
            throw error;
        }
    }
}
