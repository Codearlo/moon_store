// assets/js/header-fix.js
// Script para corregir y mantener la funcionalidad del nuevo header

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar correcciones del header
    initHeaderFixes();
    
    // Verificar cada 2 segundos por si hay delay en la carga
    const intervalCheck = setInterval(() => {
        if (document.querySelector('.search-container')) {
            initHeaderFixes();
            clearInterval(intervalCheck);
        }
    }, 2000);
    
    // También comprobar cuando se redimensiona la ventana
    window.addEventListener('resize', initHeaderFixes);
});

/**
 * Inicializa todas las correcciones del header
 */
function initHeaderFixes() {
    // Corregir altura del main según el header
    adjustMainMargin();
    
    // Configurar búsqueda inteligente
    setupSmartSearch();
    
    // Configurar scroll del header
    setupHeaderScroll();
    
    // Inicializar tooltips
    initTooltips();
    
    // Inicializar sidebar de perfil si no está configurado
    initProfileSidebarFallback();
    
    // Forzar recarga de iconos para evitar problemas de caché
    forceReloadHeaderIcons();
}

/**
 * Inicializa el sidebar de perfil como fallback
 */
function initProfileSidebarFallback() {
    // Esperar a que el DOM esté completamente cargado
    setTimeout(() => {
        const profileButton = document.getElementById('profileButton');
        const profileSidebar = document.getElementById('profileSidebar');
        
        if (profileButton && profileSidebar && !profileButton.hasAttribute('data-configured')) {
            console.log('Configurando sidebar desde header-fix.js');
            
            profileButton.setAttribute('data-configured', 'true');
            
            profileButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clic en perfil desde fallback');
                
                // Abrir sidebar
                profileSidebar.classList.add('active');
                const overlay = document.getElementById('sidebarOverlay');
                if (overlay) {
                    overlay.classList.add('active');
                }
                document.body.style.overflow = 'hidden';
            });
            
            // Configurar botón de cerrar
            const closeSidebar = document.getElementById('closeSidebar');
            if (closeSidebar && !closeSidebar.hasAttribute('data-configured')) {
                closeSidebar.setAttribute('data-configured', 'true');
                closeSidebar.addEventListener('click', () => {
                    profileSidebar.classList.remove('active');
                    const overlay = document.getElementById('sidebarOverlay');
                    if (overlay) {
                        overlay.classList.remove('active');
                    }
                    document.body.style.overflow = '';
                });
            }
            
            // Configurar overlay
            const overlay = document.getElementById('sidebarOverlay');
            if (overlay && !overlay.hasAttribute('data-configured')) {
                overlay.setAttribute('data-configured', 'true');
                overlay.addEventListener('click', () => {
                    profileSidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        }
    }, 500);
}

/**
 * Ajusta el margen superior del main según la altura del header
 */
function adjustMainMargin() {
    const header = document.querySelector('.site-header');
    const main = document.querySelector('main');
    
    if (!header || !main) return;
    
    const updateMargin = () => {
        const headerHeight = header.offsetHeight;
        main.style.marginTop = `${headerHeight + 20}px`;
    };
    
    // Actualizar inmediatamente
    updateMargin();
    
    // Actualizar cuando cambie el tamaño de ventana
    window.addEventListener('resize', updateMargin);
    
    // Usar ResizeObserver si está disponible
    if (window.ResizeObserver) {
        const observer = new ResizeObserver(updateMargin);
        observer.observe(header);
    }
}

/**
 * Configura la búsqueda inteligente con sugerencias
 */
function setupSmartSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    // Búsqueda con delay para mejor performance
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        }, 300);
    });
    
    // Ocultar sugerencias al perder el foco
    searchInput.addEventListener('blur', () => {
        setTimeout(hideSearchSuggestions, 200);
    });
}

/**
 * Muestra sugerencias de búsqueda
 * @param {string} query - Término de búsqueda
 */
function showSearchSuggestions(query) {
    // Eliminar sugerencias existentes
    hideSearchSuggestions();
    
    // Crear contenedor de sugerencias
    const searchContainer = document.querySelector('.search-container');
    const suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    suggestions.innerHTML = `
        <div class="suggestion-item" data-query="${query}">
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" fill="currentColor"/>
            </svg>
            Buscar "${query}"
        </div>
        <div class="suggestion-item" data-category="gaming">
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" fill="currentColor"/>
            </svg>
            PC Gaming
        </div>
        <div class="suggestion-item" data-category="monitor">
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z" fill="currentColor"/>
            </svg>
            Monitores
        </div>
    `;
    
    searchContainer.appendChild(suggestions);
    
    // Agregar eventos a las sugerencias
    suggestions.addEventListener('click', (e) => {
        const item = e.target.closest('.suggestion-item');
        if (!item) return;
        
        const query = item.dataset.query;
        const category = item.dataset.category;
        
        if (query) {
            window.location.href = `productos.html?buscar=${encodeURIComponent(query)}`;
        } else if (category) {
            window.location.href = `productos.html?categoria=${category}`;
        }
    });
}

/**
 * Oculta las sugerencias de búsqueda
 */
function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

/**
 * Configura el comportamiento del header al hacer scroll
 */
function setupHeaderScroll() {
    let lastScrollTop = 0;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    function handleScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Agregar clase cuando hay scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Auto-hide en móvil al hacer scroll hacia abajo
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        }
        
        lastScrollTop = scrollTop;
    }
}

/**
 * Inicializa tooltips para los botones
 */
function initTooltips() {
    const userButton = document.getElementById('userButton');
    const cartButton = document.getElementById('cartButton');
    
    if (userButton) {
        userButton.setAttribute('title', 'Mi cuenta');
    }
    
    if (cartButton) {
        cartButton.setAttribute('title', 'Carrito de compras');
    }
}

/**
 * Fuerza la recarga de iconos del header para evitar problemas de caché
 */
function forceReloadHeaderIcons() {
    const timestamp = Date.now();
    
    // Recargar logo
    const logo = document.querySelector('.logo img');
    if (logo && logo.src) {
        logo.src = logo.src.split('?')[0] + '?v=' + timestamp;
    }
    
    // Asegurar que los SVG se rendericen correctamente
    const svgElements = document.querySelectorAll('.site-header svg');
    svgElements.forEach(svg => {
        // Forzar re-render
        svg.style.display = 'none';
        svg.offsetHeight; // Trigger reflow
        svg.style.display = '';
    });
}

/**
 * Actualiza el estado del carrito
 * @param {number} itemCount - Número de items en el carrito
 */
function updateCartState(itemCount) {
    const cartCount = document.querySelector('.cart-count');
    const cartButton = document.getElementById('cartButton');
    
    if (cartCount) {
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    }
    
    if (cartButton) {
        cartButton.classList.toggle('has-items', itemCount > 0);
    }
}

/**
 * Maneja la navegación por categorías
 * @param {string} category - Categoría seleccionada
 */
function navigateToCategory(category) {
    const url = category === 'todos' ? 'productos.html' : `productos.html?categoria=${category}`;
    window.location.href = url;
}

// Exportar funciones para uso global
window.headerUtils = {
    updateCartState,
    navigateToCategory,
    showSearchSuggestions,
    hideSearchSuggestions
};