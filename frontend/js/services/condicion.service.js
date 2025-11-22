class CondicionService {
    constructor() {
        this.config = window.CondicionConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            console.log('Fetching:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Datos recibidos:', data);
            
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }
}

window.CondicionService = CondicionService;

