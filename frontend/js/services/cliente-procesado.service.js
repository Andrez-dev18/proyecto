class ClienteProcesadoService {
    constructor() {
        this.config = window.ClienteProcesadoConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            console.log('Fetch URL Cliente Procesado:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('Data received from clienteProce:', data);
            
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`No se pudo cargar Cliente Procesado: ${error.message}`);
        }
    }

    async crear(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.CREAR}`;
            console.log('Crear Cliente Procesado URL:', url);
            
            const response = await fetch(url, {
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
            console.error('Error en crear clienteProce:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ACTUALIZAR}`;

            console.log('=== ACTUALIZAR CLIENTE PROCESADO ===');
            console.log('URL:', url);
            console.log('Método: PUT');
            console.log('Datos enviados:', JSON.stringify(data, null, 2));

            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            console.log('Status respuesta:', response.status);

            const responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);

            if (!response.ok) {
                // Retry with POST fallback
                console.warn('PUT failed, status', response.status, 'retrying with POST fallback');
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const fallbackText = await response.text();
                console.log('Fallback response:', fallbackText);
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
            console.error('Error en actualizar clienteProce:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ELIMINAR}/${id}`;

            console.log('=== ELIMINAR CLIENTE PROCESADO ===');
            console.log('URL:', url);
            console.log('Método: DELETE');
            console.log('ID:', id);

            let response = await fetch(url, { method: 'DELETE' });

            console.log('Status respuesta:', response.status);

            let responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);

            if (!response.ok) {
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
            console.error('Error en eliminar clienteProce:', error);
            throw error;
        }
    }

    async filtrar(filtros) {
        try {
            const params = new URLSearchParams();

            // Solo añadir los parámetros que tengan valor
            if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
            if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
            if (filtros.distrito) params.append('distrito', filtros.distrito);
            if (filtros.zona) params.append('zona', filtros.zona);
            if (filtros.canal) params.append('canal', filtros.canal);
            if (filtros.linea) params.append('linea', filtros.linea);
            if (filtros.vendedor) params.append('vendedor', filtros.vendedor);
            if (filtros.cliente) params.append('cliente', filtros.cliente);

            // Agregar parámetros de DataTables si existen
            if (filtros.start !== undefined) params.append('start', filtros.start);
            if (filtros.length !== undefined) params.append('length', filtros.length);
            if (filtros.search && filtros.search.value) {
                params.append('search[value]', filtros.search.value);
            }

            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.FILTRO}?${params}`;
            console.log('Filtrando clienteProce:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Filtered data received from clienteProce:', result);

            return result;
        } catch (error) {
            console.error('Error en filtrar clienteProce:', error);
            throw error;
        }
    }

    async exportarCSV() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.EXPORTAR}`;
            console.log('Exportar clienteProce URL:', url);
            // Abrir en nueva pestaña para descargar
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error en exportar clienteProce:', error);
            throw error;
        }
    }

    async ejecutarETL(data) {
        try {
            // URL correcta según tu API
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ETL}`;
            
            console.log('=== EJECUTAR ETL CLIENTE PROCESADO ===');
            console.log('URL ETL clienteProce:', url);
            console.log('Datos enviados:', data);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Response status ETL:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response ETL:', errorText);
                
                // Intentar parsear como JSON si es posible
                try {
                    const error = JSON.parse(errorText);
                    throw new Error(error.message || error.error || 'Error al ejecutar ETL');
                } catch (e) {
                    throw new Error('Error al ejecutar ETL clienteProce: ' + errorText);
                }
            }

            const result = await response.json();
            console.log('Resultado ETL clienteProce:', result);
            
            return result;
        } catch (error) {
            console.error('Error en ejecutarETL clienteProce:', error);
            throw error;
        }
    }
}

window.ClienteProcesadoService = ClienteProcesadoService;
