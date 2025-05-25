<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

try {
    $categoria = $_GET['categoria'] ?? '';
    $precio_min = $_GET['precio_min'] ?? '';
    $precio_max = $_GET['precio_max'] ?? '';
    $buscar = $_GET['buscar'] ?? '';
    $ordenar = $_GET['ordenar'] ?? 'nombre';
    $pagina = max(1, intval($_GET['pagina'] ?? 1));
    $limite = 12; // productos por página
    $offset = ($pagina - 1) * $limite;
    
    // Construir WHERE clause
    $where = ["p.activo = 1"];
    $params = [];
    $types = "";
    
    if (!empty($categoria)) {
        $where[] = "p.categoria_id = ?";
        $params[] = $categoria;
        $types .= "i";
    }
    
    if (!empty($precio_min)) {
        $where[] = "p.precio >= ?";
        $params[] = $precio_min;
        $types .= "d";
    }
    
    if (!empty($precio_max)) {
        $where[] = "p.precio <= ?";
        $params[] = $precio_max;
        $types .= "d";
    }
    
    if (!empty($buscar)) {
        $where[] = "(p.nombre LIKE ? OR p.descripcion LIKE ?)";
        $buscar_param = "%$buscar%";
        $params[] = $buscar_param;
        $params[] = $buscar_param;
        $types .= "ss";
    }
    
    $where_clause = implode(" AND ", $where);
    
    // Determinar ORDER BY
    $order_by = "p.nombre ASC";
    switch ($ordenar) {
        case 'precio-asc':
            $order_by = "p.precio ASC";
            break;
        case 'precio-desc':
            $order_by = "p.precio DESC";
            break;
        case 'fecha-desc':
            $order_by = "p.created_at DESC";
            break;
    }
    
    // Contar total de productos
    $count_sql = "SELECT COUNT(*) as total 
                  FROM productos p 
                  LEFT JOIN categorias c ON p.categoria_id = c.id 
                  WHERE $where_clause";
    
    if (!empty($params)) {
        $count_stmt = $conn->prepare($count_sql);
        $count_stmt->bind_param($types, ...$params);
        $count_stmt->execute();
        $total_result = $count_stmt->get_result();
    } else {
        $total_result = $conn->query($count_sql);
    }
    
    $total_productos = $total_result->fetch_assoc()['total'];
    $total_paginas = ceil($total_productos / $limite);
    
    // Obtener productos
    $sql = "SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.imagen, 
                   c.nombre as categoria
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE $where_clause 
            ORDER BY $order_by 
            LIMIT $limite OFFSET $offset";
    
    if (!empty($params)) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($sql);
    }
    
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = [
            'id' => $row['id'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],
            'precio' => floatval($row['precio']),
            'stock' => intval($row['stock']),
            'imagen' => $row['imagen'],
            'categoria' => $row['categoria']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'productos' => $productos,
        'total' => $total_productos,
        'pagina_actual' => $pagina,
        'total_paginas' => $total_paginas,
        'limite' => $limite
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al cargar productos']);
}
?>