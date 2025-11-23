class ClienteProcesadoService {
    constructor() {
        this.baseURL = AppConfig.API.BASE_URL;
    }

    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL}/clienteProce/crear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();
            
            if (!response.ok) {
                throw new Error(responseText || 'Error al crear registro');
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const url = `${this.baseURL}/clienteProce/actualizar`;
            console.log('Actualizando registro:', data);

            const response = await fetch(url, {
                method: 'POST', // Usar POST ya que tu backend acepta ambos
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(responseText || 'Error al actualizar registro');
            }
            
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseURL}/clienteProce/borrar/${id}`;
            console.log('Eliminando registro ID:', id);

            // Usar POST como fallback ya que tu backend acepta ambos
            const response = await fetch(url, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const responseText = await response.text();
            
            if (!response.ok) {
                throw new Error(responseText || 'Error al eliminar registro');
            }

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
            const response = await fetch(`${this.baseURL}/clienteProce/etl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Error al ejecutar ETL');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en ejecutarETL:', error);
            throw error;
        }
    }
}
