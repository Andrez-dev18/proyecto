class TamanoMercadoService {
    constructor() {
        this.baseURL = AppConfig.API.BASE_URL;
    }

    async getAll() {
        try {
            const url = `${this.baseURL + AppConfig.API.ENDPOINTS.TAMAMERDIA.ALL}`;
            console.log('Fetch URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Data received:', data);
            
            // Asegurar que retornamos siempre un array
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`No se pudo cargar Vivo Arequipa: ${error.message}`);
        }
    }

}