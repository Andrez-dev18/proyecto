class FormController {
    generarFormulario(datos = null) {
        formView.generarFormulario(datos);
    }

    async guardar() {
        const form = document.getElementById('registroForm');
        if (!form) return;

        const formData = new FormData(form);
        await dataController.guardarRegistro(formData);
    }
}

window.formController = new FormController();
