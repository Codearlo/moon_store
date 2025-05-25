<?php
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
    $input = json_decode(file_get_contents('php://input'), true);
    
    $nombres = trim($input['firstName'] ?? '');
    $apellidos = trim($input['lastName'] ?? '');
    $email = trim($input['email'] ?? '');
    $telefono = trim($input['phone'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validaciones
    if (empty($nombres) || empty($apellidos) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos los campos son requeridos']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email inválido']);
        exit;
    }
    
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres']);
        exit;
    }
    
    // Verificar si email existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Este email ya está registrado']);
        exit;
    }
    
    // Hashear contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar usuario
    $stmt = $conn->prepare("INSERT INTO usuarios (nombres, apellidos, email, telefono, password_hash) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nombres, $apellidos, $email, $telefono, $passwordHash);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al registrar usuario']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
?>