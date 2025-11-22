class MercadoResService {
    constructor() {
        this.config = window.MercadoResConfig;
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

    async delete(data) {
        console.log(`${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}`);
        try {
            const response = await fetch(
                `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) throw new Error("Error al eliminar");

            return await response.json();

        } catch (error) {
            console.error("Error en eliminar:", error);
            throw error;
        }
    }

    async getFiltered(filters) {
        try {
            const params = new URLSearchParams();
            if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
            if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
            if (filters.tipo) params.append('tipo', filters.tipo);

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.FILTRO}?${params}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en filtrado');
            return await response.json();
        } catch (error) {
            console.error('Error en getFiltered:', error);
            throw error;
        }
    }

    async getTipos() {
        try {
            const url = `${this.baseUrl}${this.config.CATALOGOS.TIPOS}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar tipos');
            return await response.json();
        } catch (error) {
            console.error('Error en getTipos:', error);
            return [];
        }
    }

    async exportToExcel(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
            if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
            if (filters.tipo) params.append('tipo', filters.tipo);

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXCEL}?${params}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al exportar:', error);
            throw error;
        }
    }

    async getProvincias() {
        try {
            const url = `${this.baseUrl}${this.config.CATALOGOS.PROVINCIAS}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar provincias');
            return await response.json();
        } catch (error) {
            console.error('Error en getProvincias:', error);
            return [];
        }
    }

}

window.MercadoResService = MercadoResService;
