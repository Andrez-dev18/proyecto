class VivoProvinciaService {
    constructor() {
        this.baseURL = 'http://localhost/proyecto/backend';
    }

    async getAll() {
        try {
            const url = `${this.baseURL}/vivoProvincia/all`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error:', error);
            throw new Error(`No se pudo cargar los datos: ${error.message}`);
        }
    }

    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL}/vivoProvincia/crear`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Error al crear registro');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const response = await fetch(`${this.baseURL}/vivoProvincia/actualizar`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                // Retry with POST fallback
                console.warn('PUT failed, retrying with POST fallback');
                const fallbackResponse = await fetch(`${this.baseURL}/vivoProvincia/actualizar`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                if (!fallbackResponse.ok) {
                    throw new Error('Error al actualizar registro');
                }
                
                return await fallbackResponse.json();
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const response = await fetch(`${this.baseURL}/vivoProvincia/borrar/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                // Retry with POST fallback
                console.warn('DELETE failed, retrying with POST fallback');
                const fallbackResponse = await fetch(`${this.baseURL}/vivoProvincia/borrar/${id}`, {
                    method: 'POST'
                });
                
                if (!fallbackResponse.ok) {
                    throw new Error('Error al eliminar registro');
                }
                
                return await fallbackResponse.json();
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    exportarCSV() {
        window.open(`${this.baseURL}/reporte/vivoProvincia/excel`, '_blank');
    }

    // Catálogos
    async getProvincias() {
        const response = await fetch(`${this.baseURL}/provincia/all`);
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            provincia: item.nombre
        }));
    }

    async getProveedores() {
        const response = await fetch(`${this.baseURL}/proveedor/all`);
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            proveedor: item.nombre
        }));
    }

    async getTipos() {
        const response = await fetch(`${this.baseURL}/tipo/all`);
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            tipo: item.nombre
        }));
    }
}

window.VivoProvinciaService = VivoProvinciaService;

