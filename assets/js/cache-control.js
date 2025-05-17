// assets/js/cache-control.js
// Script para gestionar la caché y asegurar que se carguen las últimas versiones

// Versión de la caché - cambiar esto cuando se actualicen los archivos
const CACHE_VERSION = '1.0.0';

// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
    
    // Aplicar versión a recursos críticos
    addVersionToResources();
    
    console.log('Cache control inicializado - v' + CACHE_VERSION);
});

/**
 * Registra el Service Worker
 */
function registerServiceWorker() {
    // Intentar registrar el service worker
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registrado con éxito:', registration.scope);
            
            // Comprobar si hay una nueva versión disponible
            if (registration.active) {
                registration.update()
                    .then(() => {
                        console.log('Service Worker actualizado');
                    })
                    .catch(error => {
                        console.error('Error al actualizar el Service Worker:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error al registrar Service Worker:', error);
        });
    
    // Escuchar eventos de actualización del service worker
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Nuevo Service Worker activado, recargando la página...');
        window.location.reload();
    });
}

/**
 * Agrega parámetros de versión a los recursos críticos
 */
function addVersionToResources() {
    // Generar un timestamp para forzar recarga de recursos
    const timestamp = new Date().getTime();
    
    // Seleccionar todos los links CSS
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        // Solo modificar si no tiene ya un parámetro de versión
        if (currentHref && !currentHref.includes('v=')) {
            link.setAttribute('href', appendVersionParam(currentHref, timestamp));
        }
    });
    
    // Seleccionar todos los scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        const currentSrc = script.getAttribute('src');
        // Solo modificar si no tiene ya un parámetro de versión
        if (currentSrc && !currentSrc.includes('v=')) {
            script.setAttribute('src', appendVersionParam(currentSrc, timestamp));
        }
    });
    
    // Seleccionar todas las imágenes
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const currentSrc = img.getAttribute('src');
        // Solo modificar si no tiene ya un parámetro de versión y no es un SVG inline
        if (currentSrc && !currentSrc.includes('v=') && !currentSrc.startsWith('data:')) {
            img.setAttribute('src', appendVersionParam(currentSrc, timestamp));
        }
    });
}

/**
 * Añade un parámetro de versión a una URL
 * @param {string} url - URL original
 * @param {string|number} version - Versión o timestamp a añadir
 * @returns {string} URL con parámetro de versión
 */
function appendVersionParam(url, version) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${version}`;
}

/**
 * Comprueba si hay actualizaciones disponibles
 * @param {boolean} forceReload - Si es true, recarga la página si hay actualizaciones
 */
function checkForUpdates(forceReload = false) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'checkForUpdates' });
        
        // Escuchar respuesta del Service Worker
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'updates-available' && event.data.hasUpdates) {
                console.log('Actualizaciones disponibles.');
                
                if (forceReload) {
                    window.location.reload();
                } else {
                    // Aquí podrías mostrar una notificación al usuario
                    showUpdateNotification();
                }
            }
        });
    }
}

/**
 * Muestra una notificación de actualización disponible
 */
function showUpdateNotification() {
    // Comprobar si ya existe una notificación
    if (document.querySelector('.update-notification')) return;
    
    const notification = document.createElement('div');
    notification.className = 'notification update-notification success';
    notification.innerHTML = `
        <p>Hay una nueva versión disponible. <button class="reload-btn">Actualizar ahora</button></p>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Añadir evento al botón
    const reloadBtn = notification.querySelector('.reload-btn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    // Eliminar después de 15 segundos si el usuario no hace clic
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 15000);
}

// Exportar funciones para uso global
window.cacheControl = {
    checkForUpdates,
    CACHE_VERSION
};