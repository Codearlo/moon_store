-- database/update_for_google_auth.sql
-- Actualización de la base de datos para soportar autenticación con Google

-- Agregar columnas para Google OAuth
ALTER TABLE usuarios 
ADD COLUMN google_id VARCHAR(100) UNIQUE NULL AFTER email,
ADD COLUMN avatar_url TEXT NULL AFTER google_id,
ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE AFTER avatar_url;

-- Crear índice para google_id
CREATE INDEX idx_usuarios_google_id ON usuarios(google_id);

-- Hacer que password_hash sea opcional (para usuarios de Google)
ALTER TABLE usuarios 
MODIFY COLUMN password_hash VARCHAR(255) NULL;

-- Actualizar usuarios existentes para marcar emails como verificados si tienen contraseña
UPDATE usuarios 
SET email_verificado = TRUE 
WHERE password_hash IS NOT NULL;