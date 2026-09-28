# Documentación de Base de Datos y Backend - Sistema de Alquiler de Canchas

Este documento detalla la estructura de la base de datos y los requerimientos para que el backend pueda implementar el sistema de reservas, gestión de equipos, usuarios, menú de opciones por disciplina deportiva, sistema de referees, permisos de visualización, notificaciones, gestión de carreras (instituto) y juegos de mesa (ajedrez, etc.).

## 1. Estructura de la Base de Datos (Tablas Relacionales)

### Tabla: `deportes`
Permite gestionar el menú de opciones de deportes y actividades disponibles en la plataforma (Fútbol, Futsal, Vóley, Básquet, Ajedrez, Damas, etc.).

- `id_deporte` (INT, Primary Key, Auto-increment)
- `nombre` (VARCHAR, Unique) -> Ej: Fútbol 11, Futsal, Vóley, Tenis, Ajedrez, Damas, Dominó
- `icono_url` (VARCHAR) -> Imagen o ícono para mostrar en el menú de la interfaz
- `tipo_actividad` (VARCHAR) -> `deporte` (fútbol, vóley, etc.), `juego_mesa` (ajedrez, damas, etc.)
- `activo` (BOOLEAN) -> 1 si está disponible en la app, 0 si está oculto

### Tabla: `carreras`
Catálogo de carreras del instituto educativo.

- `id_carrera` (INT, Primary Key, Auto-increment)
- `nombre_carrera` (VARCHAR, Unique) -> Ej: Ingeniería de Sistemas, Administración, Derecho, Medicina
- `codigo` (VARCHAR, Unique) -> Código interno de la carrera
- `activo` (BOOLEAN) -> 1 si está activa, 0 si está inactiva

### Tabla: `usuarios`
Almacena la información de los clientes, dueños de canchas o administradores.

- `id_usuario` (INT, Primary Key, Auto-increment)
- `nombre` (VARCHAR)
- `apellido` (VARCHAR)
- `correo` (VARCHAR, Unique)
- `telefono` (VARCHAR)
- `contrasena_hash` (VARCHAR)
- `rol` (VARCHAR) -> Ej: `cliente`, `administrador`, `dueno_cancha`, `arbitro`
- `id_carrera` (INT, Foreign Key -> `carreras.id_carrera`, Opcional) -> Carrera del estudiante (solo para instituto)
- `codigo_estudiante` (VARCHAR, Opcional) -> Código único del estudiante en el instituto
- `fecha_registro` (TIMESTAMP)
- `disponible_para_arbitrar` (BOOLEAN) -> Para usuarios con rol arbitro, indica si está disponible para asignar partidos
- `calificacion_arbitro` (DECIMAL) -> Promedio de calificaciones (1-5) para árbitros
- `notificaciones_activas` (BOOLEAN) -> Si el usuario desea recibir notificaciones

### Tabla: `canchas`
Representa los espacios físicos disponibles para deportes (fútbol, vóley, etc.), vinculados directamente a un deporte del menú principal.

- `id_cancha` (INT, Primary Key, Auto-increment)
- `id_deporte` (INT, Foreign Key -> `deportes.id_deporte`)
- `id_dueno` (INT, Foreign Key -> `usuarios.id_usuario`) -> Dueño de la cancha
- `nombre_cancha` (VARCHAR) -> Ej: Cancha Sintética 1, Loza Deportiva Central
- `superficie` (VARCHAR) -> Ej: Grass sintético, Losa de cemento, Arena
- `precio_por_hora` (DECIMAL)
- `estado` (VARCHAR) -> Ej: `disponible`, `mantenimiento`, `inactiva`
- `ubicacion` (VARCHAR) -> Dirección física de la cancha
- `capacidad_jugadores` (INT) -> Número máximo de jugadores

### Tabla: `espacios_juegos_mesa`
Representa los espacios físicos disponibles para juegos de mesa (ajedrez, damas, dominó, etc.).

- `id_espacio` (INT, Primary Key, Auto-increment)
- `id_deporte` (INT, Foreign Key -> `deportes.id_deporte`) -> Debe ser un juego de mesa (tipo_actividad = 'juego_mesa')
- `id_dueno` (INT, Foreign Key -> `usuarios.id_usuario`) -> Dueño del espacio
- `nombre_espacio` (VARCHAR) -> Ej: Sala de Ajedrez 1, Área de Juegos de Mesa
- `tipo_espacio` (VARCHAR) -> Ej: `mesa_individual`, `sala_multiple`, `area_abierta`
- `numero_mesas` (INT) -> Cantidad de mesas disponibles en el espacio
- `tipo_mesa` (VARCHAR) -> Ej: `ajedrez`, `damas`, `domino`, `generico`
- `precio_por_hora` (DECIMAL)
- `precio_por_mesa` (DECIMAL, Opcional) -> Precio adicional por mesa si aplica
- `estado` (VARCHAR) -> Ej: `disponible`, `mantenimiento`, `inactiva`
- `ubicacion` (VARCHAR) -> Dirección física del espacio
- `capacidad_jugadores` (INT) -> Número máximo de jugadores simultáneos
- `iluminacion` (VARCHAR) -> Ej: `natural`, `artificial`, `mixta`
- `climatizado` (BOOLEAN) -> Si el espacio tiene aire acondicionado/calefacción

