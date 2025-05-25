// assets/js/auth.js
// Script para funcionalidades de autenticación (login y registro)

document.addEventListener('DOMContentLoaded', () => {
    // Detectar qué página estamos viendo
    const isLoginPage = window.location.pathname.includes('login.html');
    const isRegisterPage = window.location.pathname.includes('register.html');
    
    if (isLoginPage) {
        initLoginPage();
    } else if (isRegisterPage) {
        initRegisterPage();
    }
    
    // Funcionalidades comunes
    initCommonFunctionality();
});

/**
 * Inicializa la página de login
 */
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginButton = document.getElementById('loginButton');
    
    if (!loginForm) return;
    
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => togglePasswordVisibility(passwordInput, togglePassword));
    }
    
    // Validación en tiempo real
    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
        emailInput.addEventListener('input', () => clearError(emailInput));
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', () => clearError(passwordInput));
    }
    
    // Envío del formulario
    loginForm.addEventListener('submit', handleLoginSubmit);
}

/**
 * Inicializa la página de registro
 */
function initRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    if (!registerForm) return;
    
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => togglePasswordVisibility(passwordInput, togglePassword));
    }
    
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword));
    }
    
    // Validación en tiempo real
    if (firstNameInput) {
        firstNameInput.addEventListener('blur', () => validateRequired(firstNameInput, 'El nombre es requerido'));
        firstNameInput.addEventListener('input', () => clearError(firstNameInput));
    }
    
    if (lastNameInput) {
        lastNameInput.addEventListener('blur', () => validateRequired(lastNameInput, 'El apellido es requerido'));
        lastNameInput.addEventListener('input', () => clearError(lastNameInput));
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
        emailInput.addEventListener('input', () => clearError(emailInput));
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => validatePhone(phoneInput));
        phoneInput.addEventListener('input', () => {
            formatPhoneInput(phoneInput);
            clearError(phoneInput);
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            validatePasswordStrength(passwordInput);
            clearError(passwordInput);
            if (confirmPasswordInput.value) {
                validatePasswordMatch(passwordInput, confirmPasswordInput);
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            validatePasswordMatch(passwordInput, confirmPasswordInput);
            clearError(confirmPasswordInput);
        });
    }
    
    // Envío del formulario
    registerForm.addEventListener('submit', handleRegisterSubmit);
}

/**
 * Inicializa funcionalidades comunes
 */
function initCommonFunctionality() {
    // Botones de redes sociales
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });
    
    // Enlaces de términos y condiciones
    const termsLinks = document.querySelectorAll('a[href="#"]');
    termsLinks.forEach(link => {
        if (link.textContent.includes('términos')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Próximamente: Términos y condiciones', 'info');
            });
        }
    });
}

/**
 * Maneja el envío del formulario de login
 */
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    // Validaciones
    let isValid = true;
    
    if (!validateEmail(document.getElementById('email'))) isValid = false;
    if (!validateRequired(document.getElementById('password'), 'La contraseña es requerida')) isValid = false;
    
    if (!isValid) return;
    
    // Mostrar loader
    const button = document.getElementById('loginButton');
    showButtonLoader(button);
    
    try {
        // Simular llamada a API
        await simulateAPICall();
        
        // En un caso real, aquí harías la llamada a tu backend
        console.log('Login attempt:', { email, password, rememberMe });
        
        // Simular respuesta exitosa
        showNotification('¡Bienvenido de vuelta!', 'success');
        
        // Redirigir después de un delay
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        
    } catch (error) {
        showNotification('Error al iniciar sesión. Verifica tus credenciales.', 'error');
        hideButtonLoader(button);
    }
}

/**
 * Maneja el envío del formulario de registro
 */
async function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const acceptTerms = formData.get('acceptTerms');
    const newsletter = formData.get('newsletter');
    
    // Validaciones
    let isValid = true;
    
    if (!validateRequired(document.getElementById('firstName'), 'El nombre es requerido')) isValid = false;
    if (!validateRequired(document.getElementById('lastName'), 'El apellido es requerido')) isValid = false;
    if (!validateEmail(document.getElementById('email'))) isValid = false;
    if (!validatePhone(document.getElementById('phone'))) isValid = false;
    if (!validatePasswordStrength(document.getElementById('password'))) isValid = false;
    if (!validatePasswordMatch(document.getElementById('password'), document.getElementById('confirmPassword'))) isValid = false;
    if (!acceptTerms) {
        showNotification('Debes aceptar los términos y condiciones', 'error');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Mostrar loader
    const button = document.getElementById('registerButton');
    showButtonLoader(button);
    
    try {
        // Simular llamada a API
        await simulateAPICall();
        
        // En un caso real, aquí harías la llamada a tu backend
        console.log('Register attempt:', {
            firstName, lastName, email, phone, password, newsletter
        });
        
        // Simular respuesta exitosa
        showNotification('¡Cuenta creada exitosamente!', 'success');
        
        // Redirigir después de un delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        
    } catch (error) {
        showNotification('Error al crear la cuenta. Inténtalo de nuevo.', 'error');
        hideButtonLoader(button);
    }
}

