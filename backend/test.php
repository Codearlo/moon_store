<?php
$host = "localhost";
$user = "u347334547_admin_moon"; 
$password = "CH7322a#"; 
$dbname = "u347334547_moonstore"; 

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo "ERROR: " . $conn->connect_error;
} else {
    echo "CONEXIÓN OK";
    
    // Probar si existe tabla usuarios
    $result = $conn->query("SHOW TABLES LIKE 'usuarios'");
    if ($result->num_rows > 0) {
        echo " - Tabla usuarios existe";
    } else {
        echo " - ERROR: Tabla usuarios no existe";
    }
}
?>