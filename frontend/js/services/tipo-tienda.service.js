class TipoTiendaService {
    constructor() {
        this.config = window.TipoTiendaConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la petición');
            return await response.json();
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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear');
            }
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
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar');
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
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar');
            }
            return await response.json();
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }
}

window.TipoTiendaService = TipoTiendaService;

