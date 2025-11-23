class CondicionService {
    constructor() {
        this.baseURL = AppConfig.API.BASE_URL;
        // Usar directamente los endpoints de TIPO del config global
        this.endpoints = AppConfig.API.ENDPOINTS.TIPO;
    }

    async crear(data) {
        try {
            // Para crear NO enviamos el código
            const dataLimpia = {
                nombre: data.nombre,
                linea: data.linea || null
            };

            console.log('Creando registro con datos:', dataLimpia);

            const response = await fetch(`${this.baseURL}${this.endpoints.CREAR}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataLimpia)
            });

            const responseText = await response.text();
            console.log('Respuesta del servidor (crear):', responseText);

            if (!response.ok) {
                let error;
                try {
                    error = JSON.parse(responseText);
                } catch (e) {
                    throw new Error(responseText || 'Error al crear registro');
                }
                throw new Error(error.message || 'Error al crear registro');
            }

            try {
                return JSON.parse(responseText);
            } catch (e) {
                return { success: true, message: 'Registro creado exitosamente' };
            }
        } catch (error) {
            console.error('Error en crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            // Para actualizar SÍ enviamos el código
            const dataLimpia = {
                codigo: data.codigo,
                nombre: data.nombre,
                linea: data.linea || null
            };

            console.log('Actualizando registro con datos:', dataLimpia);

            const url = `${this.baseURL}${this.endpoints.EDITAR}`;

            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataLimpia)
            });

            let responseText = await response.text();
            console.log('Respuesta del servidor (actualizar):', responseText);

            if (!response.ok) {
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataLimpia)
                });
                responseText = await response.text();
                
                if (!response.ok) {
                    let errorMsg = 'Error al actualizar registro';
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch (e) {
                        errorMsg = responseText || errorMsg;
                    }
                    throw new Error(errorMsg);
                }
            }

            try {
                return JSON.parse(responseText);
            } catch (e) {
                return { success: true, message: 'Registro actualizado exitosamente' };
            }
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(codigo) {
        try {
            // Para eliminar usamos el código en la URL
            const url = `${this.baseURL}${this.endpoints.BORRAR}/${codigo}`;
            console.log('Eliminando registro con código:', codigo, 'URL:', url);

            let response = await fetch(url, { method: 'DELETE' });
            let responseText = await response.text();
            console.log('Respuesta DELETE:', response.status, responseText);

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('text/html') || response.status === 405 || response.status === 404) {
                    console.log('DELETE no permitido, intentando con POST');
                    response = await fetch(url, { method: 'POST' });
                    responseText = await response.text();
                    console.log('Respuesta POST:', response.status, responseText);
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

            try {
                return JSON.parse(responseText);
            } catch (e) {
                return { success: true, message: 'Registro eliminado exitosamente' };
            }
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }

    async filtrar(filtros) {
        try {
            const params = new URLSearchParams();

            if (filtros.nombre) params.append('nombre', filtros.nombre);
            if (filtros.linea) params.append('linea', filtros.linea);

            const url = `${this.baseURL}${this.endpoints.FILTRO}?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error en filtrar:', error);
            throw error;
        }
    }

    async exportarCSV() {
        try {
            window.open(`${this.baseURL}${this.endpoints.EXPORTAR}`, '_blank');
        } catch (error) {
            console.error('Error en exportar:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.ALL}`;
            console.log('Obteniendo todos los registros de:', url);
            
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
            console.log('Datos recibidos:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en getAll:', error);
            throw new Error(`No se pudo cargar los tipos: ${error.message}`);
        }
    }
}

window.CondicionService = CondicionService;
