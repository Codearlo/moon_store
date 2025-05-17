// assets/js/navigation.js
// Maneja la navegación, el menú móvil y todas las interacciones relacionadas con la navegación

// Objeto global para funciones de navegación
window.navigationModule = {
    initNavigation,
    setupMobileMenu,
    setupSmoothScroll,
    markActiveNavigationLink,
    setupScrollAnimations,
    closeMenu,
    openMenu,
    toggleMenu,
    isMobileMenuOpen: false
};

/**
 * Inicializa la navegación y el menú móvil
 */
function initNavigation() {
    setupMobileMenu();
    setupSmoothScroll();
    markActiveNavigationLink();
    setupScrollAnimations();
    setupMobileDetection();
}

/**
 * Configura el menú móvil
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuToggle || !navLinks) return;
    
    // Eliminar manejadores de eventos existentes para evitar duplicación
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    // Agregar evento al nuevo botón de menú
    newMenuToggle.addEventListener('click', toggleMenu);
    
    // Remover y volver a agregar eventos a los enlaces para evitar duplicación
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Añadir evento para cerrar menú al hacer clic en un enlace
        newItem.addEventListener('click', (e) => {
            // Solo prevenir el comportamiento predeterminado para enlaces a fragmentos de la misma página
            const href = newItem.getAttribute('href');
            if (href.startsWith('#') || (href.includes('#') && !href.includes('.html'))) {
                e.preventDefault();
                
                const targetId = href.replace('#', '');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Cerrar el menú primero
                    closeMenu();
                    
                    // Luego hacer scroll al elemento después de un breve retraso
                    setTimeout(() => {
                        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            } else {
                // Para enlaces a otras páginas, no prevenir el comportamiento predeterminado
                // Solo cerrar el menú
                closeMenu();
            }
        });
    });
    
    // Manejar tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.navigationModule.isMobileMenuOpen) {
            closeMenu();
        }
    });
}

/**
 * Alterna la visibilidad del menú móvil
 * @param {Event} e - Evento de clic
 */