### Tabla: `equipos`
Permite a los usuarios crear sus propios grupos o equipos de amigos para los partidos.

- `id_equipo` (INT, Primary Key, Auto-increment)
- `id_capitan` (INT, Foreign Key -> `usuarios.id_usuario`)
- `nombre_equipo` (VARCHAR)
- `escudo_url` (VARCHAR)
- `nivel_competitivo` (VARCHAR) -> Ej: `recreativo`, `amateur`, `profesional`
- `visibilidad` (VARCHAR) -> `publico` (cualquiera puede ver), `privado` (solo miembros)

### Tabla: `equipo_miembros`
Relación de muchos a muchos para saber qué usuarios pertenecen a qué equipo.

- `id_miembro` (INT, Primary Key, Auto-increment)
- `id_equipo` (INT, Foreign Key -> `equipos.id_equipo`)
- `id_usuario` (INT, Foreign Key -> `usuarios.id_usuario`)
- `estado_invitacion` (VARCHAR) -> Ej: `aceptado`, `pendiente`, `rechazado`
- `rol_en_equipo` (VARCHAR) -> Ej: `capitan`, `jugador`, `subcapitan`

### Tabla: `reservas`
Registra el alquiler de una cancha deportiva o espacio de juegos de mesa por parte de un usuario o equipo en una fecha y hora específica.

- `id_reserva` (INT, Primary Key, Auto-increment)
- `tipo_reserva` (VARCHAR) -> `cancha` (deportes), `juego_mesa` (ajedrez, damas, etc.)
- `id_cancha` (INT, Foreign Key -> `canchas.id_cancha`, Opcional) -> Solo si tipo_reserva = 'cancha'
- `id_espacio_juego` (INT, Foreign Key -> `espacios_juegos_mesa.id_espacio`, Opcional) -> Solo si tipo_reserva = 'juego_mesa'
- `id_usuario` (INT, Foreign Key -> `usuarios.id_usuario`) -> Usuario que hace la reserva
- `id_equipo` (INT, Foreign Key, Opcional -> `equipos.id_equipo`)
- `id_arbitro` (INT, Foreign Key, Opcional -> `usuarios.id_usuario`) -> Árbitro asignado (solo para deportes)
- `fecha_reserva` (DATE)
- `hora_inicio` (TIME)
- `hora_fin` (TIME)
- `estado_reserva` (VARCHAR) -> Ej: `pendiente_pago`, `confirmada`, `en_curso`, `finalizada`, `cancelada`
- `monto_total` (DECIMAL)
- `visibilidad` (VARCHAR) -> `publico` (cualquiera puede ver), `privado` (solo participantes), `equipos_amigos` (solo equipos del mismo deporte)
- `resultado_partido` (JSON, Opcional) -> {equipo_local: {goles: 2}, equipo_visitante: {goles: 1}, detalles: "..."} (solo para deportes)
- `resultado_juego` (JSON, Opcional) -> {jugador1: {id_usuario, resultado: "ganado"}, jugador2: {id_usuario, resultado: "perdido"}, tipo_victoria: "mate", movimientos: 45} (solo para juegos de mesa)
- `numero_mesas_reservadas` (INT, Opcional) -> Cantidad de mesas reservadas (solo para juegos de mesa)

### Tabla: `permisos_visualizacion`
Controla quién puede ver cada reserva/pastido.

- `id_permiso` (INT, Primary Key, Auto-increment)
- `id_reserva` (INT, Foreign Key -> `reservas.id_reserva`)
- `id_usuario` (INT, Foreign Key -> `usuarios.id_usuario`, Opcional) -> Usuario específico con permiso
- `id_equipo` (INT, Foreign Key -> `equipos.id_equipo`, Opcional) -> Equipo con permiso
- `tipo_permiso` (VARCHAR) -> `lectura` (puede ver), `escritura` (puede modificar), `invitar` (puede invitar otros)
- `fecha_concedido` (TIMESTAMP)

### Tabla: `notificaciones`
Almacena las notificaciones para usuarios y equipos.

- `id_notificacion` (INT, Primary Key, Auto-increment)
- `id_usuario` (INT, Foreign Key -> `usuarios.id_usuario`, Opcional) -> Usuario destinatario
- `id_equipo` (INT, Foreign Key -> `equipos.id_equipo`, Opcional) -> Equipo destinatario
- `tipo_notificacion` (VARCHAR) -> `partido_finalizado`, `arbitro_asignado`, `cambio_horario`, `invitacion_equipo`, `recordatorio_partido`
- `titulo` (VARCHAR)
- `mensaje` (TEXT)
- `id_reserva` (INT, Foreign Key -> `reservas.id_reserva`, Opcional) -> Reserva relacionada
- `leida` (BOOLEAN) -> Si ya fue leída
- `fecha_creacion` (TIMESTAMP)
- `fecha_expiracion` (TIMESTAMP, Opcional) -> Cuándo dejar de mostrar la notificación

### Tabla: `disponibilidad_arbitros`
Horarios en los que los árbitros están disponibles para arbitrar.

- `id_disponibilidad` (INT, Primary Key, Auto-increment)
- `id_arbitro` (INT, Foreign Key -> `usuarios.id_usuario`)
- `dia_semana` (INT) -> 0 (Domingo) a 6 (Sábado)
- `hora_inicio` (TIME)
- `hora_fin` (TIME)
- `activo` (BOOLEAN)

