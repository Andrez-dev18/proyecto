
class BeneficioProvinciaService {
    constructor() {
        this.config = window.BeneficioProvinciaConfig;
        this.baseURL = this.config.API.BASE_URL;
        this.endpoints = this.config.API.ENDPOINTS;
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.ALL}`;
            console.log('Fetch URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Obtener texto primero para ver qué llega
            const text = await response.text();
            console.log('Response text (first 500 chars):', text.substring(0, 500));
            
            // Intentar parsear como JSON
            const data = JSON.parse(text);
            console.log('Data parsed successfully');
            console.log('Data type:', Array.isArray(data) ? 'Array' : typeof data);
            console.log('Data length:', Array.isArray(data) ? data.length : 'N/A');
            
            // Tu API devuelve un array directo
            if (Array.isArray(data)) {
                return data;
            }
            
            // Si viene en formato {data: [...]}
            if (data.data && Array.isArray(data.data)) {
                return data.data;
            }
            
            // Si es un objeto único, convertirlo a array
            if (typeof data === 'object' && data !== null) {
                return [data];
            }
            
            return [];
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`Error al cargar datos: ${error.message}`);
        }
    }

    async filtrar(filtros) {
        try {
            const params = new URLSearchParams();

            if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
            if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
            if (filtros.provincia) params.append('provincia', filtros.provincia);
            if (filtros.proveedor) params.append('proveedor', filtros.proveedor);

            const url = `${this.baseURL}${this.endpoints.FILTRO}?${params}`;
            console.log('Filtrar URL:', url);
            
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const result = JSON.parse(text);
            
            // Manejar diferentes formatos de respuesta
            if (Array.isArray(result)) {
                return { status: 'success', data: result };
            }
            
            if (result.data && Array.isArray(result.data)) {
                return result;
            }
            
            return { status: 'success', data: [] };
        } catch (error) {
            console.error('Error en filtrar:', error);
            throw error;
        }
    }

    async crear(data) {
        try {
            console.log('Creando registro:', data);
            
            const response = await fetch(`${this.baseURL}${this.endpoints.CREAR}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            return text ? JSON.parse(text) : { success: true };
        } catch (error) {
            console.error('Error en crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            console.log('Actualizando registro:', data);
            
            const response = await fetch(`${this.baseURL}${this.endpoints.ACTUALIZAR}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : { success: true };
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            console.log('Eliminando ID:', id);
            
            const url = `${this.baseURL}${this.endpoints.ELIMINAR}/${id}`;
            const response = await fetch(url, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : { success: true };
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }
    
    async exportarCSV() {
        try {
            window.open(`${this.baseURL}${this.endpoints.EXCEL}`, '_blank');
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    async getProveedores() {
        try {
            const url = `${this.baseURL}${this.config.CATALOGOS.PROVEEDORES}`;
            console.log('Cargando proveedores:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn('No se pudieron cargar proveedores');
                return [];
            }
            
            const text = await response.text();
            const data = JSON.parse(text);
            
            // Si viene como array directo
            if (Array.isArray(data)) {
                return data.map(item => ({
                    id: item.codigo || item.id || item.nombre,
                    nombre: item.nombre
                }));
            }
            
            // Si viene como {data: [...]}
            if (data.data && Array.isArray(data.data)) {
                return data.data.map(item => ({
                    id: item.codigo || item.id || item.nombre,
                    nombre: item.nombre
                }));
            }
            
            return [];
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
            return [];
        }
    }

    async getProvincias() {
        try {
            const url = `${this.baseURL}${this.config.CATALOGOS.PROVINCIAS}`;
            console.log('Cargando provincias:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn('No se pudieron cargar provincias');
                return [];
            }
            
            const text = await response.text();
            const data = JSON.parse(text);
            
            // Si viene como array directo
            if (Array.isArray(data)) {
                return data.map(item => ({
                    id: item.codigo || item.id || item.nombre,
                    nombre: item.nombre
                }));
            }
            
            // Si viene como {data: [...]}
            if (data.data && Array.isArray(data.data)) {
                return data.data.map(item => ({
                    id: item.codigo || item.id || item.nombre,
                    nombre: item.nombre
                }));
            }
            
            return [];
        } catch (error) {
            console.error('Error al cargar provincias:', error);
            return [];
        }
    }
}