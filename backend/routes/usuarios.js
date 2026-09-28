const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// GET /api/usuarios - Obtener usuarios (participantes)
router.get('/', async (req, res) => {
  try {
    const { carrera_id, rol, activo } = req.query;

    let query = `
      SELECT u.id_usuario, u.id_estudiante, u.nombre, u.apellido, u.correo, u.telefono,
             u.rol, u.id_carrera, u.semestre, u.fecha_registro, u.foto_url, u.activo,
             c.nombre_carrera, c.codigo as codigo_carrera
      FROM usuarios u
      LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
      WHERE 1=1
    `;
    const params = [];

    if (carrera_id) {
      query += ' AND u.id_carrera = ?';
      params.push(carrera_id);
    }

    if (rol) {
      query += ' AND u.rol = ?';
      params.push(rol);
    }

    if (activo !== undefined) {
      query += ' AND u.activo = ?';
      params.push(activo === 'true');
    }

    query += ' ORDER BY u.nombre, u.apellido';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /api/usuarios/:id - Obtener un usuario específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT u.*, c.nombre_carrera, c.codigo as codigo_carrera
       FROM usuarios u
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
       WHERE u.id_usuario = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST /api/usuarios - Crear un nuevo usuario (participante)
router.post('/', async (req, res) => {
  try {
    const { id_estudiante, nombre, apellido, correo, contrasena, telefono, rol, id_carrera, semestre, foto_url } = req.body;

    if (!id_estudiante || !nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ error: 'ID estudiante, nombre, apellido, correo y contraseña son requeridos' });
    }

    // Validar correo institucional
    if (!correo.endsWith('@senati.pe')) {
      return res.status(400).json({ error: 'Solo se permiten correos institucionales @senati.pe' });
    }

    // Hashear contraseña
    const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

    const [result] = await db.query(
      'INSERT INTO usuarios (id_estudiante, nombre, apellido, correo, contrasena_hash, telefono, rol, id_carrera, semestre, foto_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_estudiante, nombre, apellido, correo, contrasena_hash, telefono || null, rol || 'participante', id_carrera || null, semestre || null, foto_url || null]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      id_usuario: result.insertId
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El ID de estudiante o correo ya existe' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /api/usuarios/:id - Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono, rol, id_carrera, semestre, foto_url, activo } = req.body;

    const [result] = await db.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, telefono = ?, rol = ?, id_carrera = ?, semestre = ?, foto_url = ?, activo = ? WHERE id_usuario = ?',
      [nombre, apellido, correo, telefono, rol, id_carrera, semestre, foto_url, activo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE /api/usuarios/:id - Eliminar un usuario (solo admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM usuarios WHERE id_usuario = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// POST /api/usuarios/login - Iniciar sesión con correo y contraseña
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    // Validar correo institucional
    if (!correo.endsWith('@senati.pe')) {
      return res.status(400).json({ error: 'Solo se permiten correos institucionales @senati.pe' });
    }

    // Buscar usuario por correo
    const [rows] = await db.query(
      `SELECT u.*, c.nombre_carrera, c.codigo as codigo_carrera
       FROM usuarios u
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
       WHERE u.correo = ? AND u.activo = TRUE`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = rows[0];

    // Verificar contraseña si existe hash
    if (usuario.contrasena_hash) {
      const match = await bcrypt.compare(contrasena, usuario.contrasena_hash);
      if (!match) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
    }

    // Retornar usuario sin el hash de contraseña
    const { contrasena_hash, ...usuarioSinContrasena } = usuario;

    res.json({
      message: 'Login exitoso',
      usuario: usuarioSinContrasena
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// POST /api/usuarios/admin-inicial - Crear usuario admin inicial (solo para setup)
router.post('/admin-inicial', async (req, res) => {
  try {
    const adminData = {
      id_estudiante: 'ADMIN123',
      nombre: 'Super',
      apellido: 'Admin',
      correo: 'admin123@senati.pe',
      contrasena: 'admin123', // Contraseña por defecto
      rol: 'administrador',
      id_carrera: null,
      semestre: null,
      foto_url: null
    };

    // Hashear contraseña
    const contrasena_hash = await bcrypt.hash(adminData.contrasena, saltRounds);

    // Intentar actualizar si existe, o crear si no existe
    const [existing] = await db.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [adminData.correo]);

    if (existing.length > 0) {
      // Actualizar contraseña del admin existente
      await db.query(
        'UPDATE usuarios SET contrasena_hash = ? WHERE correo = ?',
        [contrasena_hash, adminData.correo]
      );
      res.json({
        message: 'Contraseña de admin actualizada exitosamente',
        usuario: adminData
      });
    } else {
      // Crear nuevo admin
      const [result] = await db.query(
        'INSERT INTO usuarios (id_estudiante, nombre, apellido, correo, contrasena_hash, rol, id_carrera, semestre, foto_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [adminData.id_estudiante, adminData.nombre, adminData.apellido, adminData.correo, contrasena_hash, adminData.rol, adminData.id_carrera, adminData.semestre, adminData.foto_url]
      );
      res.status(201).json({
        message: 'Usuario admin creado exitosamente',
        usuario: adminData,
        id_usuario: result.insertId
      });
    }
  } catch (error) {
    console.error('Error creando admin inicial:', error);
    res.status(500).json({ error: 'Error al crear usuario admin' });
  }
});

// POST /api/usuarios/setup-passwords - Ejecutar script de contraseñas (setup)
router.post('/setup-passwords', async (req, res) => {
  try {
    // Agregar columna contrasena_hash si no existe
    await db.query(`
      ALTER TABLE usuarios 
      ADD COLUMN contrasena_hash VARCHAR(255) AFTER correo
    `);

    // Actualizar usuario admin con contraseña por defecto
    const contrasena_hash = await bcrypt.hash('admin123', saltRounds);
    await db.query(
      'UPDATE usuarios SET contrasena_hash = ? WHERE correo = ?',
      [contrasena_hash, 'admin123@senati.pe']
    );

    res.json({ message: 'Sistema de contraseñas configurado exitosamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      // La columna ya existe, solo actualizar la contraseña del admin
      try {
        const contrasena_hash = await bcrypt.hash('admin123', saltRounds);
        await db.query(
          'UPDATE usuarios SET contrasena_hash = ? WHERE correo = ?',
          [contrasena_hash, 'admin123@senati.pe']
        );
        res.json({ message: 'Contraseña de admin actualizada (columna ya existía)' });
      } catch (updateError) {
        console.error('Error actualizando contraseña:', updateError);
        res.status(500).json({ error: 'Error al actualizar contraseña' });
      }
    } else {
      console.error('Error en setup:', error);
      res.status(500).json({ error: 'Error en setup de contraseñas' });
    }
  }
});

module.exports = router;