### Tabla: `asignaciones_arbitros`
Historial de asignaciones de árbitros a partidos.

- `id_asignacion` (INT, Primary Key, Auto-increment)
- `id_reserva` (INT, Foreign Key -> `reservas.id_reserva`)
- `id_arbitro` (INT, Foreign Key -> `usuarios.id_usuario`)
- `estado_asignacion` (VARCHAR) -> `asignado`, `completado`, `cancelado`, `no_presento`
- `fecha_asignacion` (TIMESTAMP)
- `calificacion_arbitro` (INT, Opcional) -> Calificación (1-5) dada por los equipos
- `comentario_calificacion` (TEXT, Opcional)

### Tabla: `historial_partidos`
Registro detallado de partidos finalizados para estadísticas y seguimiento.

- `id_historial` (INT, Primary Key, Auto-increment)
- `id_reserva` (INT, Foreign Key -> `reservas.id_reserva`)
- `fecha_partido` (DATE)
- `hora_inicio` (TIME)
- `hora_fin` (TIME)
- `id_cancha` (INT, Foreign Key -> `canchas.id_cancha`, Opcional)
- `id_espacio_juego` (INT, Foreign Key -> `espacios_juegos_mesa.id_espacio`, Opcional)
- `id_arbitro` (INT, Foreign Key -> `usuarios.id_usuario`, Opcional)
- `resultado` (JSON) -> {equipo_local: {id_equipo, goles}, equipo_visitante: {id_equipo, goles}} (para deportes)
- `resultado_juego` (JSON, Opcional) -> {jugador1: {id_usuario, resultado: "ganado"}, jugador2: {id_usuario, resultado: "perdido"}, tipo_victoria: "mate", movimientos: 45} (para juegos de mesa)
- `estado_final` (VARCHAR) -> `completado`, `suspendido`, `abandonado`
- `detalles_suspension` (TEXT, Opcional)

### Tabla: `torneos_juegos_mesa`
Organización de torneos para juegos de mesa (ajedrez, damas, etc.).

- `id_torneo` (INT, Primary Key, Auto-increment)
- `id_deporte` (INT, Foreign Key -> `deportes.id_deporte`) -> Debe ser un juego de mesa
- `id_organizador` (INT, Foreign Key -> `usuarios.id_usuario`)
- `nombre_torneo` (VARCHAR)
- `descripcion` (TEXT)
- `fecha_inicio` (DATE)
- `fecha_fin` (DATE)
- `tipo_torneo` (VARCHAR) -> `eliminacion_directa`, `round_robin`, `suizo`
- `numero_participantes` (INT)
- `numero_rondas` (INT)
- `estado_torneo` (VARCHAR) -> `inscripcion_abierta`, `en_curso`, `finalizado`, `cancelado`
- `premio` (VARCHAR, Opcional) -> Descripción del premio
- `reglas_especificas` (TEXT, Opcional) -> Reglas específicas del torneo

### Tabla: `torneo_participantes`
Relación de participantes en torneos de juegos de mesa.

- `id_participante` (INT, Primary Key, Auto-increment)
- `id_torneo` (INT, Foreign Key -> `torneos_juegos_mesa.id_torneo`)
- `id_usuario` (INT, Foreign Key -> `usuarios.id_usuario`)
- `id_equipo` (INT, Foreign Key -> `equipos.id_equipo`, Opcional) -> Si participa un equipo
- `fecha_inscripcion` (TIMESTAMP)
- `estado_participacion` (VARCHAR) -> `inscrito`, `eliminado`, `campeon`, `subcampeon`
- `puntos_torneo` (INT) -> Puntos acumulados en el torneo
- `ranking_actual` (INT) -> Posición actual en el torneo

### Tabla: `partidas_torneo`
Partidas individuales dentro de un torneo de juegos de mesa.

- `id_partida` (INT, Primary Key, Auto-increment)
- `id_torneo` (INT, Foreign Key -> `torneos_juegos_mesa.id_torneo`)
- `ronda` (INT) -> Número de ronda del torneo
- `id_jugador1` (INT, Foreign Key -> `usuarios.id_usuario`)
- `id_jugador2` (INT, Foreign Key -> `usuarios.id_usuario`)
- `id_ganador` (INT, Foreign Key -> `usuarios.id_usuario`, Opcional) -> Usuario ganador
- `fecha_partida` (DATE)
- `hora_inicio` (TIME)
- `hora_fin` (TIME)
- `resultado_detalle` (JSON) -> {tipo_victoria: "mate", movimientos: 45, tiempo_usado_j1: "25:30", tiempo_usado_j2: "32:15"}
- `estado_partida` (VARCHAR) -> `programada`, `en_curso`, `finalizada`, `suspendida`
- `id_espacio_juego` (INT, Foreign Key -> `espacios_juegos_mesa.id_espacio`, Opcional)

---

## 2. Requerimientos para los Endpoints del Backend

### A. Módulo de Deportes (Menú de Opciones)

