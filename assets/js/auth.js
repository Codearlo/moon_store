// assets/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // LOGIN FORM
    if (loginForm) {
        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
            });
        }
        
        // Submit login
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
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
                    alert('¡Login exitoso!');
                    window.location.href = '../index.html';
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error de conexión con el servidor');
                console.error('Error:', error);
            }
        });
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
        
        // Submit register
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
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
                    alert('¡Registro exitoso!');
                    window.location.href = 'login.html';
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error de conexión con el servidor');
                console.error('Error:', error);
            }
        });
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