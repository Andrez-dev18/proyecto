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
    }
};

window.Constants = Constants;
