// assets/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Verificar parámetros URL para mensajes
    checkUrlParams();
    
    // LOGIN FORM
    if (loginForm) {
        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                
                // Cambiar icono
                const icon = togglePassword.querySelector('svg path');
                if (type === 'text') {
                    icon.setAttribute('d', 'M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z');
                } else {
                    icon.setAttribute('d', 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z');
                }
            });
        }
        
        // Submit login
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('loginButton');
            const buttonText = submitBtn.querySelector('.button-text');
            const loader = submitBtn.querySelector('.button-loader');
            
            // Mostrar loading
            buttonText.style.display = 'none';
            loader.style.display = 'block';
            submitBtn.disabled = true;
            
            const formData = new FormData(loginForm);
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            try {
                const response = await fetch('../backend/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showMessage('¡Login exitoso!', 'success');
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1000);
                } else {
                    showMessage('Error: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión con el servidor', 'error');
                console.error('Error:', error);
            } finally {
                // Ocultar loading
                buttonText.style.display = 'inline';
                loader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
        
        // Google Login
        const googleButton = document.querySelector('.google-button');
        if (googleButton) {
            googleButton.addEventListener('click', () => {
                window.location.href = '../backend/google-auth.php';
            });
        }
    }
    
    // REGISTER FORM
    if (registerForm) {
        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
            });
        }
        
        if (toggleConfirmPassword && confirmPasswordInput) {
            toggleConfirmPassword.addEventListener('click', () => {
                const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
                confirmPasswordInput.type = type;
            });
        }
        
        // Password strength indicator
        if (passwordInput) {
            passwordInput.addEventListener('input', updatePasswordStrength);
        }
        
        // Validar confirmación de contraseña
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordConfirmation);
        }
        
        // Submit register
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validar que las contraseñas coincidan
            if (passwordInput.value !== confirmPasswordInput.value) {
                showMessage('Las contraseñas no coinciden', 'error');
                return;
            }
            
            const submitBtn = document.getElementById('registerButton');
            const buttonText = submitBtn.querySelector('.button-text');
            const loader = submitBtn.querySelector('.button-loader');
            
            // Mostrar loading
            buttonText.style.display = 'none';
            loader.style.display = 'block';
            submitBtn.disabled = true;
            
            const formData = new FormData(registerForm);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password')
            };
            
            try {
                const response = await fetch('../backend/register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showMessage('¡Registro exitoso!', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1000);
                } else {
                    showMessage('Error: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión con el servidor', 'error');
                console.error('Error:', error);
            } finally {
                // Ocultar loading
                buttonText.style.display = 'inline';
                loader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
        
        // Google Register
        const googleButton = document.querySelector('.google-button');
        if (googleButton) {
            googleButton.addEventListener('click', () => {
                window.location.href = '../backend/google-auth.php';
            });
        }
    }
});

// Password strength function
function updatePasswordStrength() {
    const password = this.value;
    const strengthBar = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    strengthBar.className = 'strength-fill';
    
    if (score === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Fortaleza de la contraseña';
    } else if (score <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Débil';
    } else if (score <= 3) {
        strengthBar.classList.add('fair');
        strengthText.textContent = 'Regular';
    } else if (score <= 4) {
        strengthBar.classList.add('good');
        strengthText.textContent = 'Buena';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Fuerte';
    }
}

// Validar confirmación de contraseña
function validatePasswordConfirmation() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    const errorMsg = document.getElementById('confirmPasswordError');
    
    if (confirmPassword && password !== confirmPassword) {
        errorMsg.textContent = 'Las contraseñas no coinciden';
        errorMsg.classList.add('show');
        this.parentElement.parentElement.classList.add('error');
    } else {
        errorMsg.textContent = '';
        errorMsg.classList.remove('show');
        this.parentElement.parentElement.classList.remove('error');
    }
}

// Verificar parámetros URL
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('login') === 'success') {
        showMessage('¡Autenticación exitosa con Google!', 'success');
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (urlParams.get('error')) {
        showMessage(urlParams.get('error'), 'error');
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Mostrar mensajes
function showMessage(message, type = 'info') {
    // Eliminar mensajes existentes
    const existingMessages = document.querySelectorAll('.auth-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span>${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Insertar antes del formulario
    const authCard = document.querySelector('.auth-card');
    const form = document.querySelector('.auth-form');
    authCard.insertBefore(messageDiv, form);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}
