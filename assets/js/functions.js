// functions.js
// Script para forzar la recarga de la caché en cualquier momento

/**
 * Fuerza una recarga completa del sitio y limpia todas las cachés
 */
function forceReloadSite() {
    // 1. Intentar limpiar caché del navegador
    clearAllCaches();
    
    // 2. Intentar actualizar service worker
    updateServiceWorker();
    
    // 3. Recargar la página forzando recarga desde servidor
    setTimeout(() => {
        window.location.reload(true);
    }, 500);
}

/**
 * Intenta limpiar todas las cachés disponibles
 */
function clearAllCaches() {
    // 1. Limpiar localStorage
    try {
        localStorage.clear();
    } catch (e) {
        console.warn('No se pudo limpiar localStorage', e);
    }
    
    // 2. Limpiar sessionStorage
    try {
        sessionStorage.clear();
    } catch (e) {
        console.warn('No se pudo limpiar sessionStorage', e);
    }
    
    // 3. Limpiar caché del Service Worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            action: 'clearCache'
        });
    }
    
    // 4. Limpiar Cache API
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
            });
        });
    }
    
    // 5. Establecer marca de tiempo para forzar recarga de recursos
    window.FORCE_RELOAD_TIMESTAMP = Date.now();
    
    console.log('Todas las cachés han sido limpiadas');
}

/**
 * Actualiza el Service Worker
 */
function updateServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            // Desregistrar todos los service workers
            for (let registration of registrations) {
                registration.unregister();
            }
            console.log('Service Workers desregistrados');
        });
    }
}

/**
 * Recarga solo recursos críticos como iconos sin recargar toda la página
 */
function reloadCriticalResources() {
    const timestamp = Date.now();
    
    // 1. Recargar todos los SVG (iconos)
    document.querySelectorAll('img[src*=".svg"]').forEach(img => {
        const originalSrc = img.getAttribute('src');
        
        // Crear una nueva URL con timestamp forzado
        let newSrc = originalSrc;
        if (newSrc.includes('?')) {
            newSrc = newSrc.split('?')[0] + '?t=' + timestamp;
        } else {
            newSrc = newSrc + '?t=' + timestamp;
        }
        
        // Reemplazar imagen actual con una nueva
        const newImg = document.createElement('img');
        
        // Copiar todos los atributos originales
        for (let i = 0; i < img.attributes.length; i++) {
            const attr = img.attributes[i];
            if (attr.name !== 'src') {
                newImg.setAttribute(attr.name, attr.value);
            }
        }
        
        // Establecer el nuevo src
        newImg.setAttribute('src', newSrc);
        
        // Sustituir la imagen
        if (img.parentNode) {
            img.parentNode.replaceChild(newImg, img);
        }
    });
    
    // 2. Recargar logo
    document.querySelectorAll('img[src*="logo"]').forEach(img => {
        const originalSrc = img.getAttribute('src');
        img.setAttribute('src', originalSrc.split('?')[0] + '?t=' + timestamp);
    });
    
    console.log('Recursos críticos recargados');
    return true;
}

// Exportar funciones para uso global
window.cacheTools = {
    forceReloadSite,
    clearAllCaches,
    reloadCriticalResources
};