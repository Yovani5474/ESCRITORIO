const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/carreras - Obtener todas las carreras activas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_carrera, nombre_carrera, codigo, activo FROM carreras WHERE activo = TRUE ORDER BY nombre_carrera'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo carreras:', error);
    res.status(500).json({ error: 'Error al obtener carreras' });
  }
});

// GET /api/carreras/:id - Obtener una carrera específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM carreras WHERE id_carrera = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo carrera:', error);
    res.status(500).json({ error: 'Error al obtener carrera' });
  }
});

// POST /api/carreras - Crear una nueva carrera (solo admin)
router.post('/', async (req, res) => {
  try {
    const { nombre_carrera, codigo, activo } = req.body;

    if (!nombre_carrera || !codigo) {
      return res.status(400).json({ error: 'El nombre y código son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO carreras (nombre_carrera, codigo, activo) VALUES (?, ?, ?)',
      [nombre_carrera, codigo, activo !== undefined ? activo : true]
    );

    res.status(201).json({
      message: 'Carrera creada exitosamente',
      id_carrera: result.insertId
    });
  } catch (error) {
    console.error('Error creando carrera:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El código de carrera ya existe' });
    }
    res.status(500).json({ error: 'Error al crear carrera' });
  }
});

// PUT /api/carreras/:id - Actualizar una carrera (solo admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_carrera, codigo, activo } = req.body;

    const [result] = await db.query(
      'UPDATE carreras SET nombre_carrera = ?, codigo = ?, activo = ? WHERE id_carrera = ?',
      [nombre_carrera, codigo, activo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    res.json({ message: 'Carrera actualizada exitosamente' });
  } catch (error) {
    console.error('Error actualizando carrera:', error);
    res.status(500).json({ error: 'Error al actualizar carrera' });
  }
});

// DELETE /api/carreras/:id - Eliminar una carrera (solo admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM carreras WHERE id_carrera = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    res.json({ message: 'Carrera eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando carrera:', error);
    res.status(500).json({ error: 'Error al eliminar carrera' });
  }
});

module.exports = router;
