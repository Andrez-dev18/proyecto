class AuthService {
    static async login(usuario, password) {
        const url = `${AppConfig.API.BASE_URL}${AppConfig.API.ENDPOINTS.AUTH.LOGIN}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en AuthService.login:', error);
            throw error;
        }
    }
}

window.AuthService = AuthService;
