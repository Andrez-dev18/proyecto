class ComercializacionService {
    constructor() {
        this.baseURL = typeof ComercializacionConfig !== 'undefined' 
            ? ComercializacionConfig.apiBaseURL 
            : 'http://localhost:8033/proyecto/backend';
    }

    // ========== VIVO AREQUIPA ==========
    
    async getVivoAqp() {
        try {
            console.log('Fetch URL:', `${this.baseURL}/comercializacion/vivo-aqp`);
            const response = await fetch(`${this.baseURL}/comercializacion/vivo-aqp`);
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Data received:', data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`No se pudo cargar Vivo Arequipa: ${error.message}`);
        }
    }

    async filtrarVivoAqp(filtros) {
        const params = new URLSearchParams();
        if (filtros.fecha) params.append('fecha', filtros.fecha);
        if (filtros.mercado) params.append('mercado', filtros.mercado);
        if (filtros.proveedor) params.append('proveedor', filtros.proveedor);
        if (filtros.condicion) params.append('condicion', filtros.condicion);

        const response = await fetch(`${this.baseURL}/comercializacion/vivo-aqp?${params}`);
        if (!response.ok) throw new Error('Error al filtrar datos');
        return await response.json();
    }

    // ========== VIVO PROVINCIA ==========
    
    async getVivoProvincia() {
        try {
            console.log('Fetch URL:', `${this.baseURL}/comercializacion/vivo-provincia`);
            const response = await fetch(`${this.baseURL}/comercializacion/vivo-provincia`);
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Data received:', data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error(`No se pudo cargar Vivo Provincia: ${error.message}`);
        }
    }

    async filtrarVivoProvincia(filtros) {
        const params = new URLSearchParams();
        if (filtros.fecha) params.append('fecha', filtros.fecha);
        if (filtros.provincia) params.append('provincia', filtros.provincia);
        if (filtros.proveedor) params.append('proveedor', filtros.proveedor);
        if (filtros.tipo) params.append('tipo', filtros.tipo);

        const response = await fetch(`${this.baseURL}/comercializacion/vivo-provincia?${params}`);
        if (!response.ok) throw new Error('Error al filtrar datos');
        return await response.json();
    }

    // ========== CRUD OPERATIONS ==========
    
    async crear(tabla, data) {
        const response = await fetch(`${this.baseURL}/comercializacion/crear`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ tabla, ...data })
        });
        if (!response.ok) throw new Error('Error al crear registro');
        return await response.json();
    }

    async actualizar(tabla, data) {
        const response = await fetch(`${this.baseURL}/comercializacion/actualizar`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ tabla, ...data })
        });
        if (!response.ok) throw new Error('Error al actualizar registro');
        return await response.json();
    }

    async eliminar(tabla, id) {
        const response = await fetch(`${this.baseURL}/comercializacion/borrar/${id}?tabla=${tabla}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar registro');
        return await response.json();
    }

    // ========== CATÁLOGOS ==========
    
    async getEmpresas() {
        const response = await fetch(`${this.baseURL}/empresa/all`);
        if (!response.ok) throw new Error('Error al obtener empresas');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            empresa: item.nombre
        }));
    }

    async getMercados() {
        const response = await fetch(`${this.baseURL}/mercado/all`);
        if (!response.ok) throw new Error('Error al obtener mercados');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            mercado: item.nombre
        }));
    }

    async getProveedores() {
        const response = await fetch(`${this.baseURL}/proveedor/all`);
        if (!response.ok) throw new Error('Error al obtener proveedores');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            proveedor: item.nombre
        }));
    }

    async getProvincias() {
        const response = await fetch(`${this.baseURL}/provincia/all`);
        if (!response.ok) throw new Error('Error al obtener provincias');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            provincia: item.nombre
        }));
    }

    async getCondiciones() {
        const response = await fetch(`${this.baseURL}/comercializacion/condiciones`);
        if (!response.ok) throw new Error('Error al obtener condiciones');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            condicion: item.nombre
        }));
    }

    async getTipos() {
        const response = await fetch(`${this.baseURL}/comercializacion/tipos`);
        if (!response.ok) throw new Error('Error al obtener tipos');
        const data = await response.json();
        return data.map(item => ({
            id: item.codigo,
            tipo: item.nombre
        }));
    }
}
