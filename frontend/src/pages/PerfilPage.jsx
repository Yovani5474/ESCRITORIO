import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PerfilPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    semestre: ''
  });
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono || '',
      semestre: user.semestre || ''
    });

    loadCarreras();
    loadUserStats();
  }, [user, navigate]);

  const loadCarreras = async () => {
    try {
      const response = await api.get('/carreras');
      setCarreras(response.data);
    } catch (err) {
      console.error('Error cargando carreras:', err);
    }
  };

  const loadUserStats = async () => {
    try {
      // Aquí podrías cargar estadísticas del usuario
      // Por ahora, datos de ejemplo
      setUserStats({
        partidos_jugados: 0,
        victorias: 0,
        derrotas: 0,
        campeonatos_participados: 0
      });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/usuarios/${user.id_usuario}`, formData);
      setMessage('Perfil actualizado exitosamente');
      setEditing(false);
      
      // Actualizar usuario en el contexto
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage('Error al actualizar perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono || '',
      semestre: user.semestre || ''
    });
    setEditing(false);
    setMessage('');
  };

  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="perfil-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Mi Perfil</h1>
          <button className="btn-back" onClick={() => navigate('/')}>
            ← Volver al Inicio
          </button>
        </div>

        <div className="perfil-container">
          <div className="perfil-card">
            <div className="perfil-header">
              <div className="perfil-avatar">
                {user.foto_url ? (
                  <img src={user.foto_url} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                  </div>
                )}
              </div>
              <div className="perfil-info">
                <h2 className="perfil-name">{user.nombre} {user.apellido}</h2>
                <p className="perfil-email">{user.correo}</p>
                <span className={`user-role-badge ${user.rol}`}>
                  {user.rol}
                </span>
              </div>
              <button
                className="btn-edit"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancelar' : '✏️ Editar'}
              </button>
            </div>

            {editing ? (
              <form className="perfil-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombres:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellidos:</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ID Estudiante:</label>
                    <input
                      type="text"
                      value={user.id_estudiante}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Carrera:</label>
                    <select
                      name="id_carrera"
                      value={user.id_carrera || ''}
                      disabled
                    >
                      <option value="">Sin carrera</option>
                      {carreras.map(carrera => (
                        <option key={carrera.id_carrera} value={carrera.id_carrera}>
                          {carrera.nombre_carrera}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Semestre:</label>
                    <input
                      type="text"
                      name="semestre"
                      value={formData.semestre}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button type="button" className="btn-cancelar" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="perfil-details">
                <div className="detail-item">
                  <span className="detail-label">ID Estudiante:</span>
                  <span className="detail-value">{user.id_estudiante}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Carrera:</span>
                  <span className="detail-value">{user.nombre_carrera || 'Sin carrera'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Semestre:</span>
                  <span className="detail-value">{user.semestre || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{user.telefono || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha de Registro:</span>
                  <span className="detail-value">
                    {new Date(user.fecha_registro).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </div>

          {userStats && (
            <div className="stats-card">
              <h3 className="stats-title">Mis Estadísticas</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{userStats.partidos_jugados}</span>
                  <span className="stat-label">Partidos Jugados</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userStats.victorias}</span>
                  <span className="stat-label">Victorias</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userStats.derrotas}</span>
                  <span className="stat-label">Derrotas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userStats.campeonatos_participados}</span>
                  <span className="stat-label">Campeonatos</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