#### `GET /api/deportes`
- **Descripción**: Retorna la lista de todos los deportes y juegos de mesa activos para construir el menú dinámico en la interfaz.
- **Parámetros**: `tipo_actividad` (opcional) -> `deporte`, `juego_mesa`
- **Respuesta esperada (JSON)**:
```json
[
  { "id_deporte": 1, "nombre": "Fútbol", "icono_url": "/icons/futbol.png", "tipo_actividad": "deporte" },
  { "id_deporte": 2, "nombre": "Futsal", "icono_url": "/icons/futsal.png", "tipo_actividad": "deporte" },
  { "id_deporte": 3, "nombre": "Vóley", "icono_url": "/icons/voley.png", "tipo_actividad": "deporte" },
  { "id_deporte": 4, "nombre": "Ajedrez", "icono_url": "/icons/ajedrez.png", "tipo_actividad": "juego_mesa" },
  { "id_deporte": 5, "nombre": "Damas", "icono_url": "/icons/damas.png", "tipo_actividad": "juego_mesa" },
  { "id_deporte": 6, "nombre": "Dominó", "icono_url": "/icons/domino.png", "tipo_actividad": "juego_mesa" }
]
```

### B. Módulo de Canchas

#### `GET /api/canchas?deporte_id={id}`
- **Descripción**: Filtra las canchas disponibles según la opción seleccionada en el menú.
- **Parámetros**: `deporte_id` (opcional) - Filtra por deporte
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_cancha": 1,
    "nombre_cancha": "Cancha Sintética 1",
    "superficie": "Grass sintético",
    "precio_por_hora": 50.00,
    "estado": "disponible",
    "ubicacion": "Av. Principal 123",
    "capacidad_jugadores": 22
  }
]
```

### C. Módulo de Reservas

#### `POST /api/reservas`
- **Descripción**: Crea una nueva reserva validando que el horario de la cancha esté libre.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_cancha": 1,
  "id_usuario": 5,
  "id_equipo": 3,
  "fecha_reserva": "2026-09-26",
  "hora_inicio": "18:00",
  "hora_fin": "20:00",
  "visibilidad": "publico"
}
```

#### `GET /api/reservas/{id_reserva}`
- **Descripción**: Obtiene detalles de una reserva específica con verificación de permisos de visualización.
- **Respuesta esperada (JSON)**:
```json
{
  "id_reserva": 1,
  "cancha": { "nombre_cancha": "Cancha Sintética 1" },
  "fecha_reserva": "2026-09-26",
  "hora_inicio": "18:00",
  "hora_fin": "20:00",
  "estado_reserva": "confirmada",
  "equipo": { "nombre_equipo": "Los Tigres" },
  "arbitro": { "nombre": "Juan Pérez", "calificacion": 4.5 },
  "visibilidad": "publico",
  "resultado_partido": null
}
```

#### `GET /api/reservas`
- **Descripción**: Lista reservas visibles para el usuario actual según sus permisos.
- **Parámetros**: `fecha_inicio`, `fecha_fin`, `id_deporte`, `estado`
- **Respuesta esperada (JSON)**: Array de reservas (mismo formato que arriba)

#### `PUT /api/reservas/{id_reserva}/estado`
- **Descripción**: Actualiza el estado de una reserva (ej: de "confirmada" a "en_curso" o "finalizada").
- **Cuerpo requerido (JSON)**:
```json
{
  "estado_reserva": "finalizada",
  "resultado_partido": {
    "equipo_local": { "id_equipo": 3, "goles": 3 },
    "equipo_visitante": { "id_equipo": 7, "goles": 2 },
    "detalles": "Partido intenso"
  }
}
```

### D. Módulo de Árbitros

#### `GET /api/arbitros/disponibles`
- **Descripción**: Lista árbitros disponibles para una fecha y hora específica.
- **Parámetros**: `fecha`, `hora_inicio`, `hora_fin`, `id_deporte`
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_usuario": 10,
    "nombre": "Juan Pérez",
    "calificacion_arbitro": 4.5,
    "disponible": true
  }
]
```

#### `POST /api/reservas/{id_reserva}/arbitro`
- **Descripción**: Asigna un árbitro a una reserva.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_arbitro": 10
}
```

#### `GET /api/arbitros/{id_arbitro}/partidos`
- **Descripción**: Lista los partidos asignados a un árbitro (pasados, presentes y futuros).
- **Parámetros**: `estado` (opcional) -> `asignado`, `completado`, `todos`
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_reserva": 1,
    "fecha_reserva": "2026-09-26",
    "hora_inicio": "18:00",
    "hora_fin": "20:00",
    "cancha": { "nombre_cancha": "Cancha Sintética 1" },
    "equipos": [
      { "nombre_equipo": "Los Tigres" },
      { "nombre_equipo": "Los Leones" }
    ],
    "estado_asignacion": "asignado"
  }
]
```

#### `POST /api/arbitros/{id_arbitro}/disponibilidad`
- **Descripción**: Establece los horarios de disponibilidad de un árbitro.
- **Cuerpo requerido (JSON)**:
```json
{
  "disponibilidad": [
    { "dia_semana": 1, "hora_inicio": "18:00", "hora_fin": "23:00" },
    { "dia_semana": 3, "hora_inicio": "18:00", "hora_fin": "23:00" }
  ]
}
```

### E. Módulo de Permisos de Visualización

#### `POST /api/reservas/{id_reserva}/permisos`
- **Descripción**: Concede permisos de visualización a usuarios o equipos específicos.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_usuario": 15,
  "tipo_permiso": "lectura"
}
```
O para equipos:
```json
{
  "id_equipo": 5,
  "tipo_permiso": "lectura"
}
```

