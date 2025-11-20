class VendedorService {
    constructor() {
        this.config = window.VendedorConfig;
        this.baseURL = this.config.API.BASE_URL;
        this.endpoints = this.config.API.ENDPOINTS;
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
            console.error('Error al obtener vendedores:', error);
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

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear vendedor');
            }

            return await response.json();
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

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar vendedor');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseURL}${this.endpoints.ELIMINAR}/${id}`;
            const response = await fetch(url, { method: 'DELETE' });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar vendedor');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al eliminar:', error);
            throw error;
        }
    }
}

window.VendedorService = VendedorService;
