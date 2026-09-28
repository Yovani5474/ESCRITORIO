# 🏆 Sistema de Campeonatos Deportivos

Sistema completo para la gestión de campeonatos deportivos y torneos, diseñado para institutos educativos y competencias deportivas.

## 🏗️ Arquitectura del Sistema

El sistema está dividido en tres componentes principales:

1. **Backend**: API REST con Node.js + Express + MySQL
2. **Frontend**: Aplicación React con Vite
3. **Base de Datos**: MySQL con 11 tablas relacionales

## 📁 Estructura del Proyecto

```
cancha/
├── backend/                 # API REST (Node.js + Express)
│   ├── config/             # Configuración de base de datos
│   ├── routes/             # Endpoints de la API
│   ├── server.js           # Punto de entrada
│   ├── package.json
│   └── .env                # Variables de entorno
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios API
│   │   └── App.jsx         # Componente principal
│   ├── package.json
│   └── vite.config.js
├── database/               # Scripts SQL
│   ├── 01_crear_base_datos_campeonatos.sql
│   ├── 02_tablas_campeonatos.sql
│   └── 03_datos_ejemplo_campeonatos.sql
├── docs/                   # Documentación
│   ├── DOCUMENTACION_BACKEND.md
│   └── FUNCIONALIDADES_ADICIONALES.md
└── README.md
```

## � Credenciales de Acceso

### Usuario Administrador

Para acceder al sistema con privilegios de administrador, puedes usar las siguientes credenciales:

**Usuario Admin 1:**
- **ID Estudiante**: `2026007`
- **Nombre**: Admin Sistema
- **Correo**: `admin@senati.pe`
- **Rol**: Administrador

**Usuario Admin 2 (Super Admin):**
- **ID Estudiante**: `ADMIN123`
- **Nombre**: Super Admin
- **Correo**: `admin123@senati.pe`
- **Rol**: Administrador

> **Nota**: Estos usuarios ya están creados en la base de datos con el script de datos de ejemplo. No requieren contraseña para la versión actual del sistema (autenticación pendiente de implementar).

## �🚀 Instalación y Configuración

### 1. Requisitos Previos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### 2. Configuración de la Base de Datos

**IMPORTANTE**: El sistema usa la base de datos `campeonatos_db` con las carreras de SENATI.

1. Asegúrate de que MySQL esté instalado y en ejecución.

2. Ejecuta los scripts SQL en orden (usando tu cliente MySQL preferido):

```sql
-- El script 01_crear_base_datos_campeonatos.sql ya incluye las carreras de SENATI
source database/01_crear_base_datos_campeonatos.sql;

-- Crear tablas
source database/02_tablas_campeonatos.sql;

-- Insertar datos de ejemplo con carreras SENATI y correos @senati.pe
source database/03_datos_ejemplo_campeonatos.sql;
```

**Carreras de SENATI incluidas:**
- EE.G.G. / EEGG: Estudios Generales
- AMOD: Mecánica Automotriz
- EIND: Electricista Industrial
- AMTD: Mecatrónica Automotriz
- NAED: Administración de Empresas
- PIAD: Ingeniería de Software con IA

**Formato de correos:** Los participantes usan correos @senati.pe (ej: 1234567@senati.pe)

### 3. Configuración del Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en `.env`:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=campeonatos_db
DB_PORT=3306
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

4. Inicia el servidor:
```bash
npm start
```

El backend estará disponible en `http://localhost:3001`

### 4. Configuración del Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🎯 Funcionalidades Implementadas

### ✅ Características Principales

#### 1. **Panel Lateral / Navbar**
- ✅ **Usuarios**: Módulo para administrar perfiles, roles y permisos
- ✅ **Equipos**: Listado y registro de equipos participantes
- ✅ **Deportes**: Catálogo de disciplinas deportivas (Vóley, Fútbol, Futsal, Ajedrez, etc.)
- ✅ **Canchas**: Gestión de espacios físicos sin costo (para campeonatos)
- ✅ **Links/Enlaces**: Accesos directos a transmisiones, actas, estadísticas
- ✅ **Campeonatos**: Gestión completa de torneos
- ✅ **Registro**: Formulario de inscripción de participantes

#### 2. **Formulario de Registro de Participantes**
- ✅ **ID**: Identificador único del estudiante/participante
- ✅ **Nombres**: Campo de nombres completos
- ✅ **Apellidos**: Campo de apellidos completos
- ✅ **Carrera**: Selección del catálogo de carreras del instituto
- ✅ **Semestre**: Ciclo o año en curso del estudiante
- ✅ **Correo**: Email opcional del participante
- ✅ **Teléfono**: Teléfono opcional
- ✅ **Rol**: Selección de rol (participante, árbitro, organizador, admin)

