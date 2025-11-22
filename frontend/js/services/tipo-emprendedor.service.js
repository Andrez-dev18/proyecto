class TipoEmprendedorService {
    constructor() {
        this.config = window.TipoEmprendedorConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener datos');
            return await response.json();
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.CREAR}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al crear');
            return result;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ACTUALIZAR}`;
            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (!response.ok && response.status === 405) {
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al actualizar');
            return result;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(codigo) {
        try {
            const url = `${this.baseUrl}/tipoEmpren/borrar/${codigo}`;
            console.log('🗑️ DELETE URL:', url);
            
            let response = await fetch(url, { 
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            
            // Si DELETE no funciona, intentar con POST
            if (response.status === 405 || response.status === 404) {
                console.log('⚠️ Intentando con POST...');
                response = await fetch(url, { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
            }
            
            // Leer respuesta como texto primero
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            // Si la respuesta está vacía pero el status es 200, asumir éxito
            if (response.ok && !responseText.trim()) {
                return { message: 'Registro eliminado correctamente' };
            }
            
            // Intentar parsear como JSON
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                // Si no es JSON válido pero el status es 200, asumir éxito
                if (response.ok) {
                    return { message: 'Registro eliminado correctamente' };
                }
                // Si hay error y no es JSON, lanzar error con el texto
                console.error('❌ Respuesta no es JSON:', responseText);
                throw new Error('Error en el servidor. Revisa que no haya warnings de PHP.');
            }
            
            if (!response.ok) {
                throw new Error(result.error || 'Error al eliminar');
            }
            
            return result;
        } catch (error) {
            console.error('❌ Error en delete:', error);
            throw error;
        }
    }

    exportToExcel() {
        const url = `${this.baseUrl}/tipoEmpren/exportar`;
        window.open(url, '_blank');
    }
}

window.TipoEmprendedorService = TipoEmprendedorService;
