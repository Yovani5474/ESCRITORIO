const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/equipos - Obtener equipos
router.get('/', async (req, res) => {
  try {
    const { visibilidad } = req.query;

    let query = `
      SELECT e.*, u.nombre as capitan_nombre, u.apellido as capitan_apellido
      FROM equipos e
      JOIN usuarios u ON e.id_capitan = u.id_usuario
    `;
    const params = [];

    if (visibilidad) {
      query += ' WHERE e.visibilidad = ?';
      params.push(visibilidad);
    }

    query += ' ORDER BY e.nombre_equipo';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo equipos:', error);
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
});

// GET /api/equipos/:id - Obtener un equipo específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT e.*, u.nombre as capitan_nombre, u.apellido as capitan_apellido
       FROM equipos e
       JOIN usuarios u ON e.id_capitan = u.id_usuario
       WHERE e.id_equipo = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo equipo:', error);
    res.status(500).json({ error: 'Error al obtener equipo' });
  }
});

// GET /api/equipos/:id/miembros - Obtener miembros de un equipo
router.get('/:id/miembros', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT em.*, u.nombre, u.apellido, u.correo
       FROM equipo_miembros em
       JOIN usuarios u ON em.id_usuario = u.id_usuario
       WHERE em.id_equipo = ? AND em.estado_invitacion = 'aceptado'
       ORDER BY em.rol_en_equipo DESC, u.nombre`,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo miembros:', error);
    res.status(500).json({ error: 'Error al obtener miembros' });
  }
});

// POST /api/equipos - Crear un nuevo equipo
router.post('/', async (req, res) => {
  try {
    const { id_capitan, nombre_equipo, escudo_url, nivel_competitivo, visibilidad } = req.body;

    if (!id_capitan || !nombre_equipo) {
      return res.status(400).json({ error: 'Capitán y nombre son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO equipos (id_capitan, nombre_equipo, escudo_url, nivel_competitivo, visibilidad) VALUES (?, ?, ?, ?, ?)',
      [id_capitan, nombre_equipo, escudo_url || null, nivel_competitivo || 'amateur', visibilidad || 'publico']
    );

    // Agregar al capitán como miembro automáticamente
    await db.query(
      'INSERT INTO equipo_miembros (id_equipo, id_usuario, estado_invitacion, rol_en_equipo, fecha_aceptacion) VALUES (?, ?, ?, ?, NOW())',
      [result.insertId, id_capitan, 'aceptado', 'capitan']
    );

    res.status(201).json({
      message: 'Equipo creado exitosamente',
      id_equipo: result.insertId
    });
  } catch (error) {
    console.error('Error creando equipo:', error);
    res.status(500).json({ error: 'Error al crear equipo' });
  }
});

// POST /api/equipos/:id/miembros - Invitar un usuario al equipo
router.post('/:id/miembros', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, rol_en_equipo } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'Usuario es requerido' });
    }

    const [result] = await db.query(
      'INSERT INTO equipo_miembros (id_equipo, id_usuario, estado_invitacion, rol_en_equipo) VALUES (?, ?, ?, ?)',
      [id, id_usuario, 'pendiente', rol_en_equipo || 'jugador']
    );

    // Crear notificación
    await db.query(
      'INSERT INTO notificaciones (id_usuario, tipo_notificacion, titulo, mensaje) VALUES (?, ?, ?, ?)',
      [id_usuario, 'invitacion_equipo', 'Invitación a Equipo', 'Has sido invitado a unirte a un equipo.']
    );

    res.status(201).json({
      message: 'Invitación enviada exitosamente',
      id_miembro: result.insertId
    });
  } catch (error) {
    console.error('Error invitando miembro:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El usuario ya es miembro del equipo' });
    }
    res.status(500).json({ error: 'Error al invitar miembro' });
  }
});

// PUT /api/equipos/:id/miembros/:id_miembro/estado - Aceptar/rechazar invitación
router.put('/:id/miembros/:id_miembro/estado', async (req, res) => {
  try {
    const { id, id_miembro } = req.params;
    const { estado_invitacion } = req.body;

    if (!['aceptado', 'rechazado'].includes(estado_invitacion)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const updates = { estado_invitacion };
    if (estado_invitacion === 'aceptado') {
      updates.fecha_aceptacion = new Date();
    }

    const [result] = await db.query(
      'UPDATE equipo_miembros SET estado_invitacion = ?, fecha_aceptacion = ? WHERE id_miembro = ? AND id_equipo = ?',
      [estado_invitacion, updates.fecha_aceptacion || null, id_miembro, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }

    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

module.exports = router;
