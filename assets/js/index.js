// assets/js/index.js
// JavaScript específico para la página de inicio

document.addEventListener('DOMContentLoaded', () => {
    // Configurar menú móvil
    initMobileMenu();
    
    // Cargar componentes
    loadComponents();
    
    // Configurar funcionalidades adicionales
    setTimeout(() => {
        initCopyToClipboard();
    }, 1000);
    
    // Configurar estado de conexión
    setupConnectionStatus();
});

/**
 * Inicializa el menú móvil
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');
    const header = document.querySelector('.simple-nav');

    if (!mobileMenuToggle || !navLinks || !menuOverlay) return;

    const updateMenuIcon = (isOpen) => {
        const iconPath = mobileMenuToggle.querySelector('path');
        if (isOpen) {
            iconPath.setAttribute('d', 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z');
        } else {
            iconPath.setAttribute('d', 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z');
        }
    };

    const closeMenu = () => {
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');
        
        // Restaura los estilos del body y el header
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        if(header) header.style.paddingRight = '';
        
        updateMenuIcon(false);
    };

    const openMenu = () => {
        // Calcula el ancho de la barra de scroll ANTES de ocultarla
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        navLinks.classList.add('active');
        menuOverlay.classList.add('active');
        
        // Aplica los estilos para evitar el salto
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        if(header) header.style.paddingRight = `${scrollbarWidth}px`;

        updateMenuIcon(true);
    };

    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    menuOverlay.addEventListener('click', closeMenu);

    // Cerrar menú al hacer clic en enlaces y scroll suave
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.getAttribute('href');
            if (destination && destination.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(destination);
                if (targetElement) {
                    closeMenu();
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            } else {
                closeMenu();
            }
        });
    });
}

/**
 * Carga todos los componentes necesarios
 */
function loadComponents() {
    loadComponent('footer-placeholder', 'components/footer.html');
    loadComponent('whatsapp-placeholder', 'components/whatsapp-button.html');
    loadComponent('contactFormModalPlaceholder', 'components/contact-form-modal.html', () => {
        setupContactFormModal();
    });
}

/**
 * Carga componentes HTML reutilizables
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
 * Configura la funcionalidad del modal del formulario de contacto
 */
function setupContactFormModal() {
    const openModalBtn = document.getElementById('openContactFormBtn');
    const closeModalBtn = document.getElementById('closeContactFormBtn');
    const modal = document.getElementById('contactFormModal');
    const contactForm = document.getElementById('contactForm');
    
    if (!openModalBtn || !modal || !contactForm) return;
    
    // Abrir modal
    openModalBtn.addEventListener('click', () => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar modal con botón
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }
    
    // Cerrar al hacer clic afuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(contactForm);
        const nombre = formData.get('nombre');
        const asunto = formData.get('asunto');
        const mensaje = formData.get('mensaje');
        
        // Formatear mensaje para WhatsApp
        const whatsappMessage = `*Formulario de Contacto*\nNombre: ${nombre}\nAsunto: ${asunto}\nMensaje: ${mensaje}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Número de WhatsApp
        const phoneNumber = '51904505720';
        
        // Crear URL de WhatsApp
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Mostrar notificación
        showNotification('Redirigiendo a WhatsApp...', 'success');
        
        // Cerrar modal
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Abrir WhatsApp en una nueva pestaña
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            contactForm.reset(); // Resetear formulario
        }, 1000);
    });
}

/**
 * Inicializa la función de copiar al portapapeles
 */
function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('data-copy');
            
            if (textToCopy) {
                // Crear elemento temporal para copiar texto
                const tempInput = document.createElement('input');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                // Mostrar notificación
                showNotification('Copiado al portapapeles', 'success');
                
                // Efecto visual en el botón
                button.classList.add('copied');
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1000);
            }
        });
    });
}

/**
 * Muestra una notificación temporal
 */
function showNotification(message, type = 'info') {
    // Eliminar notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Configura el estado de conexión
 */
function setupConnectionStatus() {
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        document.body.classList.toggle('is-offline', !isOnline);
        if (isOnline && window.cacheControl) {
            window.cacheControl.checkForUpdates();
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Recargar recursos críticos al iniciar
    window.addEventListener('load', function () {
        if (window.cacheTools) {
            window.cacheTools.reloadCriticalResources();
        }
    });
}

// Exportar funciones para uso global si es necesario
window.indexUtils = {
    showNotification,
    loadComponent,
    setupContactFormModal,
    initCopyToClipboard
};