// assets/js/mobile-fixes.js
// Correcciones para la navegación y el desplazamiento suave

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el enlace del logo para que vaya a moonstore.codearlo.com
    updateLogoLink();
    
    // Configurar botones de copiar para elementos de contacto
    setupCopyButtons();
});

/**
 * Actualiza el enlace del logo para que vaya a moonstore.codearlo.com
 */
function updateLogoLink() {
    const logoLinks = document.querySelectorAll('.logo a, .logo');
    
    logoLinks.forEach(link => {
        // Si el logo es un enlace o contiene un enlace
        if (link.tagName === 'A' || link.querySelector('a')) {
            const actualLink = link.tagName === 'A' ? link : link.querySelector('a');
            actualLink.href = 'https://moonstore.codearlo.com';
            actualLink.setAttribute('title', 'Moon Store - Inicio');
        } else {
            // Si el logo no es un enlace, convertirlo en uno
            const parent = link.parentNode;
            
            // Guardar el contenido actual del logo
            const logoContent = link.innerHTML;
            
            // Crear un nuevo enlace
            const newLink = document.createElement('a');
            newLink.href = 'https://moonstore.codearlo.com';
            newLink.setAttribute('title', 'Moon Store - Inicio');
            newLink.innerHTML = logoContent;
            
            // Aplicar estilos del logo original al nuevo enlace
            newLink.className = link.className;
            
            // Reemplazar el logo original con el nuevo enlace
            parent.replaceChild(newLink, link);
        }
    });
}

/**
 * Configura los botones de copiar para elementos de contacto
 */
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('data-copy');
            
            if (textToCopy) {
                // Crear elemento temporal para copiar texto
                const tempInput = document.createElement('input');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                // Efecto visual en el botón
                button.classList.add('copied');
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1000);
                
                // Mostrar notificación si existe la función
                if (typeof showNotification === 'function') {
                    showNotification('Copiado al portapapeles', 'success');
                }
            }
        });
    });
}