#### `GET /api/reservas/{id_reserva}/permisos`
- **Descripción**: Lista todos los permisos de visualización de una reserva.
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_permiso": 1,
    "usuario": { "nombre": "María García" },
    "tipo_permiso": "lectura",
    "fecha_concedido": "2026-09-25T10:00:00Z"
  },
  {
    "id_permiso": 2,
    "equipo": { "nombre_equipo": "Los Rayos" },
    "tipo_permiso": "invitar",
    "fecha_concedido": "2026-09-25T10:05:00Z"
  }
]
```

#### `DELETE /api/reservas/{id_reserva}/permisos/{id_permiso}`
- **Descripción**: Revoca un permiso de visualización.

### F. Módulo de Notificaciones

#### `GET /api/notificaciones`
- **Descripción**: Obtiene las notificaciones del usuario actual o de sus equipos.
- **Parámetros**: `no_leidas` (boolean) - Si es true, solo retorna no leídas
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_notificacion": 1,
    "tipo_notificacion": "partido_finalizado",
    "titulo": "Partido Finalizado",
    "mensaje": "El partido entre Los Tigres y Los Leones ha finalizado 3-2",
    "id_reserva": 1,
    "leida": false,
    "fecha_creacion": "2026-09-26T20:05:00Z"
  }
]
```

#### `PUT /api/notificaciones/{id_notificacion}/leer`
- **Descripción**: Marca una notificación como leída.

#### `POST /api/notificaciones/marcar-todas-leidas`
- **Descripción**: Marca todas las notificaciones del usuario como leídas.

### G. Módulo de Equipos

#### `POST /api/equipos`
- **Descripción**: Crea un nuevo equipo.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_capitan": 5,
  "nombre_equipo": "Los Tigres",
  "escudo_url": "/escudos/tigres.png",
  "nivel_competitivo": "amateur",
  "visibilidad": "publico"
}
```

#### `POST /api/equipos/{id_equipo}/miembros`
- **Descripción**: Invita un usuario a unirse al equipo.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_usuario": 15,
  "rol_en_equipo": "jugador"
}
```

#### `PUT /api/equipos/{id_equipo}/miembros/{id_miembro}/estado`
- **Descripción**: Acepta o rechaza una invitación al equipo.
- **Cuerpo requerido (JSON)**:
```json
{
  "estado_invitacion": "aceptado"
}
```

#### `GET /api/equipos/{id_equipo}/proximos-partidos`
- **Descripción**: Lista los próximos partidos del equipo.
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_reserva": 5,
    "fecha_reserva": "2026-09-30",
    "hora_inicio": "19:00",
    "hora_fin": "21:00",
    "cancha": { "nombre_cancha": "Cancha Central" },
    "arbitro": { "nombre": "Carlos Ruiz" }
  }
]
```

### H. Módulo de Historial y Estadísticas

#### `GET /api/historial/partidos`
- **Descripción**: Obtiene el historial de partidos finalizados.
- **Parámetros**: `id_equipo`, `id_usuario`, `fecha_inicio`, `fecha_fin`, `id_deporte`
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_historial": 1,
    "fecha_partido": "2026-09-20",
    "resultado": {
      "equipo_local": { "id_equipo": 3, "goles": 2 },
      "equipo_visitante": { "id_equipo": 7, "goles": 1 }
    },
    "cancha": { "nombre_cancha": "Cancha Sintética 1" },
    "arbitro": { "nombre": "Juan Pérez" }
  }
]
```

#### `POST /api/arbitros/{id_arbitro}/calificar`
- **Descripción**: Califica el desempeño de un árbitro después de un partido.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_reserva": 1,
  "calificacion": 5,
  "comentario": "Excelente arbitraje, muy imparcial"
}
```

### I. Módulo de Carreras (Instituto)

#### `GET /api/carreras`
- **Descripción**: Retorna la lista de todas las carreras disponibles en el instituto.
- **Respuesta esperada (JSON)**:
```json
[
  { "id_carrera": 1, "nombre_carrera": "Ingeniería de Sistemas", "codigo": "IS-001", "activo": true },
  { "id_carrera": 2, "nombre_carrera": "Administración", "codigo": "ADM-002", "activo": true },
  { "id_carrera": 3, "nombre_carrera": "Derecho", "codigo": "DER-003", "activo": true }
]
```

#### `POST /api/carreras`
- **Descripción**: Crea una nueva carrera (solo administradores).
- **Cuerpo requerido (JSON)**:
```json
{
  "nombre_carrera": "Medicina",
  "codigo": "MED-004",
  "activo": true
}
```

#### `GET /api/usuarios?carrera_id={id}`
- **Descripción**: Lista los usuarios (estudiantes) de una carrera específica.
- **Parámetros**: `carrera_id` - ID de la carrera
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_usuario": 5,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan.perez@instituto.edu",
    "codigo_estudiante": "2024-00123",
    "carrera": { "nombre_carrera": "Ingeniería de Sistemas" }
  }
]
```

### J. Módulo de Espacios de Juegos de Mesa

