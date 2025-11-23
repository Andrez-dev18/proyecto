
class InfoGRSService {
    constructor() {
        this.baseURL = InfoGRSConfig.API.BASE_URL;
        this.endpoints = InfoGRSConfig.API.ENDPOINTS;
    }

    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.INFOGRS.CREAR}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    async actualizar(data) {
        try {
            const url = `${this.baseURL}${this.endpoints.INFOGRS.EDITAR}`;
            
            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMsg = 'Error al actualizar registro';
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch (e) {
                        errorMsg = errorText || errorMsg;
                    }
                    throw new Error(errorMsg);
                }
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseURL}${this.endpoints.INFOGRS.BORRAR}/${id}`;
            
            let response = await fetch(url, { method: 'DELETE' });

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('text/html') || response.status === 405) {
                    response = await fetch(url, { method: 'POST' });
                }

                if (!response.ok) {
                    const responseText = await response.text();
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

            const responseText = await response.text();
            return responseText ? JSON.parse(responseText) : { success: true };
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }

    async filtrar(filtros) {
        try {
            const params = new URLSearchParams();
            
            if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
            if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
            if (filtros.provincia) params.append('provincia', filtros.provincia);
            if (filtros.zona) params.append('zona', filtros.zona);
            if (filtros.tipo) params.append('tipo', filtros.tipo);
            if (filtros.categoria) params.append('categoria', filtros.categoria);
            if (filtros.linea) params.append('linea', filtros.linea);
            if (filtros.mercado) params.append('mercado', filtros.mercado);

            const url = `${this.baseURL}${this.endpoints.INFOGRS.FILTRO}?${params}`;
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
            console.error('Error en filtrar:', error);
            throw error;
        }
    }

    async exportarExcel() {
        try {
            window.open(`${this.baseURL}${this.endpoints.INFOGRS.EXPORTAR}`, '_blank');
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.INFOGRS.ALL}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en getAll:', error);
            throw new Error(`No se pudo cargar InfoGRS: ${error.message}`);
        }
    }

    async getProvincias() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.PROVINCIAS}`);
        if (!response.ok) throw new Error('Error al obtener provincias');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            nombre: item.nombre
        }));
    }

    async getZonas() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.ZONAS}`);
        if (!response.ok) throw new Error('Error al obtener zonas');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            nombre: item.nombre
        }));
    }

    async getTipos() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.TIPOS}`);
        if (!response.ok) throw new Error('Error al obtener tipos');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            nombre: item.nombre
        }));
    }

    async getCategorias() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.CATEGORIAS}`);
        if (!response.ok) throw new Error('Error al obtener categorías');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            nombre: item.nombre
        }));
    }

    async getLineas() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.LINEAS}`);
        if (!response.ok) throw new Error('Error al obtener líneas');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            nombre: item.nombre
        }));
    }

    async getMercados() {
        const response = await fetch(`${this.baseURL}${this.endpoints.CATALOGOS.MERCADOS}`);
        if (!response.ok) throw new Error('Error al obtener mercados');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            nombre: item.nombre
        }));
    }
}
