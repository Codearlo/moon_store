// assets/js/cache-control.js
// Script para gestionar la caché y asegurar que se carguen las últimas versiones

// Versión de la caché - cambiar esto cuando se actualicen los archivos
const CACHE_VERSION = '1.0.1';

// Bandera para evitar mostrar notificaciones de actualización después de recargar
let justReloaded = false;

// Lista de recursos críticos que deben recargarse siempre
const CRITICAL_RESOURCES = [
    'cart.svg',
    'logo.png',
    'whatsapp.svg',
    'instagram.svg',
    'facebook.svg',
    'youtube.svg',
    'tiktok.svg'
];

// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
    
    // Limpiar caché del navegador para ciertos recursos
    clearBrowserCache();
    
    // Aplicar versión a recursos críticos
    addVersionToResources();
    
    // Establecer justReloaded a true por un segundo para evitar notificaciones inmediatas
    justReloaded = true;
    setTimeout(() => {
        justReloaded = false;
    }, 2000);
    
    console.log('Cache control inicializado - v' + CACHE_VERSION);
});

/**
 * Registra el Service Worker
 */
function registerServiceWorker() {
    // Intentar registrar el service worker
    navigator.serviceWorker.register('/service-worker.js?v=' + CACHE_VERSION)
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
 * Intenta limpiar la caché del navegador para ciertos recursos
 */
function clearBrowserCache() {
    try {
        // Intentar limpiar caché para iconos y recursos críticos
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    // Sólo limpiar cachés que no sean nuestro caché controlado
                    if (!cacheName.includes('moon-store-cache')) {
                        caches.delete(cacheName);
                    }
                });
            });
        }
        
        // Para navegadores que soportan la API Cache Storage
        if (window.sessionStorage) {
            sessionStorage.setItem('cache-timestamp', Date.now());
        }
    } catch (e) {
        console.warn('No se pudo limpiar la caché del navegador', e);
    }
}

/**
 * Agrega parámetros de versión a los recursos críticos
 */
function addVersionToResources() {
    // Timestamp único para esta sesión
    const timestamp = Date.now();
    
    // Seleccionar todos los links CSS
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
        forceReloadResource(link, 'href', timestamp);
    });
    
    // Seleccionar todos los scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        forceReloadResource(script, 'src', timestamp);
    });
    
    // Seleccionar todas las imágenes
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        forceReloadResource(img, 'src', timestamp, true);
    });
    
    // Forzar recarga de iconos SVG específicos después de que el DOM esté completamente cargado
    setTimeout(() => {
        // Buscar SVGs que son iconos clave
        document.querySelectorAll('img[src*=".svg"]').forEach(svgImg => {
            const src = svgImg.getAttribute('src');
            if (src) {
                // Verificar si es un recurso crítico
                const isCritical = CRITICAL_RESOURCES.some(resource => src.includes(resource));
                if (isCritical) {
                    // Forzar recarga completa creando un nuevo elemento
                    const newSrc = appendVersionParam(src, timestamp + '-forced');
                    const parent = svgImg.parentNode;
                    
                    // Crear una nueva imagen con el src actualizado
                    const newImg = document.createElement('img');
                    // Copiar todos los atributos
                    Array.from(svgImg.attributes).forEach(attr => {
                        if (attr.name !== 'src') {
                            newImg.setAttribute(attr.name, attr.value);
                        }
                    });
                    // Establecer el nuevo src con versión
                    newImg.setAttribute('src', newSrc);
                    
                    // Reemplazar la imagen original
                    if (parent) {
                        parent.replaceChild(newImg, svgImg);
                    }
                }
            }
        });
    }, 500);
}

/**
 * Fuerza la recarga de un recurso agregando versión
 * @param {HTMLElement} element - Elemento HTML
 * @param {string} attribute - Atributo a modificar (src o href)
 * @param {string|number} timestamp - Timestamp para versión
 * @param {boolean} checkCritical - Si debe verificar si es un recurso crítico
 */
function forceReloadResource(element, attribute, timestamp, checkCritical = false) {
    const value = element.getAttribute(attribute);
    
    if (!value) return;
    
    // Verificar si ya tiene parámetro de versión
    const hasVersion = value.includes('v=');
    
    // Si es crítico, forzar recarga aunque tenga versión
    let isCritical = false;
    
    if (checkCritical) {
        isCritical = CRITICAL_RESOURCES.some(resource => value.includes(resource));
    }
    
    // Omitir recursos data: o blob:
    if (value.startsWith('data:') || value.startsWith('blob:')) return;
    
    // Si no tiene versión o es crítico, agregar/actualizar versión
    if (!hasVersion || isCritical) {
        element.setAttribute(attribute, appendVersionParam(value, timestamp));
        if (isCritical) {
            // Para recursos críticos, también asegurarnos de que no se estén cargando desde caché
            element.setAttribute('crossorigin', 'anonymous');
            element.setAttribute('loading', 'eager');
        }
    }
}

/**
 * Añade un parámetro de versión a una URL
 * @param {string} url - URL original
 * @param {string|number} version - Versión o timestamp a añadir
 * @returns {string} URL con parámetro de versión
 */
function appendVersionParam(url, version) {
    // Eliminar cualquier parámetro de versión existente
    let cleanUrl = url;
    if (url.includes('v=')) {
        // Extraer la URL base sin el parámetro v=
        const urlParts = url.split(/[?&]/);
        const baseUrl = urlParts[0];
        const params = urlParts.slice(1).filter(param => !param.startsWith('v='));
        
        cleanUrl = baseUrl;
        if (params.length > 0) {
            cleanUrl += '?' + params.join('&');
        }
    }
    
    // Agregar nuevo parámetro de versión
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}v=${version}`;
}

/**
 * Comprueba si hay actualizaciones disponibles
 * @param {boolean} forceReload - Si es true, recarga la página si hay actualizaciones
 */
function checkForUpdates(forceReload = false) {
    // No mostrar notificaciones si acaba de recargar la página
    if (justReloaded) return;
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'checkForUpdates' });
        
        // Escuchar respuesta del Service Worker
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'updates-available' && event.data.hasUpdates) {
                console.log('Actualizaciones disponibles.');
                
                if (forceReload) {
                    window.location.reload();
                } else {
                    // Mostrar notificación de actualización
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
    // No mostrar notificaciones si acaba de recargar la página
    if (justReloaded) return;
    
    // Comprobar si ya existe una notificación
    if (document.querySelector('.update-notification')) return;
    
    const notification = document.createElement('div');
    notification.className = 'notification update-notification success';
    notification.innerHTML = `
        <p>Actualización disponible <button class="reload-btn">Actualizar</button></p>
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
    
    // Eliminar notificación automáticamente después de 1 segundo
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 1000);
}

// Exportar funciones para uso global
window.cacheControl = {
    checkForUpdates,
    CACHE_VERSION,
    forceReload: function() {
        // Forzar recarga de todos los recursos críticos
        const timestamp = Date.now() + '-force-reload';
        
        // Específicamente buscar y recargar imágenes SVG (iconos)
        document.querySelectorAll('img[src*=".svg"]').forEach(img => {
            const currentSrc = img.getAttribute('src');
            if (currentSrc) {
                img.setAttribute('src', appendVersionParam(currentSrc, timestamp));
            }
        });
        
        return "Recarga forzada de recursos críticos completada";
    },
    reloadPage: function() {
        window.location.reload(true);  // true = forzar recarga desde servidor
    }
};