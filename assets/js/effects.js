// assets/js/effects.js
// Maneja efectos visuales y animaciones

/**
 * Inicializa el efecto parallax para la luna y las estrellas
 */
function initParallaxEffect() {
    const moon = document.querySelector('.moon');
    const stars = document.querySelector('.stars');
    
    if (moon && stars) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Aplicar transformación con diferentes intensidades
            moon.style.transform = `translate(${x * 20}px, ${y * 20}px) rotate(45deg)`;
            stars.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        });
    }
}

/**
 * Inicializa la animación aleatoria de estrellas parpadeantes
 */
function initStarsAnimation() {
    const starsContainer = document.querySelector('.stars');
    
    if (!starsContainer) return;
    
    // Crear estrellas adicionales con parpadeo aleatorio
    for (let i = 0; i < 30; i++) {
        createStar(starsContainer, i);
    }
}

/**
 * Crea una estrella con animación personalizada
 * @param {HTMLElement} container - Contenedor donde se añadirá la estrella
 * @param {number} index - Índice para calcular posición y retraso
 */
function createStar(container, index) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Posicionar aleatoriamente
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Tamaño aleatorio entre 1px y 3px
    const size = 1 + Math.random() * 2;
    
    // Ajustar los estilos
    star.style.cssText = `
        position: absolute;
        background-color: white;
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        top: ${posY}%;
        border-radius: 50%;
        opacity: ${0.5 + Math.random() * 0.5};
        animation: twinkle ${3 + Math.random() * 4}s infinite ${Math.random() * 5}s;
    `;
    
    container.appendChild(star);
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

/**
 * Crea un efecto de starfield animado
 */
function createStarfieldEffect() {
    const bgElements = document.querySelector('.bg-elements');
    
    if (!bgElements) return;
    
    // Crear canvas para el starfield
    const canvas = document.createElement('canvas');
    canvas.className = 'starfield';
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    `;
    
    bgElements.appendChild(canvas);
    
    // Configurar canvas
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Crear estrellas
    const stars = [];
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            vx: Math.floor(Math.random() * 50) - 25,
            vy: Math.floor(Math.random() * 50) - 25
        });
    }
    
    // Función de animación
    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        
        for (let i = 0; i < starCount; i++) {
            const star = stars[i];
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.5) + ')';
            ctx.fill();
            
            // Mover estrellas
            star.x += star.vx / 30;
            star.y += star.vy / 30;
            
            // Si la estrella sale del canvas, reiniciar posición
            if (star.x < 0 || star.x > width) star.x = Math.random() * width;
            if (star.y < 0 || star.y > height) star.y = Math.random() * height;
        }
        
        window.requestAnimationFrame(animate);
    }
    
    // Ajustar tamaño del canvas cuando se redimensiona la ventana
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    // Iniciar animación
    animate();
}

// Exportar funciones para uso en otros archivos
window.effectsModule = {
    initParallaxEffect,
    initStarsAnimation,
    addGlassHoverEffects,
    createStarfieldEffect
};