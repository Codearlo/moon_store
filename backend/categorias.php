<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

try {
    $sql = "SELECT id, nombre, descripcion FROM categorias WHERE activo = 1 ORDER BY nombre";
    $result = $conn->query($sql);
    
    $categorias = [];
    while ($row = $result->fetch_assoc()) {
        $categorias[] = [
            'id' => $row['id'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'categorias' => $categorias
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al cargar categorías']);
}
?>