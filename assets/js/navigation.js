/**
     * Configura el sidebar de perfil
     */
    function setupProfileSidebar() {
        console.log('Configurando sidebar de perfil...');
        
        const profileButton = document.getElementById('profileButton');
        const profileSidebar = document.getElementById('profileSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const closeSidebar = document.getElementById('closeSidebar');
        
        console.log('Elementos encontrados:', {
            profileButton: !!profileButton,
            profileSidebar: !!profileSidebar,
            sidebarOverlay: !!sidebarOverlay,
            closeSidebar: !!closeSidebar
        });
        
        if (!profileButton || !profileSidebar) {
            console.error('No se encontraron elementos del sidebar');
            return;
        }
        
        // Abrir sidebar
        profileButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clic en botón de perfil');
            openProfileSidebar();
        });
        
        // Cerrar sidebar con botón
        if (closeSidebar) {
            closeSidebar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clic en cerrar sidebar');
                closeProfileSidebar();
            });
        }
        
        // Cerrar sidebar con overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clic en overlay');
                closeProfileSidebar();
            });
        }
        
        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && profileSidebar.classList.contains('active')) {
                console.log('ESC presionado');
                closeProfileSidebar();
            }
        });
        
        // Verificar estado de usuario al cargar
        updateSidebarContent();
        
        console.log('Sidebar configurado correctamente');
    }
    
    /**
     * Abre el sidebar de perfil
     */
    function openProfileSidebar() {
        console.log('Abriendo sidebar...');
        
        const profileSidebar = document.getElementById('profileSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (!profileSidebar || !sidebarOverlay) {
            console.error('No se encontraron elementos para abrir sidebar');
            return;
        }
        
        profileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Actualizar contenido según estado de usuario
        updateSidebarContent();
        
        console.log('Sidebar abierto');
    }
    
    /**
     * Cierra el sidebar de perfil
     */
    function closeProfileSidebar() {
        console.log('Cerrando sidebar...');
        
        const profileSidebar = document.getElementById('profileSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (!profileSidebar || !sidebarOverlay) {
            console.error('No se encontraron elementos para cerrar sidebar');
            return;
        }
        
        profileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        console.log('Sidebar cerrado');
    }
    
    /**
     * Actualiza el contenido del sidebar según el estado del usuario
     */
    function updateSidebarContent() {
        const guestContent = document.getElementById('guestContent');
        const userContent = document.getElementById('userContent');
        const isLoggedIn = checkUserSession();
        
        if (isLoggedIn) {
            // Mostrar contenido de usuario logueado
            if (guestContent) guestContent.style.display = 'none';
            if (userContent) userContent.style.display = 'block';
            
            // Cargar datos del usuario
            loadUserData();
        } else {
            // Mostrar contenido de invitado
            if (guestContent) guestContent.style.display = 'block';
            if (userContent) userContent.style.display = 'none';
        }
    }
    
    /**
     * Carga los datos del usuario logueado
     */
    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        
        if (userName && userData.nombre) {
            userName.textContent = userData.nombre;
        }
        if (userEmail && userData.email) {
            userEmail.textContent = userData.email;
        }
    }// assets/js/navigation.js
// Script para la nueva navegación con barra de productos

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar navegación
    initNavigation();
    
    console.log('Nueva navegación inicializada correctamente');
});

/**
 * Inicializa toda la funcionalidad de navegación
 */