function toggleMenu(e) {
    if (e) e.stopPropagation();
    
    if (window.navigationModule.isMobileMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

/**
 * Abre el menú móvil
 */
function openMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');
    
    if (!navLinks || !menuToggle) return;
    
    // Eliminar cualquier botón de cierre existente antes de agregar uno nuevo
    const existingCloseBtn = navLinks.querySelector('.nav-close-btn');
    if (existingCloseBtn) {
        existingCloseBtn.remove();
    }
    
    navLinks.classList.add('active');
    window.navigationModule.isMobileMenuOpen = true;
    
    // Cambiar ícono del menú a X
    menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/>
        </svg>
    `;
    
    // Eliminar cualquier overlay existente antes de crear uno nuevo
    const existingOverlay = document.querySelector('.menu-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Crear y mostrar overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Animar la aparición con un pequeño retraso
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    // Agregar evento al overlay
    overlay.addEventListener('click', closeMenu);
    
    // Prevenir scroll
    document.body.style.overflow = 'hidden';
    
    // Añadir botón de cierre si no existe
    if (!navLinks.querySelector('.nav-close-btn')) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'nav-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', closeMenu);
        navLinks.appendChild(closeBtn);
    }
    
    // Asegurar que el elemento no se oculta debido a transiciones
    navLinks.style.display = 'block';
}

/**
 * Cierra el menú móvil
 */
function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');
    
    if (!navLinks || !menuToggle) return;
    
    // Remover clase active
    navLinks.classList.remove('active');
    window.navigationModule.isMobileMenuOpen = false;
    
    // Restaurar ícono del menú
    menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" fill="currentColor"/>
        </svg>
    `;
    
    // Restaurar scroll
    document.body.style.overflow = '';
    
    // Remover overlay con animación
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        // Remover después de la animación
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
    
    // Remover botón de cierre si existe
    const closeBtn = navLinks.querySelector('.nav-close-btn');
    if (closeBtn) {
        closeBtn.remove();
    }
}

/**
 * Configura el desplazamiento suave para enlaces internos
 */
function setupSmoothScroll() {
    // Seleccionar enlaces internos
    const links = document.querySelectorAll('a[href^="#"], a[href*="#"]');
    
    links.forEach(link => {
        // No agregamos evento si el enlace está dentro del menú móvil
        // ya que esos ya se manejan en setupMobileMenu
        if (link.closest('#navLinks')) return;
        
        link.addEventListener('click', (e) => {
            // Obtener el valor del href
            const href = link.getAttribute('href');
            
            // Verificar si es un enlace interno dentro de la misma página
            if (href.includes('#') && (!href.includes('.html') || 
                (href.includes('.html') && href.split('.html')[0] === window.location.pathname.split('/').pop().split('.html')[0]))) {
                
                // Obtener el ID del elemento objetivo
                const targetId = href.includes('#') ? href.split('#')[1] : href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                // Si existe el elemento objetivo, hacer scroll suave
                if (targetElement) {
                    e.preventDefault();
                    
                    // Compensar por la barra de navegación fija
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
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
 * Marca el enlace de navegación activo según la URL actual o posición de scroll
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
        
        // Remover clase active de todos los enlaces
        link.classList.remove('active');
        
        // Marcar como activo según las condiciones
        if (
            // Coincide exactamente con la página actual
            href === currentPage ||
            // Estamos en la página de inicio y el enlace es para la página de inicio
            (currentPage === 'index.html' && href === 'index.html') ||
            // El enlace contiene un hash que coincide con el hash actual
            (currentHash && href.includes(currentHash))
        ) {
            link.classList.add('active');
        }
    });
}

/**
 * Configura animaciones al hacer scroll y actualiza el enlace activo
 */
function setupScrollAnimations() {
    // Marcar secciones como activas cuando están en viewport
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        // Usar throttle para mejorar el rendimiento
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    updateActiveSection();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
        
        function updateActiveSection() {
            const scrollPosition = window.scrollY + 100; // Offset para activar un poco antes
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Marcar enlace correspondiente como activo
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        
                        if (
                            link.getAttribute('href').includes('#' + sectionId) || 
                            (link.getAttribute('href') === 'index.html' && sectionId === 'inicio')
                        ) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    }
}

/**
 * Detecta si el dispositivo es móvil y agrega clase al body
 */
function setupMobileDetection() {
    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Añadir clases al body para poder usarlas en CSS
    if (isMobile) document.body.classList.add('is-mobile');
    if (isTouch) document.body.classList.add('has-touch');
    if (!isTouch) document.body.classList.add('has-mouse');
    
    // Detectar orientación
    updateOrientation();
    
    // Actualizar al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            document.body.classList.add('is-mobile');
        } else {
            document.body.classList.remove('is-mobile');
            
            // Asegurarse de cerrar el menú móvil si estaba abierto
            if (window.navigationModule.isMobileMenuOpen) {
                closeMenu();
            }
        }
        
        updateOrientation();
    });
    
    // Actualizar orientación
    window.addEventListener('orientationchange', () => {
        setTimeout(updateOrientation, 200);
    });
    
    /**
     * Actualiza clases de orientación
     */
    function updateOrientation() {
        if (window.innerHeight < window.innerWidth) {
            document.body.classList.add('is-landscape');
            document.body.classList.remove('is-portrait');
        } else {
            document.body.classList.add('is-portrait');
            document.body.classList.remove('is-landscape');
        }
    }
    
    // Manejar problema comunes de dispositivos táctiles
    if (isTouch) {
        // Aplicar clase touch-target a elementos interactivos para mejor accesibilidad
        const touchTargets = document.querySelectorAll('button, a, .button, .nav-link, .social-icon, .contact-icon, .map-button, .copy-button');
        
        touchTargets.forEach(target => {
            target.classList.add('touch-target');
            
            // Eliminar efectos hover que pueden quedar "atascados" en móviles
            target.addEventListener('touchend', () => {
                // Pequeño retraso para permitir respuesta visual
                setTimeout(() => {
                    target.blur();
                }, 300);
            });
        });
    }
    
    // Corregir problema de altura en dispositivos móviles (100vh)
    if (isMobile) {
        const fixMobileHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        fixMobileHeight();
        window.addEventListener('resize', fixMobileHeight);
    }
}