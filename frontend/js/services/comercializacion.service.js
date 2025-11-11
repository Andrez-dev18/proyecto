class ComercializacionService {
    constructor() {
        this.baseURL = AppConfig.API.BASE_URL;
    }

    // ========== VIVO AREQUIPA ==========
    
    async getVivoAqp() {
        try {
            const url = `${this.baseURL}/vivoArequipa/all`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            // Asegurar que retornamos siempre un array
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`No se pudo cargar Vivo Arequipa: ${error.message}`);
        }
    }

    async filtrarVivoAqp(filtros) {
        try {
        const params = new URLSearchParams();

        // Solo añadir los parámetros que tengan valor
        if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
        if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
        if (filtros.mercado) params.append('mercado', filtros.mercado);
        if (filtros.proveedor) params.append('proveedor', filtros.proveedor);
        if (filtros.condicion) params.append('condicion', filtros.condicion);

        const url = `${this.baseURL}/vivoArequipa/filtro?${params}`;
        

        const response = await fetch(url);
        

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (!result || typeof result !== 'object' || !Array.isArray(result.data)) {
            throw new Error('Formato de respuesta inválido');
        }

        return result;
    } catch (error) {
        console.error('Error en filtrarVivoAqp:', error);
        throw error;
    }
    }

    // ========== VIVO PROVINCIA ==========
    
    async getVivoProvincia() {
        try {
            const url = `${this.baseURL}/vivoProvincia/all`;
            

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
         
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            
            // Asegurar que retornamos siempre un array
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`No se pudo cargar Vivo Provincia: ${error.message}`);
        }
    }

    async filtrarVivoProvincia(filtros) {
        
        try {
            const params = new URLSearchParams();
            
            // Solo añadir parámetros que tengan valor
            if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
            if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
            if (filtros.provincia) params.append('provincia', filtros.provincia);
            if (filtros.proveedor) params.append('proveedor', filtros.proveedor);
            if (filtros.tipo) params.append('tipo', filtros.tipo);
            
            const url = `${this.baseURL}/vivoProvincia/filtro?${params}`;
            
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const error = await response.text();
                console.error('Error response:', error);
                throw new Error(`Error ${response.status}: ${error}`);
            }
            
            const result = await response.json();
            
            return result; // Retornamos el objeto completo {status, data}
        } catch (error) {
            console.error('Error en filtrarVivoProvincia:', error);
            throw error;
        }
    }

    // ========== CRUD OPERATIONS ==========
    
    async crear(tabla, data) {
        try {
            const endpoint = tabla === 'com_db_vivo_aqp' ? '/vivoArequipa/crear' : '/vivoProvincia/crear';
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al crear registro');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en crear:', error);
            throw error;
        }
    }

    async actualizar(tabla, data) {
        try {
            const endpoint = tabla === 'com_db_vivo_aqp' ? '/vivoArequipa/actualizar' : '/vivoProvincia/actualizar';
            const url = `${this.baseURL}${endpoint}`;
                        
            let response = await fetch(url, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            const responseText = await response.text();
            
            if (!response.ok) {
                // Retry with POST fallback (some servers/clients can't send PUT)
                console.warn('PUT failed, status', response.status, 'retrying with POST fallback');
                response = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                const fallbackText = await response.text();
                if (!response.ok) {
                    let errorMsg = 'Error al actualizar registro';
                    try {
                        const errorData = JSON.parse(fallbackText);
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch (e) {
                        errorMsg = fallbackText || errorMsg;
                    }
                    throw new Error(errorMsg);
                }
                return JSON.parse(fallbackText);
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(tabla, id) {
        try {
            const endpoint = tabla === 'com_db_vivo_aqp' ? '/vivoArequipa/borrar' : '/vivoProvincia/borrar';
            const url = `${this.baseURL}${endpoint}/${id}`;
            
            console.log('=== ELIMINAR REGISTRO ===');
            console.log('URL:', url);
            console.log('Método: DELETE');
            console.log('ID:', id);
            
            let response = await fetch(url, { method: 'DELETE' });

            console.log('Status respuesta:', response.status);

            let responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);

            if (!response.ok) {
                // If server returned HTML (unexpected) or DELETE not allowed, try POST fallback
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('text/html') || response.status === 405 || response.status === 404) {
                    console.warn('DELETE returned HTML or failed, retrying with POST fallback');
                    response = await fetch(url, { method: 'POST' });
                    responseText = await response.text();
                    console.log('Fallback (POST) respuesta del servidor:', responseText);
                }

                if (!response.ok) {
                    let errorMsg = 'Error al eliminar registro';
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch (e) {
                        errorMsg = responseText || errorMsg;
                    }
                    throw new Error(errorMsg);
                }
            }

            return responseText ? JSON.parse(responseText) : { success: true };
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }
    
    async exportarCSV(tabla) {
        try {
            const endpoint = tabla === 'com_db_vivo_aqp' ? '/reporte/vivoArequipa/excel' : '/reporte/vivoProvincia/excel';
            console.log('Exportando a CSV:', endpoint);
            
            // Abrir en nueva pestaña para descargar
            window.open(`${this.baseURL}${endpoint}`, '_blank');
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    // ========== CATÁLOGOS ==========
    
    async getEmpresas() {
        const response = await fetch(`${this.baseURL}/empresa/all`);
        if (!response.ok) throw new Error('Error al obtener empresas');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            empresa: item.nombre
        }));
    }

    async getMercados() {
        const response = await fetch(`${this.baseURL}/mercado/all`);
        if (!response.ok) throw new Error('Error al obtener mercados');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            mercado: item.nombre
        }));
    }

    async getProveedores() {
        const response = await fetch(`${this.baseURL}/proveedor/all`);
        if (!response.ok) throw new Error('Error al obtener proveedores');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            proveedor: item.nombre
        }));
    }

    async getProvincias() {
        const response = await fetch(`${this.baseURL}/provincia/all`);
        if (!response.ok) throw new Error('Error al obtener provincias');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            provincia: item.nombre
        }));
    }

    async getCondiciones() {
        const response = await fetch(`${this.baseURL}/condicion/all`);
        if (!response.ok) throw new Error('Error al obtener condiciones');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            condicion: item.nombre
        }));
    }

    async getTipos() {
        const response = await fetch(`${this.baseURL}/tipo/all`);
        if (!response.ok) throw new Error('Error al obtener tipos');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            tipo: item.nombre
        }));
    }
}
window.ComercializacionService = new ComercializacionService();