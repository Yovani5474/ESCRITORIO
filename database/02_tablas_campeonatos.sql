USE campeonatos_db;

-- Insertar carreras de SENATI por defecto
INSERT INTO carreras (nombre_carrera, codigo, activo) VALUES
('Estudios Generales', 'EEGG', TRUE),
('Mecánica Automotriz', 'AMOD', TRUE),
('Electricista Industrial', 'EIND', TRUE),
('Mecatrónica Automotriz', 'AMTD', TRUE),
('Administración de Empresas', 'NAED', TRUE),
('Ingeniería de Software con IA', 'PIAD', TRUE)
ON DUPLICATE KEY UPDATE activo = TRUE;

-- Tabla: carreras (carreras de SENATI)
CREATE TABLE IF NOT EXISTS carreras (
    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: deportes
CREATE TABLE IF NOT EXISTS deportes (
    id_deporte INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    icono_url VARCHAR(255),
    tipo_actividad ENUM('deporte', 'juego_mesa') DEFAULT 'deporte',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo_actividad (tipo_actividad),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: usuarios (participantes/jugadores)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante VARCHAR(20) UNIQUE NOT NULL, -- ID único del estudiante
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE,
    contrasena_hash VARCHAR(255), -- Hash de la contraseña (bcrypt)
    telefono VARCHAR(20),
    rol ENUM('participante', 'administrador', 'arbitro', 'organizador') DEFAULT 'participante',
    id_carrera INT,
    semestre VARCHAR(20), -- Semestre actual del estudiante
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foto_url VARCHAR(255), -- Foto del participante
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera) ON DELETE SET NULL,
    INDEX idx_id_estudiante (id_estudiante),
    INDEX idx_correo (correo),
    INDEX idx_rol (rol),
    INDEX idx_carrera (id_carrera)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: canchas (espacios deportivos - sin dueño ni precio)
CREATE TABLE IF NOT EXISTS canchas (
    id_cancha INT AUTO_INCREMENT PRIMARY KEY,
    id_deporte INT NOT NULL,
    nombre_cancha VARCHAR(100) NOT NULL,
    superficie VARCHAR(50),
    ubicacion VARCHAR(255),
    capacidad_jugadores INT,
    estado ENUM('disponible', 'mantenimiento', 'inactiva') DEFAULT 'disponible',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_deporte) REFERENCES deportes(id_deporte) ON DELETE CASCADE,
    INDEX idx_deporte (id_deporte),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: equipos
CREATE TABLE IF NOT EXISTS equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_equipo VARCHAR(100) NOT NULL,
    escudo_url VARCHAR(255),
    color_primario VARCHAR(7) DEFAULT '#3498db', -- Color del equipo en formato HEX
    color_secundario VARCHAR(7) DEFAULT '#2980b9',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: equipo_miembros
CREATE TABLE IF NOT EXISTS equipo_miembros (
    id_miembro INT AUTO_INCREMENT PRIMARY KEY,
    id_equipo INT NOT NULL,
    id_usuario INT NOT NULL,
    rol_en_equipo ENUM('capitan', 'jugador', 'subcapitan') DEFAULT 'jugador',
    fecha_incorporacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_equipo_usuario (id_equipo, id_usuario),
    INDEX idx_equipo (id_equipo),
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: campeonatos
CREATE TABLE IF NOT EXISTS campeonatos (
    id_campeonato INT AUTO_INCREMENT PRIMARY KEY,
    nombre_campeonato VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_deporte INT NOT NULL,
    id_organizador INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo_sistema ENUM('eliminacion_directa', 'round_robin', 'suizo') DEFAULT 'eliminacion_directa',
    estado ENUM('inscripcion_abierta', 'en_curso', 'finalizado', 'cancelado') DEFAULT 'inscripcion_abierta',
    color_tema VARCHAR(7) DEFAULT '#2c3e50', -- Color del tema del campeonato
    color_fondo VARCHAR(7) DEFAULT '#f5f5f5',
    numero_equipos INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_deporte) REFERENCES deportes(id_deporte) ON DELETE CASCADE,
    FOREIGN KEY (id_organizador) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_deporte (id_deporte),
    INDEX idx_organizador (id_organizador),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: campeonato_equipos
CREATE TABLE IF NOT EXISTS campeonato_equipos (
    id_participante INT AUTO_INCREMENT PRIMARY KEY,
    id_campeonato INT NOT NULL,
    id_equipo INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    semilla INT, -- Posición en el bracket (1, 2, 3, 4, etc.)
    estado_participacion ENUM('inscrito', 'eliminado', 'campeon', 'subcampeon', 'tercer_lugar') DEFAULT 'inscrito',
    FOREIGN KEY (id_campeonato) REFERENCES campeonatos(id_campeonato) ON DELETE CASCADE,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo) ON DELETE CASCADE,
    UNIQUE KEY unique_campeonato_equipo (id_campeonato, id_equipo),
    INDEX idx_campeonato (id_campeonato),
    INDEX idx_equipo (id_equipo),
    INDEX idx_semilla (semilla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: partidos (encuentros del campeonato)
CREATE TABLE IF NOT EXISTS partidos (
    id_partido INT AUTO_INCREMENT PRIMARY KEY,
    id_campeonato INT NOT NULL,
    ronda INT NOT NULL, -- Ronda del bracket (1: octavos, 2: cuartos, 3: semifinales, 4: final, etc.)
    id_equipo_local INT NOT NULL,
    id_equipo_visitante INT NOT NULL,
    id_cancha INT,
    fecha_partido DATE,
    hora_inicio TIME,
    hora_fin TIME,
    resultado_local INT DEFAULT 0,
    resultado_visitante INT DEFAULT 0,
    id_ganador INT, -- ID del equipo ganador
    estado_partido ENUM('programado', 'en_curso', 'finalizado', 'suspendido') DEFAULT 'programado',
    id_arbitro INT,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_campeonato) REFERENCES campeonatos(id_campeonato) ON DELETE CASCADE,
    FOREIGN KEY (id_equipo_local) REFERENCES equipos(id_equipo) ON DELETE CASCADE,
    FOREIGN KEY (id_equipo_visitante) REFERENCES equipos(id_equipo) ON DELETE CASCADE,
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha) ON DELETE SET NULL,
    FOREIGN KEY (id_ganador) REFERENCES equipos(id_equipo) ON DELETE SET NULL,
    FOREIGN KEY (id_arbitro) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_campeonato (id_campeonato),
    INDEX idx_ronda (ronda),
    INDEX idx_equipo_local (id_equipo_local),
    INDEX idx_equipo_visitante (id_equipo_visitante),
    INDEX idx_estado (estado_partido),
    INDEX idx_fecha (fecha_partido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: links (enlaces compartibles)
CREATE TABLE IF NOT EXISTS links (
    id_link INT AUTO_INCREMENT PRIMARY KEY,
    id_campeonato INT,
    id_partido INT,
    tipo_link ENUM('transmision', 'acta', 'estadisticas', 'galeria', 'otro') DEFAULT 'otro',
    titulo VARCHAR(150) NOT NULL,
    url VARCHAR(500) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_campeonato) REFERENCES campeonatos(id_campeonato) ON DELETE CASCADE,
    FOREIGN KEY (id_partido) REFERENCES partidos(id_partido) ON DELETE CASCADE,
    INDEX idx_campeonato (id_campeonato),
    INDEX idx_partido (id_partido),
    INDEX idx_tipo (tipo_link),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: configuracion_ui (personalización de colores)
CREATE TABLE IF NOT EXISTS configuracion_ui (
    id_config INT AUTO_INCREMENT PRIMARY KEY,
    id_campeonato INT UNIQUE, -- Configuración por campeonato o NULL para global
    color_primario VARCHAR(7) DEFAULT '#3498db',
    color_secundario VARCHAR(7) DEFAULT '#2c3e50',
    color_acento VARCHAR(7) DEFAULT '#e74c3c',
    color_fondo VARCHAR(7) DEFAULT '#f5f5f5',
    color_texto VARCHAR(7) DEFAULT '#333333',
    modo_oscuro BOOLEAN DEFAULT FALSE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_campeonato) REFERENCES campeonatos(id_campeonato) ON DELETE CASCADE,
    INDEX idx_campeonato (id_campeonato)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_campeonato INT,
    tipo_notificacion ENUM('partido_programado', 'resultado_registrado', 'equipo_inscrito', 'campeonato_creado', 'link_compartido') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_campeonato) REFERENCES campeonatos(id_campeonato) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_campeonato (id_campeonato),
    INDEX idx_leida (leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
