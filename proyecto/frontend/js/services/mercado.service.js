class MercadoService {
    constructor() {
        this.config = window.MercadoConfig;
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
            
            const text = await response.text();
            if (!response.ok) {
                const errorData = JSON.parse(text);
                throw new Error(errorData.error || 'Error al crear');
            }
            
            return JSON.parse(text);
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
            
            const text = await response.text();
            if (!response.ok) {
                const errorData = JSON.parse(text);
                throw new Error(errorData.error || 'Error al actualizar');
            }
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(codigo) {
        try {
            // Tu backend acepta DELETE o POST en: /mercado/borrar/{codigo}
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}/${codigo}`;
            
            console.log('Eliminando con URL:', url);
            
            // Primero intentar con DELETE
            let response = await fetch(url, {
                method: 'DELETE',
                headers: { 
                    'Accept': 'application/json'
                }
            });
            
            // Si DELETE no funciona (405 Method Not Allowed), intentar con POST
            if (response.status === 405) {
                console.log('DELETE no permitido, intentando con POST...');
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 
                        'Accept': 'application/json'
                    }
                });
            }
            
            // Leer la respuesta
            const text = await response.text();
            
            // Si está vacío y OK, asumir éxito
            if (!text && response.ok) {
                return { success: true, message: 'Registro eliminado' };
            }
            
            // Verificar si es error PHP/HTML
            if (text.includes('<br') || text.includes('<!DOCTYPE') || text.includes('<html')) {
                console.error('Error PHP en el servidor:', text);
                
                // Si el status es 200 a pesar del error HTML, puede ser que funcionó
                if (response.status === 200) {
                    console.warn('Respuesta HTML pero status 200, asumiendo éxito');
                    return { success: true, message: 'Registro eliminado' };
                }
                
                throw new Error('Error del servidor al eliminar');
            }
            
            // Intentar parsear JSON
            try {
                const result = JSON.parse(text);
                
                if (!response.ok && result.error) {
                    throw new Error(result.error);
                }
                
                return result;
            } catch (e) {
                // Si no se puede parsear pero el status es OK
                if (response.ok) {
                    return { success: true, message: 'Registro eliminado' };
                }
                throw new Error('Error al eliminar el registro');
            }
            
        } catch (error) {
            console.error('Error en delete:', error);
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

    async exportToExcel() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXCEL}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al exportar:', error);
            throw error;
        }
    }
}

window.MercadoService = MercadoService;

