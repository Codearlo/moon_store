// assets/js/navigation-fixes.js
// Correcciones para la navegación y el desplazamiento suave

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el enlace del logo para que vaya a moonstore.codearlo.com
    updateLogoLink();
    
    // Configurar navegación suave para enlaces internos
    setupSmoothScroll();
    
    // Configurar menú móvil mejorado
    setupMobileMenu();
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
 * Configura el desplazamiento suave para todos los enlaces internos
 */
function setupSmoothScroll() {
    // Seleccionar todos los enlaces internos (que comienzan con # o contienen # y están en la misma página)
    const links = document.querySelectorAll('a[href^="#"], a[href*="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Obtener el valor del href
            const href = link.getAttribute('href');
            
            // Comprobar si es un enlace interno
            if (href.startsWith('#') || (href.includes('#') && !href.startsWith('http'))) {
                // Si es un enlace a la sección de la misma página
                if (href.includes('#') && href.split('#')[0] === '') {
                    e.preventDefault();
                    
                    // Obtener el ID del elemento objetivo (parte después del #)
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    // Si existe el elemento objetivo, hacer scroll suave
                    if (targetElement) {
                        // Compensar por la barra de navegación fija
                        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                // Si es un enlace a otra página con un hash (ejemplo: "inicio.html#seccion")
                else if (href.includes('#') && href.split('#')[0] !== '') {
                    // No prevenir el comportamiento predeterminado para permitir la navegación a otra página
                    // pero almacenar el hash para el scroll después de cargar la página
                    localStorage.setItem('scrollToTarget', href.split('#')[1]);
                }
            }
        });
    });
    
    // Comprobar si hay un objetivo de desplazamiento almacenado al cargar la página
    window.addEventListener('load', () => {
        const scrollTarget = localStorage.getItem('scrollToTarget');
        if (scrollTarget) {
            const targetElement = document.getElementById(scrollTarget);
            if (targetElement) {
                // Compensar por la barra de navegación fija
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Pequeño retraso para asegurar que la página esté completamente cargada
                setTimeout(() => {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Limpiar el almacenamiento
                    localStorage.removeItem('scrollToTarget');
                }, 300);
            }
        }
    });
}

/**
 * Configura el menú móvil mejorado con superposición
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Cambiar ícono del menú
            if (navLinks.classList.contains('active')) {
                menuToggle.innerHTML = `
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/>
                    </svg>
                `;
                
                // Agregar overlay para cerrar el menú al hacer clic fuera
                const overlay = document.createElement('div');
                overlay.className = 'menu-overlay';
                document.body.appendChild(overlay);
                
                // Activar overlay con un pequeño retraso para la animación
                setTimeout(() => {
                    overlay.classList.add('active');
                }, 10);
                
                // Prevenir scroll del body cuando el menú está abierto
                document.body.style.overflow = 'hidden';
                
                // Agregar evento para cerrar menú
                overlay.addEventListener('click', closeMenu);
            } else {
                closeMenu();
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', closeMenu);
        });
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        
        if (menuToggle) {
            menuToggle.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" fill="currentColor"/>
                </svg>
            `;
        }
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Remover overlay con animación
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }
}