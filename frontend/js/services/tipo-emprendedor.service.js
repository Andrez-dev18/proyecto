
class TipoEmprendedorService {
    constructor() {
        this.config = window.TipoEmprendedorConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            console.log('Fetching:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la petición');
            const data = await response.json();
            console.log('Datos recibidos:', data);
            return data;
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.CREAR}`;
            console.log('Creating:', url, data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al crear');
            return result;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ACTUALIZAR}`;
            console.log('Updating:', url, data);
            
            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (!response.ok && response.status === 405) {
                console.log('PUT failed, trying POST...');
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al actualizar');
            return result;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(codigo) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}/${codigo}`;
            console.log('Deleting:', url);
            
            let response = await fetch(url, {
                method: 'DELETE'
            });
            
            if (!response.ok && (response.status === 405 || response.status === 404)) {
                console.log('DELETE failed, trying POST...');
                response = await fetch(url, {
                    method: 'POST'
                });
            }
            
            const responseText = await response.text();
            
            if (response.ok && !responseText.trim()) {
                return { success: true, message: 'Registro eliminado correctamente' };
            }
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                if (response.ok) {
                    return { success: true, message: 'Registro eliminado correctamente' };
                }
                throw new Error('Error al procesar respuesta del servidor');
            }
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al eliminar');
            }
            
            return result;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    exportToExcel() {
        const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXPORTAR}`;
        window.open(url, '_blank');
    }
}

window.TipoEmprendedorService = TipoEmprendedorService;
