// assets/js/main.js
// Script principal que maneja la carga del sitio

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar efectos visuales
    initVisualEffects();
    
    // Inicializar navegación (ya no incluye setupMobileMenu duplicado)
    if (typeof initNavigation === 'function') {
        initNavigation();
    } else if (window.navigationModule && typeof window.navigationModule.initNavigation === 'function') {
        window.navigationModule.initNavigation();
    }
    
    // Inicializar formulario de contacto
    initContactForm();
    
    // Inicializar animaciones cuando los elementos son visibles
    initIntersectionObserver();
    
    // Inicializar botón para volver arriba
    initScrollToTopButton();
    
    console.log('Luna Tech - Sitio web inicializado correctamente');
});

/**
 * Inicializa efectos visuales generales
 */
function initVisualEffects() {
    // Iniciar partículas que aparecen y desaparecen
    if (window.effectsModule && typeof window.effectsModule.initStarsAnimation === 'function') {
        window.effectsModule.initStarsAnimation();
    }
    
    // Efecto parallax para estrellas
    if (window.effectsModule && typeof window.effectsModule.initParallaxEffect === 'function') {
        window.effectsModule.initParallaxEffect();
    }
}

/**
 * Inicializa el observer para animaciones al hacer scroll
 */
function initIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .section-fade-in');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('section-fade-in')) {
                        entry.target.classList.add('visible');
                    } else {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            if (!element.classList.contains('section-fade-in')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            }
            observer.observe(element);
        });
    }
}

/**
 * Inicializa el botón para volver arriba
 */
function initScrollToTopButton() {
    // Verificar si ya existe el botón
    if (!document.querySelector('.scroll-top-btn')) {
        // Crear botón
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-top-btn';
        scrollButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" fill="currentColor"/>
            </svg>
        `;
        
        // Agregar evento de click
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Agregar al DOM
        document.body.appendChild(scrollButton);
        
        // Mostrar/ocultar según el scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });
    }
}

/**
 * Inicializa el formulario de contacto
 */
function initContactForm() {
    // Inicializar modal del formulario
    initContactFormModal();
    
    // Inicializar función copiar al portapapeles
    initCopyToClipboard();
}

/**
 * Inicializa el modal del formulario de contacto
 */
function initContactFormModal() {
    // Cargar el componente del modal si no existe
    if (!document.getElementById('contactFormModal')) {
        // Crear placeholder si no existe
        if (!document.getElementById('contactFormModalPlaceholder')) {
            const placeholder = document.createElement('div');
            placeholder.id = 'contactFormModalPlaceholder';
            document.body.appendChild(placeholder);
        }
        
        // Cargar componente
        loadComponent('contactFormModalPlaceholder', '../components/contact-form-modal.html', () => {
            setupContactFormModal();
        });
    } else {
        setupContactFormModal();
    }
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
        document.body.style.overflow = 'hidden'; // Evitar scroll de página
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
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info)
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