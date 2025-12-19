class AlternoService {
    constructor() {
        this.baseURL = AppConfig.API.BASE_URL;
    }

    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL + AppConfig.API.ENDPOINTS.ALTERNO.CREAR}`, {
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
            const url = `${this.baseURL + AppConfig.API.ENDPOINTS.ALTERNO.EDITAR}`;

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
            const url = `${this.baseURL + AppConfig.API.ENDPOINTS.ALTERNO.BORRAR}/${id}`;

            let response = await fetch(url, { method: 'DELETE' });
            let responseText = await response.text();

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('text/html') || response.status === 405 || response.status === 404) {
                    response = await fetch(url, { method: 'POST' });
                    responseText = await response.text();
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
            if (filtros.provincia) params.append('provincia', filtros.provincia);
            if (filtros.mercado) params.append('mercado', filtros.mercado);
            if (filtros.tipo) params.append('tipo', filtros.tipo);

            const url = `${this.baseURL + AppConfig.API.ENDPOINTS.ALTERNO.FILTRO}${params}`;

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();

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
            window.open(`${this.baseURL + AppConfig.API.ENDPOINTS.ALTERNO.EXPORTAR}`, '_blank');
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const url = `${this.baseURL + AppConfig.API.ENDPOINTS.ALTERNO.ALL}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`No se pudo cargar Alterno: ${error.message}`);
        }
    }

    async getProvincias() {
        const response = await fetch(`${this.baseURL}/provincia/all`);
        if (!response.ok) throw new Error('Error al obtener provincias');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            provincia: item.nombre
        }));
    }

    async getMercados() {
        const response = await fetch(`${this.baseURL}/mercado/all`);
        if (!response.ok) throw new Error('Error al obtener mercados');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            mercado: item.nombre
        }));
    }

    async getTipos() {
        const response = await fetch(`${this.baseURL}/tipo/all`);
        if (!response.ok) throw new Error('Error al obtener tipos');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            tipo: item.nombre
        }));
    }
}

