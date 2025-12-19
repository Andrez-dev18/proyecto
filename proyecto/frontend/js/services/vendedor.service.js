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

            const responseText = await response.text();
            console.log('Respuesta crear:', responseText);

            if (!response.ok) {
                throw new Error(responseText || 'Error al crear vendedor');
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error al crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            // Usar POST en lugar de PUT ya que tu backend acepta ambos
            const response = await fetch(`${this.baseURL}${this.endpoints.ACTUALIZAR}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();
            console.log('Respuesta actualizar:', responseText);

            if (!response.ok) {
                throw new Error(responseText || 'Error al actualizar vendedor');
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error al actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseURL}${this.endpoints.ELIMINAR}/${id}`;
            // Usar POST como fallback ya que tu backend acepta ambos
            const response = await fetch(url, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const responseText = await response.text();
            console.log('Respuesta eliminar:', responseText);

            if (!response.ok) {
                throw new Error(responseText || 'Error al eliminar vendedor');
            }

            return responseText ? JSON.parse(responseText) : { success: true };
        } catch (error) {
            console.error('Error al eliminar:', error);
            throw error;
        }
    }
}

window.VendedorService = VendedorService;
