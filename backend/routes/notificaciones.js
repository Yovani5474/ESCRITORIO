const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/notificaciones - Obtener notificaciones
router.get('/', async (req, res) => {
  try {
    const { id_usuario, id_equipo, no_leidas } = req.query;

    let query = 'SELECT * FROM notificaciones WHERE 1=1';
    const params = [];

    if (id_usuario) {
      query += ' AND id_usuario = ?';
      params.push(id_usuario);
    }

    if (id_equipo) {
      query += ' AND id_equipo = ?';
      params.push(id_equipo);
    }

    if (no_leidas === 'true') {
      query += ' AND leida = FALSE';
    }

    query += ' ORDER BY fecha_creacion DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// PUT /api/notificaciones/:id/leer - Marcar notificación como leída
router.put('/:id/leer', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE notificaciones SET leida = TRUE WHERE id_notificacion = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error marcando notificación:', error);
    res.status(500).json({ error: 'Error al marcar notificación' });
  }
});

// POST /api/notificaciones/marcar-todas-leidas - Marcar todas como leídas
router.post('/marcar-todas-leidas', async (req, res) => {
  try {
    const { id_usuario, id_equipo } = req.body;

    let query = 'UPDATE notificaciones SET leida = TRUE WHERE 1=1';
    const params = [];

    if (id_usuario) {
      query += ' AND id_usuario = ?';
      params.push(id_usuario);
    }

    if (id_equipo) {
      query += ' AND id_equipo = ?';
      params.push(id_equipo);
    }

    await db.query(query, params);

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error marcando notificaciones:', error);
    res.status(500).json({ error: 'Error al marcar notificaciones' });
  }
});

module.exports = router;
