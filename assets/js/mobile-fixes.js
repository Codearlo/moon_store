// assets/js/mobile-fixes.js
// Script para solucionar problemas específicos en dispositivos móviles

document.addEventListener('DOMContentLoaded', () => {
    // La gestión del menú móvil ahora está centralizada en navigation.js
    // Aquí solo añadimos correcciones específicas para rendimiento en móviles
    applyMobileFixes();
});

/**
 * Aplica correcciones específicas para dispositivos móviles
 */
function applyMobileFixes() {
    // Optimizar imágenes para dispositivos móviles
    optimizeMobileImages();
    
    // Corregir problemas de scroll en iOS
    fixIOSScroll();
    
    // Mejorar rendimiento general en móviles
    improvePerformance();
}

/**
 * Optimiza imágenes para móviles
 */
function optimizeMobileImages() {
    // Solo aplicar en móviles
    if (window.innerWidth > 768) return;
    
    // Cargar imágenes livianas específicas para móvil si existen
    const images = document.querySelectorAll('img[data-mobile-src]');
    images.forEach(img => {
        const mobileSrc = img.getAttribute('data-mobile-src');
        if (mobileSrc) {
            img.setAttribute('src', mobileSrc);
        }
    });
    
    // Cargar imágenes con lazy loading nativo
    const lazyImages = document.querySelectorAll('img:not([loading])');
    lazyImages.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
}

/**
 * Corrige problemas específicos de scroll en iOS
 */
function fixIOSScroll() {
    // Detectar iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Solución para 100vh en iOS
        const fixVh = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };
        
        fixVh();
        window.addEventListener('resize', fixVh);
        window.addEventListener('orientationchange', () => {
            setTimeout(fixVh, 200);
        });
        
        // Fix para problemas de scroll en inputs
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                // Pequeño retraso para dejar que el teclado se cierre
                setTimeout(() => {
                    window.scrollTo(0, window.scrollY);
                }, 100);
            });
        });
    }
}

/**
 * Mejora el rendimiento general en dispositivos móviles
 */
function improvePerformance() {
    // Solo aplicar en móviles
    if (window.innerWidth > 768) return;
    
    // Reducir animaciones en móviles para mejor rendimiento
    document.body.classList.add('reduce-animations');
    
    // Optimizar scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!document.body.classList.contains('is-scrolling')) {
            document.body.classList.add('is-scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 200);
    }, { passive: true });
    
    // Evitar reflow con propiedades que causan reflow
    const heavyElements = document.querySelectorAll('.product-card, .service-card, .glass-card');
    heavyElements.forEach(el => {
        el.style.willChange = 'transform';
        el.style.transform = 'translateZ(0)';
    });
}