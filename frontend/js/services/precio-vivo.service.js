class PrecioVivoService {
    constructor() {
        this.config = window.PrecioVivoConfig;
        this.baseURL = this.config.API.BASE_URL;
        this.endpoints = this.config.API.ENDPOINTS;
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.ALL}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async filtrar(filtros) {
    try {
        const params = new URLSearchParams();
        if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
        if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
        if (filtros.empresa) params.append('empresa', filtros.empresa);

        const url = `${this.baseURL}${this.endpoints.FILTRO}?${params}`;
        console.log('🔍 URL de filtrado:', url);
        
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Resultado del filtro:', result);
        
        // Manejar diferentes formatos de respuesta
        if (Array.isArray(result)) {
            return result;
        }
        if (result.data && Array.isArray(result.data)) {
            return result.data;
        }
        
        return [];
    } catch (error) {
        console.error('❌ Error en filtrar:', error);
        throw error;
    }
}


    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.CREAR}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.ACTUALIZAR}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.ELIMINAR}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async getEmpresas() {
        try {
            const response = await fetch(`${this.baseURL}${this.config.CATALOGOS.EMPRESAS}`);
            if (!response.ok) return [];
            
            const data = await response.json();
            return data.map(item => ({
                id: item.codigo || item.id,
                empresa: item.nombre
            }));
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }
}