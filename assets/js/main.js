// FUNCIONALIDAD FLECHA DE RETORNO (BACK TO TOP)
// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        // Detecta el evento de scroll en la ventana
        window.addEventListener('scroll', () => {
            // Si el usuario baja más de 400px
            if (window.scrollY > 400) {
                // Añade la clase que la hace visible en el CSS
                backToTopButton.classList.add('show');
            } else {
                // Quita la clase si vuelve arriba
                backToTopButton.classList.remove('show');
            }
        });
    }
});