function initNavigation() {
    // Variables globales
    const state = {
        isMobileMenuOpen: false,
        isTablet: window.innerWidth <= 1366,
        isMobile: window.innerWidth <= 768
    };
    
    // Configurar sidebar de perfil
    setupProfileSidebar();
    
    // Configurar búsqueda
    setupSearch();
    
    // Configurar botones de usuario y carrito
    setupUserActions();
    
    // Configurar menú móvil
    setupMobileMenu();
    
    // Configurar dropdowns
    setupDropdowns();
    
    // Marcar enlace activo
    markActiveNavigationLink();
    
    // Detectar cambios en el tamaño de ventana
    window.addEventListener('resize', handleResize);
    
    /**
     * Configura la funcionalidad de búsqueda
     */
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        
        if (!searchInput || !searchButton) return;
        
        // Enviar búsqueda al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Enviar búsqueda al hacer clic en el botón
        searchButton.addEventListener('click', performSearch);
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query) {
                // Construir la URL según la página actual
                const currentPage = window.location.pathname.split('/').pop();
                let targetUrl;
                
                if (currentPage === 'productos.html') {
                    // Si estamos en productos, actualizar la búsqueda en la misma página
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.set('buscar', query);
                    const newUrl = `${window.location.pathname}?${urlParams}`;
                    window.history.pushState({}, '', newUrl);
                    
                    // Disparar evento personalizado para que productos.js recargue los resultados
                    window.dispatchEvent(new CustomEvent('searchUpdated', { 
                        detail: { query: query } 
                    }));
                    
                    // También actualizar el campo de búsqueda en los filtros si existe
                    const filtrosBuscar = document.getElementById('buscar');
                    if (filtrosBuscar) {
                        filtrosBuscar.value = query;
                    }
                } else {
                    // Si estamos en otra página, redirigir a productos
                    targetUrl = `productos.html?buscar=${encodeURIComponent(query)}`;
                    window.location.href = targetUrl;
                }
                
                // Limpiar input de búsqueda
                searchInput.value = '';
                hideSearchSuggestions();
            }
        }
    }
    
    /**
     * Configura los botones de usuario y carrito
     */
    function setupUserActions() {
        const cartButton = document.getElementById('cartButton');
        
        if (cartButton) {
            cartButton.addEventListener('click', () => {
                // Mostrar modal de carrito o redirigir
                showCartModal();
            });
        }
    }
    
    /**
     * Verifica si hay una sesión de usuario activa
     */
    function checkUserSession() {
        // Verificar localStorage para token de usuario
        return localStorage.getItem('user_token') !== null || 
               localStorage.getItem('user_data') !== null;
    }
    
    /**
     * Configura el menú móvil
     */
    function setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (!menuToggle || !navMenu) return;
        
        // Agregar evento al botón de menú
        menuToggle.addEventListener('click', toggleMenu);
        
        // Agregar evento al overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', closeMenu);
        }
        
        // Manejar tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMobileMenuOpen) {
                closeMenu();
            }
        });
        
        // Cerrar menú al hacer clic en enlaces
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMobileMenuOpen) {
                    closeMenu();
                }
            });
        });
    }
    
    /**
     * Configura los dropdowns
     */
    function setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!toggle || !menu) return;
            
            // En móvil, manejar clic para abrir/cerrar
            if (state.isMobile || state.isTablet) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Cerrar otros dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle actual dropdown
                    dropdown.classList.toggle('active');
                });
            }
        });
        
        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
    
    /**
     * Abre el menú móvil
     */
    function openMenu() {
        const navMenu = document.getElementById('navMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuToggle = document.getElementById('menuToggle');
        
        navMenu.classList.add('mobile-active');
        state.isMobileMenuOpen = true;
        
        // Activar overlay
        if (menuOverlay) {
            menuOverlay.classList.add('active');
        }
        
        // Cambiar icono a X
        if (menuToggle) {
            menuToggle.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/>
                </svg>
            `;
        }
        
        // Prevenir scroll
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Cierra el menú móvil
     */
    function closeMenu() {
        const navMenu = document.getElementById('navMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuToggle = document.getElementById('menuToggle');
        
        navMenu.classList.remove('mobile-active');
        state.isMobileMenuOpen = false;
        
        // Desactivar overlay
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        
        // Restaurar icono de hamburguesa
        if (menuToggle) {
            menuToggle.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" fill="currentColor"/>
                </svg>
            `;
        }
        
        // Restaurar scroll
        document.body.style.overflow = '';
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
        state.isTablet = window.innerWidth <= 1366;
        state.isMobile = window.innerWidth <= 768;
        
        // Si cambiamos a una resolución grande, asegurar que el menú se cierre
        if (window.innerWidth > 1366 && state.isMobileMenuOpen) {
            closeMenu();
        }
        
        // Reconfigurar dropdowns según el tamaño de pantalla
        setupDropdowns();
    }
}

/**
 * Marca el enlace de navegación activo según la URL actual
 */
function markActiveNavigationLink() {
    setTimeout(() => {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const fileName = currentPath.split('/').pop() || 'index.html';
        
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remover clase active de todos los enlaces
            link.classList.remove('active');
            
            // Marcar como activo según las condiciones
            if (
                // Coincide exactamente con la página actual
                href === fileName ||
                // Estamos en la página de inicio y el enlace es para la página de inicio
                (fileName === 'index.html' && href.includes('index.html')) ||
                // El enlace contiene un hash que coincide con el hash actual
                (currentHash && href.includes(currentHash))
            ) {
                link.classList.add('active');
            }
        });
    }, 100);
}

/**
 * Muestra el modal del carrito (placeholder)
 */
function showCartModal() {
    // Por ahora solo mostrar un alert, después implementar modal real
    alert('Carrito de compras\n(Funcionalidad pendiente)');
}

/**
 * Actualiza el contador del carrito
 * @param {number} count - Número de items en el carrito
 */
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Función global para cerrar sesión
 */
function logout() {
    // Limpiar datos de sesión
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    sessionStorage.clear();
    
    // Mostrar notificación
    showNotification('Sesión cerrada correctamente', 'success');
    
    // Recargar página para actualizar el estado
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

/**
 * Función para mostrar notificaciones
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `header-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Exportar funciones para uso global
window.navigationModule = {
    initNavigation,
    markActiveNavigationLink,
    updateCartCount,
    showCartModal,
    logout,
    showNotification,
    openProfileSidebar: function() {
        const profileSidebar = document.getElementById('profileSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        profileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    closeProfileSidebar: function() {
        const profileSidebar = document.getElementById('profileSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        profileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
};
