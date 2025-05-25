// assets/js/auth.js
// Script simplificado para autenticación

document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth script loaded');
    
    // Detectar página
    const isLoginPage = document.getElementById('loginForm');
    const isRegisterPage = document.getElementById('registerForm');
    
    if (isLoginPage) {
        initLoginForm();
    }
    
    if (isRegisterPage) {
        initRegisterForm();
    }
});

function initLoginForm() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    
    // Toggle password
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
    }
    
    // Validación básica
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmailField);
    }
    
    // Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('/backend/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('¡Login exitoso!');
                window.location.href = '../index.html';
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Error de conexión');
        }
    });
}

function initRegisterForm() {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const toggleBtn = document.getElementById('togglePassword');
    const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');
    
    // Toggle passwords
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
    }
    
    if (toggleConfirmBtn && confirmInput) {
        toggleConfirmBtn.addEventListener('click', () => {
            const type = confirmInput.type === 'password' ? 'text' : 'password';
            confirmInput.type = type;
        });
    }
    
    // Password strength
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
    
    // Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('/backend/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión');
                window.location.href = 'login.html';
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Error de conexión');
        }
    });
}

function validateEmailField() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showError(this, 'Email inválido');
    } else {
        clearError(this);
    }
}

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

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}