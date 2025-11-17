class PVentasVivoArequipaService {
    constructor() {
        // Configuración embebida directamente en el servicio
        this.config = {
            BASE_URL: 'http://localhost/proyecto/backend',
            ENDPOINTS: {
                ALL: '/vivo/arequipa/all',
                FILTRO: '/vivo/arequipa',
                CREAR: '/vivo/crear',
                ACTUALIZAR: '/vivo/actualizar',
                ELIMINAR: '/vivo/borrar',
                EXCEL: '/reporte/vivo/arequipa/excel'
            }
        };
    }

    async getAll() {
        try {
            const url = `${this.config.BASE_URL}${this.config.ENDPOINTS.ALL}`;
            console.log('📡 Fetching from:', url);
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
            const url = `${this.config.BASE_URL}${this.config.ENDPOINTS.CREAR}`;
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
            const url = `${this.config.BASE_URL}${this.config.ENDPOINTS.ACTUALIZAR}`;
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
            const url = `${this.config.BASE_URL}${this.config.ENDPOINTS.ELIMINAR}/${id}`;
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
            if (filters.ano) params.append('ano', filters.ano);
            if (filters.mes) params.append('mes', filters.mes);
            if (filters.provincia) params.append('provincia', filters.provincia);
            if (filters.zona) params.append('zona', filters.zona);
            if (filters.tipoCliente) params.append('tipo_cliente', filters.tipoCliente);

            const url = `${this.config.BASE_URL}${this.config.ENDPOINTS.FILTRO}?${params}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en filtrado');
            return await response.json();
        } catch (error) {
            console.error('Error en getFiltered:', error);
            throw error;
        }
    }

    exportToExcel() {
        const url = `${this.config.BASE_URL}${this.config.ENDPOINTS.EXCEL}`;
        window.open(url, '_blank');
    }
}

window.PVentasVivoArequipaService = PVentasVivoArequipaService;