#### `GET /api/espacios-juegos-mesa`
- **Descripción**: Lista todos los espacios disponibles para juegos de mesa.
- **Parámetros**: `deporte_id` (opcional) - Filtra por tipo de juego (ajedrez, damas, etc.)
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_espacio": 1,
    "nombre_espacio": "Sala de Ajedrez 1",
    "tipo_espacio": "sala_multiple",
    "numero_mesas": 8,
    "tipo_mesa": "ajedrez",
    "precio_por_hora": 10.00,
    "precio_por_mesa": 2.00,
    "estado": "disponible",
    "ubicacion": "Edificio A, Piso 2",
    "capacidad_jugadores": 16,
    "iluminacion": "artificial",
    "climatizado": true
  }
]
```

#### `POST /api/espacios-juegos-mesa`
- **Descripción**: Crea un nuevo espacio para juegos de mesa (solo administradores o dueños).
- **Cuerpo requerido (JSON)**:
```json
{
  "id_deporte": 5,
  "id_dueno": 10,
  "nombre_espacio": "Sala de Ajedrez 2",
  "tipo_espacio": "sala_multiple",
  "numero_mesas": 10,
  "tipo_mesa": "ajedrez",
  "precio_por_hora": 15.00,
  "precio_por_mesa": 2.50,
  "ubicacion": "Edificio B, Piso 1",
  "capacidad_jugadores": 20,
  "iluminacion": "natural",
  "climatizado": true
}
```

#### `GET /api/espacios-juegos-mesa/{id_espacio}/disponibilidad`
- **Descripción**: Verifica la disponibilidad de un espacio en una fecha y hora específica.
- **Parámetros**: `fecha`, `hora_inicio`, `hora_fin`
- **Respuesta esperada (JSON)**:
```json
{
  "id_espacio": 1,
  "disponible": true,
  "mesas_disponibles": 8,
  "reservas_solapadas": []
}
```

### K. Módulo de Reservas de Juegos de Mesa

#### `POST /api/reservas/juego-mesa`
- **Descripción**: Crea una reserva para un espacio de juegos de mesa.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_espacio_juego": 1,
  "id_usuario": 5,
  "id_equipo": null,
  "fecha_reserva": "2026-09-26",
  "hora_inicio": "14:00",
  "hora_fin": "16:00",
  "numero_mesas_reservadas": 2,
  "visibilidad": "publico"
}
```

#### `PUT /api/reservas/{id_reserva}/resultado-juego`
- **Descripción**: Registra el resultado de un juego de mesa (ajedrez, damas, etc.).
- **Cuerpo requerido (JSON)**:
```json
{
  "resultado_juego": {
    "jugador1": { "id_usuario": 5, "resultado": "ganado" },
    "jugador2": { "id_usuario": 8, "resultado": "perdido" },
    "tipo_victoria": "mate",
    "movimientos": 45,
    "tiempo_jugador1": "25:30",
    "tiempo_jugador2": "32:15"
  }
}
```

### L. Módulo de Torneos de Juegos de Mesa

#### `GET /api/torneos-juegos-mesa`
- **Descripción**: Lista todos los torneos de juegos de mesa activos.
- **Parámetros**: `deporte_id` (opcional), `estado` (opcional) -> `inscripcion_abierta`, `en_curso`, `finalizado`
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_torneo": 1,
    "nombre_torneo": "Torneo de Ajedrez 2026",
    "deporte": { "nombre": "Ajedrez" },
    "organizador": { "nombre": "Carlos Ruiz" },
    "fecha_inicio": "2026-10-01",
    "fecha_fin": "2026-10-15",
    "tipo_torneo": "suizo",
    "numero_participantes": 32,
    "numero_rondas": 7,
    "estado_torneo": "inscripcion_abierta",
    "premio": "Trofeo + $500"
  }
]
```

#### `POST /api/torneos-juegos-mesa`
- **Descripción**: Crea un nuevo torneo de juegos de mesa (solo administradores u organizadores).
- **Cuerpo requerido (JSON)**:
```json
{
  "id_deporte": 5,
  "id_organizador": 10,
  "nombre_torneo": "Torneo de Damas Semestral",
  "descripcion": "Torneo semestral de damas para estudiantes",
  "fecha_inicio": "2026-10-01",
  "fecha_fin": "2026-10-15",
  "tipo_torneo": "eliminacion_directa",
  "numero_rondas": 5,
  "premio": "Medalla de oro",
  "reglas_especificas": "Tiempo por jugador: 30 minutos"
}
```

#### `POST /api/torneos-juegos-mesa/{id_torneo}/inscribir`
- **Descripción**: Inscribe a un usuario o equipo en un torneo.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_usuario": 5
}
```
O para equipos:
```json
{
  "id_equipo": 3
}
```

