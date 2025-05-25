<?php
// backend/config/database.php
// Configuración de la base de datos

$host = 'localhost';
$database = 'u347334547_moonstore';
$username = 'u347334547_admin_moon';
$password = 'CH7322a#';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>