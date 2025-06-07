<?php
// backend/google-callback.php
// Maneja el callback de Google OAuth

header('Content-Type: application/json');
require_once 'config/database.php';
require_once 'config/google-oauth.php';

try {
    // Verificar que tenemos el código de autorización
    if (!isset($_GET['code'])) {
        throw new Exception('Código de autorización no recibido');
    }
    
    $code = $_GET['code'];
    
    // Intercambiar código por tokens
    $tokens = exchangeCodeForTokens($code);
    if (!$tokens || !isset($tokens['access_token'])) {
        throw new Exception('Error al obtener tokens de Google');
    }
    
    // Obtener información del usuario
    $userInfo = getUserInfo($tokens['access_token']);
    if (!$userInfo) {
        throw new Exception('Error al obtener información del usuario');
    }
    
    // Extraer datos del usuario
    $googleId = $userInfo['id'];
    $email = $userInfo['email'];
    $name = $userInfo['name'];
    $picture = $userInfo['picture'] ?? '';
    
    // Separar nombre y apellido
    $nameParts = explode(' ', $name, 2);
    $firstName = $nameParts[0];
    $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
    
    // Verificar si el usuario ya existe
    $stmt = $conn->prepare("SELECT id, nombres, apellidos, email, google_id FROM usuarios WHERE email = ? OR google_id = ?");
    $stmt->bind_param("ss", $email, $googleId);
    $stmt->execute();
    $result = $stmt->get_result();
    $existingUser = $result->fetch_assoc();
    
    if ($existingUser) {
        // Usuario existe, actualizar Google ID si no lo tiene
        if (empty($existingUser['google_id'])) {
            $stmt = $conn->prepare("UPDATE usuarios SET google_id = ?, avatar_url = ? WHERE id = ?");
            $stmt->bind_param("ssi", $googleId, $picture, $existingUser['id']);
            $stmt->execute();
        }
        
        $userId = $existingUser['id'];
        $userNames = $existingUser['nombres'];
        $userLastNames = $existingUser['apellidos'];
    } else {
        // Usuario nuevo, crear cuenta
        $stmt = $conn->prepare("INSERT INTO usuarios (nombres, apellidos, email, google_id, avatar_url, email_verificado) VALUES (?, ?, ?, ?, ?, 1)");
        $stmt->bind_param("sssss", $firstName, $lastName, $email, $googleId, $picture);
        
        if (!$stmt->execute()) {
            throw new Exception('Error al crear cuenta de usuario');
        }
        
        $userId = $conn->insert_id;
        $userNames = $firstName;
        $userLastNames = $lastName;
    }
    
    // Crear sesión
    session_start();
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_name'] = $userNames . ' ' . $userLastNames;
    $_SESSION['es_admin'] = false; // Los usuarios de Google no son admin por defecto
    $_SESSION['login_method'] = 'google';
    
    // Redirigir a la página principal con éxito
    header('Location: ../pages/index.html?login=success');
    exit;
    
} catch (Exception $e) {
    error_log('Error en Google OAuth: ' . $e->getMessage());
    
    // Redirigir a login con error
    header('Location: ../pages/login.html?error=' . urlencode('Error al autenticar con Google'));
    exit;
}
?>
