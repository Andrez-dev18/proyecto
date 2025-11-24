class MercadoDetService {
    constructor() {
        this.config = window.MercadoDetConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la petición');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en getAll:', error);
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
            if (!response.ok) throw new Error('Error al crear');
            return await response.json();
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ACTUALIZAR}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al actualizar');
            return await response.json();
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseUrl + this.config.API.ENDPOINTS.ELIMINAR}/${id}`;

            let response = await fetch(url, { method: 'DELETE' });

            let responseText = await response.text();

            if (!response.ok) {
                // If server returned HTML (unexpected) or DELETE not allowed, try POST fallback
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

    async exportarCSV() {
        try {
            console.log(`${this.baseUrl + this.config.API.ENDPOINTS.EXCEL}`, '_blank');
            // Abrir en nueva pestaña para descargar
            window.open(`${this.baseUrl + this.config.API.ENDPOINTS.EXCEL}`, '_blank');

        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    async getMercados() {
        try {
            const url = `${this.baseUrl}${this.config.CATALOGOS.mercado}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar provincias');
            return await response.json();
        } catch (error) {
            console.error('Error en getProvincias:', error);
            return [];
        }
    }

}

window.MercadoDetService = MercadoDetService;
