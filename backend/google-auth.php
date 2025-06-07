<?php
// backend/google-auth.php
// Inicia el proceso de autenticación con Google

require_once 'config/google-oauth.php';

// Generar URL de autorización y redirigir
$authUrl = getGoogleAuthUrl();
header('Location: ' . $authUrl);
exit;
?>
