<?php
$host = "localhost";
$user = "u347334547_admin_moon"; 
$password = "CH7322a#"; 
$dbname = "u347334547_moonstore"; 

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>