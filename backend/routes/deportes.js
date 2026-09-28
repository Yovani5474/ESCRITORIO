const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/deportes - Obtener todos los deportes activos
router.get('/', async (req, res) => {
  try {
    const { tipo_actividad } = req.query;

    let query = `
      SELECT id_deporte, nombre, icono_url, tipo_actividad, activo
      FROM deportes
      WHERE activo = TRUE
    `;
    const params = [];

    if (tipo_actividad) {
      query += ' AND tipo_actividad = ?';
      params.push(tipo_actividad);
    }

    query += ' ORDER BY nombre';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo deportes:', error);
    res.status(500).json({ error: 'Error al obtener deportes' });
  }
});

// GET /api/deportes/:id - Obtener un deporte específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM deportes WHERE id_deporte = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo deporte:', error);
    res.status(500).json({ error: 'Error al obtener deporte' });
  }
});

// POST /api/deportes - Crear un nuevo deporte (solo admin)
router.post('/', async (req, res) => {
  try {
    const { nombre, icono_url, tipo_actividad } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const [result] = await db.query(
      'INSERT INTO deportes (nombre, icono_url, tipo_actividad) VALUES (?, ?, ?)',
      [nombre, icono_url || null, tipo_actividad || 'deporte']
    );

    res.status(201).json({
      message: 'Deporte creado exitosamente',
      id_deporte: result.insertId
    });
  } catch (error) {
    console.error('Error creando deporte:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El nombre del deporte ya existe' });
    }
    res.status(500).json({ error: 'Error al crear deporte' });
  }
});

// PUT /api/deportes/:id - Actualizar un deporte (solo admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, icono_url, tipo_actividad, activo } = req.body;

    const [result] = await db.query(
      'UPDATE deportes SET nombre = ?, icono_url = ?, tipo_actividad = ?, activo = ? WHERE id_deporte = ?',
      [nombre, icono_url, tipo_actividad, activo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }

    res.json({ message: 'Deporte actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando deporte:', error);
    res.status(500).json({ error: 'Error al actualizar deporte' });
  }
});

// DELETE /api/deportes/:id - Eliminar un deporte (solo admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM deportes WHERE id_deporte = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }

    res.json({ message: 'Deporte eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando deporte:', error);
    res.status(500).json({ error: 'Error al eliminar deporte' });
  }
});

module.exports = router;
