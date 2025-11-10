class HuevoService {
    constructor() {
        this.config = window.HuevoConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            console.log('📡 Fetching:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la petición');
            const data = await response.json();
            console.log('✅ Datos recibidos:', data);
            return data;
        } catch (error) {
            console.error('❌ Error en getAll:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.CREAR}`;
            console.log('📡 Creating:', url, data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al crear');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ACTUALIZAR}`;
            console.log('📡 Updating:', url, data);
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al actualizar');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}/${id}`;
            console.log('📡 Deleting:', url);
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en delete:', error);
            throw error;
        }
    }

    async getFiltered(filters) {
        try {
            const params = new URLSearchParams();
            if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
            if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
            if (filters.provincia) params.append('provincia', filters.provincia);
            if (filters.tipo) params.append('tipo', filters.tipo);
            if (filters.mercado) params.append('mercado', filters.mercado);
            if (filters.proveedor) params.append('proveedor', filters.proveedor);

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.FILTRO}?${params}`;
            console.log('📡 Filtering:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en filtrado');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en getFiltered:', error);
            throw error;
        }
    }

    async getProvincias() {
        try {
            const url = `${this.baseUrl}${this.config.CATALOGOS.PROVINCIAS}`;
            console.log('📡 Fetching provincias:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar provincias');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en getProvincias:', error);
            return [];
        }
    }

    async getTipos() {
        try {
            const url = `${this.baseUrl}${this.config.CATALOGOS.TIPOS}`;
            console.log('📡 Fetching tipos:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar tipos');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en getTipos:', error);
            return [];
        }
    }

    async getMercados() {
        try {
            const url = `${this.baseUrl}${this.config.CATALOGOS.MERCADOS}`;
            console.log('📡 Fetching mercados:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar mercados');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en getMercados:', error);
            return [];
        }
    }

    async getProveedores() {
        try {
            const url = `${this.baseUrl}${this.config.CATALOGOS.PROVEEDORES}`;
            console.log('📡 Fetching proveedores:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar proveedores');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en getProveedores:', error);
            return [];
        }
    }

    async exportToExcel(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
            if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
            if (filters.provincia) params.append('provincia', filters.provincia);
            if (filters.tipo) params.append('tipo', filters.tipo);
            if (filters.mercado) params.append('mercado', filters.mercado);
            if (filters.proveedor) params.append('proveedor', filters.proveedor);

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXCEL}?${params}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('❌ Error al exportar:', error);
            throw error;
        }
    }
}

window.HuevoService = HuevoService;
