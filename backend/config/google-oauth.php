<?php
// backend/config/google-oauth.php
// Configuración para Google OAuth 2.0

// Credenciales de Google OAuth (obtener de Google Cloud Console)
define('GOOGLE_CLIENT_ID', '225943393755-l0k6f64p2iaf1ap1b6rm45nkffu8chf1.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', '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');
define('GOOGLE_REDIRECT_URI', 'https://moonstore.codearlo.com/backend/google-callback.php');

// URLs de Google OAuth
define('GOOGLE_OAUTH_URL', 'https://accounts.google.com/o/oauth2/auth');
define('GOOGLE_TOKEN_URL', 'https://oauth2.googleapis.com/token');
define('GOOGLE_USERINFO_URL', 'https://www.googleapis.com/oauth2/v2/userinfo');

/**
 * Genera la URL de autorización de Google
 */
function getGoogleAuthUrl() {
    $params = [
        'client_id' => GOOGLE_CLIENT_ID,
        'redirect_uri' => GOOGLE_REDIRECT_URI,
        'scope' => 'openid email profile',
        'response_type' => 'code',
        'access_type' => 'offline',
        'prompt' => 'consent'
    ];
    
    return GOOGLE_OAUTH_URL . '?' . http_build_query($params);
}

/**
 * Intercambia el código de autorización por tokens
 */
function exchangeCodeForTokens($code) {
    $postData = [
        'client_id' => GOOGLE_CLIENT_ID,
        'client_secret' => GOOGLE_CLIENT_SECRET,
        'redirect_uri' => GOOGLE_REDIRECT_URI,
        'grant_type' => 'authorization_code',
        'code' => $code
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, GOOGLE_TOKEN_URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    }
    
    return false;
}

/**
 * Obtiene información del usuario usando el access token
 */
function getUserInfo($accessToken) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, GOOGLE_USERINFO_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    }
    
    return false;
}
?>
