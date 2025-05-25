<?php
// backend/register.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require_once 'config/database.php';

try {
    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    $nombres = trim($input['firstName'] ?? '');
    $apellidos = trim($input['lastName'] ?? '');
    $email = trim($input['email'] ?? '');
    $telefono = trim($input['phone'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validaciones
    $errors = [];
    
    if (empty($nombres)) $errors[] = 'El nombre es requerido';
    if (empty($apellidos)) $errors[] = 'El apellido es requerido';
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email inválido';
    }
    if (empty($password) || strlen($password) < 6) {
        $errors[] = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => implode(', ', $errors)]);
        exit;
    }
    
    // Verificar si el email ya existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Este email ya está registrado']);
        exit;
    }
    
    // Hashear contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar usuario
    $stmt = $pdo->prepare("
        INSERT INTO usuarios (nombres, apellidos, email, telefono, password_hash) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([$nombres, $apellidos, $email, $telefono, $passwordHash]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
?>