class TrozadoAutoserService {
    constructor() {
        this.config = window.TrozadoAutoserConfig;
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
            if (filtros.corte) params.append('corte', filtros.corte);

            const url = `${this.baseURL}${this.endpoints.FILTRO}?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || result || [];
        } catch (error) {
            console.error('Error:', error);
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

    async getCortes() {
        try {
            const url = `${this.baseURL}${this.config.CATALOGOS.CORTES}`;
            console.log('📦 Intentando cargar cortes desde:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn('⚠️ Endpoint de cortes no disponible, usando valores por defecto');
                // SOLO LOS 6 CORTES QUE EXISTEN
                return [
                    { id: 1, corte: 'PECHUGA ESPECIAL' },
                    { id: 2, corte: 'PIERNA ESPECIAL' },
                    { id: 3, corte: 'MUSLITO' },
                    { id: 4, corte: 'ESPINAZO' },
                    { id: 5, corte: 'ALITAS' },
                    { id: 6, corte: 'HIGADO' }
                ];
            }
            
            const data = await response.json();
            console.log('✅ Cortes cargados desde backend:', data);
            
            return data.map(item => ({
                id: item.codigo || item.id,
                corte: item.nombre
            }));
        } catch (error) {
            console.error('❌ Error al cargar cortes, usando valores por defecto:', error);
            // SOLO LOS 6 CORTES QUE EXISTEN
            return [
                { id: 1, corte: 'PECHUGA ESPECIAL' },
                { id: 2, corte: 'PIERNA ESPECIAL' },
                { id: 3, corte: 'MUSLITO' },
                { id: 4, corte: 'ESPINAZO' },
                { id: 5, corte: 'ALITAS' },
                { id: 6, corte: 'HIGADO' }
            ];
        }
    }
}

window.TrozadoAutoserService = TrozadoAutoserService;
