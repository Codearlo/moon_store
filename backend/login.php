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
    
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email y contraseña son requeridos']);
        exit;
    }
    
    // Buscar usuario
    $stmt = $conn->prepare("SELECT id, nombres, apellidos, email, password_hash, es_administrador FROM usuarios WHERE email = ? AND activo = 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit;
    }
    
    // Actualizar último acceso
    $stmt = $conn->prepare("UPDATE usuarios SET created_at = NOW() WHERE id = ?");
    $stmt->bind_param("i", $user['id']);
    $stmt->execute();
    
    // Crear sesión
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['es_admin'] = $user['es_administrador'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'user' => [
            'id' => $user['id'],
            'nombres' => $user['nombres'],
            'apellidos' => $user['apellidos'],
            'email' => $user['email'],
            'es_administrador' => $user['es_administrador']
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
?>