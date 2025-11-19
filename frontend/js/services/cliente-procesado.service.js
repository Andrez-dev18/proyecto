class ClienteProcesadoService {
    constructor() {
        this.baseURL = ClienteProcesadoConfig.API.BASE_URL;
        this.endpoints = ClienteProcesadoConfig.API.ENDPOINTS;
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.ALL}`;
            console.log('Fetching from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Data received:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error in getAll:', error);
            throw error;
        }
    }

    async crear(data) {
        try {
            const url = `${this.baseURL}${this.endpoints.CREAR}`;
            console.log('Creando registro:', url, data);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();
            console.log('Response crear:', responseText);

            if (!response.ok) {
                let error;
                try {
                    error = JSON.parse(responseText);
                } catch (e) {
                    error = { message: responseText };
                }
                throw new Error(error.message || error.error || 'Error al crear registro');
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const url = `${this.baseURL}${this.endpoints.EDITAR}`;
            console.log('Actualizando registro:', url, data);
            
            let response = await fetch(url, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Si PUT falla, intentar con POST
            if (!response.ok && (response.status === 405 || response.status === 404)) {
                console.log('PUT falló, intentando con POST...');
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            }

            const responseText = await response.text();
            console.log('Response actualizar:', responseText);

            if (!response.ok) {
                let error;
                try {
                    error = JSON.parse(responseText);
                } catch (e) {
                    error = { message: responseText };
                }
                throw new Error(error.message || error.error || 'Error al actualizar registro');
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseURL}${this.endpoints.BORRAR}/${id}`;
            console.log('Eliminando registro:', url);
            
            let response = await fetch(url, { 
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            // Si DELETE falla, intentar con POST
            if (!response.ok && (response.status === 405 || response.status === 404)) {
                console.log('DELETE falló, intentando con POST...');
                response = await fetch(url, { 
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            }

            const responseText = await response.text();
            console.log('Response eliminar:', responseText);

            if (!response.ok) {
                let error;
                try {
                    error = JSON.parse(responseText);
                } catch (e) {
                    error = { message: responseText };
                }
                throw new Error(error.message || error.error || 'Error al eliminar registro');
            }

            return responseText ? JSON.parse(responseText) : { success: true };
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }

    async filtrar(params) {
        try {
            const queryParams = new URLSearchParams();
            
            // Agregar parámetros de filtro
            if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
            if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
            
            // Agregar parámetros de DataTables
            if (params.start !== undefined) queryParams.append('start', params.start);
            if (params.length !== undefined) queryParams.append('length', params.length);
            if (params.search && params.search.value) {
                queryParams.append('search[value]', params.search.value);
            }

            const url = `${this.baseURL}${this.endpoints.FILTRO}?${queryParams.toString()}`;
            console.log('Filtering URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const responseText = await response.text();
            console.log('Response filtrar:', responseText);

            if (!response.ok) {
                let error;
                try {
                    error = JSON.parse(responseText);
                } catch (e) {
                    error = { message: responseText };
                }
                throw new Error(error.message || error.error || `HTTP error! status: ${response.status}`);
            }

            const result = JSON.parse(responseText);
            console.log('Filter result:', result);
            return result;
        } catch (error) {
            console.error('Error en filtrar:', error);
            throw error;
        }
    }

    async exportar() {
        try {
            const url = `${this.baseURL}${this.endpoints.EXPORTA}`;
            console.log('Exportando desde:', url);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    async ejecutarETL(data) {
        try {
            const url = `${this.baseURL}${this.endpoints.ETL}`;
            console.log('=== EJECUTANDO ETL ===');
            console.log('URL:', url);
            console.log('Datos enviados:', JSON.stringify(data));
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status);
            
            // Obtener el texto de respuesta primero
            const responseText = await response.text();
            console.log('Response text completo:', responseText);
            
            // Verificar si la respuesta está vacía
            if (!responseText) {
                console.error('Respuesta vacía del servidor');
                return {
                    success: false,
                    mensaje: 'El servidor no devolvió ninguna respuesta',
                    error: 'Respuesta vacía'
                };
            }
            
            // Intentar parsear como JSON
            let result;
            try {
                result = JSON.parse(responseText);
                console.log('Respuesta parseada:', result);
            } catch (parseError) {
                console.error('Error al parsear JSON:', parseError);
                console.error('Texto recibido:', responseText);
                
                // Si no es JSON válido, devolver error
                return {
                    success: false,
                    mensaje: 'Respuesta inválida del servidor',
                    error: responseText.substring(0, 200)
                };
            }

            // Verificar si la respuesta indica éxito
            if (!response.ok) {
                console.error('Respuesta no OK:', response.status);
                return {
                    success: false,
                    mensaje: result.mensaje || result.error || 'Error en el servidor',
                    error: result.error || `Status: ${response.status}`
                };
            }

            // Verificar el campo success en la respuesta
            if (result.success === false) {
                console.error('ETL reportó fallo:', result);
                return {
                    success: false,
                    mensaje: result.mensaje || 'El ETL no se ejecutó correctamente',
                    error: result.error || 'Error desconocido'
                };
            }

            // Si llegamos aquí, el ETL fue exitoso
            console.log('ETL ejecutado exitosamente:', result);
            return result;
            
        } catch (error) {
            console.error('=== ERROR EN ETL ===');
            console.error('Error completo:', error);
            console.error('Stack:', error.stack);
            
            return {
                success: false,
                mensaje: 'Error al comunicarse con el servidor',
                error: error.message
            };
        }
    }
}

// Hacer disponible globalmente
window.ClienteProcesadoService = ClienteProcesadoService;
