class ProductoSustitutoService {
    constructor() {
        this.config = window.ProductoSustitutoConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getTiposProducto() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.TIPOS_PRODUCTO}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener tipos de producto');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en getTiposProducto:', error);
            throw error;
        }
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

    async update(data) {
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

    async delete(id) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}/${id}`;
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar');
            return await response.json();
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    async getFiltered(filters) {
        try {
            const params = new URLSearchParams();
            if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
            if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
            if (filters.producto) params.append('producto', filters.producto);

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.FILTRO}?${params}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en filtrado');
            return await response.json();
        } catch (error) {
            console.error('Error en getFiltered:', error);
            throw error;
        }
    }

    async exportToExcel(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
            if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
            if (filters.producto) params.append('producto', filters.producto);

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXCEL}?${params}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al exportar:', error);
            throw error;
        }
    }
}

window.ProductoSustitutoService = ProductoSustitutoService;

