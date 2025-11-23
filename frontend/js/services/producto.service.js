class ProductoService {
    constructor() {
        this.config = window.ProductoConfig;
        this.baseURL = AppConfig.API.BASE_URL; // Usar URL base del config global
        this.endpoints = this.config.ENDPOINTS;
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.ALL}`;
            console.log('Fetch URL:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async obtenerDatosFiltrados(params) {
        try {
            const queryParams = new URLSearchParams({
                start: params.start || 0,
                length: params.length || 10,
                'search[value]': params.search?.value || ''
            });

            const url = `${this.baseURL}${this.endpoints.FILTRO}?${queryParams}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en obtenerDatosFiltrados:', error);
            throw error;
        }
    }

    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.CREAR}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al crear producto');
            }

            return result;
        } catch (error) {
            console.error('Error al crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.ACTUALIZAR}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al actualizar producto');
            }

            return result;
        } catch (error) {
            console.error('Error al actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseURL}${this.endpoints.ELIMINAR}/${id}`;
            const response = await fetch(url, { method: 'DELETE' });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al eliminar producto');
            }

            return result;
        } catch (error) {
            console.error('Error al eliminar:', error);
            throw error;
        }
    }

    async exportarExcel() {
        window.open(`${this.baseURL}${this.endpoints.EXPORTAR}`, '_blank');
    }
}

window.ProductoService = ProductoService;

