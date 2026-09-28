-- Crear base de datos para campeonatos deportivos
CREATE DATABASE IF NOT EXISTS campeonatos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campeonatos_db;

-- Usuario de la base de datos (descomentar y ajustar según sea necesario)
-- CREATE USER IF NOT EXISTS 'campeonatos_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
-- GRANT ALL PRIVILEGES ON campeonatos_db.* TO 'campeonatos_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Insertar carreras de SENATI por defecto
INSERT INTO carreras (nombre_carrera, codigo, activo) VALUES
('Estudios Generales', 'EEGG', TRUE),
('Mecánica Automotriz', 'AMOD', TRUE),
('Electricista Industrial', 'EIND', TRUE),
('Mecatrónica Automotriz', 'AMTD', TRUE),
('Administración de Empresas', 'NAED', TRUE),
('Ingeniería de Software con IA', 'PIAD', TRUE)
ON DUPLICATE KEY UPDATE activo = TRUE;
