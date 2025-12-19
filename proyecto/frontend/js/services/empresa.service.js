class EmpresaService {
    constructor() {
        this.config = window.EmpresaConfig;
        this.baseURL = this.config.API.BASE_URL;
        this.endpoints = this.config.API.ENDPOINTS;
    }

    async getAll() {
        try {
            const url = `${this.baseURL}${this.endpoints.ALL}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    async crear(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.CREAR}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            const responseText = await response.text();
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Respuesta inválida del servidor');
            }
            
            if (!response.ok) {
                throw new Error(result.error || `Error HTTP: ${response.status}`);
            }
            
            return result;
        } catch (error) {
            console.error('Error en crear:', error);
            throw error;
        }
    }

    async actualizar(data) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.ACTUALIZAR}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            const responseText = await response.text();
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Respuesta inválida del servidor');
            }
            
            if (!response.ok) {
                throw new Error(result.error || `Error HTTP: ${response.status}`);
            }

            return result;
        } catch (error) {
            console.error('Error en actualizar:', error);
            throw error;
        }
    }

    async eliminar(codigo) {
        try {
            const url = `${this.baseURL}${this.endpoints.ELIMINAR}/${codigo}`;
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: codigo })
            });

            const responseText = await response.text();
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Respuesta inválida del servidor');
            }
            
            if (!response.ok) {
                throw new Error(result.error || `Error HTTP: ${response.status}`);
            }

            return result;
        } catch (error) {
            console.error('Error en eliminar:', error);
            throw error;
        }
    }
}

window.EmpresaService = EmpresaService;
