const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/torneos-juegos-mesa - Obtener torneos
router.get('/', async (req, res) => {
  try {
    const { deporte_id, estado } = req.query;

    let query = `
      SELECT t.*, d.nombre as deporte, d.icono_url,
             u.nombre as organizador_nombre, u.apellido as organizador_apellido
      FROM torneos_juegos_mesa t
      JOIN deportes d ON t.id_deporte = d.id_deporte
      JOIN usuarios u ON t.id_organizador = u.id_usuario
    `;
    const params = [];

    if (deporte_id) {
      query += ' WHERE t.id_deporte = ?';
      params.push(deporte_id);
    }

    if (estado) {
      query += deporte_id ? ' AND t.estado_torneo = ?' : ' WHERE t.estado_torneo = ?';
      params.push(estado);
    }

    query += ' ORDER BY t.fecha_inicio DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo torneos:', error);
    res.status(500).json({ error: 'Error al obtener torneos' });
  }
});

// GET /api/torneos-juegos-mesa/:id - Obtener un torneo específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT t.*, d.nombre as deporte, d.icono_url,
              u.nombre as organizador_nombre, u.apellido as organizador_apellido
       FROM torneos_juegos_mesa t
       JOIN deportes d ON t.id_deporte = d.id_deporte
       JOIN usuarios u ON t.id_organizador = u.id_usuario
       WHERE t.id_torneo = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Torneo no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo torneo:', error);
    res.status(500).json({ error: 'Error al obtener torneo' });
  }
});

