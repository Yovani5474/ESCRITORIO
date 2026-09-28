USE campeonatos_db;

-- Insertar carreras de SENATI
INSERT INTO carreras (nombre_carrera, codigo, activo) VALUES
('Estudios Generales', 'EEGG', TRUE),
('Mecánica Automotriz', 'AMOD', TRUE),
('Electricista Industrial', 'EIND', TRUE),
('Mecatrónica Automotriz', 'AMTD', TRUE),
('Administración de Empresas', 'NAED', TRUE),
('Ingeniería de Software con IA', 'PIAD', TRUE);

-- Insertar deportes de ejemplo
INSERT INTO deportes (nombre, icono_url, tipo_actividad, activo) VALUES
('Fútbol', '/icons/futbol.png', 'deporte', TRUE),
('Futsal', '/icons/futsal.png', 'deporte', TRUE),
('Vóley', '/icons/voley.png', 'deporte', TRUE),
('Básquet', '/icons/basquet.png', 'deporte', TRUE),
('Ajedrez', '/icons/ajedrez.png', 'juego_mesa', TRUE);

-- Insertar usuarios (participantes) de ejemplo con correos @senati.pe
INSERT INTO usuarios (id_estudiante, nombre, apellido, correo, rol, id_carrera, semestre, activo) VALUES
('2026001', 'Marco', 'Antonio', 'marco@senati.pe', 'participante', 4, 'IV', TRUE),
('2026002', 'Kenyi', 'Ruiz', 'kenyi@senati.pe', 'participante', 2, 'II', TRUE),
('2026003', 'Rafael', 'Pérez', 'rafael@senati.pe', 'participante', 5, 'VI', TRUE),
('2026004', 'Pedro', 'García', 'pedro@senati.pe', 'participante', 3, 'III', TRUE),
('2026005', 'Juan', 'Martínez', 'juan@senati.pe', 'participante', 4, 'IV', TRUE),
('2026006', 'Carlos', 'López', 'carlos@senati.pe', 'participante', 2, 'V', TRUE),
('2026007', 'Admin', 'Sistema', 'admin@senati.pe', 'administrador', NULL, NULL, TRUE),
('2026008', 'Arbitro1', 'Principal', 'arbitro@senati.pe', 'arbitro', NULL, NULL, TRUE),
('ADMIN123', 'Super', 'Admin', 'admin123@senati.pe', 'administrador', NULL, NULL, TRUE);

-- Insertar canchas de ejemplo (sin dueño ni precio)
INSERT INTO canchas (id_deporte, nombre_cancha, superficie, ubicacion, capacidad_jugadores, estado) VALUES
(1, 'Cancha Principal', 'Grass sintético', 'Estadio Central', 22, 'disponible'),
(1, 'Cancha Secundaria', 'Grass sintético', 'Estadio Central', 22, 'disponible'),
(2, 'Loza Deportiva 1', 'Cemento', 'Patio Deportivo', 10, 'disponible'),
(3, 'Cancha Vóley 1', 'Sintético', 'Gimnasio', 12, 'disponible'),
(4, 'Cancha Básquet', 'Parquet', 'Gimnasio', 10, 'disponible');

