class PVentasBeneficiadoProvinciasService {
    constructor() {
        this.config = PVentasBeneficiadoProvinciasConfig;
    }

    async getAll() {
        try {
            const url = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.ALL}`;
            console.log('📡 Fetching from:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                // Si falla /all, intentar sin /all
                console.log('Intentando ruta alternativa sin /all');
                const urlAlt = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.FILTRO}`;
                const responseAlt = await fetch(urlAlt);
                
                if (!responseAlt.ok) {
                    throw new Error(`Error ${responseAlt.status}: ${responseAlt.statusText}`);
                }
                
                const dataAlt = await responseAlt.json();
                console.log('✅ Datos recibidos (ruta alternativa):', dataAlt);
                return Array.isArray(dataAlt) ? dataAlt : [];
            }
            
            const data = await response.json();
            console.log('✅ Datos recibidos:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('❌ Error en getAll:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const datosParaEnviar = this.limpiarDatos(data);
            
            const url = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.CREAR}`;
            console.log('📤 Creando registro en:', url);
            console.log('Datos a enviar:', datosParaEnviar);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosParaEnviar)
            });
            
            const responseText = await response.text();
            console.log('Respuesta del servidor (texto):', responseText);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${responseText}`);
            }
            
            try {
                const jsonResponse = JSON.parse(responseText);
                return jsonResponse;
            } catch {
                return { 
                    success: true, 
                    message: responseText || 'Registro creado exitosamente',
                    id: data.id 
                };
            }
        } catch (error) {
            console.error('❌ Error en create:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            const datosParaEnviar = this.limpiarDatos(data);
            
            const url = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.ACTUALIZAR}`;
            console.log('📤 Actualizando registro en:', url);
            console.log('Datos a enviar:', datosParaEnviar);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosParaEnviar)
            });
            
            const responseText = await response.text();
            console.log('Respuesta del servidor (texto):', responseText);
            
            if (!response.ok) {
                console.warn('PUT falló, intentando con POST...');
                const fallbackResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(datosParaEnviar)
                });
                
                const fallbackText = await fallbackResponse.text();
                
                if (!fallbackResponse.ok) {
                    throw new Error(`Error ${fallbackResponse.status}: ${fallbackText}`);
                }
                
                try {
                    return JSON.parse(fallbackText);
                } catch {
                    return { 
                        success: true, 
                        message: fallbackText || 'Registro actualizado exitosamente',
                        id: data.id 
                    };
                }
            }
            
            try {
                const jsonResponse = JSON.parse(responseText);
                return jsonResponse;
            } catch {
                return { 
                    success: true, 
                    message: responseText || 'Registro actualizado exitosamente',
                    id: data.id 
                };
            }
        } catch (error) {
            console.error('❌ Error en update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const url = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.ELIMINAR}/${id}`;
            console.log('🗑️ Eliminando registro:', url);
            
            const response = await fetch(url, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                console.warn('DELETE falló, intentando con POST...');
                const fallbackResponse = await fetch(url, {
                    method: 'POST'
                });
                
                if (!fallbackResponse.ok) {
                    throw new Error('Error al eliminar');
                }
                
                return await fallbackResponse.json();
            }
            
            return await response.json();
        } catch (error) {
            console.error('❌ Error en delete:', error);
            throw error;
        }
    }

    async getFiltered(filters) {
        try {
            const params = new URLSearchParams();
            if (filters.ano) params.append('ano', filters.ano);
            if (filters.mes) params.append('mes', filters.mes);
            if (filters.provincia) params.append('provincia', filters.provincia);
            if (filters.zona) params.append('zona', filters.zona);
            if (filters.tipoCliente) params.append('tipo_cliente', filters.tipoCliente);

            const url = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.FILTRO}?${params}`;
            console.log('📡 Filtrando desde:', url);
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Error en filtrado');
            return await response.json();
        } catch (error) {
            console.error('❌ Error en getFiltered:', error);
            throw error;
        }
    }

    exportToExcel() {
        const url = `${this.config.API.BASE_URL}${this.config.API.ENDPOINTS.EXCEL}`;
        window.open(url, '_blank');
    }

    limpiarDatos(data) {
        const datosLimpios = {};
        
        for (const key in data) {
            const value = data[key];
            
            if (['id', 'ano', 'mes', 'nombre'].includes(key)) {
                if (value !== null && value !== undefined && value !== '') {
                    datosLimpios[key] = value;
                }
            }
            else if (typeof value === 'string') {
                if (value && value.trim() !== '') {
                    datosLimpios[key] = value.trim();
                }
            }
            else if (typeof value === 'number') {
                datosLimpios[key] = value;
            }
            else if (value !== null && value !== undefined && value !== '') {
                datosLimpios[key] = value;
            }
        }
        
        const camposNumericos = [
            'grs', 'rp', 'grs_vivo', 'santa_elena', 'granjas_chicas',
            'rosario', 'sanfern_lima', 'avicola_renzo', 'otros',
            'potencial_minimo', 'potencial_maximo'
        ];
        
        camposNumericos.forEach(campo => {
            if (!(campo in datosLimpios) || datosLimpios[campo] === null || datosLimpios[campo] === '') {
                datosLimpios[campo] = 0;
            }
        });
        
        return datosLimpios;
    }
}

window.PVentasBeneficiadoProvinciasService = PVentasBeneficiadoProvinciasService;

