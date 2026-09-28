const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/campeonatos - Obtener campeonatos
router.get('/', async (req, res) => {
  try {
    const { deporte_id, estado } = req.query;

    let query = `
      SELECT c.*, d.nombre as deporte, d.icono_url,
             u.nombre as organizador_nombre, u.apellido as organizador_apellido
      FROM campeonatos c
      JOIN deportes d ON c.id_deporte = d.id_deporte
      LEFT JOIN usuarios u ON c.id_organizador = u.id_usuario
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

    query += ' ORDER BY c.fecha_inicio DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo campeonatos:', error);
    res.status(500).json({ error: 'Error al obtener campeonatos' });
  }
});

// GET /api/campeonatos/:id - Obtener un campeonato específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT c.*, d.nombre as deporte, d.icono_url,
              u.nombre as organizador_nombre, u.apellido as organizador_apellido
       FROM campeonatos c
       JOIN deportes d ON c.id_deporte = d.id_deporte
       LEFT JOIN usuarios u ON c.id_organizador = u.id_usuario
       WHERE c.id_campeonato = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Campeonato no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo campeonato:', error);
    res.status(500).json({ error: 'Error al obtener campeonato' });
  }
});

// GET /api/campeonatos/:id/bracket - Obtener bracket/llaves del campeonato
router.get('/:id/bracket', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener equipos participantes con sus semillas
    const [equipos] = await db.query(
      `SELECT ce.id_equipo, e.nombre_equipo, e.escudo_url, e.color_primario, e.color_secundario,
              ce.semilla, ce.estado_participacion
       FROM campeonato_equipos ce
       JOIN equipos e ON ce.id_equipo = e.id_equipo
       WHERE ce.id_campeonato = ?
       ORDER BY ce.semilla`,
      [id]
    );

    // Obtener partidos organizados por ronda
    const [partidos] = await db.query(
      `SELECT p.*, e1.nombre_equipo as equipo_local_nombre, e1.escudo_url as equipo_local_escudo,
              e2.nombre_equipo as equipo_visitante_nombre, e2.escudo_url as equipo_visitante_escudo,
              eg.nombre_equipo as ganador_nombre, c.nombre_cancha
       FROM partidos p
       JOIN equipos e1 ON p.id_equipo_local = e1.id_equipo
       JOIN equipos e2 ON p.id_equipo_visitante = e2.id_equipo
       LEFT JOIN equipos eg ON p.id_ganador = eg.id_equipo
       LEFT JOIN canchas c ON p.id_cancha = c.id_cancha
       WHERE p.id_campeonato = ?
       ORDER BY p.ronda, p.fecha_partido`,
      [id]
    );

    // Obtener el número máximo de rondas
    const [maxRonda] = await db.query(
      'SELECT MAX(ronda) as max_ronda FROM partidos WHERE id_campeonato = ?',
      [id]
    );

    res.json({
      equipos,
      partidos,
      max_ronda: maxRonda[0]?.max_ronda || 0
    });
  } catch (error) {
    console.error('Error obteniendo bracket:', error);
    res.status(500).json({ error: 'Error al obtener bracket' });
  }
});

// POST /api/campeonatos - Crear un nuevo campeonato
router.post('/', async (req, res) => {
  try {
    const { nombre_campeonato, descripcion, id_deporte, id_organizador, fecha_inicio, fecha_fin, tipo_sistema, color_tema, color_fondo } = req.body;

    if (!nombre_campeonato || !id_deporte || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Nombre, deporte y fechas son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO campeonatos (nombre_campeonato, descripcion, id_deporte, id_organizador, fecha_inicio, fecha_fin, tipo_sistema, color_tema, color_fondo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre_campeonato, descripcion || null, id_deporte, id_organizador || null, fecha_inicio, fecha_fin, tipo_sistema || 'eliminacion_directa', color_tema || '#2c3e50', color_fondo || '#f5f5f5']
    );

    res.status(201).json({
      message: 'Campeonato creado exitosamente',
      id_campeonato: result.insertId
    });
  } catch (error) {
    console.error('Error creando campeonato:', error);
    res.status(500).json({ error: 'Error al crear campeonato' });
  }
});

// PUT /api/campeonatos/:id - Actualizar un campeonato
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_campeonato, descripcion, estado, color_tema, color_fondo } = req.body;

    const [result] = await db.query(
      'UPDATE campeonatos SET nombre_campeonato = ?, descripcion = ?, estado = ?, color_tema = ?, color_fondo = ? WHERE id_campeonato = ?',
      [nombre_campeonato, descripcion, estado, color_tema, color_fondo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Campeonato no encontrado' });
    }

    res.json({ message: 'Campeonato actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando campeonato:', error);
    res.status(500).json({ error: 'Error al actualizar campeonato' });
  }
});

// POST /api/campeonatos/:id/equipos - Inscribir equipo en campeonato
router.post('/:id/equipos', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_equipo, semilla } = req.body;

    if (!id_equipo) {
      return res.status(400).json({ error: 'Equipo es requerido' });
    }

    const [result] = await db.query(
      'INSERT INTO campeonato_equipos (id_campeonato, id_equipo, semilla) VALUES (?, ?, ?)',
      [id, id_equipo, semilla || null]
    );

    // Actualizar número de equipos
    await db.query(
      'UPDATE campeonatos SET numero_equipos = numero_equipos + 1 WHERE id_campeonato = ?',
      [id]
    );

    res.status(201).json({
      message: 'Equipo inscrito exitosamente',
      id_participante: result.insertId
    });
  } catch (error) {
    console.error('Error inscribiendo equipo:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El equipo ya está inscrito en este campeonato' });
    }
    res.status(500).json({ error: 'Error al inscribir equipo' });
  }
});

// POST /api/campeonatos/recargar-datos - Recargar datos de ejemplo (solo para desarrollo)
router.post('/recargar-datos', async (req, res) => {
  try {
    // Limpiar datos existentes
    await db.query('DELETE FROM campeonato_equipos');
    await db.query('DELETE FROM partidos');
    await db.query('DELETE FROM campeonatos');
    await db.query('DELETE FROM equipos');

    // Insertar equipos (24 equipos organizados por carreras)
    const equiposData = [
      // AMOD
      ['AMOD III', '/escudos/amod.png', '#e74c3c', '#c0392b', true],
      ['AMOD IV', '/escudos/amod.png', '#e74c3c', '#c0392b', true],
      ['AMOD V', '/escudos/amod.png', '#e74c3c', '#c0392b', true],
      ['AMOD 601', '/escudos/amod.png', '#e74c3c', '#c0392b', true],
      ['AMOD 602', '/escudos/amod.png', '#e74c3c', '#c0392b', true],
      // EIND
      ['EIND 201', '/escudos/eind.png', '#3498db', '#2980b9', true],
      ['EIND 202', '/escudos/eind.png', '#3498db', '#2980b9', true],
      ['EIND III', '/escudos/eind.png', '#3498db', '#2980b9', true],
      ['EIND IV', '/escudos/eind.png', '#3498db', '#2980b9', true],
      ['EIND 601', '/escudos/eind.png', '#3498db', '#2980b9', true],
      ['EIND 602', '/escudos/eind.png', '#3498db', '#2980b9', true],
      // AMTD
      ['AMTD 201', '/escudos/amtd.png', '#f39c12', '#e67e22', true],
      ['AMTD 202', '/escudos/amtd.png', '#f39c12', '#e67e22', true],
      ['AMTD III', '/escudos/amtd.png', '#f39c12', '#e67e22', true],
      ['AMTD IV', '/escudos/amtd.png', '#f39c12', '#e67e22', true],
      // NAED
      ['NAED II', '/escudos/naed.png', '#9b59b6', '#8e44ad', true],
      ['NAED III', '/escudos/naed.png', '#9b59b6', '#8e44ad', true],
      ['NAED IV', '/escudos/naed.png', '#9b59b6', '#8e44ad', true],
      ['NAED V', '/escudos/naed.png', '#9b59b6', '#8e44ad', true],
      ['NAED VI', '/escudos/naed.png', '#9b59b6', '#8e44ad', true],
      // PIAD
      ['PIAD II', '/escudos/piad.png', '#1abc9c', '#16a085', true],
      ['PIAD IV', '/escudos/piad.png', '#1abc9c', '#16a085', true],
      ['PIAD VI', '/escudos/piad.png', '#1abc9c', '#16a085', true],
      // EEGG
      ['EE66', '/escudos/eegg.png', '#34495e', '#2c3e50', true]
    ];

    for (const equipo of equiposData) {
      await db.query(
        'INSERT INTO equipos (nombre_equipo, escudo_url, color_primario, color_secundario, activo) VALUES (?, ?, ?, ?, ?)',
        equipo
      );
    }

    // Insertar campeonato de futsal
    const [campeonatoResult] = await db.query(
      `INSERT INTO campeonatos (nombre_campeonato, descripcion, id_deporte, id_organizador, fecha_inicio, fecha_fin, tipo_sistema, estado, color_tema, color_fondo, numero_equipos) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Campeonato de Futsal SENATI 2026', 'Torneo de futsal entre carreras del instituto - 24 equipos', 2, 9, '2026-09-25', '2026-09-26', 'eliminacion_directa', 'en_curso', '#e74c3c', '#f5f5f5', 24]
    );

    const campeonatoId = campeonatoResult.insertId;

    // Insertar equipos en el campeonato (todos los 24 equipos)
    const [equiposInsertados] = await db.query('SELECT id_equipo FROM equipos ORDER BY id_equipo');
    const equipoIds = equiposInsertados.map(e => e.id_equipo);

    for (let i = 0; i < equipoIds.length; i++) {
      await db.query(
        'INSERT INTO campeonato_equipos (id_campeonato, id_equipo, semilla, estado_participacion) VALUES (?, ?, ?, ?)',
        [campeonatoId, equipoIds[i], i + 1, 'inscrito']
      );
    }

    res.json({
      message: 'Datos recargados exitosamente',
      campeonato_id: campeonatoId,
      equipos_creados: equiposData.length
    });
  } catch (error) {
    console.error('Error recargando datos:', error);
    res.status(500).json({ error: 'Error al recargar datos' });
  }
});

module.exports = router;
