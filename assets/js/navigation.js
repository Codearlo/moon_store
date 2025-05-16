// assets/js/navigation.js
// Maneja la navegación y el menú móvil

/**
 * Inicializa la navegación y el menú móvil
 */
function initNavigation() {
    setupMobileMenu();
    setupSmoothScroll();
    markActiveNavigationLink();
    setupScrollAnimations();
}

/**
 * Configura el menú móvil
 */
// Función mejorada para el menú móvil (con apertura desde la derecha)
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
        
        // Remover overlay si existe
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            // Eliminar overlay después de la animación
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }
}

/**
 * Configura el desplazamiento suave para enlaces internos
 */
function setupSmoothScroll() {
    // Seleccionar todos los enlaces internos (que comienzan con # o contienen # y están en la misma página)
    const links = document.querySelectorAll('a[href^="#"], a[href*="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Obtener el valor del href
            const href = link.getAttribute('href');
            
            // Verificar si es un enlace interno dentro de la misma página
            if (href.includes('#') && (!href.includes('.html') || (href.includes('.html') && href.split('.html')[0] === window.location.pathname.split('/').pop().split('.html')[0]))) {
                // Obtener el ID del elemento objetivo
                const targetId = href.includes('#') ? href.split('#')[1] : href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                // Si existe el elemento objetivo, hacer scroll suave
                if (targetElement) {
                    e.preventDefault();
                    
                    // Compensar por la barra de navegación fija
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar URL sin recargar la página
                    history.pushState(null, null, '#' + targetId);
                }
            }
        });
    });
}

/**
 * Marca el enlace de navegación activo según la URL actual
 */
function markActiveNavigationLink() {
    // Obtener la ruta actual
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    // Obtener el nombre de archivo de la URL actual
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Seleccionar todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Marcar como activo si coincide con la página actual
        if (href === currentPage) {
            link.classList.add('active');
        } 
        // O si estamos en la página de inicio y el enlace es para la página de inicio
        else if (currentPage === 'index.html' && href === 'index.html') {
            link.classList.add('active');
        }
        // O si el enlace contiene un hash que coincide con el hash actual
        else if (currentHash && href.includes(currentHash)) {
            link.classList.add('active');
        }
        else {
            link.classList.remove('active');
        }
    });
}

/**
 * Configura animaciones al hacer scroll
 */
function setupScrollAnimations() {
    // Marcar secciones como activas cuando están en viewport
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 100; // Offset para activar un poco antes
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Marcar enlace correspondiente como activo
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').includes('#' + sectionId) || 
                            (link.getAttribute('href') === 'index.html' && sectionId === 'inicio')) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
}

// Exportar funciones para uso en otros archivos
window.navigationModule = {
    initNavigation,
    setupMobileMenu,
    setupSmoothScroll,
    markActiveNavigationLink
};