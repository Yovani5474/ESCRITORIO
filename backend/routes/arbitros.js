const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/arbitros/disponibles - Obtener árbitros disponibles
router.get('/disponibles', async (req, res) => {
  try {
    const { fecha, hora_inicio, hora_fin, id_deporte } = req.query;

    let query = `
      SELECT u.id_usuario, u.nombre, u.apellido, u.calificacion_arbitro,
             u.disponible_para_arbitrar
      FROM usuarios u
      WHERE u.rol = 'arbitro'
      AND u.disponible_para_arbitrar = TRUE
    `;
    const params = [];

    // Filtrar por día de la semana si se proporciona fecha
    if (fecha) {
      const diaSemana = new Date(fecha).getDay();
      query += ` AND u.id_usuario IN (
        SELECT id_arbitro FROM disponibilidad_arbitros
        WHERE dia_semana = ? AND activo = TRUE
        AND ? >= hora_inicio AND ? <= hora_fin
      )`;
      params.push(diaSemana, hora_inicio, hora_fin);
    }

    query += ' ORDER BY u.calificacion_arbitro DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo árbitros disponibles:', error);
    res.status(500).json({ error: 'Error al obtener árbitros disponibles' });
  }
});

// GET /api/arbitros/:id_arbitro/partidos - Obtener partidos de un árbitro
router.get('/:id_arbitro/partidos', async (req, res) => {
  try {
    const { id_arbitro } = req.params;
    const { estado } = req.query;

    let query = `
      SELECT r.*, c.nombre_cancha,
             eq1.nombre_equipo as equipo_local,
             eq2.nombre_equipo as equipo_visitante,
             aa.estado_asignacion
      FROM reservas r
      JOIN canchas c ON r.id_cancha = c.id_cancha
      LEFT JOIN equipos eq1 ON r.id_equipo = eq1.id_equipo
      LEFT JOIN asignaciones_arbitros aa ON r.id_reserva = aa.id_reserva
      WHERE r.id_arbitro = ?
    `;
    const params = [id_arbitro];

    if (estado) {
      query += ' AND aa.estado_asignacion = ?';
      params.push(estado);
    }

    query += ' ORDER BY r.fecha_reserva DESC, r.hora_inicio DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo partidos:', error);
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
});

// POST /api/arbitros/:id_arbitro/disponibilidad - Establecer disponibilidad
router.post('/:id_arbitro/disponibilidad', async (req, res) => {
  try {
    const { id_arbitro } = req.params;
    const { disponibilidad } = req.body;

    if (!disponibilidad || !Array.isArray(disponibilidad)) {
      return res.status(400).json({ error: 'Disponibilidad es requerida y debe ser un array' });
    }

    // Eliminar disponibilidad existente
    await db.query('DELETE FROM disponibilidad_arbitros WHERE id_arbitro = ?', [id_arbitro]);

    // Insertar nueva disponibilidad
    for (const disp of disponibilidad) {
      await db.query(
        'INSERT INTO disponibilidad_arbitros (id_arbitro, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, ?)',
        [id_arbitro, disp.dia_semana, disp.hora_inicio, disp.hora_fin, true]
      );
    }

    res.json({ message: 'Disponibilidad actualizada exitosamente' });
  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
    res.status(500).json({ error: 'Error al actualizar disponibilidad' });
  }
});

// POST /api/arbitros/:id_arbitro/calificar - Calificar árbitro
router.post('/:id_arbitro/calificar', async (req, res) => {
  try {
    const { id_arbitro } = req.params;
    const { id_reserva, calificacion, comentario } = req.body;

    if (!id_reserva || !calificacion) {
      return res.status(400).json({ error: 'Reserva y calificación son requeridos' });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'Calificación debe estar entre 1 y 5' });
    }

    // Actualizar asignación con calificación
    await db.query(
      'UPDATE asignaciones_arbitros SET calificacion_arbitro = ?, comentario_calificacion = ? WHERE id_reserva = ? AND id_arbitro = ?',
      [calificacion, comentario || null, id_reserva, id_arbitro]
    );

    // Calcular nuevo promedio
    const [calificaciones] = await db.query(
      'SELECT AVG(calificacion_arbitro) as promedio FROM asignaciones_arbitros WHERE id_arbitro = ? AND calificacion_arbitro IS NOT NULL',
      [id_arbitro]
    );

    const nuevoPromedio = calificaciones[0].promedio ? parseFloat(calificaciones[0].promedio).toFixed(2) : 0;

    await db.query(
      'UPDATE usuarios SET calificacion_arbitro = ? WHERE id_usuario = ?',
      [nuevoPromedio, id_arbitro]
    );

    res.json({ message: 'Árbitro calificado exitosamente', nuevo_promedio: nuevoPromedio });
  } catch (error) {
    console.error('Error calificando árbitro:', error);
    res.status(500).json({ error: 'Error al calificar árbitro' });
  }
});

module.exports = router;
