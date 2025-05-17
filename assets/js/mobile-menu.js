// assets/js/mobile-menu.js
// Script mejorado para el menú móvil

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
});

/**
 * Configura el funcionamiento del menú móvil mejorado
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuToggle || !navLinks) return;
    
    // Agregar botón de cierre dentro del menú para mejor UX
    if (!document.querySelector('.mobile-close-btn')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-close-btn';
        closeButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/>
            </svg>
        `;
        closeButton.setAttribute('aria-label', 'Cerrar menú');
        navLinks.insertBefore(closeButton, navLinks.firstChild);
        
        closeButton.addEventListener('click', closeMenu);
    }
    
    menuToggle.addEventListener('click', toggleMenu);
    
    // Cerrar menú al hacer clic en enlaces
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', closeMenu);
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    /**
     * Abre o cierra el menú móvil
     */
    function toggleMenu() {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    /**
     * Abre el menú móvil
     */
    function openMenu() {
        navLinks.classList.add('active');
        
        // Cambiar ícono del menú toggle
        menuToggle.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/>
            </svg>
        `;
        
        // Crear y mostrar overlay
        if (!document.querySelector('.menu-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);
            
            // Activar overlay con un pequeño retraso para la animación
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
            
            overlay.addEventListener('click', closeMenu);
        }
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Anunciar para lectores de pantalla
        menuToggle.setAttribute('aria-expanded', 'true');
    }
    
    /**
     * Cierra el menú móvil
     */
    function closeMenu() {
        navLinks.classList.remove('active');
        
        // Restaurar ícono del menú
        menuToggle.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" fill="currentColor"/>
            </svg>
        `;
        
        // Remover overlay con animación
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            
            // Remover del DOM después de la animación
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
        
        // Restaurar scroll
        document.body.style.overflow = '';
        
        // Actualizar para lectores de pantalla
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}