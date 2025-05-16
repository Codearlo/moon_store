// assets/js/effects.js
// Maneja efectos visuales y animaciones

/**
 * Inicializa el efecto parallax para las estrellas
 */
function initParallaxEffect() {
    const stars = document.querySelector('.stars');
    
    if (stars) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Aplicar transformación con diferentes intensidades
            stars.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        });
    }
}

/**
 * Inicializa la animación de partículas que aparecen y desaparecen
 */
function initStarsAnimation() {
    const bgElements = document.querySelector('.bg-elements');
    
    if (!bgElements) return;
    
    // Limpiar contenedor de estrellas si existe
    const existingStars = document.querySelector('.stars');
    if (existingStars) {
        existingStars.remove();
    }
    
    // Crear nuevo contenedor de estrellas/partículas
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    starsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    `;
    
    bgElements.appendChild(starsContainer);
    
    // Crear partículas que aparecen y desaparecen
    for (let i = 0; i < 100; i++) {
        createParticle(starsContainer);
    }
    
    // Crear nuevas partículas periódicamente
    setInterval(() => {
        createParticle(starsContainer);
        
        // Eliminar una partícula aleatoria para mantener equilibrio
        const particles = starsContainer.querySelectorAll('.particle');
        if (particles.length > 120) {
            const randomIndex = Math.floor(Math.random() * particles.length);
            particles[randomIndex].remove();
        }
    }, 300);
}

/**
 * Crea una partícula que aparece y desaparece
 * @param {HTMLElement} container - Contenedor donde se añadirá la partícula
 */
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posicionar aleatoriamente
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Tamaño aleatorio entre 1px y 3px
    const size = 1 + Math.random() * 2;
    
    // Duración aleatoria entre 3 y 8 segundos
    const duration = 3 + Math.random() * 5;
    
    // Ajustar los estilos
    particle.style.cssText = `
        position: absolute;
        background-color: white;
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        top: ${posY}%;
        border-radius: 50%;
        opacity: 0;
        animation: fadeInOut ${duration}s ease-in-out forwards;
    `;
    
    container.appendChild(particle);
    
    // Eliminar la partícula después de su ciclo de vida
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

/**
 * Agrega efectos de hover a los elementos con glassmorfismo
 */
function addGlassHoverEffects() {
    const glassElements = document.querySelectorAll('.glass-card');
    
    glassElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.backdropFilter = 'blur(20px)';
            element.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.backdropFilter = 'blur(12px)';
            element.style.backgroundColor = 'rgba(10, 1, 24, 0.7)';
        });
    });
}

// Exportar funciones para uso en otros archivos
window.effectsModule = {
    initParallaxEffect,
    initStarsAnimation,
    addGlassHoverEffects
};