// GET /api/torneos-juegos-mesa/:id/participantes - Obtener participantes de un torneo
router.get('/:id/participantes', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT tp.*, u.nombre, u.apellido, u.correo, eq.nombre_equipo
       FROM torneo_participantes tp
       LEFT JOIN usuarios u ON tp.id_usuario = u.id_usuario
       LEFT JOIN equipos eq ON tp.id_equipo = eq.id_equipo
       WHERE tp.id_torneo = ?
       ORDER BY tp.ranking_actual ASC`,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo participantes:', error);
    res.status(500).json({ error: 'Error al obtener participantes' });
  }
});

// GET /api/torneos-juegos-mesa/:id/partidas - Obtener partidas de un torneo
router.get('/:id/partidas', async (req, res) => {
  try {
    const { id } = req.params;
    const { ronda } = req.query;

    let query = `
      SELECT pt.*, e.nombre_espacio,
             j1.nombre as jugador1_nombre, j1.apellido as jugador1_apellido,
             j2.nombre as jugador2_nombre, j2.apellido as jugador2_apellido,
             g.nombre as ganador_nombre, g.apellido as ganador_apellido
      FROM partidas_torneo pt
      LEFT JOIN espacios_juegos_mesa e ON pt.id_espacio_juego = e.id_espacio
      LEFT JOIN usuarios j1 ON pt.id_jugador1 = j1.id_usuario
      LEFT JOIN usuarios j2 ON pt.id_jugador2 = j2.id_usuario
      LEFT JOIN usuarios g ON pt.id_ganador = g.id_usuario
      WHERE pt.id_torneo = ?
    `;
    const params = [id];

    if (ronda) {
      query += ' AND pt.ronda = ?';
      params.push(ronda);
    }

    query += ' ORDER BY pt.ronda ASC, pt.fecha_partida ASC, pt.hora_inicio ASC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo partidas:', error);
    res.status(500).json({ error: 'Error al obtener partidas' });
  }
});

// POST /api/torneos-juegos-mesa - Crear un nuevo torneo
router.post('/', async (req, res) => {
  try {
    const { id_deporte, id_organizador, nombre_torneo, descripcion, fecha_inicio, fecha_fin, tipo_torneo, numero_rondas, premio, reglas_especificas } = req.body;

    if (!id_deporte || !id_organizador || !nombre_torneo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Deporte, organizador, nombre y fechas son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO torneos_juegos_mesa (id_deporte, id_organizador, nombre_torneo, descripcion, fecha_inicio, fecha_fin, tipo_torneo, numero_rondas, premio, reglas_especificas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_deporte, id_organizador, nombre_torneo, descripcion || null, fecha_inicio, fecha_fin, tipo_torneo || 'suizo', numero_rondas || null, premio || null, reglas_especificas || null]
    );

    res.status(201).json({
      message: 'Torneo creado exitosamente',
      id_torneo: result.insertId
    });
  } catch (error) {
    console.error('Error creando torneo:', error);
    res.status(500).json({ error: 'Error al crear torneo' });
  }
});

// POST /api/torneos-juegos-mesa/:id/inscribir - Inscribir participante
router.post('/:id/inscribir', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, id_equipo } = req.body;

    if (!id_usuario && !id_equipo) {
      return res.status(400).json({ error: 'Usuario o equipo es requerido' });
    }

    if (id_usuario && id_equipo) {
      return res.status(400).json({ error: 'Solo se puede inscribir usuario o equipo, no ambos' });
    }

    // Verificar que el torneo esté abierto
    const [torneo] = await db.query('SELECT estado_torneo FROM torneos_juegos_mesa WHERE id_torneo = ?', [id]);
    if (torneo.length === 0) {
      return res.status(404).json({ error: 'Torneo no encontrado' });
    }

    if (torneo[0].estado_torneo !== 'inscripcion_abierta') {
      return res.status(400).json({ error: 'El torneo no está abierto para inscripciones' });
    }

    const [result] = await db.query(
      'INSERT INTO torneo_participantes (id_torneo, id_usuario, id_equipo) VALUES (?, ?, ?)',
      [id, id_usuario || null, id_equipo || null]
    );

    // Actualizar número de participantes
    await db.query(
      'UPDATE torneos_juegos_mesa SET numero_participantes = numero_participantes + 1 WHERE id_torneo = ?',
      [id]
    );

    res.status(201).json({
      message: 'Participante inscrito exitosamente',
      id_participante: result.insertId
    });
  } catch (error) {
    console.error('Error inscribiendo participante:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El participante ya está inscrito en este torneo' });
    }
    res.status(500).json({ error: 'Error al inscribir participante' });
  }
});

// POST /api/torneos-juegos-mesa/:id/partidas - Programar una partida
router.post('/:id/partidas', async (req, res) => {
  try {
    const { id } = req.params;
    const { ronda, id_jugador1, id_jugador2, fecha_partida, hora_inicio, hora_fin, id_espacio_juego } = req.body;

    if (!ronda || !id_jugador1 || !id_jugador2 || !fecha_partida || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Ronda, jugadores, fecha y horas son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO partidas_torneo (id_torneo, ronda, id_jugador1, id_jugador2, fecha_partida, hora_inicio, hora_fin, id_espacio_juego) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, ronda, id_jugador1, id_jugador2, fecha_partida, hora_inicio, hora_fin, id_espacio_juego || null]
    );

    res.status(201).json({
      message: 'Partida programada exitosamente',
      id_partida: result.insertId
    });
  } catch (error) {
    console.error('Error programando partida:', error);
    res.status(500).json({ error: 'Error al programar partida' });
  }
});

// PUT /api/torneos-juegos-mesa/partidas/:id/resultado - Registrar resultado de partida
router.put('/partidas/:id/resultado', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_ganador, resultado_detalle, estado_partida } = req.body;

    if (!estado_partida) {
      return res.status(400).json({ error: 'Estado de partida es requerido' });
    }

    const [result] = await db.query(
      'UPDATE partidas_torneo SET id_ganador = ?, resultado_detalle = ?, estado_partida = ? WHERE id_partida = ?',
      [id_ganador || null, resultado_detalle ? JSON.stringify(resultado_detalle) : null, estado_partida, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Partida no encontrada' });
    }

    res.json({ message: 'Resultado registrado exitosamente' });
  } catch (error) {
    console.error('Error registrando resultado:', error);
    res.status(500).json({ error: 'Error al registrar resultado' });
  }
});

module.exports = router;
