/*class VivoArequipaService {
    constructor() {
        // URL base directa
        this.baseUrl = 'http://localhost/proyecto/backend';
        this.config = window.VivoArequipaConfig;
    }

    async getAll() {
        try {
            // Intentar primero con la ruta completa
            const url = `${this.baseUrl}/vivo/arequipa/all`;
            console.log('📡 Intentando obtener datos de:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Incluir cookies si hay autenticación
            });
            
            console.log('📨 Response status:', response.status);
            
            // Si hay error 401, intentar con otra ruta
            if (response.status === 401) {
                console.warn('⚠️ Error 401: No autorizado. Posible problema de autenticación');
                throw new Error('No autorizado. Por favor, inicia sesión.');
            }
            
            if (response.status === 404) {
                console.warn('⚠️ Error 404: Ruta no encontrada');
                // Intentar ruta alternativa
                const altUrl = `${this.baseUrl}/vivoArequipa/all`;
                console.log('📡 Intentando ruta alternativa:', altUrl);
                
                const altResponse = await fetch(altUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                
                if (altResponse.ok) {
                    const data = await altResponse.json();
                    console.log('✅ Datos obtenidos de ruta alternativa:', data.length);
                    return Array.isArray(data) ? data : [];
                }
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
            }
            
            const responseText = await response.text();
            console.log('📨 Response text (primeros 200 chars):', responseText.substring(0, 200));
            
            // Verificar si la respuesta está vacía
            if (!responseText || responseText.trim() === '') {
                console.warn('⚠️ Respuesta vacía del servidor');
                return [];
            }
            
            // Intentar parsear JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('❌ Error parsing JSON:', e);
                console.error('Response was:', responseText);
                
                // Verificar si es un error de PHP/HTML
                if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
                    console.error('❌ El servidor devolvió HTML en lugar de JSON');
                    throw new Error('El servidor devolvió HTML en lugar de JSON. Posible error en el backend.');
                }
                
                throw new Error('Respuesta inválida del servidor');
            }
            
            console.log('📦 Datos parseados:', data);
            console.log(`✅ ${Array.isArray(data) ? data.length : 0} registros obtenidos`);
            
            return Array.isArray(data) ? data : [];
            
        } catch (error) {
            console.error('❌ Error en getAll:', error);
            
            // Intentar hacer una petición de prueba simple
            console.log('🔍 Haciendo prueba de conectividad...');
            try {
                const testResponse = await fetch(`${this.baseUrl}/`, {
                    method: 'GET'
                });
                console.log('✅ El servidor responde en la URL base');
            } catch (testError) {
                console.error('❌ No se puede conectar al servidor en:', this.baseUrl);
            }
            
            throw error;
        }
    }

    // Método para probar diferentes rutas posibles
    async testAllPossibleRoutes() {
        const possibleRoutes = [
            '/vivo/arequipa/all',
            '/vivoArequipa/all',
            '/vivo/arequipa',
            '/vivoarquipa/all',
            '/api/vivo/arequipa/all',
            '/index.php/vivo/arequipa/all'
        ];
        
        console.log('🔍 Probando todas las rutas posibles...');
        
        for (const route of possibleRoutes) {
            const url = `${this.baseUrl}${route}`;
            console.log(`Probando: ${url}`);
            
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    console.log(`✅ Ruta encontrada: ${url}`);
                    const data = await response.json();
                    return { success: true, url: url, data: data };
                } else {
                    console.log(`❌ ${url} - Status: ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ ${url} - Error: ${error.message}`);
            }
        }
        
        return { success: false, message: 'No se encontró ninguna ruta válida' };
    }

    // Resto de métodos igual...
    
    async getFiltered(filtros) {
        try {
            const params = new URLSearchParams();
            
            if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
            if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
            if (filtros.mercado) params.append('mercado', filtros.mercado);
            if (filtros.empresa) params.append('empresa', filtros.empresa);
            if (filtros.proveedor) params.append('proveedor', filtros.proveedor);
            if (filtros.condicion) params.append('condicion', filtros.condicion);

            const url = `${this.baseUrl}/vivo/arequipa/filtro?${params}`;
            console.log('📡 Filtrando datos:', url);
            
            const response = await fetch(url, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`✅ ${result.data ? result.data.length : 0} registros filtrados`);
            return result;
        } catch (error) {
            console.error('❌ Error en getFiltered:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const url = `${this.baseUrl}/vivo/arequipa/crear`;
            console.log('📡 Creando registro en:', url);
            console.log('📦 Datos a enviar:', data);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            
            const responseText = await response.text();
            console.log('📨 Respuesta del servidor:', responseText);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${responseText}`);
            }
            
            try {
                return JSON.parse(responseText);
            } catch (e) {
                return { success: true, message: responseText };
            }
        } catch (error) {
            console.error('❌ Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const url = `${this.baseUrl}/vivo/arequipa/actualizar`;
            console.log('📡 Actualizando registro en:', url);
            console.log('📦 Datos a enviar:', data);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            
            const responseText = await response.text();
            console.log('📨 Respuesta del servidor:', responseText);
            
            if (!response.ok) {
                // Intentar con POST si PUT falla
                console.warn('⚠️ PUT falló, intentando con POST...');
                const responseFallback = await fetch(url, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data),
                    credentials: 'include'
                });
                
                const fallbackText = await responseFallback.text();
                if (!responseFallback.ok) {
                    throw new Error(`Error ${responseFallback.status}: ${fallbackText}`);
                }
                
                try {
                    return JSON.parse(fallbackText);
                } catch (e) {
                    return { success: true, message: fallbackText };
                }
            }

            try {
                return JSON.parse(responseText);
            } catch (e) {
                return { success: true, message: responseText };
            }
        } catch (error) {
            console.error('❌ Error en update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const url = `${this.baseUrl}/vivo/arequipa/borrar/${id}`;
            console.log('📡 Eliminando registro:', url);
            
            const response = await fetch(url, { 
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            
            const responseText = await response.text();
            console.log('📨 Respuesta del servidor:', responseText);

            if (!response.ok) {
                // Intentar con POST si DELETE falla
                console.warn('⚠️ DELETE falló, intentando con POST...');
                const responseFallback = await fetch(url, { 
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });
                
                const fallbackText = await responseFallback.text();
                if (!responseFallback.ok) {
                    throw new Error(`Error ${responseFallback.status}: ${fallbackText}`);
                }
                
                try {
                    return JSON.parse(fallbackText);
                } catch (e) {
                    return { success: true, message: fallbackText };
                }
            }

            try {
                return JSON.parse(responseText);
            } catch (e) {
                return { success: true, message: responseText };
            }
        } catch (error) {
            console.error('❌ Error en delete:', error);
            throw error;
        }
    }

    async exportToExcel(filtros = {}) {
        try {
            const params = new URLSearchParams();
            
            Object.keys(filtros).forEach(key => {
                if (filtros[key]) params.append(key, filtros[key]);
            });

            const queryString = params.toString();
            const url = `${this.baseUrl}/vivo/arequipa/exportar${queryString ? '?' + queryString : ''}`;
            
            console.log('📊 Exportando Excel desde:', url);
            window.open(url, '_blank');
            
            return { success: true, message: 'Exportación iniciada' };
        } catch (error) {
            console.error('❌ Error al exportar:', error);
            throw error;
        }
    }

    // Catálogos con mejor manejo de errores
    async getEmpresas() {
        try {
            const url = `${this.baseUrl}/empresa/all`;
            console.log('📋 Obteniendo empresas de:', url);
            
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                console.error('❌ Error response:', response.status);
                return [];
            }
            
            const data = await response.json();
            console.log('📦 Empresas obtenidas:', data);
            return data.map(item => ({
                id: item.codigo || item.id,
                empresa: item.nombre || item.empresa,
                ruc: item.ruc || ''
            }));
        } catch (error) {
            console.error('❌ Error al obtener empresas:', error);
            return [];
        }
    }

    async getMercados() {
        try {
            const url = `${this.baseUrl}/mercado/all`;
            console.log('📋 Obteniendo mercados de:', url);
            
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                console.error('❌ Error response:', response.status);
                return [];
            }
            
            const data = await response.json();
            console.log('📦 Mercados obtenidos:', data);
            return data.map(item => ({
                id: item.codigo || item.id,
                mercado: item.nombre || item.mercado
            }));
        } catch (error) {
            console.error('❌ Error al obtener mercados:', error);
            return [];
        }
    }

    async getProveedores() {
        try {
            const url = `${this.baseUrl}/proveedor/all`;
            console.log('📋 Obteniendo proveedores de:', url);
            
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                console.error('❌ Error response:', response.status);
                return [];
            }
            
            const data = await response.json();
            console.log('📦 Proveedores obtenidos:', data);
            return data.map(item => ({
                id: item.codigo || item.id,
                proveedor: item.nombre || item.proveedor,
                ruc: item.ruc || ''
            }));
        } catch (error) {
            console.error('❌ Error al obtener proveedores:', error);
            return [];
        }
    }

    async getCondiciones() {
        try {
            const url = `${this.baseUrl}/condicion/all`;
            console.log('📋 Obteniendo condiciones de:', url);
            
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                console.error('❌ Error response:', response.status);
                return [];
            }
            
            const data = await response.json();
            console.log('📦 Condiciones obtenidas:', data);
            return data.map(item => ({
                id: item.codigo || item.id,
                condicion: item.nombre || item.condicion
            }));
        } catch (error) {
            console.error('❌ Error al obtener condiciones:', error);
            return [];
        }
    }
}

// Hacer disponible globalmente
window.VivoArequipaService = VivoArequipaService;

// Función de prueba para encontrar la ruta correcta
window.findCorrectRoute = async function() {
    const service = new VivoArequipaService();
    const result = await service.testAllPossibleRoutes();
    console.log('Resultado de búsqueda de rutas:', result);
    return result;
};
*/