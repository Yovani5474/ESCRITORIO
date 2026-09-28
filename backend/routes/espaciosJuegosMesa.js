const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/espacios-juegos-mesa - Obtener espacios de juegos de mesa
router.get('/', async (req, res) => {
  try {
    const { deporte_id, estado } = req.query;

    let query = `
      SELECT e.id_espacio, e.nombre_espacio, e.tipo_espacio, e.numero_mesas,
             e.tipo_mesa, e.precio_por_hora, e.precio_por_mesa,
             e.estado, e.ubicacion, e.capacidad_jugadores,
             e.iluminacion, e.climatizado,
             d.nombre as deporte, d.icono_url,
             u.nombre as dueno_nombre, u.apellido as dueno_apellido
      FROM espacios_juegos_mesa e
      JOIN deportes d ON e.id_deporte = d.id_deporte
      JOIN usuarios u ON e.id_dueno = u.id_usuario
    `;
    const params = [];

    if (deporte_id) {
      query += ' WHERE e.id_deporte = ?';
      params.push(deporte_id);
    }

    if (estado) {
      query += deporte_id ? ' AND e.estado = ?' : ' WHERE e.estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY e.nombre_espacio';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo espacios de juegos de mesa:', error);
    res.status(500).json({ error: 'Error al obtener espacios de juegos de mesa' });
  }
});

// GET /api/espacios-juegos-mesa/:id - Obtener un espacio específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT e.*, d.nombre as deporte, d.icono_url,
              u.nombre as dueno_nombre, u.apellido as dueno_apellido
       FROM espacios_juegos_mesa e
       JOIN deportes d ON e.id_deporte = d.id_deporte
       JOIN usuarios u ON e.id_dueno = u.id_usuario
       WHERE e.id_espacio = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo espacio:', error);
    res.status(500).json({ error: 'Error al obtener espacio' });
  }
});

// GET /api/espacios-juegos-mesa/:id/disponibilidad - Verificar disponibilidad
router.get('/:id/disponibilidad', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin } = req.query;

    if (!fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Fecha, hora inicio y hora fin son requeridos' });
    }

    // Obtener información del espacio
    const [espacio] = await db.query(
      'SELECT numero_mesas FROM espacios_juegos_mesa WHERE id_espacio = ?',
      [id]
    );

    if (espacio.length === 0) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }

    // Verificar reservas en ese horario
    const [reservas] = await db.query(
      `SELECT id_reserva, numero_mesas_reservadas
       FROM reservas
       WHERE id_espacio_juego = ?
       AND fecha_reserva = ?
       AND estado_reserva != 'cancelada'
       AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))`,
      [id, fecha, hora_inicio, hora_inicio, hora_fin, hora_fin, hora_inicio, hora_fin]
    );

    const mesasReservadas = reservas.reduce((total, r) => total + r.numero_mesas_reservadas, 0);
    const mesasDisponibles = espacio[0].numero_mesas - mesasReservadas;

    res.json({
      id_espacio: parseInt(id),
      disponible: mesasDisponibles > 0,
      mesas_disponibles: mesasDisponibles,
      numero_mesas_total: espacio[0].numero_mesas,
      reservas_solapadas: reservas
    });
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad' });
  }
});

// POST /api/espacios-juegos-mesa - Crear un nuevo espacio
router.post('/', async (req, res) => {
  try {
    const { id_deporte, id_dueno, nombre_espacio, tipo_espacio, numero_mesas, tipo_mesa, precio_por_hora, precio_por_mesa, estado, ubicacion, capacidad_jugadores, iluminacion, climatizado } = req.body;

    if (!id_deporte || !id_dueno || !nombre_espacio || !numero_mesas || !precio_por_hora) {
      return res.status(400).json({ error: 'Deporte, dueño, nombre, número de mesas y precio son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO espacios_juegos_mesa (id_deporte, id_dueno, nombre_espacio, tipo_espacio, numero_mesas, tipo_mesa, precio_por_hora, precio_por_mesa, estado, ubicacion, capacidad_jugadores, iluminacion, climatizado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_deporte, id_dueno, nombre_espacio, tipo_espacio || 'sala_multiple', numero_mesas, tipo_mesa || null, precio_por_hora, precio_por_mesa || null, estado || 'disponible', ubicacion || null, capacidad_jugadores || null, iluminacion || 'artificial', climatizado || false]
    );

    res.status(201).json({
      message: 'Espacio creado exitosamente',
      id_espacio: result.insertId
    });
  } catch (error) {
    console.error('Error creando espacio:', error);
    res.status(500).json({ error: 'Error al crear espacio' });
  }
});

// PUT /api/espacios-juegos-mesa/:id - Actualizar un espacio
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_espacio, tipo_espacio, numero_mesas, tipo_mesa, precio_por_hora, precio_por_mesa, estado, ubicacion, capacidad_jugadores, iluminacion, climatizado } = req.body;

    const [result] = await db.query(
      'UPDATE espacios_juegos_mesa SET nombre_espacio = ?, tipo_espacio = ?, numero_mesas = ?, tipo_mesa = ?, precio_por_hora = ?, precio_por_mesa = ?, estado = ?, ubicacion = ?, capacidad_jugadores = ?, iluminacion = ?, climatizado = ? WHERE id_espacio = ?',
      [nombre_espacio, tipo_espacio, numero_mesas, tipo_mesa, precio_por_hora, precio_por_mesa, estado, ubicacion, capacidad_jugadores, iluminacion, climatizado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }

    res.json({ message: 'Espacio actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando espacio:', error);
    res.status(500).json({ error: 'Error al actualizar espacio' });
  }
});

// DELETE /api/espacios-juegos-mesa/:id - Eliminar un espacio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM espacios_juegos_mesa WHERE id_espacio = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }

    res.json({ message: 'Espacio eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando espacio:', error);
    res.status(500).json({ error: 'Error al eliminar espacio' });
  }
});

module.exports = router;