#### 3. **Sistema de Llaves (Bracket/Eliminatorias)**
- ✅ **Estructura de Eliminación Directa**: Representación gráfica en árbol
- ✅ **Cruces y Enfrentamientos**: Casillas interactivas tipo "VS"
- ✅ **Indicadores Visuales**: Marcas de ganadores (✓) y resaltado de equipos
- ✅ **Separación por Categorías**: Soporte para múltiples llaves por deporte
- ✅ **Resultados**: Registro de resultados y avance de ganadores
- ✅ **Rondas**: Cuartos, semifinales, final, etc.

#### 4. **Personalización de Colores UI/UX**
- ✅ **Selector de Colores**: Cambio de paleta de colores en tiempo real
- ✅ **Presets**: Temas predefinidos (Azul Profesional, Verde Deportivo, Rojo Intenso, Púreo Real)
- ✅ **Modo Oscuro**: Toggle para modo oscuro/claro
- ✅ **Colores Personalizables**: Primario, secundario, acento, fondo, texto
- ✅ **Aplicación por Campeonato**: Cada campeonato puede tener su propio tema

#### 5. **Sistema de Links/Enlaces**
- ✅ **Transmisiones**: Enlaces a streams de partidos
- ✅ **Actas**: Documentos oficiales de partidos
- ✅ **Estadísticas**: Enlaces a análisis y estadísticas
- ✅ **Galería**: Enlaces a fotos y videos
- ✅ **Tipos Personalizables**: Soporte para diferentes tipos de enlaces

### Backend (API REST)

#### Módulo de Campeonatos
- `GET /api/campeonatos` - Listar campeonatos
- `GET /api/campeonatos/:id` - Obtener campeonato específico
- `GET /api/campeonatos/:id/bracket` - Obtener llaves/bracket
- `POST /api/campeonatos` - Crear campeonato
- `PUT /api/campeonatos/:id` - Actualizar campeonato
- `POST /api/campeonatos/:id/equipos` - Inscribir equipo

#### Módulo de Partidos
- `GET /api/partidos` - Listar partidos
- `GET /api/partidos/:id` - Obtener partido específico
- `POST /api/partidos` - Crear partido
- `PUT /api/partidos/:id/resultado` - Registrar resultado
- `DELETE /api/partidos/:id` - Eliminar partido

#### Módulo de Links
- `GET /api/links` - Listar enlaces
- `POST /api/links` - Crear enlace
- `PUT /api/links/:id` - Actualizar enlace
- `DELETE /api/links/:id` - Eliminar enlace

#### Módulo de Usuarios (Actualizado)
- `GET /api/usuarios` - Listar participantes
- `GET /api/usuarios/:id` - Obtener participante específico
- `POST /api/usuarios` - Registrar participante
- `PUT /api/usuarios/:id` - Actualizar participante
- `DELETE /api/usuarios/:id` - Eliminar participante

#### Módulo de Deportes, Carreras, Canchas, Equipos
- Mantiene la misma estructura pero adaptado para campeonatos

### Frontend (React)

#### Páginas
- **HomePage** (`/`) - Página de inicio con campeonatos en curso y selección de deportes
- **CampeonatosPage** (`/campeonatos`) - Gestión de campeonatos y visualización de llaves
- **DeportesPage** (`/deportes`) - Catálogo de deportes
- **CanchasPage** (`/canchas`) - Espacios deportivos disponibles
- **Registro** (`/registro`) - Formulario de inscripción de participantes

#### Componentes
- **Navbar** - Barra de navegación con todas las secciones
- **Bracket** - Visualización de llaves/brackets interactiva
- **FormularioParticipante** - Formulario completo de registro
- **ColorThemeSelector** - Selector de personalización de colores
- **DeporteCard** - Tarjeta de deporte
- **CanchaCard** - Tarjeta de cancha

#### Servicios API
- `api.js` - Configuración de Axios (puerto 3001)
- `campeonatosService.js` - Servicios de campeonatos
- `partidosService.js` - Servicios de partidos
- `linksService.js` - Servicios de enlaces
- `usuariosService.js` - Servicios de usuarios (actualizado)
- `deportesService.js` - Servicios de deportes
- `carrerasService.js` - Servicios de carreras
- `canchasService.js` - Servicios de canchas (actualizado)

## 📊 Base de Datos

El sistema utiliza 11 tablas relacionales optimizadas para campeonatos:

1. `carreras` - Catálogo de carreras del instituto
2. `deportes` - Deportes y disciplinas disponibles
3. `usuarios` - Participantes (con ID estudiante, semestre, carrera)
4. `canchas` - Espacios deportivos (sin dueño ni precio)
5. `equipos` - Equipos participantes
6. `equipo_miembros` - Miembros de equipos
7. `campeonatos` - Torneos y competencias
8. `campeonato_equipos` - Equipos inscritos en campeonatos
9. `partidos` - Encuentros del campeonato
10. `links` - Enlaces compartibles (transmisiones, actas, etc.)
11. `configuracion_ui` - Personalización de colores por campeonato
12. `notificaciones` - Sistema de notificaciones

## 🎨 Características de UI/UX

