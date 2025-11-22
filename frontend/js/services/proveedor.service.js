class ProveedorService {
    constructor() {
        this.config = window.ProveedorConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            console.log('Fetching proveedores:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la petición');
            const data = await response.json();
            console.log('Proveedores recibidos:', data);
            return data;
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.CREAR}`;
            console.log('Creating proveedor:', url, data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al crear proveedor');
            }
            
            return result;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ACTUALIZAR}`;
            console.log('Updating proveedor:', url, data);
            
            // Primero intentar con PUT
            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            // Si PUT falla, intentar con POST como fallback
            if (!response.ok && response.status === 405) {
                console.log('PUT no soportado, intentando con POST');
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al actualizar proveedor');
            }
            
            return result;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(codigo) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}/${codigo}`;
            console.log('Deleting proveedor:', url);
            
            // Primero intentar con DELETE
            let response = await fetch(url, {
                method: 'DELETE'
            });
            
            // Si DELETE falla o no está soportado, intentar con POST
            if (!response.ok && (response.status === 405 || response.status === 404)) {
                console.log('DELETE no soportado, intentando con POST');
                response = await fetch(url, {
                    method: 'POST'
                });
            }
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al eliminar proveedor');
            }
            
            return result;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    async exportToExcel() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXPORTAR}`;
            console.log('Exportando a Excel:', url);
            
            // Abrir en nueva ventana para descargar el archivo
            window.open(url, '_blank');
            
            return { success: true, message: 'Exportación iniciada' };
        } catch (error) {
            console.error('Error al exportar:', error);
            throw error;
        }
    }
}

window.ProveedorService = ProveedorService;

