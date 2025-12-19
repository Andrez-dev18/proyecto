class DashboardService {
    constructor() {
        this.baseUrl = 'http://localhost/proyecto/backend';
    }

    async getResumenGeneral(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/resumen-general`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener resumen general');
            return data.data;
        } catch (error) {
            console.error('Error en getResumenGeneral:', error);
            throw error;
        }
    }

    async getVivoAqpResumen(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/vivo-aqp/resumen`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener resumen vivo');
            return data.data;
        } catch (error) {
            console.error('Error en getVivoAqpResumen:', error);
            throw error;
        }
    }

    async getVivoAqpPorZona(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/vivo-aqp/zona`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener vivo por zona');
            return data.data;
        } catch (error) {
            console.error('Error en getVivoAqpPorZona:', error);
            throw error;
        }
    }

    async getVivoAqpPorProveedor(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/vivo-aqp/proveedor`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener vivo por proveedor');
            return data.data;
        } catch (error) {
            console.error('Error en getVivoAqpPorProveedor:', error);
            throw error;
        }
    }

    async getBeneficiadoProvinciaResumen(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/beneficiado/resumen`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener beneficiado');
            return data.data;
        } catch (error) {
            console.error('Error en getBeneficiadoProvinciaResumen:', error);
            throw error;
        }
    }

    async getTrozadoDiarioResumen(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/trozado/resumen`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener trozado');
            return data.data;
        } catch (error) {
            console.error('Error en getTrozadoDiarioResumen:', error);
            throw error;
        }
    }

    async getTrozadoPorProducto(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/trozado/producto`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener trozado por producto');
            return data.data;
        } catch (error) {
            console.error('Error en getTrozadoPorProducto:', error);
            throw error;
        }
    }

    async getClienteProcesadosTop(fechaInicio = null, fechaFin = null, limit = 20) {
        try {
            let url = `${this.baseUrl}/dashboard/cliente/top`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            params.append('limit', limit);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener top clientes');
            return data.data;
        } catch (error) {
            console.error('Error en getClienteProcesadosTop:', error);
            throw error;
        }
    }

    async getClientePorLinea(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/cliente/linea`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener cliente por línea');
            return data.data;
        } catch (error) {
            console.error('Error en getClientePorLinea:', error);
            throw error;
        }
    }

    async getHuevoResumen(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/huevo/resumen`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener huevo');
            return data.data;
        } catch (error) {
            console.error('Error en getHuevoResumen:', error);
            throw error;
        }
    }

    async getGallinaResumen(fechaInicio = null, fechaFin = null) {
        try {
            let url = `${this.baseUrl}/dashboard/gallina/resumen`;
            
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al obtener gallina');
            return data.data;
        } catch (error) {
            console.error('Error en getGallinaResumen:', error);
            throw error;
        }
    }

    // ==================== MONITOREO DEL SISTEMA ====================
async getEstadisticasGeneralesSistema(fechaInicio = null, fechaFin = null) {
    try {
        let url = `${this.baseUrl}/dashboard/sistema/estadisticas`;
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error');
        return data.data;
    } catch (error) {
        console.error('Error en getEstadisticasGeneralesSistema:', error);
        throw error;
    }
}

async getUsoPorModuloSistema(fechaInicio = null, fechaFin = null) {
    try {
        let url = `${this.baseUrl}/dashboard/sistema/uso-modulo`;
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error');
        return data.data;
    } catch (error) {
        console.error('Error en getUsoPorModuloSistema:', error);
        throw error;
    }
}

async getActividadUltimos30DiasSistema() {
    try {
        const url = `${this.baseUrl}/dashboard/sistema/actividad-30dias`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error');
        return data.data;
    } catch (error) {
        console.error('Error en getActividadUltimos30DiasSistema:', error);
        throw error;
    }
}

async getUsuariosActivosSistema() {
    try {
        const url = `${this.baseUrl}/dashboard/sistema/usuarios-activos`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error');
        return data.data;
    } catch (error) {
        console.error('Error en getUsuariosActivosSistema:', error);
        throw error;
    }
}

async getActividadRecienteSistema(limit = 10) {
    try {
        const url = `${this.baseUrl}/dashboard/sistema/actividad-reciente?limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error');
        return data.data;
    } catch (error) {
        console.error('Error en getActividadRecienteSistema:', error);
        throw error;
    }
}

}
