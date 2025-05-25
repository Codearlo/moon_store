// assets/js/functions.js
// Funciones utilitarias generales del sitio web

/**
 * Fuerza un scroll suave al inicio de la página
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Scroll suave a un elemento específico
 * @param {string} elementId - ID del elemento
 * @param {number} offset - Offset adicional desde el top (default: 100)
 */
function scrollToElement(elementId, offset = 100) {
    const element = document.getElementById(elementId);
    if (element) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Detecta si el usuario está en un dispositivo móvil
 * @returns {boolean}
 */
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Detecta si el usuario está en una tablet
 * @returns {boolean}
 */
function isTabletDevice() {
    return (window.innerWidth > 768 && window.innerWidth <= 1366) || 
           (window.innerWidth === 1024 && window.innerHeight === 1366) || 
           (window.innerWidth === 1366 && window.innerHeight === 1024);
}

/**
 * Obtiene la altura real del viewport en móviles (evita problemas con barras de navegación)
 * @returns {number}
 */
function getRealViewportHeight() {
    return window.innerHeight || document.documentElement.clientHeight;
}

/**
 * Debounce - Limita la frecuencia de ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle - Limita la ejecución de una función a un intervalo específico
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Intervalo en ms
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback para navegadores más antiguos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const result = document.execCommand('copy');
            textArea.remove();
            return result;
        }
    } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
        return false;
    }
}

/**
 * Muestra una notificación temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info, warning)
 * @param {number} duration - Duración en ms (default: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Eliminar notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
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
    }, duration);
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida un número de teléfono peruano
 * @param {string} phone - Número a validar
 * @returns {boolean}
 */
function isValidPeruvianPhone(phone) {
    // Acepta formatos: +51xxxxxxxxx, 51xxxxxxxxx, 9xxxxxxxx
    const phoneRegex = /^(\+51|51)?[9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Formatea un número de teléfono peruano
 * @param {string} phone - Número a formatear
 * @returns {string}
 */
function formatPeruvianPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
        return `+51 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('51')) {
        const number = cleanPhone.substring(2);
        return `+51 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
    
    return phone;
}

/**
 * Abre WhatsApp con un mensaje predefinido
 * @param {string} phone - Número de teléfono (sin +)
 * @param {string} message - Mensaje a enviar
 */
function openWhatsApp(phone, message = '') {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

/**
 * Redirige a Google Maps con una dirección
 * @param {string} address - Dirección a buscar
 */
function openGoogleMaps(address) {
    const encodedAddress = encodeURIComponent(address);
    const mapsURL = `https://maps.google.com/maps?q=${encodedAddress}`;
    window.open(mapsURL, '_blank');
}

/**
 * Detecta si el navegador está en modo oscuro
 * @returns {boolean}
 */
function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Obtiene información del dispositivo
 * @returns {Object}
 */
function getDeviceInfo() {
    return {
        isMobile: isMobileDevice(),
        isTablet: isTabletDevice(),
        isDesktop: !isMobileDevice() && !isTabletDevice(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
    };
}

/**
 * Genera un ID único
 * @returns {string}
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Espera a que un elemento aparezca en el DOM
 * @param {string} selector - Selector CSS
 * @param {number} timeout - Timeout en ms (default: 5000)
 * @returns {Promise<Element>}
 */
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

/**
 * Anima el conteo de un número
 * @param {Element} element - Elemento a animar
 * @param {number} start - Número inicial
 * @param {number} end - Número final
 * @param {number} duration - Duración en ms
 */
function animateNumber(element, start, end, duration = 1000) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (difference * easeOut));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/**
 * Carga de forma lazy las imágenes
 * @param {string} selector - Selector de las imágenes a cargar
 */
function lazyLoadImages(selector = 'img[data-src]') {
    const images = document.querySelectorAll(selector);
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sin soporte
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Exportar funciones para uso global
window.siteUtils = {
    scrollToTop,
    scrollToElement,
    isMobileDevice,
    isTabletDevice,
    getRealViewportHeight,
    debounce,
    throttle,
    copyToClipboard,
    showNotification,
    isValidEmail,
    isValidPeruvianPhone,
    formatPeruvianPhone,
    openWhatsApp,
    openGoogleMaps,
    isDarkMode,
    getDeviceInfo,
    generateUniqueId,
    waitForElement,
    animateNumber,
    lazyLoadImages
};