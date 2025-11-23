
class ProvinciaService {
    constructor() {
        // Verificar que ProvinciaConfig esté disponible
        if (typeof ProvinciaConfig === 'undefined') {
            console.error('ProvinciaConfig no está definido');
            throw new Error('ProvinciaConfig no está definido. Asegúrate de cargar config.provincia.js primero');
        }
        this.baseURL = ProvinciaConfig.API.BASE_URL;
        this.endpoints = ProvinciaConfig.API.ENDPOINTS;
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.ALL}`;
            console.log('Fetching provincias:', url);
            
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
            console.log('Provincias recibidas:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en getAll:', error);
            throw new Error(`No se pudieron cargar las provincias: ${error.message}`);
        }
    }

    async crear(data) {
        try {
            const url = `${this.baseURL}${this.endpoints.CREAR}`;
            console.log('Creando provincia:', url, data);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();
            console.log('Respuesta crear:', responseText);

            if (!response.ok) {
                let error;
                try {
                    error = JSON.parse(responseText);
                } catch (e) {
                    throw new Error(responseText || 'Error al crear provincia');
                }
                throw new Error(error.error || error.message || 'Error al crear provincia');
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const url = `${this.baseURL}${this.endpoints.ACTUALIZAR}`;
            console.log('Actualizando provincia:', url, data);
            
            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            let responseText = await response.text();
            console.log('Respuesta PUT:', response.status, responseText);

            if (!response.ok) {
                console.log('PUT falló, intentando con POST...');
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                responseText = await response.text();
                console.log('Respuesta POST:', response.status, responseText);
                
                if (!response.ok) {
                    let errorMsg = 'Error al actualizar provincia';
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMsg = errorData.error || errorData.message || errorMsg;
                    } catch (e) {
                        errorMsg = responseText || errorMsg;
                    }
                    throw new Error(errorMsg);
                }
            }
            
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseURL}${this.endpoints.ELIMINAR}/${id}`;
            console.log('Eliminando provincia:', url);
            
            let response = await fetch(url, { method: 'DELETE' });
            let responseText = await response.text();
            console.log('Respuesta DELETE:', response.status, responseText);

            if (!response.ok) {
                console.log('DELETE falló, intentando con POST...');
                response = await fetch(url, { method: 'POST' });
                responseText = await response.text();
                console.log('Respuesta POST:', response.status, responseText);

                if (!response.ok) {
                    let errorMsg = 'Error al eliminar provincia';
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMsg = errorData.error || errorData.message || errorMsg;
                    } catch (e) {
                        errorMsg = responseText || errorMsg;
                    }
                    throw new Error(errorMsg);
                }
            }

            return responseText ? JSON.parse(responseText) : { success: true, message: "Registro eliminado correctamente" };
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }

    async exportar() {
        try {
            const url = `${this.baseURL}${this.endpoints.EXPORTAR}`;
            console.log('Exportando provincias:', url);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }
}