/**
 * Maneja el login con redes sociales
 */
function handleSocialLogin(e) {
    e.preventDefault();
    const provider = e.currentTarget.classList.contains('google-button') ? 'Google' : 'Facebook';
    
    showNotification(`Próximamente: Login con ${provider}`, 'info');
    
    // Aquí implementarías la integración real con OAuth
    console.log(`Social login attempt: ${provider}`);
}

/**
 * Alterna la visibilidad de la contraseña
 */
function togglePasswordVisibility(input, button) {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    
    // Cambiar icono
    const svg = button.querySelector('svg path');
    if (svg) {
        if (isPassword) {
            // Icono de ojo tachado
            svg.setAttribute('d', 'M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17C9.24,17 7,14.76 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z');
        } else {
            // Icono de ojo normal
            svg.setAttribute('d', 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z');
        }
    }
}

/**
 * Valida que un campo requerido tenga valor
 */
function validateRequired(input, message) {
    const value = input.value.trim();
    if (!value) {
        showFieldError(input, message);
        return false;
    }
    
    clearFieldError(input);
    return true;
}

/**
 * Valida formato de email
 */
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(input, 'El correo electrónico es requerido');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError(input, 'Ingresa un correo electrónico válido');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

/**
 * Valida formato de teléfono peruano
 */
function validatePhone(input) {
    const phone = input.value.replace(/\D/g, '');
    
    if (!phone) {
        showFieldError(input, 'El teléfono es requerido');
        return false;
    }
    
    if (phone.length !== 9 || !phone.startsWith('9')) {
        showFieldError(input, 'Ingresa un número válido (9 dígitos, inicia con 9)');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

/**
 * Formatea la entrada del teléfono
 */
function formatPhoneInput(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = value.substring(0, 3) + ' ' + value.substring(3);
        } else {
            value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 9);
        }
    }
    
    input.value = value;
}

/**
 * Valida la fortaleza de la contraseña
 */
function validatePasswordStrength(input) {
    const password = input.value;
    const strengthBar = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        if (strengthBar) {
            strengthBar.className = 'strength-fill';
            strengthBar.style.width = '0%';
        }
        if (strengthText) {
            strengthText.textContent = 'Fortaleza de la contraseña';
        }
        showFieldError(input, 'La contraseña es requerida');
        return false;
    }
    
    let score = 0;
    let feedback = '';
    
    // Criterios de fortaleza
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Determinar nivel
    if (score < 3) {
        feedback = 'Muy débil';
        if (strengthBar) {
            strengthBar.className = 'strength-fill weak';
        }
    } else if (score < 4) {
        feedback = 'Débil';
        if (strengthBar) {
            strengthBar.className = 'strength-fill fair';
        }
    } else if (score < 5) {
        feedback = 'Buena';
        if (strengthBar) {
            strengthBar.className = 'strength-fill good';
        }
    } else {
        feedback = 'Muy fuerte';
        if (strengthBar) {
            strengthBar.className = 'strength-fill strong';
        }
    }
    
    if (strengthText) {
        strengthText.textContent = feedback;
    }
    
    if (score < 3) {
        showFieldError(input, 'La contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas y números');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

/**
 * Valida que las contraseñas coincidan
 */
function validatePasswordMatch(passwordInput, confirmInput) {
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    if (!confirm) {
        showFieldError(confirmInput, 'Confirma tu contraseña');
        return false;
    }
    
    if (password !== confirm) {
        showFieldError(confirmInput, 'Las contraseñas no coinciden');
        return false;
    }
    
    clearFieldError(confirmInput);
    return true;
}

/**
 * Muestra error en un campo específico
 */
function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Limpia el error de un campo específico
 */
function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Limpia cualquier error en un campo
 */
function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

/**
 * Muestra el loader en un botón
 */
function showButtonLoader(button) {
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');
    
    button.disabled = true;
    if (buttonText) buttonText.style.display = 'none';
    if (buttonLoader) buttonLoader.style.display = 'block';
}

/**
 * Oculta el loader en un botón
 */
function hideButtonLoader(button) {
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');
    
    button.disabled = false;
    if (buttonText) buttonText.style.display = '';
    if (buttonLoader) buttonLoader.style.display = 'none';
}

/**
 * Simula una llamada a API
 */
function simulateAPICall() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simular éxito en el 90% de los casos
            if (Math.random() < 0.9) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

/**
 * Muestra una notificación
 */
function showNotification(message, type = 'info') {
    // Usar la función global si existe, sino crear una básica
    if (window.siteUtils && window.siteUtils.showNotification) {
        window.siteUtils.showNotification(message, type);
    } else {
        // Implementación básica
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px 25px',
            background: 'rgba(10, 1, 24, 0.9)',
            color: 'white',
            borderRadius: '8px',
            zIndex: '9999',
            transform: 'translateY(0)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}