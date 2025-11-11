const Constants = {
    PROVEEDORES_VIVO: {
        COMUNES: ['grs', 'rp', 'renzo'],
        AREQUIPA: ['fafo', 'santa_angela', 'rosario', 'pollo_lima'],
        PROVINCIA: ['jorge_pan', 'mirian_g', 'vasquez', 'san_joaquin', 
                    'fortunato', 'perca', 'gamboa', 'asoc_sondor']
    },

    PROVEEDORES_BENEFICIADO: {
        COMUNES: ['grs', 'rp', 'avicola_renzo'],
        AREQUIPA: ['avelino', 'peladores', 'avicruz', 'rafael', 'matilde', 
                   'avirox', 'julia', 'simon', 'yesica', 'gabriel', 'arturo', 
                   'nicolas', 'luis_f', 'mirella'],
        PROVINCIA: ['grs_vivo', 'santa_elena', 'granjas_chicas', 'rosario', 'sanfern_lima']
    },

    CAMPOS_FORMULARIO: {
        GENERALES: ['ano', 'mes', 'provincia', 'zona'],
        CLIENTE: ['compra', 'compraGrs', 'tipo_cliente', 'tipoCliente', 'nombre'],
        POTENCIAL: ['potencial_minimo', 'potencial_maximo', 'potencialMinimo', 'potencialMaximo'],
        CONDICIONES: ['condicion_ptmin', 'condicion_ptmax', 'condicionPtmin', 'condicionPtmax'],
        OTROS: ['observaciones', 'tipo_proc', 'id']
    },

    OPCIONES: {
        COMPRA: ['SI', 'NO'],
        ANO_DEFAULT: 2024
    },

    TIPOS_PROCESAMIENTO: {
        'vivo-arequipa': 'Arequipa Vivo',
        'vivo-provincia': 'Provincia Vivo',
        'beneficiado-arequipa': 'Arequipa Beneficiado',
        'beneficiado-provincia': 'Provincia Beneficiado'
    },

    BENEFICIO_PROVINCIA: {
        TIPOS_PRECIO: {
            MAYORISTA: ['precioMayEntero', 'precioMayMejorado', 'precioMayCarcasa'],
            PUBLICO: ['precioPubMejorado', 'precioPubCarcasa']
        },
        TIPOS_PESO: {
            PROMEDIO: ['pesoPromMenor', 'pesoPromMayor']
        },
        TIPOS_COLOR: {
            RANGO: ['colorMin', 'colorMax']
        }
    },

    FORMATO: {
        FECHA: 'YYYY-MM-DD',
        FECHA_HORA: 'YYYY-MM-DD HH:mm:ss',
        MONEDA: 'S/. ',
        DECIMAL_2: 2,
        DECIMAL_1: 1
    },

    USUARIO_SISTEMA: {
        DEFECTO: 'admin',
        TRANSFERENCIA: 'sistema'
    }

};


window.Constants = Constants;