#### `GET /api/torneos-juegos-mesa/{id_torneo}/participantes`
- **Descripción**: Lista los participantes de un torneo con su ranking actual.
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_participante": 1,
    "usuario": { "nombre": "Juan Pérez", "apellido": "García" },
    "fecha_inscripcion": "2026-09-20T10:00:00Z",
    "estado_participacion": "inscrito",
    "puntos_torneo": 12,
    "ranking_actual": 1
  }
]
```

#### `GET /api/torneos-juegos-mesa/{id_torneo}/partidas`
- **Descripción**: Lista las partidas de un torneo, filtradas por ronda si se especifica.
- **Parámetros**: `ronda` (opcional)
- **Respuesta esperada (JSON)**:
```json
[
  {
    "id_partida": 1,
    "ronda": 1,
    "jugador1": { "nombre": "Juan Pérez" },
    "jugador2": { "nombre": "María García" },
    "ganador": { "nombre": "Juan Pérez" },
    "fecha_partida": "2026-10-01",
    "hora_inicio": "14:00",
    "hora_fin": "15:30",
    "resultado_detalle": {
      "tipo_victoria": "mate",
      "movimientos": 32,
      "tiempo_usado_j1": "18:45",
      "tiempo_usado_j2": "42:15"
    },
    "estado_partida": "finalizada"
  }
]
```

#### `POST /api/torneos-juegos-mesa/{id_torneo}/partidas`
- **Descripción**: Programa una nueva partida en un torneo (solo organizadores).
- **Cuerpo requerido (JSON)**:
```json
{
  "ronda": 2,
  "id_jugador1": 5,
  "id_jugador2": 8,
  "fecha_partida": "2026-10-05",
  "hora_inicio": "16:00",
  "hora_fin": "18:00",
  "id_espacio_juego": 1
}
```

#### `PUT /api/torneos-juegos-mesa/partidas/{id_partida}/resultado`
- **Descripción**: Registra el resultado de una partida de torneo.
- **Cuerpo requerido (JSON)**:
```json
{
  "id_ganador": 5,
  "resultado_detalle": {
    "tipo_victoria": "mate",
    "movimientos": 28,
    "tiempo_usado_j1": "22:10",
    "tiempo_usado_j2": "35:45"
  },
  "estado_partida": "finalizada"
}
```

---

## 3. Flujo de Notificaciones y Eventos

### Cuando un partido termina (estado -> "finalizada"):

1. **Backend detecta el cambio de estado** en la reserva.
2. **Actualiza el historial de partidos** con el resultado.
3. **Genera notificaciones** para:
   - **Miembros de ambos equipos**: "El partido entre [Equipo A] y [Equipo B] ha finalizado [resultado]"
   - **Árbitro asignado**: "Tu arbitraje en el partido [Equipo A] vs [Equipo B] ha sido completado. Por favor califica el desempeño."
   - **Dueño de la cancha**: "El partido en [Cancha] ha finalizado. La cancha está disponible."
4. **Actualiza disponibilidad de árbitro**: El árbitro queda disponible para otros partidos en ese horario.
5. **Envía invitación a calificar**: A los equipos para calificar al árbitro.

### Cuando se asigna un árbitro a un partido:

1. **Backend valida disponibilidad** del árbitro en ese horario.
2. **Crea registro en asignaciones_arbitros**.
3. **Genera notificaciones** para:
   - **Árbitro**: "Has sido asignado para arbitrar el partido [Equipo A] vs [Equipo B] el [fecha] a las [hora]."
   - **Capitanes de equipos**: "Árbitro [Nombre] asignado para tu partido el [fecha]."

### Cuando un usuario es invitado a un equipo:

1. **Backend crea registro en equipo_miembros** con estado "pendiente".
2. **Genera notificación** para el usuario invitado: "Has sido invitado a unirte al equipo [Nombre Equipo]."

### Cuando hay cambio de horario de un partido:

1. **Backend actualiza la reserva**.
2. **Genera notificaciones** para:
   - **Todos los miembros de ambos equipos**: "El partido [Equipo A] vs [Equipo B] ha sido reprogramado para [nueva fecha/hora]."
   - **Árbitro asignado**: "El partido que arbitras ha sido reprogramado para [nueva fecha/hora]."

### Cuando un juego de mesa termina (estado -> "finalizada"):

1. **Backend detecta el cambio de estado** en la reserva.
2. **Actualiza el historial de partidos** con el resultado del juego.
3. **Genera notificaciones** para:
   - **Ambos jugadores**: "Tu partida de [Juego] ha finalizado. Resultado: [detalles]."
   - **Dueño del espacio**: "La reserva en [Espacio] ha finalizado. El espacio está disponible."

### Cuando se crea un torneo de juegos de mesa:

1. **Backend valida que el organizador tenga permisos**.
2. **Crea el torneo** con estado "inscripcion_abierta".
3. **Genera notificaciones** para usuarios interesados en ese deporte:
   - "Nuevo torneo de [Juego] disponible: [Nombre del torneo]. Inscripciones abiertas hasta [fecha]."

### Cuando se programa una partida en un torneo:

1. **Backend valida disponibilidad de los jugadores** y del espacio.
2. **Crea la partida** en el torneo.
3. **Genera notificaciones** para ambos jugadores:
   - "Tienes una partida programada en el torneo [Nombre] contra [Oponente] el [fecha] a las [hora]."

---

## 4. Formulario de Inscripción del Instituto

### Requerimientos para el Formulario de Registro

El sistema debe incluir un formulario de inscripción específico para estudiantes del instituto que incluya:

#### Campos obligatorios para estudiantes:
- `nombre` (VARCHAR)
- `apellido` (VARCHAR)
- `correo` (VARCHAR, Unique) - Debe ser correo institucional (@instituto.edu)
- `telefono` (VARCHAR)
- `contrasena` (VARCHAR) - Se hasheará en el backend
- `id_carrera` (INT) - Selección del catálogo de carreras
- `codigo_estudiante` (VARCHAR) - Código único proporcionado por el instituto
- `acepto_terminos` (BOOLEAN) - Aceptación de términos y condiciones

#### Validaciones requeridas:
- El correo debe tener dominio institucional (@instituto.edu)
- El código_estudiante debe ser único y validado contra el sistema del instituto
- La carrera seleccionada debe estar activa
- La contraseña debe cumplir con requisitos mínimos (longitud, complejidad)

#### Endpoint de registro de estudiantes:

#### `POST /api/usuarios/registro-estudiante`
- **Descripción**: Registra un nuevo estudiante en el sistema del instituto.
- **Cuerpo requerido (JSON)**:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan.perez@instituto.edu",
  "telefono": "+51987654321",
  "contrasena": "SecurePass123!",
  "id_carrera": 1,
  "codigo_estudiante": "2024-00123",
  "acepto_terminos": true
}
```
- **Respuesta esperada (JSON)**:
```json
{
  "success": true,
  "mensaje": "Estudiante registrado exitosamente",
  "usuario": {
    "id_usuario": 15,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan.perez@instituto.edu",
    "carrera": { "nombre_carrera": "Ingeniería de Sistemas" },
    "rol": "cliente"
  }
}
```

