// assets/js/components.js
// Maneja la carga de componentes reutilizables (header y footer)

document.addEventListener('DOMContentLoaded', () => {
    // Cargar componentes
    loadComponent('header-placeholder', '../components/header.html');
    loadComponent('footer-placeholder', '../components/footer.html');
    loadComponent('whatsapp-placeholder', '../components/whatsapp-button.html');
});

/**
 * Carga componentes HTML reutilizables
 * @param {string} targetId - ID del elemento donde se cargará el componente
 * @param {string} componentUrl - URL del archivo de componente
 * @param {function} callback - Función que se ejecutará después de cargar el componente (opcional)
 */
function loadComponent(targetId, componentUrl, callback) {
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
                // Inicializar navegación después de cargar el header
                setTimeout(() => {
                    if (typeof initNavigation === 'function') {
                        initNavigation();
                    } else if (window.navigationModule && typeof window.navigationModule.initNavigation === 'function') {
                        window.navigationModule.initNavigation();
                    }
                    markActiveNavLink();
                    
                    // Configurar sidebar de perfil específicamente
                    initProfileSidebarAfterLoad();
                }, 100);
            }
            
            // Ejecutar callback si se proporcionó
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error('Error cargando componente:', error);
            target.innerHTML = `<p>Error cargando componente: ${error.message}</p>`;
        });
}

/**
 * Inicializa el sidebar de perfil después de cargar el header
 */
function initProfileSidebarAfterLoad() {
    const profileButton = document.getElementById('profileButton');
    const profileSidebar = document.getElementById('profileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');
    
    console.log('Inicializando sidebar desde components.js', {
        profileButton: !!profileButton,
        profileSidebar: !!profileSidebar,
        sidebarOverlay: !!sidebarOverlay,
        closeSidebar: !!closeSidebar
    });
    
    if (profileButton && profileSidebar) {
        // Remover listeners existentes si los hay
        profileButton.removeEventListener('click', handleProfileClick);
        
        // Agregar nuevo listener
        profileButton.addEventListener('click', handleProfileClick);
        
        // Configurar botón de cerrar
        if (closeSidebar) {
            closeSidebar.removeEventListener('click', handleCloseSidebar);
            closeSidebar.addEventListener('click', handleCloseSidebar);
        }
        
        // Configurar overlay
        if (sidebarOverlay) {
            sidebarOverlay.removeEventListener('click', handleCloseSidebar);
            sidebarOverlay.addEventListener('click', handleCloseSidebar);
        }
        
        // Configurar tecla ESC
        document.addEventListener('keydown', handleEscapeKey);
        
        console.log('Sidebar configurado exitosamente');
    } else {
        console.error('No se pudieron encontrar elementos del sidebar');
    }
}

/**
 * Maneja el clic en el botón de perfil
 */
function handleProfileClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Abriendo sidebar de perfil...');
    
    const profileSidebar = document.getElementById('profileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (profileSidebar && sidebarOverlay) {
        profileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Actualizar contenido del sidebar
        updateSidebarContent();
        
        console.log('Sidebar abierto correctamente');
    } else {
        console.error('No se encontraron elementos del sidebar para abrir');
    }
}

/**
 * Maneja el cierre del sidebar
 */
function handleCloseSidebar(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Cerrando sidebar de perfil...');
    
    const profileSidebar = document.getElementById('profileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (profileSidebar && sidebarOverlay) {
        profileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Sidebar cerrado correctamente');
    }
}

/**
 * Maneja la tecla ESC para cerrar el sidebar
 */
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        const profileSidebar = document.getElementById('profileSidebar');
        if (profileSidebar && profileSidebar.classList.contains('active')) {
            handleCloseSidebar(e);
        }
    }
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
 * Verifica si hay una sesión de usuario activa
 */
function checkUserSession() {
    return localStorage.getItem('user_token') !== null || 
           localStorage.getItem('user_data') !== null;
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
}

/**
 * Función global para cerrar sesión
 */
function logout() {
    // Limpiar datos de sesión
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    sessionStorage.clear();
    
    // Cerrar sidebar
    handleCloseSidebar(new Event('click'));
    
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

// Hacer funciones disponibles globalmente
window.sidebarUtils = {
    handleProfileClick,
    handleCloseSidebar,
    updateSidebarContent,
    logout,
    showNotification
};