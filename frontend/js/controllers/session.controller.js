//validar usuario
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await AuthService.validarSesion();
        if (!response.success) {
            // No hay sesión, redirigir al login
            window.location.href = "login.html";
        } else {
            // Mostrar nombre en el header
            const nombreElemento = document.querySelector("#nombreUsuario");
            if (nombreElemento) nombreElemento.textContent = response.nombre;
        }
    } catch (error) {
        console.error("Error al validar sesión:", error);
        window.location.href = "login.html";
    }
});

//cerrar sesion
async function cerrarSesion() {
    try {
        const response = await AuthService.logout();
        if (response.success) {
            sessionStorage.clear();
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}

//settear info del usuario de la session
document.addEventListener("DOMContentLoaded", () => {
    const usuarioData = sessionStorage.getItem("usuario");

    if (!usuarioData) {
        window.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(usuarioData);

    // Mostrar el nombre en el encabezado
    const nombreUsuario = document.getElementById("userName");
    if (nombreUsuario) {
        nombreUsuario.textContent = usuario.codigo || "Usuario";
    }

    // Mostrar el rol o nombre completo
    const rolUsuario = document.getElementById("rolUser");
    if (rolUsuario) {
        rolUsuario.textContent = usuario.nombre || "Sin rol";
    }
});

