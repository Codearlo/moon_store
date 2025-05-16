// assets/js/main.js
// Script principal que maneja la carga del sitio

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar efectos visuales
    initVisualEffects();
    
    // Inicializar navegación
    initNavigation();
    
    // Inicializar formulario de contacto
    initContactForm();
    
    // Inicializar animaciones cuando los elementos son visibles
    initIntersectionObserver();
    
    // Inicializar botón para volver arriba
    initScrollToTopButton();
    
    console.log('Luna Tech - Sitio web inicializado correctamente');
});

/**
 * Inicializa el formulario de contacto
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Aquí se implementaría la lógica de envío del formulario
            // Por ahora, solo simulamos el envío
            
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            console.log('Formulario enviado:', formValues);
            
            // Simulación de envío exitoso
            showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
            
            // Resetear el formulario
            contactForm.reset();
        });
    }
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
 * Añade estrellas fugaces al fondo
 */
function addShootingStars() {
    const bgElements = document.querySelector('.bg-elements');
    
    if (bgElements) {
        // Crear 5 estrellas fugaces
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.setProperty('--i', i);
            star.style.setProperty('--y', 10 + Math.random() * 40); // Posición vertical aleatoria
            bgElements.appendChild(star);
        }
    }
}