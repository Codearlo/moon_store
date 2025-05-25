// assets/js/navigation.js
// Script completo consolidado para toda la lógica de navegación

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar navegación
    initNavigation();
    
    // Inicializar corrección para el icono de carrito en móvil/tablet
    initCartIcon();
    
    // Forzar recarga de iconos para evitar problemas de caché
    forceReloadIcons();
    
    // Verificar cada 2 segundos (por si hay algún delay en la carga)
    const intervalCheck = setInterval(() => {
        if (document.querySelector('.cta-button .button')) {
            initCartIcon();
            clearInterval(intervalCheck);
        }
    }, 2000);
    
    // También comprobar cuando se redimensiona la ventana
    window.addEventListener('resize', () => {
        initCartIcon();
        handleResize();
    });
    
    console.log('Navegación inicializada correctamente');
});

/**
 * Inicializa la navegación y el menú móvil
 */
function initNavigation() {
    // Variables globales
    const state = {
        isMobileMenuOpen: false,
        isTablet: window.innerWidth <= 1366 || 
                 (window.innerWidth === 1024 && window.innerHeight === 1366) || 
                 (window.innerWidth === 1366 && window.innerHeight === 1024),
        isMobile: window.innerWidth <= 768
    };
    
    // Configurar menú móvil
    setupMobileMenu();
    
    // Configurar scroll suave
    setupSmoothScroll();
    
    // Marcar enlace activo
    markActiveNavigationLink();
    
    // Configurar animaciones de scroll
    setupScrollAnimations();
    
    // Detectar cambios en el tamaño de ventana
    window.addEventListener('resize', handleResize);
    
    // Configurar altura variable en móviles
    updateMobileHeight();
    window.addEventListener('resize', updateMobileHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateMobileHeight, 200);
    });
    
    /**
     * Configura el menú móvil
     */
    function setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (!menuToggle || !navLinks) return;
        
        // Agregar evento al botón de menú
        menuToggle.addEventListener('click', function() {
            toggleMenu();
        });
        
        // Agregar eventos a los enlaces
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', handleNavLinkClick);
        });
        
        // Agregar evento al overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function() {
                closeMenu();
            });
        }
        
        // Manejar tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMobileMenuOpen) {
                closeMenu();
            }
        });
    }
    
    /**
     * Maneja el clic en los enlaces de navegación
     * @param {Event} e - Evento de clic
     */
    function handleNavLinkClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        // Si es enlace interno
        if (href.startsWith('#') || (href.includes('#') && !href.includes('.html'))) {
            e.preventDefault();
            
            const targetId = href.split('#')[1] || href.replace('#', '');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Cerrar el menú primero
                closeMenu(true);
                
                // Hacer scroll al elemento después de un breve retraso
                setTimeout(() => {
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        } else if (href === 'index.html') {
            e.preventDefault();
            // Si el enlace es a index.html y estamos en la página principal
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                // Cerrar el menú primero
                closeMenu(true);
                
                // Hacer scroll al inicio de la página
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // Si no estamos en la página principal, navegar a ella
                window.location.href = href;
            }
        } else {
            // Para enlaces a otras páginas, solo cerrar el menú
            closeMenu(true);
        }
    }
    
    /**
     * Configura el desplazamiento suave para enlaces internos
     */
    function setupSmoothScroll() {
        // Seleccionar enlaces internos que no están en la navegación principal
        const links = document.querySelectorAll('a[href^="#"]:not(.nav-link), a[href*="#"]:not(.nav-link)');
        
        links.forEach(link => {
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
     * Marca el enlace de navegación activo según la URL o posición de scroll
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
     * Actualiza la variable CSS para altura en móviles
     */
    function updateMobileHeight() {
        // Solución para 100vh en iOS
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    /**
     * Abre el menú móvil
     */
    function openMenu() {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.getElementById('menuToggle');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (!navLinks || !menuToggle) return;
        
        // Forzar estilos para iPad Pro específicamente
        const isIPadPro = (window.innerWidth === 1024 && window.innerHeight === 1366) || 
                        (window.innerWidth === 1366 && window.innerHeight === 1024);
        
        if (isIPadPro) {
            navLinks.style.display = 'block';
            navLinks.style.position = 'fixed';
            navLinks.style.top = '0';
            navLinks.style.right = '0';
            navLinks.style.bottom = '0';
            navLinks.style.width = '300px';
            navLinks.style.height = '100vh';
            navLinks.style.backgroundColor = 'rgba(10, 1, 24, 0.95)';
            navLinks.style.backdropFilter = 'blur(12px)';
            navLinks.style.webkitBackdropFilter = 'blur(12px)';
            navLinks.style.padding = '70px 20px 20px';
            navLinks.style.borderLeft = '1px solid rgba(138, 43, 226, 0.2)';
            navLinks.style.zIndex = '9999';
            navLinks.style.overflowY = 'auto';
            navLinks.style.boxShadow = '-5px 0 15px rgba(0, 0, 0, 0.5)';
        }
        
        // Mostrar menú
        navLinks.classList.add('active');
        state.isMobileMenuOpen = true;
        
        // NO CAMBIAR el icono del menú toggle a X, solo ocultarlo
        menuToggle.style.visibility = 'hidden';
        
        // Activar overlay
        if (menuOverlay) {
            menuOverlay.classList.add('active');
        }
        
        // Prevenir scroll
        document.body.style.overflow = 'hidden';
        
        // Asegurar que el elemento no se oculta
        navLinks.style.display = 'block';
        
        // Crear botón de cierre explícito
        const closeBtn = document.createElement('button');
        closeBtn.className = 'nav-close-btn';
        closeBtn.innerHTML = 'X';
        closeBtn.setAttribute('aria-label', 'Cerrar menú');
        closeBtn.addEventListener('click', closeMenu);
        
        // Eliminar cualquier botón existente antes de añadir uno nuevo
        const existingCloseBtn = navLinks.querySelector('.nav-close-btn');
        if (existingCloseBtn) {
            existingCloseBtn.remove();
        }
        
        navLinks.appendChild(closeBtn);
    }
    
    /**
     * Cierra el menú móvil
     * @param {boolean} keepMobileView - Si es true, mantiene la vista móvil consistente
     */
    function closeMenu(keepMobileView = false) {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.getElementById('menuToggle');
        const menuOverlay = document.getElementById('menuOverlay');
        const header = document.querySelector('.site-header');
        
        if (!navLinks || !menuToggle) return;
        
        // Si estamos en móvil o tablet, aplicar clase para mantener vista consistente
        if (keepMobileView && state.isTablet) {
            header.classList.add('mobile-view-locked');
            
            // Remover la clase después de un tiempo
            setTimeout(() => {
                header.classList.remove('mobile-view-locked');
            }, 1000);
        }
        
        // Remover clase active
        navLinks.classList.remove('active');
        state.isMobileMenuOpen = false;
        
        // Hacer visible el botón de menú de nuevo
        menuToggle.style.visibility = 'visible';
        
        // Restaurar scroll
        document.body.style.overflow = '';
        
        // Desactivar overlay
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        
        // Eliminar el botón de cierre
        const closeBtn = navLinks.querySelector('.nav-close-btn');
        if (closeBtn) {
            closeBtn.remove();
        }
    }
    
    /**
     * Alterna la visibilidad del menú móvil
     */
    function toggleMenu() {
        if (state.isMobileMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    /**
     * Maneja cambios en el tamaño de la ventana
     */
    function handleResize() {
        // Actualizar variables de estado
        state.isTablet = window.innerWidth <= 1366 || 
                        (window.innerWidth === 1024 && window.innerHeight === 1366) || 
                        (window.innerWidth === 1366 && window.innerHeight === 1024);
        state.isMobile = window.innerWidth <= 768;
        
        // Si cambiamos a una resolución grande, asegurar que el menú se cierre
        if (window.innerWidth > 1366 && !state.isTablet && state.isMobileMenuOpen) {
            closeMenu();
        }
        
        // Actualizar el icono de carrito
        initCartIcon();
    }
}

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
 * Inicializa o corrige el icono del carrito (CONSOLIDADO desde header-fix.js)
 */
function initCartIcon() {
    const cartButton = document.querySelector('.cta-button .button');
    if (!cartButton) return;
    
    // Verificar si estamos en móvil o tablet (cualquier cosa hasta 1366px - incluye iPadPro)
    const isSmallScreen = window.innerWidth <= 1366;
    
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

/**
 * Fuerza la recarga de iconos críticos para evitar problemas de caché
 */
function forceReloadIcons() {
    const timestamp = Date.now();
    
    // Seleccionar todos los iconos SVG en el header
    const svgImages = document.querySelectorAll('.site-header img, .site-header svg');
    
    svgImages.forEach(img => {
        if (img.src) {
            // Crear una nueva URL con timestamp forzado
            let newSrc = img.src;
            if (newSrc.includes('?')) {
                newSrc = newSrc.split('?')[0] + '?v=' + timestamp;
            } else {
                newSrc = newSrc + '?v=' + timestamp;
            }
            
            // Asignar la nueva URL
            img.src = newSrc;
        }
    });
    
    // Forzar recarga de logo específicamente
    const logo = document.querySelector('.logo img');
    if (logo && logo.src) {
        logo.src = logo.src.split('?')[0] + '?v=' + timestamp;
    }
}

/**
 * Marca el enlace de navegación activo según la URL actual (función global)
 */
function markActiveNavLink() {
    setTimeout(() => {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop() || 'index.html';
        
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            if (linkHref === fileName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }, 100);
}

// Exportar funciones para uso global
window.navigationModule = {
    initNavigation,
    initCartIcon,
    forceReloadIcons,
    markActiveNavLink
};