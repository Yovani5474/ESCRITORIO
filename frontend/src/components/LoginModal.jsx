import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const LoginModal = ({ onClose }) => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const senatiRegex = /^[a-zA-Z0-9]+@senati\.pe$/;
    return senatiRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(correo)) {
      setError('Solo se permiten correos institucionales @senati.pe');
      return;
    }

    if (!contrasena) {
      setError('La contraseña es requerida');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/usuarios/login', {
        correo,
        contrasena
      });

      if (response.data.usuario) {
        login(response.data.usuario);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Iniciar Sesión</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Correo Institucional SENATI:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ej: 1234567@senati.pe"
              required
              pattern="[a-zA-Z0-9]+@senati\.pe"
              title="Solo correos @senati.pe"
            />
            <small className="form-hint">Formato: 1234567@senati.pe</small>
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
          <div className="login-hint">
            <p><strong>Admin:</strong> admin123@senati.pe / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
