class CondicionService {
    constructor() {
        this.config = window.CondicionConfig;
        this.baseUrl = this.config.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseUrl}${this.config.API.ENDPOINTS.ALL}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la petición');
            return await response.json();
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }
}

window.CondicionService = CondicionService;