### Personalización de Colores
- **4 Presets**: Azul Profesional, Verde Deportivo, Rojo Intenso, Púreo Real
- **5 Colores Personalizables**: Primario, secundario, acento, fondo, texto
- **Modo Oscuro**: Toggle para cambiar entre tema claro y oscuro
- **Por Campeonato**: Cada campeonato puede tener su propio tema

### Visualización de Llaves
- **Diseño Interactivo**: Click en partidos para ver detalles
- **Indicadores Visuales**: Ganadores resaltados en verde
- **Organización por Rondas**: Cuartos, semifinales, final
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 🧪 Pruebas

### Probar el Backend

```bash
# Obtener campeonatos
curl http://localhost:3001/api/campeonatos

# Obtener bracket de un campeonato
curl http://localhost:3001/api/campeonatos/1/bracket

# Registrar participante
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"id_estudiante":"2024-009","nombre":"Nuevo","apellido":"Participante","rol":"participante"}'
```

### Probar el Frontend

1. Asegúrate de que el backend esté corriendo en `http://localhost:3001`
2. Inicia el frontend: `cd frontend && npm run dev`
3. Abre el navegador en `http://localhost:5173`
4. Navega por las diferentes secciones:
   - **Inicio**: Ver campeonatos en curso
   - **Campeonatos**: Ver llaves y resultados
   - **Registro**: Inscribir nuevos participantes
   - **Personalizar**: Cambiar colores del tema

## 🔒 Seguridad

### En Producción

1. **Cambiar el JWT_SECRET** en el archivo `.env` del backend
2. **Configurar HTTPS** para el backend
3. **Implementar autenticación** con JWT tokens
4. **Validar y sanitizar** todos los inputs
5. **Usar variables de entorno** para datos sensibles
6. **Configurar CORS** adecuadamente
7. **Implementar rate limiting** para prevenir abusos
8. **Hashear contraseñas** con bcrypt (ya implementado)
9. **Validar permisos** en cada endpoint
10. **Usar prepared statements** para prevenir SQL injection (ya implementado)

## 📝 Diferencias con el Sistema Anterior

### Eliminado
- ❌ Sistema de alquiler de canchas
- ❌ Campos de precio por hora
- ❌ Campo de dueño de cancha
- ❌ Sistema de reservas comerciales
- ❌ Espacios de juegos de mesa (ajedrez, etc.)
- ❌ Torneos de juegos de mesa específicos

### Agregado
- ✅ Sistema de campeonatos deportivos
- ✅ ID de estudiante único
- ✅ Campo de semestre
- ✅ Sistema de llaves/brackets visual
- ✅ Personalización de colores UI
- ✅ Sistema de links/enlaces
- ✅ Sin costos asociados a canchas
- ✅ Enfoque en competencias institucionales

## 🐛 Solución de Problemas

### Backend no inicia
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos `campeonatos_db` exista
- Ejecuta los scripts SQL si la base de datos está vacía

### Frontend no conecta con backend
- Verifica que el backend esté corriendo en `http://localhost:3001`
- Verifica la configuración de CORS en el backend
- Revisa la consola del navegador para errores

### Error de conexión a base de datos
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos `campeonatos_db` exista
- Ejecuta los scripts SQL para crear las tablas

## 📚 Documentación Adicional

- **DOCUMENTACION_BACKEND.md** - Documentación detallada (versión anterior)
- **FUNCIONALIDADES_ADICIONALES.md** - Funcionalidades opcionales sugeridas
- **backend/README.md** - Documentación específica del backend
- **frontend/README.md** - Documentación específica del frontend

## 🎯 Próximos Pasos

### Funcionalidades Prioritarias

1. **Sistema de Autenticación**
   - Login/Logout
   - Registro de usuarios
   - JWT tokens
   - Recuperación de contraseña

2. **Gestión Completa de Equipos**
   - CRUD de equipos
   - Gestión de miembros
   - Escudos y colores personalizados

3. **Gestión de Links**
   - CRUD completo de enlaces
   - Organización por campeonato
   - Tipos personalizados

4. **Panel de Administración**
   - Gestión de usuarios
   - Gestión de campeonatos
   - Reportes y estadísticas

5. **Sistema de Notificaciones**
   - Notificaciones en tiempo real
   - Email notifications
   - Notificaciones por campeonato

## 👥 Contribución

Este proyecto está diseñado para ser extendido. Algunas áreas para contribuir:

- Implementar autenticación completa
- Agregar más tipos de sistemas de torneo (Round Robin, Suizo)
- Mejorar el diseño visual de las llaves
- Agregar estadísticas detalladas
- Implementar más funcionalidades

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

## 🙏 Notas Importantes

- El sistema está optimizado para **campeonatos deportivos institucionales**
- **No tiene sistema de pagos** (es para campeonatos gratuitos)
- **No tiene alquiler de canchas** (canchas son espacios disponibles)
- **Enfocado en gestión de competencias** más que en alquiler comercial
- **ID de estudiante es obligatorio** para identificar participantes
- **Carrera y semestre** son campos importantes para el contexto institucional
