const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/canchas - Obtener canchas (sin dueño ni precio)
router.get('/', async (req, res) => {
  try {
    const { deporte_id, estado } = req.query;

    let query = `
      SELECT c.id_cancha, c.nombre_cancha, c.superficie, c.estado, c.ubicacion, c.capacidad_jugadores,
             d.nombre as deporte, d.icono_url
      FROM canchas c
      JOIN deportes d ON c.id_deporte = d.id_deporte
    `;
    const params = [];

    if (deporte_id) {
      query += ' WHERE c.id_deporte = ?';
      params.push(deporte_id);
    }

    if (estado) {
      query += deporte_id ? ' AND c.estado = ?' : ' WHERE c.estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY c.nombre_cancha';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo canchas:', error);
    res.status(500).json({ error: 'Error al obtener canchas' });
  }
});

// GET /api/canchas/:id - Obtener una cancha específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT c.*, d.nombre as deporte, d.icono_url
       FROM canchas c
       JOIN deportes d ON c.id_deporte = d.id_deporte
       WHERE c.id_cancha = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo cancha:', error);
    res.status(500).json({ error: 'Error al obtener cancha' });
  }
});

// POST /api/canchas - Crear una nueva cancha
router.post('/', async (req, res) => {
  try {
    const { id_deporte, nombre_cancha, superficie, ubicacion, capacidad_jugadores, estado } = req.body;

    if (!id_deporte || !nombre_cancha) {
      return res.status(400).json({ error: 'Deporte y nombre son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO canchas (id_deporte, nombre_cancha, superficie, ubicacion, capacidad_jugadores, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [id_deporte, nombre_cancha, superficie || null, ubicacion || null, capacidad_jugadores || null, estado || 'disponible']
    );

    res.status(201).json({
      message: 'Cancha creada exitosamente',
      id_cancha: result.insertId
    });
  } catch (error) {
    console.error('Error creando cancha:', error);
    res.status(500).json({ error: 'Error al crear cancha' });
  }
});

// PUT /api/canchas/:id - Actualizar una cancha
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_cancha, superficie, ubicacion, capacidad_jugadores, estado } = req.body;

    const [result] = await db.query(
      'UPDATE canchas SET nombre_cancha = ?, superficie = ?, ubicacion = ?, capacidad_jugadores = ?, estado = ? WHERE id_cancha = ?',
      [nombre_cancha, superficie, ubicacion, capacidad_jugadores, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    res.json({ message: 'Cancha actualizada exitosamente' });
  } catch (error) {
    console.error('Error actualizando cancha:', error);
    res.status(500).json({ error: 'Error al actualizar cancha' });
  }
});

// DELETE /api/canchas/:id - Eliminar una cancha
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM canchas WHERE id_cancha = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    res.json({ message: 'Cancha eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando cancha:', error);
    res.status(500).json({ error: 'Error al eliminar cancha' });
  }
});

module.exports = router;
