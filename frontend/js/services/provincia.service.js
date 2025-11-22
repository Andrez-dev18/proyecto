class ProvinciaService {
    constructor() {
        this.config = window.ProvinciaConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            console.log('Fetching provincias:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la petición');
            const data = await response.json();
            console.log('Provincias recibidas:', data);
            return data;
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.CREAR}`;
            console.log('Creating provincia:', url, data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al crear provincia');
            }
            
            return result;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ACTUALIZAR}`;
            console.log('Updating provincia:', url, data);
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al actualizar provincia');
            }
            
            return result;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(codigo) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}/${codigo}`;
            console.log('Deleting provincia:', url);
            const response = await fetch(url, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al eliminar provincia');
            }
            
            return result;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    async exportToExcel() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXPORTAR}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al exportar:', error);
            throw error;
        }
    }
}

window.ProvinciaService = ProvinciaService;
