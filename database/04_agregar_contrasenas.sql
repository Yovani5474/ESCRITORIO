USE campeonatos_db;

-- Agregar columna contrasena_hash a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN contrasena_hash VARCHAR(255) AFTER correo;

-- Actualizar usuario admin con contraseña por defecto
-- Nota: Este es un hash de bcrypt para la contraseña 'admin123'
-- En producción, el admin debería cambiar su contraseña inmediatamente
UPDATE usuarios 
SET contrasena_hash = '$2b$10$NJeiiRXCw0sSgj2BQfQ0jexuEDzaKbjfVKtmIz5FrjALR/Rfdllii'
WHERE correo = 'admin123@senati.pe';

-- Para otros usuarios, puedes agregar contraseñas manualmente con:
-- UPDATE usuarios SET contrasena_hash = '$2b$10$...' WHERE correo = 'usuario@senati.pe';
-- O usar el endpoint POST /api/usuarios para crear usuarios con contraseñas
