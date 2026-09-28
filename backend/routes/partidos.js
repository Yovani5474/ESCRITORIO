const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/partidos - Obtener partidos
router.get('/', async (req, res) => {
  try {
    const { campeonato_id, ronda, estado } = req.query;

    let query = `
      SELECT p.*, c.nombre_cancha,
             e1.nombre_equipo as equipo_local_nombre, e1.escudo_url as equipo_local_escudo, e1.color_primario as equipo_local_color,
             e2.nombre_equipo as equipo_visitante_nombre, e2.escudo_url as equipo_visitante_escudo, e2.color_primario as equipo_visitante_color,
             eg.nombre_equipo as ganador_nombre,
             cam.nombre_campeonato
      FROM partidos p
      LEFT JOIN canchas c ON p.id_cancha = c.id_cancha
      JOIN equipos e1 ON p.id_equipo_local = e1.id_equipo
      JOIN equipos e2 ON p.id_equipo_visitante = e2.id_equipo
      LEFT JOIN equipos eg ON p.id_ganador = eg.id_equipo
      JOIN campeonatos cam ON p.id_campeonato = cam.id_campeonato
    `;
    const params = [];

    if (campeonato_id) {
      query += ' WHERE p.id_campeonato = ?';
      params.push(campeonato_id);
    }

    if (ronda) {
      query += campeonato_id ? ' AND p.ronda = ?' : ' WHERE p.ronda = ?';
      params.push(ronda);
    }

    if (estado) {
      query += (campeonato_id || ronda) ? ' AND p.estado_partido = ?' : ' WHERE p.estado_partido = ?';
      params.push(estado);
    }

    query += ' ORDER BY p.fecha_partido ASC, p.hora_inicio ASC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo partidos:', error);
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
});

// GET /api/partidos/:id - Obtener un partido específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT p.*, c.nombre_cancha,
              e1.nombre_equipo as equipo_local_nombre, e1.escudo_url as equipo_local_escudo,
              e2.nombre_equipo as equipo_visitante_nombre, e2.escudo_url as equipo_visitante_escudo,
              eg.nombre_equipo as ganador_nombre,
              cam.nombre_campeonato
       FROM partidos p
       LEFT JOIN canchas c ON p.id_cancha = c.id_cancha
       JOIN equipos e1 ON p.id_equipo_local = e1.id_equipo
       JOIN equipos e2 ON p.id_equipo_visitante = e2.id_equipo
       LEFT JOIN equipos eg ON p.id_ganador = eg.id_equipo
       JOIN campeonatos cam ON p.id_campeonato = cam.id_campeonato
       WHERE p.id_partido = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo partido:', error);
    res.status(500).json({ error: 'Error al obtener partido' });
  }
});

// POST /api/partidos - Crear un nuevo partido
router.post('/', async (req, res) => {
  try {
    const { id_campeonato, ronda, id_equipo_local, id_equipo_visitante, id_cancha, fecha_partido, hora_inicio, hora_fin, id_arbitro } = req.body;

    if (!id_campeonato || !ronda || !id_equipo_local || !id_equipo_visitante) {
      return res.status(400).json({ error: 'Campeonato, ronda y equipos son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO partidos (id_campeonato, ronda, id_equipo_local, id_equipo_visitante, id_cancha, fecha_partido, hora_inicio, hora_fin, id_arbitro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_campeonato, ronda, id_equipo_local, id_equipo_visitante, id_cancha || null, fecha_partido || null, hora_inicio || null, hora_fin || null, id_arbitro || null]
    );

    res.status(201).json({
      message: 'Partido creado exitosamente',
      id_partido: result.insertId
    });
  } catch (error) {
    console.error('Error creando partido:', error);
    res.status(500).json({ error: 'Error al crear partido' });
  }
});

// PUT /api/partidos/:id/resultado - Registrar resultado de partido
router.put('/:id/resultado', async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado_local, resultado_visitante, id_ganador, estado_partido, observaciones } = req.body;

    const [result] = await db.query(
      'UPDATE partidos SET resultado_local = ?, resultado_visitante = ?, id_ganador = ?, estado_partido = ?, observaciones = ? WHERE id_partido = ?',
      [resultado_local, resultado_visitante, id_ganador, estado_partido || 'finalizado', observaciones || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    res.json({ message: 'Resultado registrado exitosamente' });
  } catch (error) {
    console.error('Error registrando resultado:', error);
    res.status(500).json({ error: 'Error al registrar resultado' });
  }
});

// PUT /api/partidos/:id/estado - Actualizar estado de partido (para tiempo real)
router.put('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_partido } = req.body;

    const [result] = await db.query(
      'UPDATE partidos SET estado_partido = ? WHERE id_partido = ?',
      [estado_partido, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// DELETE /api/partidos/:id - Eliminar un partido
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM partidos WHERE id_partido = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    res.json({ message: 'Partido eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando partido:', error);
    res.status(500).json({ error: 'Error al eliminar partido' });
  }
});

module.exports = router;
