# Frontend - Sistema de Alquiler de Canchas y Juegos de Mesa

Frontend React para el sistema de gestión de reservas de canchas deportivas y espacios de juegos de mesa.

## Tecnologías

- React 18
- Vite
- React Router DOM
- Axios
- CSS3

## Instalación

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

## Ejecución

### Modo desarrollo:
```bash
npm run dev
```

### Modo producción:
```bash
npm run build
npm run preview
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.jsx       # Barra de navegación
│   │   ├── DeporteCard.jsx  # Tarjeta de deporte
│   │   ├── CanchaCard.jsx   # Tarjeta de cancha
│   │   └── EspacioJuegoMesaCard.jsx # Tarjeta de espacio de juego
│   ├── pages/               # Páginas de la aplicación
│   │   ├── HomePage.jsx     # Página de inicio
│   │   ├── DeportesPage.jsx # Página de deportes
│   │   ├── CanchasPage.jsx  # Página de canchas
│   │   ├── JuegosMesaPage.jsx # Página de juegos de mesa
│   │   ├── ReservasPage.jsx # Página de reservas
│   │   └── TorneosPage.jsx # Página de torneos
│   ├── services/            # Servicios API
│   │   ├── api.js           # Configuración de Axios
│   │   ├── deportesService.js
│   │   ├── carrerasService.js
│   │   ├── canchasService.js
│   │   ├── espaciosJuegosMesaService.js
│   │   └── reservasService.js
│   ├── utils/               # Utilidades
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos globales
│   ├── index.css            # Estilos base
│   └── main.jsx             # Punto de entrada
├── public/                  # Archivos estáticos
├── index.html
├── package.json
└── vite.config.js
```

## Páginas

### HomePage (`/`)
- Muestra todos los deportes y juegos de mesa disponibles
- Permite navegar a canchas o juegos de mesa según el tipo

### DeportesPage (`/deportes`)
- Lista todos los deportes y juegos de mesa
- Permite filtrar por tipo (deporte o juego de mesa)

### CanchasPage (`/canchas`)
- Muestra canchas deportivas disponibles
- Permite filtrar por deporte
- Muestra información detallada de cada cancha

### JuegosMesaPage (`/juegos-mesa`)
- Muestra espacios de juegos de mesa disponibles
- Permite filtrar por tipo de juego
- Muestra información detallada de cada espacio

### ReservasPage (`/reservas`)
- Muestra las reservas del usuario
- Permite cancelar reservas

### TorneosPage (`/torneos`)
- Muestra torneos de juegos de mesa disponibles
- Permite inscribirse en torneos
- Muestra detalles de torneos

## Servicios API

Todos los servicios están en `src/services/` y usan Axios para comunicarse con el backend:

- `api.js`: Configuración base de Axios
- `deportesService.js`: Operaciones con deportes
- `carrerasService.js`: Operaciones con carreras
- `canchasService.js`: Operaciones con canchas
- `espaciosJuegosMesaService.js`: Operaciones con espacios de juegos
- `reservasService.js`: Operaciones con reservas

## Componentes

### Navbar
Barra de navegación principal con enlaces a todas las páginas.

### DeporteCard
Tarjeta que muestra información de un deporte o juego de mesa.

### CanchaCard
Tarjeta que muestra información de una cancha deportiva.

### EspacioJuegoMesaCard
Tarjeta que muestra información de un espacio de juegos de mesa.

## Configuración

La URL base de la API está configurada en `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Asegúrate de que el backend esté corriendo en `http://localhost:3000` antes de iniciar el frontend.

## Estilos

Los estilos están organizados en:
- `index.css`: Estilos base y reset
- `App.css`: Estilos globales de la aplicación

El diseño es responsive y se adapta a diferentes tamaños de pantalla.

## Notas Importantes

- El frontend está configurado para funcionar con el backend en `http://localhost:3000`
- Asegúrate de tener el backend corriendo antes de iniciar el frontend
- La autenticación aún no está implementada en esta versión básica
- Los formularios de reserva están simulados con alerts

## Próximos Pasos

Para un sistema completo, considerar agregar:
- Sistema de autenticación (login/register)
- Formularios completos de reserva
- Perfil de usuario
- Calendario de disponibilidad
- Sistema de pagos
- Notificaciones en tiempo real
