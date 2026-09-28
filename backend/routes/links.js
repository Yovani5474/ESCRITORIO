const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/links - Obtener links
router.get('/', async (req, res) => {
  try {
    const { campeonato_id, partido_id, tipo, activo } = req.query;

    let query = 'SELECT * FROM links WHERE 1=1';
    const params = [];

    if (campeonato_id) {
      query += ' AND id_campeonato = ?';
      params.push(campeonato_id);
    }

    if (partido_id) {
      query += ' AND id_partido = ?';
      params.push(partido_id);
    }

    if (tipo) {
      query += ' AND tipo_link = ?';
      params.push(tipo);
    }

    if (activo !== undefined) {
      query += ' AND activo = ?';
      params.push(activo === 'true');
    }

    query += ' ORDER BY fecha_creacion DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo links:', error);
    res.status(500).json({ error: 'Error al obtener links' });
  }
});

// POST /api/links - Crear un nuevo link
router.post('/', async (req, res) => {
  try {
    const { id_campeonato, id_partido, tipo_link, titulo, url, descripcion } = req.body;

    if (!titulo || !url) {
      return res.status(400).json({ error: 'Título y URL son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO links (id_campeonato, id_partido, tipo_link, titulo, url, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
      [id_campeonato || null, id_partido || null, tipo_link || 'otro', titulo, url, descripcion || null]
    );

    res.status(201).json({
      message: 'Link creado exitosamente',
      id_link: result.insertId
    });
  } catch (error) {
    console.error('Error creando link:', error);
    res.status(500).json({ error: 'Error al crear link' });
  }
});

// PUT /api/links/:id - Actualizar un link
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, url, descripcion, activo } = req.body;

    const [result] = await db.query(
      'UPDATE links SET titulo = ?, url = ?, descripcion = ?, activo = ? WHERE id_link = ?',
      [titulo, url, descripcion, activo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Link no encontrado' });
    }

    res.json({ message: 'Link actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando link:', error);
    res.status(500).json({ error: 'Error al actualizar link' });
  }
});

// DELETE /api/links/:id - Eliminar un link
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM links WHERE id_link = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Link no encontrado' });
    }

    res.json({ message: 'Link eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando link:', error);
    res.status(500).json({ error: 'Error al eliminar link' });
  }
});

module.exports = router;
