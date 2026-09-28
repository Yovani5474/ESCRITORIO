const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/reservas - Obtener reservas
router.get('/', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, estado, tipo_reserva, id_usuario } = req.query;

    let query = `
      SELECT r.*,
             CASE
               WHEN r.tipo_reserva = 'cancha' THEN c.nombre_cancha
               WHEN r.tipo_reserva = 'juego_mesa' THEN e.nombre_espacio
             END as nombre_espacio,
             CASE
               WHEN r.tipo_reserva = 'cancha' THEN d.nombre as deporte
               WHEN r.tipo_reserva = 'juego_mesa' THEN dj.nombre as deporte
             END as nombre_deporte,
             u.nombre as usuario_nombre, u.apellido as usuario_apellido,
             eq.nombre_equipo,
             arb.nombre as arbitro_nombre, arb.apellido as arbitro_apellido
      FROM reservas r
      LEFT JOIN canchas c ON r.id_cancha = c.id_cancha
      LEFT JOIN espacios_juegos_mesa e ON r.id_espacio_juego = e.id_espacio
      LEFT JOIN deportes d ON c.id_deporte = d.id_deporte
      LEFT JOIN deportes dj ON e.id_deporte = dj.id_deporte
      LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
      LEFT JOIN equipos eq ON r.id_equipo = eq.id_equipo
      LEFT JOIN usuarios arb ON r.id_arbitro = arb.id_usuario
    `;
    const params = [];

    if (id_usuario) {
      query += ' WHERE r.id_usuario = ?';
      params.push(id_usuario);
    }

    if (fecha_inicio) {
      query += id_usuario ? ' AND r.fecha_reserva >= ?' : ' WHERE r.fecha_reserva >= ?';
      params.push(fecha_inicio);
    }

    if (fecha_fin) {
      query += (id_usuario || fecha_inicio) ? ' AND r.fecha_reserva <= ?' : ' WHERE r.fecha_reserva <= ?';
      params.push(fecha_fin);
    }

    if (estado) {
      query += (id_usuario || fecha_inicio || fecha_fin) ? ' AND r.estado_reserva = ?' : ' WHERE r.estado_reserva = ?';
      params.push(estado);
    }

    if (tipo_reserva) {
      query += (id_usuario || fecha_inicio || fecha_fin || estado) ? ' AND r.tipo_reserva = ?' : ' WHERE r.tipo_reserva = ?';
      params.push(tipo_reserva);
    }

    query += ' ORDER BY r.fecha_reserva DESC, r.hora_inicio DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// GET /api/reservas/:id - Obtener una reserva específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT r.*,
              CASE
                WHEN r.tipo_reserva = 'cancha' THEN c.nombre_cancha
                WHEN r.tipo_reserva = 'juego_mesa' THEN e.nombre_espacio
              END as nombre_espacio,
              CASE
                WHEN r.tipo_reserva = 'cancha' THEN d.nombre as deporte
                WHEN r.tipo_reserva = 'juego_mesa' THEN dj.nombre as deporte
              END as nombre_deporte,
              u.nombre as usuario_nombre, u.apellido as usuario_apellido,
              eq.nombre_equipo,
              arb.nombre as arbitro_nombre, arb.apellido as arbitro_apellido
       FROM reservas r
       LEFT JOIN canchas c ON r.id_cancha = c.id_cancha
       LEFT JOIN espacios_juegos_mesa e ON r.id_espacio_juego = e.id_espacio
       LEFT JOIN deportes d ON c.id_deporte = d.id_deporte
       LEFT JOIN deportes dj ON e.id_deporte = dj.id_deporte
       LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
       LEFT JOIN equipos eq ON r.id_equipo = eq.id_equipo
       LEFT JOIN usuarios arb ON r.id_arbitro = arb.id_usuario
       WHERE r.id_reserva = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo reserva:', error);
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
});

