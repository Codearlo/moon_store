// assets/js/components.js
// Maneja la carga de componentes reutilizables (header y footer)

document.addEventListener('DOMContentLoaded', () => {
    // Cargar componentes
    loadComponent('header-placeholder', '../components/header.html');
    loadComponent('footer-placeholder', '../components/footer.html');
});

/**
 * Carga componentes HTML reutilizables
 * @param {string} targetId - ID del elemento donde se cargará el componente
 * @param {string} componentUrl - URL del archivo de componente
 */
function loadComponent(targetId, componentUrl) {
    const target = document.getElementById(targetId);
    
    if (!target) {
        console.error(`Elemento con ID ${targetId} no encontrado`);
        return;
    }
    
    fetch(componentUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el componente: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            target.innerHTML = html;
            
            // Activar scripts después de cargar el componente
            if (targetId === 'header-placeholder') {
                if (typeof initNavigation === 'function') {
                    initNavigation();
                } else if (window.navigationModule && typeof window.navigationModule.initNavigation === 'function') {
                    window.navigationModule.initNavigation();
                }
                markActiveNavLink();
            }
        })
        .catch(error => {
            console.error('Error cargando componente:', error);
            target.innerHTML = `<p>Error cargando componente: ${error.message}</p>`;
        });
}

/**
 * Marca el enlace de navegación activo según la URL actual
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