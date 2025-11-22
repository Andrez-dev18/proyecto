class CriadorEmprendedorService {
    constructor() {
        this.baseURL = AppConfig.API.BASE_URL;
        this.endpoints = CriadorEmprendedorConfig.API.ENDPOINTS;
    }

    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.CREAR}`, {
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
            const url = `${this.baseURL}${this.endpoints.EDITAR}`;
            
            console.log('=== ACTUALIZAR CRIADOR ===');
            console.log('URL:', url);
            console.log('Datos enviados:', JSON.stringify(data, null, 2));

            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            console.log('Status respuesta:', response.status);

            const responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);

            if (!response.ok) {
                console.warn('PUT failed, status', response.status, 'retrying with POST fallback');
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const fallbackText = await response.text();
                console.log('Fallback response:', fallbackText);
                if (!response.ok) {
                    let errorMsg = 'Error al actualizar registro';
                    try {
                        const errorData = JSON.parse(fallbackText);
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch (e) {
                        errorMsg = fallbackText || errorMsg;
                    }
                    throw new Error(errorMsg);
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
            const url = `${this.baseURL}${this.endpoints.BORRAR}/${id}`;

            console.log('=== ELIMINAR CRIADOR ===');
            console.log('URL:', url);
            console.log('ID:', id);

            let response = await fetch(url, { method: 'DELETE' });

            console.log('Status respuesta:', response.status);

            let responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('text/html') || response.status === 405 || response.status === 404) {
                    console.warn('DELETE returned HTML or failed, retrying with POST fallback');
                    response = await fetch(url, { method: 'POST' });
                    responseText = await response.text();
                    console.log('Fallback (POST) respuesta del servidor:', responseText);
                }

                if (!response.ok) {
                    let errorMsg = 'Error al eliminar registro';
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch (e) {
                        errorMsg = responseText || errorMsg;
                    }
                    throw new Error(errorMsg);
                }
            }

            return responseText ? JSON.parse(responseText) : { success: true };
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }

    async filtrar(filtros) {
        try {
            const params = new URLSearchParams();

            if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
            if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
            if (filtros.tipoCriador) params.append('tipoCriador', filtros.tipoCriador);
            if (filtros.zona) params.append('zona', filtros.zona);
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.categoria) params.append('categoria', filtros.categoria);

            const url = `${this.baseURL}${this.endpoints.FILTRO}?${params}`;
            console.log('Filtrando Criadores:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Filtered data received:', result);

            if (!result || typeof result !== 'object' || !Array.isArray(result.data)) {
                throw new Error('Formato de respuesta inválido');
            }

            return result;
        } catch (error) {
            console.error('Error en filtrar:', error);
            throw error;
        }
    }

    async exportarCSV() {
        try {
            console.log(`${this.baseURL}${this.endpoints.EXPORTA}`, '_blank');
            window.open(`${this.baseURL}${this.endpoints.EXPORTA}`, '_blank');
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.ALL}`;
            console.log('Fetch URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('Data received:', data);

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`No se pudo cargar Criadores: ${error.message}`);
        }
    }

    async getTiposCriador() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.TIPOS_CRIADOR}`);
        if (!response.ok) throw new Error('Error al obtener tipos de criador');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            tipoCriador: item.nombre
        }));
    }

    async getZonas() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.ZONAS}`);
        if (!response.ok) throw new Error('Error al obtener zonas');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            zona: item.nombre
        }));
    }

    async getEstados() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.ESTADOS}`);
        if (!response.ok) throw new Error('Error al obtener estados');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            estado: item.nombre
        }));
    }

    async getCategorias() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.CATEGORIAS}`);
        if (!response.ok) throw new Error('Error al obtener categorías');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            categoria: item.nombre
        }));
    }

    async ejecutarETL(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.ETL}`, {
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