// POST /api/reservas - Crear una nueva reserva (cancha)
router.post('/', async (req, res) => {
  try {
    const { tipo_reserva, id_cancha, id_espacio_juego, id_usuario, id_equipo, id_arbitro, fecha_reserva, hora_inicio, hora_fin, visibilidad, numero_mesas_reservadas } = req.body;

    if (!tipo_reserva || !id_usuario || !fecha_reserva || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Tipo, usuario, fecha y horas son requeridos' });
    }

    if (tipo_reserva === 'cancha' && !id_cancha) {
      return res.status(400).json({ error: 'Para reservas de cancha, id_cancha es requerido' });
    }

    if (tipo_reserva === 'juego_mesa' && !id_espacio_juego) {
      return res.status(400).json({ error: 'Para reservas de juego de mesa, id_espacio_juego es requerido' });
    }

    // Calcular monto total
    let monto_total = 0;
    if (tipo_reserva === 'cancha') {
      const [cancha] = await db.query('SELECT precio_por_hora FROM canchas WHERE id_cancha = ?', [id_cancha]);
      if (cancha.length === 0) {
        return res.status(404).json({ error: 'Cancha no encontrada' });
      }
      const horas = (new Date(`2000-01-01 ${hora_fin}`) - new Date(`2000-01-01 ${hora_inicio}`)) / 3600000;
      monto_total = cancha[0].precio_por_hora * horas;
    } else if (tipo_reserva === 'juego_mesa') {
      const [espacio] = await db.query('SELECT precio_por_hora, precio_por_mesa FROM espacios_juegos_mesa WHERE id_espacio = ?', [id_espacio_juego]);
      if (espacio.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }
      const horas = (new Date(`2000-01-01 ${hora_fin}`) - new Date(`2000-01-01 ${hora_inicio}`)) / 3600000;
      const mesas = numero_mesas_reservadas || 1;
      monto_total = (espacio[0].precio_por_hora * horas) + (espacio[0].precio_por_mesa ? espacio[0].precio_por_mesa * mesas : 0);
    }

    const [result] = await db.query(
      'INSERT INTO reservas (tipo_reserva, id_cancha, id_espacio_juego, id_usuario, id_equipo, id_arbitro, fecha_reserva, hora_inicio, hora_fin, monto_total, visibilidad, numero_mesas_reservadas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [tipo_reserva, id_cancha || null, id_espacio_juego || null, id_usuario, id_equipo || null, id_arbitro || null, fecha_reserva, hora_inicio, hora_fin, monto_total, visibilidad || 'publico', numero_mesas_reservadas || 1]
    );

    res.status(201).json({
      message: 'Reserva creada exitosamente',
      id_reserva: result.insertId,
      monto_total
    });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// POST /api/reservas/juego-mesa - Crear reserva específica de juego de mesa
router.post('/juego-mesa', async (req, res) => {
  try {
    const { id_espacio_juego, id_usuario, id_equipo, fecha_reserva, hora_inicio, hora_fin, numero_mesas_reservadas, visibilidad } = req.body;

    if (!id_espacio_juego || !id_usuario || !fecha_reserva || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Espacio, usuario, fecha y horas son requeridos' });
    }

    // Calcular monto total
    const [espacio] = await db.query('SELECT precio_por_hora, precio_por_mesa FROM espacios_juegos_mesa WHERE id_espacio = ?', [id_espacio_juego]);
    if (espacio.length === 0) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }

    const horas = (new Date(`2000-01-01 ${hora_fin}`) - new Date(`2000-01-01 ${hora_inicio}`)) / 3600000;
    const mesas = numero_mesas_reservadas || 1;
    const monto_total = (espacio[0].precio_por_hora * horas) + (espacio[0].precio_por_mesa ? espacio[0].precio_por_mesa * mesas : 0);

    const [result] = await db.query(
      'INSERT INTO reservas (tipo_reserva, id_espacio_juego, id_usuario, id_equipo, fecha_reserva, hora_inicio, hora_fin, monto_total, visibilidad, numero_mesas_reservadas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['juego_mesa', id_espacio_juego, id_usuario, id_equipo || null, fecha_reserva, hora_inicio, hora_fin, monto_total, visibilidad || 'publico', numero_mesas_reservadas || 1]
    );

    res.status(201).json({
      message: 'Reserva de juego de mesa creada exitosamente',
      id_reserva: result.insertId,
      monto_total
    });
  } catch (error) {
    console.error('Error creando reserva de juego de mesa:', error);
    res.status(500).json({ error: 'Error al crear reserva de juego de mesa' });
  }
});

// PUT /api/reservas/:id/estado - Actualizar estado de reserva
router.put('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_reserva, resultado_partido, resultado_juego } = req.body;

    const updates = { estado_reserva };
    const params = [];

    if (resultado_partido) {
      updates.resultado_partido = JSON.stringify(resultado_partido);
    }

    if (resultado_juego) {
      updates.resultado_juego = JSON.stringify(resultado_juego);
    }

    const [result] = await db.query(
      'UPDATE reservas SET estado_reserva = ?, resultado_partido = ?, resultado_juego = ? WHERE id_reserva = ?',
      [estado_reserva, updates.resultado_partido || null, updates.resultado_juego || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Si el estado es finalizada, crear registro en historial
    if (estado_reserva === 'finalizada') {
      const [reserva] = await db.query('SELECT * FROM reservas WHERE id_reserva = ?', [id]);
      if (reserva.length > 0) {
        await db.query(
          'INSERT INTO historial_partidos (id_reserva, fecha_partido, hora_inicio, hora_fin, id_cancha, id_espacio_juego, id_arbitro, resultado, resultado_juego) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, reserva[0].fecha_reserva, reserva[0].hora_inicio, reserva[0].hora_fin, reserva[0].id_cancha, reserva[0].id_espacio_juego, reserva[0].id_arbitro, updates.resultado_partido || null, updates.resultado_juego || null]
        );
      }
    }

    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// PUT /api/reservas/:id/resultado-juego - Registrar resultado de juego de mesa
router.put('/:id/resultado-juego', async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado_juego } = req.body;

    if (!resultado_juego) {
      return res.status(400).json({ error: 'Resultado del juego es requerido' });
    }

    const [result] = await db.query(
      'UPDATE reservas SET resultado_juego = ? WHERE id_reserva = ?',
      [JSON.stringify(resultado_juego), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ message: 'Resultado del juego registrado exitosamente' });
  } catch (error) {
    console.error('Error registrando resultado:', error);
    res.status(500).json({ error: 'Error al registrar resultado' });
  }
});

// DELETE /api/reservas/:id - Cancelar una reserva
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE reservas SET estado_reserva = ? WHERE id_reserva = ?',
      ['cancelada', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
});

module.exports = router;
