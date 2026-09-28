# Backend - Sistema de Alquiler de Canchas y Juegos de Mesa

Backend API para el sistema de gestión de reservas de canchas deportivas y espacios de juegos de mesa.

## Tecnologías

- Node.js
- Express.js
- MySQL
- bcryptjs (para hash de contraseñas)
- cors
- dotenv

## Instalación

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tu configuración:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=canchas_db
DB_PORT=3306
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3001
```

## Configuración de la Base de Datos

1. Asegúrate de tener MySQL instalado y en ejecución.

2. Ejecutar los scripts SQL en orden:
```bash
# Desde el directorio raíz del proyecto
mysql -u root -p < database/01_crear_base_datos.sql
mysql -u root -p canchas_db < database/02_tablas_principales.sql
mysql -u root -p canchas_db < database/03_datos_ejemplo.sql
```

O manualmente desde MySQL:
```sql
source database/01_crear_base_datos.sql
source database/02_tablas_principales.sql
source database/03_datos_ejemplo.sql
```

## Ejecución

### Modo desarrollo (con hot reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints API

### Deportes
- `GET /api/deportes` - Obtener todos los deportes
- `GET /api/deportes/:id` - Obtener un deporte específico
- `POST /api/deportes` - Crear un nuevo deporte (admin)
- `PUT /api/deportes/:id` - Actualizar un deporte (admin)
- `DELETE /api/deportes/:id` - Eliminar un deporte (admin)

### Carreras
- `GET /api/carreras` - Obtener todas las carreras
- `GET /api/carreras/:id` - Obtener una carrera específica
- `POST /api/carreras` - Crear una nueva carrera (admin)
- `PUT /api/carreras/:id` - Actualizar una carrera (admin)
- `DELETE /api/carreras/:id` - Eliminar una carrera (admin)

### Usuarios
- `GET /api/usuarios` - Obtener usuarios (con filtros)
- `GET /api/usuarios/:id` - Obtener un usuario específico
- `POST /api/usuarios` - Crear un nuevo usuario
- `POST /api/usuarios/registro-estudiante` - Registro de estudiante
- `GET /api/usuarios/validar-codigo` - Validar código de estudiante
- `PUT /api/usuarios/:id` - Actualizar un usuario
- `DELETE /api/usuarios/:id` - Eliminar un usuario (admin)

### Canchas
- `GET /api/canchas` - Obtener canchas (con filtros)
- `GET /api/canchas/:id` - Obtener una cancha específica
- `POST /api/canchas` - Crear una nueva cancha
- `PUT /api/canchas/:id` - Actualizar una cancha
- `DELETE /api/canchas/:id` - Eliminar una cancha

### Espacios de Juegos de Mesa
- `GET /api/espacios-juegos-mesa` - Obtener espacios (con filtros)
- `GET /api/espacios-juegos-mesa/:id` - Obtener un espacio específico
- `GET /api/espacios-juegos-mesa/:id/disponibilidad` - Verificar disponibilidad
- `POST /api/espacios-juegos-mesa` - Crear un nuevo espacio
- `PUT /api/espacios-juegos-mesa/:id` - Actualizar un espacio
- `DELETE /api/espacios-juegos-mesa/:id` - Eliminar un espacio

### Equipos
- `GET /api/equipos` - Obtener equipos
- `GET /api/equipos/:id` - Obtener un equipo específico
- `GET /api/equipos/:id/miembros` - Obtener miembros de un equipo
- `POST /api/equipos` - Crear un nuevo equipo
- `POST /api/equipos/:id/miembros` - Invitar miembro al equipo
- `PUT /api/equipos/:id/miembros/:id_miembro/estado` - Aceptar/rechazar invitación

### Reservas
- `GET /api/reservas` - Obtener reservas (con filtros)
- `GET /api/reservas/:id` - Obtener una reserva específica
- `POST /api/reservas` - Crear una nueva reserva
- `POST /api/reservas/juego-mesa` - Crear reserva de juego de mesa
- `PUT /api/reservas/:id/estado` - Actualizar estado de reserva
- `PUT /api/reservas/:id/resultado-juego` - Registrar resultado de juego
- `DELETE /api/reservas/:id` - Cancelar una reserva

### Árbitros
- `GET /api/arbitros/disponibles` - Obtener árbitros disponibles
- `GET /api/arbitros/:id_arbitro/partidos` - Obtener partidos de un árbitro
- `POST /api/arbitros/:id_arbitro/disponibilidad` - Establecer disponibilidad
- `POST /api/arbitros/:id_arbitro/calificar` - Calificar árbitro

### Notificaciones
- `GET /api/notificaciones` - Obtener notificaciones
- `PUT /api/notificaciones/:id/leer` - Marcar como leída
- `POST /api/notificaciones/marcar-todas-leidas` - Marcar todas como leídas

### Torneos de Juegos de Mesa
- `GET /api/torneos-juegos-mesa` - Obtener torneos
- `GET /api/torneos-juegos-mesa/:id` - Obtener un torneo específico
- `GET /api/torneos-juegos-mesa/:id/participantes` - Obtener participantes
- `GET /api/torneos-juegos-mesa/:id/partidas` - Obtener partidas
- `POST /api/torneos-juegos-mesa` - Crear un nuevo torneo
- `POST /api/torneos-juegos-mesa/:id/inscribir` - Inscribir participante
- `POST /api/torneos-juegos-mesa/:id/partidas` - Programar partida
- `PUT /api/torneos-juegos-mesa/partidas/:id/resultado` - Registrar resultado

## Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de MySQL
├── routes/
│   ├── deportes.js          # Rutas de deportes
│   ├── carreras.js          # Rutas de carreras
│   ├── usuarios.js          # Rutas de usuarios
│   ├── canchas.js           # Rutas de canchas
│   ├── espaciosJuegosMesa.js # Rutas de espacios de juegos
│   ├── equipos.js           # Rutas de equipos
│   ├── reservas.js          # Rutas de reservas
│   ├── arbitros.js          # Rutas de árbitros
│   ├── notificaciones.js    # Rutas de notificaciones
│   └── torneosJuegosMesa.js # Rutas de torneos
├── server.js                # Punto de entrada
├── package.json
├── .env.example
└── .env
```

## Notas Importantes

- En producción, cambiar el `JWT_SECRET` por un valor seguro
- La base de datos debe estar configurada correctamente en `.env`
- Los endpoints que requieren autenticación (JWT) aún no están implementados en esta versión básica
- Para un sistema en producción, agregar middleware de autenticación y autorización

## Pruebas

Puedes probar los endpoints usando:
- Postman
- curl
- O cualquier cliente HTTP

Ejemplo con curl:
```bash
# Obtener deportes
curl http://localhost:3000/api/deportes

# Obtener canchas
curl http://localhost:3000/api/canchas

# Crear usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Pérez","correo":"juan@test.com","contrasena":"password123"}'
```