#### Endpoint de validación de código estudiante:

#### `GET /api/usuarios/validar-codigo?codigo={codigo_estudiante}`
- **Descripción**: Valida si un código de estudiante es válido y pertenece al instituto.
- **Parámetros**: `codigo_estudiante` - Código a validar
- **Respuesta esperada (JSON)**:
```json
{
  "valido": true,
  "carrera": { "id_carrera": 1, "nombre_carrera": "Ingeniería de Sistemas" }
}
```
O si es inválido:
```json
{
  "valido": false,
  "mensaje": "Código de estudiante no encontrado"
}
```

---

## 5. Lógica de Permisos de Visualización

### Niveles de visibilidad de reservas:

1. **`publico`**: Cualquier usuario autenticado puede ver la reserva.
2. **`privado`**: Solo:
   - El usuario que hizo la reserva
   - Miembros del equipo asignado
   - Árbitro asignado
   - Dueño de la cancha
   - Usuarios con permisos explícitos en `permisos_visualizacion`
3. **`equipos_amigos`**: 
   - Todos los participantes anteriores
   - Equipos del mismo deporte que tengan relación (ej: mismo torneo, mismos jugadores)

### Tipos de permisos:

- **`lectura`**: Puede ver la reserva y sus detalles.
- **`escritura`**: Puede modificar la reserva (cambiar horario, cancelar).
- **`invitar`**: Puede invitar a otros usuarios/equipos a ver la reserva.

---

## 6. Consideraciones de Seguridad

- Todas las endpoints deben verificar autenticación (JWT token).
- Las endpoints de escritura deben verificar autorización (rol del usuario).
- Las endpoints de visualización deben verificar permisos según la tabla `permisos_visualizacion`.
- Las contraseñas deben ser hasheadas (bcrypt o similar).
- Validar que un árbitro no pueda arbitrar su propio equipo si es jugador.
- Rate limiting en endpoints sensibles (creación de reservas, asignación de árbitros).
- **Para el instituto**: Validar que el correo de registro tenga dominio institucional.
- **Para el instituto**: Validar que el código_estudiante sea único y exista en el sistema del instituto.
- **Para torneos**: Validar que un participante no pueda inscribirse más de una vez en el mismo torneo.
- **Para juegos de mesa**: Validar que no se puedan reservar más mesas de las disponibles en el espacio.
- **Para espacios de juegos de mesa**: Validar que el tipo de mesa coincida con el deporte seleccionado (ej: mesa de ajedrez para ajedrez).

---

## 6. Diagrama de Relaciones

```
usuarios (1) ----< (N) reservas
usuarios (1) ----< (N) equipos (como capitan)
usuarios (N) ----< (N) equipo_miembros ---- (N) equipos
usuarios (1) ----< (N) disponibilidad_arbitros
usuarios (1) ----< (N) asignaciones_arbitros
usuarios (N) ----< (1) carreras (opcional)

deportes (1) ----< (N) canchas
deportes (1) ----< (N) espacios_juegos_mesa
deportes (1) ----< (N) torneos_juegos_mesa

canchas (1) ----< (N) reservas
espacios_juegos_mesa (1) ----< (N) reservas

equipos (1) ----< (N) reservas
equipos (1) ----< (N) equipo_miembros ---- (N) usuarios

reservas (1) ----< (N) permisos_visualizacion
reservas (1) ----< (N) notificaciones
reservas (1) ----< (1) historial_partidos
reservas (1) ----< (N) asignaciones_arbitros

usuarios (1) ----< (N) notificaciones
equipos (1) ----< (N) notificaciones

torneos_juegos_mesa (1) ----< (N) torneo_participantes
torneos_juegos_mesa (1) ----< (N) partidas_torneo
usuarios (N) ----< (N) torneo_participantes ---- (N) torneos_juegos_mesa
equipos (N) ----< (N) torneo_participantes ---- (N) torneos_juegos_mesa
usuarios (1) ----< (N) partidas_torneo (como jugador1 y jugador2)
espacios_juegos_mesa (1) ----< (N) partidas_torneo (opcional)
```
