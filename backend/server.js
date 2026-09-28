const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas del Sistema de Campeonatos
app.use('/api/deportes', require('./routes/deportes'));
app.use('/api/carreras', require('./routes/carreras'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/canchas', require('./routes/canchas'));
app.use('/api/equipos', require('./routes/equipos'));
app.use('/api/campeonatos', require('./routes/campeonatos'));
app.use('/api/partidos', require('./routes/partidos'));
app.use('/api/links', require('./routes/links'));
app.use('/api/notificaciones', require('./routes/notificaciones'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Campeonatos Deportivos',
    version: '2.0.0',
    status: 'running'
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