-- Insertar equipos de ejemplo (24 equipos organizados por carreras)
INSERT INTO equipos (nombre_equipo, escudo_url, color_primario, color_secundario, activo) VALUES
-- AMOD (Mecánica Automotriz)
('AMOD III', '/escudos/amod.png', '#e74c3c', '#c0392b', TRUE),
('AMOD IV', '/escudos/amod.png', '#e74c3c', '#c0392b', TRUE),
('AMOD V', '/escudos/amod.png', '#e74c3c', '#c0392b', TRUE),
('AMOD 601', '/escudos/amod.png', '#e74c3c', '#c0392b', TRUE),
('AMOD 602', '/escudos/amod.png', '#e74c3c', '#c0392b', TRUE),
-- EIND (Electricista Industrial)
('EIND 201', '/escudos/eind.png', '#3498db', '#2980b9', TRUE),
('EIND 202', '/escudos/eind.png', '#3498db', '#2980b9', TRUE),
('EIND III', '/escudos/eind.png', '#3498db', '#2980b9', TRUE),
('EIND IV', '/escudos/eind.png', '#3498db', '#2980b9', TRUE),
('EIND 601', '/escudos/eind.png', '#3498db', '#2980b9', TRUE),
('EIND 602', '/escudos/eind.png', '#3498db', '#2980b9', TRUE),
-- AMTD (Mecatrónica Automotriz)
('AMTD 201', '/escudos/amtd.png', '#f39c12', '#e67e22', TRUE),
('AMTD 202', '/escudos/amtd.png', '#f39c12', '#e67e22', TRUE),
('AMTD III', '/escudos/amtd.png', '#f39c12', '#e67e22', TRUE),
('AMTD IV', '/escudos/amtd.png', '#f39c12', '#e67e22', TRUE),
-- NAED (Administración de Empresas)
('NAED II', '/escudos/naed.png', '#9b59b6', '#8e44ad', TRUE),
('NAED III', '/escudos/naed.png', '#9b59b6', '#8e44ad', TRUE),
('NAED IV', '/escudos/naed.png', '#9b59b6', '#8e44ad', TRUE),
('NAED V', '/escudos/naed.png', '#9b59b6', '#8e44ad', TRUE),
('NAED VI', '/escudos/naed.png', '#9b59b6', '#8e44ad', TRUE),
-- PIAD (Ingeniería de Software con IA)
('PIAD II', '/escudos/piad.png', '#1abc9c', '#16a085', TRUE),
('PIAD IV', '/escudos/piad.png', '#1abc9c', '#16a085', TRUE),
('PIAD VI', '/escudos/piad.png', '#1abc9c', '#16a085', TRUE),
-- EEGG (Estudios Generales)
('EE66', '/escudos/eegg.png', '#34495e', '#2c3e50', TRUE);

-- Insertar miembros de equipos de ejemplo
INSERT INTO equipo_miembros (id_equipo, id_usuario, rol_en_equipo) VALUES
(1, 1, 'capitan'), -- Marco - Los Tigres
(1, 2, 'jugador'), -- Kenyi - Los Tigres
(2, 3, 'capitan'), -- Rafael - Los Leones
(2, 4, 'jugador'), -- Pedro - Los Leones
(3, 5, 'capitan'), -- Juan - Los Rayos
(3, 6, 'jugador'), -- Carlos - Los Rayos
(4, 1, 'jugador'), -- Marco también en Águilas
(4, 3, 'jugador'); -- Rafael también en Águilas

-- Insertar campeonato de futsal con 24 equipos y 2 canchas
INSERT INTO campeonatos (nombre_campeonato, descripcion, id_deporte, id_organizador, fecha_inicio, fecha_fin, tipo_sistema, estado, color_tema, color_fondo, numero_equipos) VALUES
('Campeonato de Futsal SENATI 2026', 'Torneo de futsal entre carreras del instituto - 24 equipos', 2, 9, '2026-09-25', '2026-09-26', 'eliminacion_directa', 'en_curso', '#e74c3c', '#f5f5f5', 24);

