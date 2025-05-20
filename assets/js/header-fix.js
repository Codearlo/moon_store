// assets/js/header-fix.js
// Script para asegurar la carga correcta del icono de carrito en dispositivos móviles y tablets

document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que el header se cargue (ya que es un componente)
    waitForElement('.cta-button .button', initCartIcon);
    
    // Verificar cada 2 segundos (por si hay algún delay en la carga)
    const intervalCheck = setInterval(() => {
        if (document.querySelector('.cta-button .button')) {
            initCartIcon();
            clearInterval(intervalCheck);
        }
    }, 2000);
    
    // También comprobar cuando se redimensiona la ventana
    window.addEventListener('resize', initCartIcon);
});

/**
 * Espera a que un elemento aparezca en el DOM
 * @param {string} selector - Selector CSS del elemento
 * @param {Function} callback - Función a ejecutar cuando aparezca
 */
function waitForElement(selector, callback) {
    if (document.querySelector(selector)) {
        callback();
        return;
    }
    
    const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
            observer.disconnect();
            callback();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Inicializa o corrige el icono del carrito
 */
function initCartIcon() {
    const cartButton = document.querySelector('.cta-button .button');
    if (!cartButton) return;
    
    // Verificar si estamos en móvil o tablet
    const isSmallScreen = window.innerWidth <= 1200; // Actualizado para incluir tablets
    
    // Si estamos en pantalla pequeña, asegurarnos de que el icono del carrito esté presente
    if (isSmallScreen) {
        // Buscar si ya existe un ícono del carrito
        let cartIcon = cartButton.querySelector('.cart-icon');
        
        // Si no existe, crearlo
        if (!cartIcon) {
            // Crear un nuevo icono
            cartIcon = document.createElement('img');
            cartIcon.src = '/assets/img/svg/cart.svg?v=' + Date.now(); // Forzar recarga
            cartIcon.alt = 'Carrito';
            cartIcon.className = 'cart-icon';
            cartIcon.width = 20;
            cartIcon.height = 20;
            cartIcon.style.filter = 'brightness(0) invert(1)'; // Hacer el icono blanco
            
            // Asegurarnos de que el botón no tiene el estilo ::before
            cartButton.style.position = 'relative';
            
            // Agregar el icono al botón
            cartButton.appendChild(cartIcon);
            
            // Ocultar el texto del botón en móvil/tablet
            const buttonText = cartButton.querySelector('.button-text');
            if (buttonText) {
                buttonText.style.display = 'none';
            }
        }
    } else {
        // En desktop, mostrar el texto del botón y asegurarse de que no haya ícono
        const buttonText = cartButton.querySelector('.button-text');
        if (buttonText) {
            buttonText.style.display = '';
        }
        
        // Remover cualquier ícono existente en desktop
        const cartIcon = cartButton.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.remove();
        }
    }
}