-- Insertar todos los equipos en el campeonato (24 equipos)
INSERT INTO campeonato_equipos (id_campeonato, id_equipo, semilla, estado_participacion) VALUES
-- Cancha 1 (12 equipos)
(1, 1, 1, 'inscrito'), -- AMOD III
(1, 16, 2, 'inscrito'), -- NAED II
(1, 2, 3, 'inscrito'), -- AMOD IV
(1, 6, 4, 'inscrito'), -- EIND 201
(1, 3, 5, 'inscrito'), -- AMOD V
(1, 17, 6, 'inscrito'), -- NAED III
(1, 13, 7, 'inscrito'), -- AMTD 201
(1, 4, 8, 'inscrito'), -- AMOD 601
(1, 7, 9, 'inscrito'), -- EIND 202
(1, 5, 10, 'inscrito'), -- AMOD 602
(1, 10, 11, 'inscrito'), -- EIND 601
(1, 15, 12, 'inscrito'), -- AMTD III
-- Cancha 2 (12 equipos)
(1, 18, 13, 'inscrito'), -- NAED IV
(1, 21, 14, 'inscrito'), -- PIAD II
(1, 24, 15, 'inscrito'), -- EE66
(1, 19, 16, 'inscrito'), -- NAED V
(1, 11, 17, 'inscrito'), -- EIND 602
(1, 16, 18, 'inscrito'), -- AMTD IV
(1, 20, 19, 'inscrito'), -- NAED VI
(1, 22, 20, 'inscrito'), -- PIAD IV
(1, 14, 21, 'inscrito'), -- AMTD 202
(1, 8, 22, 'inscrito'), -- EIND III
(1, 23, 23, 'inscrito'), -- PIAD VI
(1, 9, 24, 'inscrito'); -- EIND IV

-- Insertar partidos del campeonato (cuartos de final para 4 equipos = 2 partidos)
INSERT INTO partidos (id_campeonato, ronda, id_equipo_local, id_equipo_visitante, id_cancha, fecha_partido, hora_inicio, hora_fin, estado_partido, id_arbitro) VALUES
(1, 1, 1, 3, 1, '2026-09-27', '14:00:00', '16:00:00', 'finalizado', 8), -- Tigres vs Rayos
(1, 1, 2, 4, 2, '2026-09-27', '16:30:00', '18:30:00', 'finalizado', 8); -- Leones vs Águilas

-- Actualizar resultados de los partidos
UPDATE partidos SET resultado_local = 3, resultado_visitante = 1, id_ganador = 1 WHERE id_partido = 1; -- Tigres ganan 3-1
UPDATE partidos SET resultado_local = 2, resultado_visitante = 2, id_ganador = NULL WHERE id_partido = 2; -- Empate 2-2

-- Insertar partido final
INSERT INTO partidos (id_campeonato, ronda, id_equipo_local, id_equipo_visitante, id_cancha, fecha_partido, hora_inicio, hora_fin, estado_partido, id_arbitro) VALUES
(1, 2, 1, 2, 1, '2026-10-02', '15:00:00', '17:00:00', 'programado', 8); -- Final: Tigres vs Leones

-- Insertar links de ejemplo
INSERT INTO links (id_campeonato, id_partido, tipo_link, titulo, url, descripcion) VALUES
(1, 1, 'transmision', 'Transmisión Tigres vs Rayos', 'https://youtube.com/watch?v=example1', 'Transmisión en vivo del partido'),
(1, 1, 'acta', 'Acta Oficial Tigres vs Rayos', 'https://docs.google.com/document/d/example1', 'Acta del partido con firmas'),
(1, 2, 'transmision', 'Transmisión Leones vs Águilas', 'https://youtube.com/watch?v=example2', 'Transmisión en vivo del partido'),
(1, NULL, 'galeria', 'Galería del Campeonato', 'https://photos.google.com/example', 'Fotos de todos los partidos');

-- Insertar configuración UI de ejemplo
INSERT INTO configuracion_ui (id_campeonato, color_primario, color_secundario, color_acento, color_fondo, color_texto, modo_oscuro) VALUES
(1, '#3498db', '#2c3e50', '#e74c3c', '#f5f5f5', '#333333', FALSE);

-- Insertar notificaciones de ejemplo
INSERT INTO notificaciones (id_usuario, id_campeonato, tipo_notificacion, titulo, mensaje, leida) VALUES
(1, 1, 'partido_programado', 'Próximo Partido', 'Tu equipo Los Tigres tiene un partido el 05/10/2026 a las 14:00', FALSE),
(3, 1, 'partido_programado', 'Próximo Partido', 'Tu equipo Los Leones tiene un partido el 05/10/2026 a las 16:30', FALSE),
(1, 1, 'resultado_registrado', 'Resultado Registrado', 'El partido Tigres vs Rayos finalizó 3-1. ¡Felicidades!', FALSE);
