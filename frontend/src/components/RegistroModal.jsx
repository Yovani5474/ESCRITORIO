import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const RegistroModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    id_estudiante: '',
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    contrasena_confirm: '',
    telefono: '',
    id_carrera: '',
    semestre: ''
  });
  const [carreras, setCarreras] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadCarreras();
  }, []);

  const loadCarreras = async () => {
    try {
      const response = await api.get('/carreras');
      setCarreras(response.data);
    } catch (err) {
      console.error('Error cargando carreras:', err);
    }
  };

  const validateEmail = (email) => {
    const senatiRegex = /^[a-zA-Z0-9]+@senati\.pe$/;
    return senatiRegex.test(email);
  };

  const validatePassword = (password) => {
    // Mínimo 6 caracteres
    return password.length >= 6;
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'id_estudiante':
        errors.id_estudiante = value.length < 5 ? 'ID debe tener al menos 5 caracteres' : '';
        break;
      case 'nombre':
        errors.nombre = value.length < 2 ? 'Nombre debe tener al menos 2 caracteres' : '';
        break;
      case 'apellido':
        errors.apellido = value.length < 2 ? 'Apellido debe tener al menos 2 caracteres' : '';
        break;
      case 'correo':
        errors.correo = !validateEmail(value) ? 'Solo correos @senati.pe' : '';
        break;
      case 'contrasena':
        errors.contrasena = !validatePassword(value) ? 'Mínimo 6 caracteres' : '';
        break;
      case 'contrasena_confirm':
        errors.contrasena_confirm = value !== formData.contrasena ? 'Las contraseñas no coinciden' : '';
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
    return !errors[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.id_estudiante || !formData.nombre || !formData.apellido) {
      setError('ID estudiante, nombre y apellido son requeridos');
      return;
    }

    if (!validateEmail(formData.correo)) {
      setError('Solo se permiten correos institucionales @senati.pe');
      return;
    }

    if (!validatePassword(formData.contrasena)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.contrasena !== formData.contrasena_confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/usuarios', {
        id_estudiante: formData.id_estudiante,
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        contrasena: formData.contrasena,
        telefono: formData.telefono || null,
        rol: 'participante',
        id_carrera: formData.id_carrera || null,
        semestre: formData.semestre || null
      });

      if (response.data) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content registro-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registro de Usuario</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-row">
            <div className="form-group">
              <label>ID de Estudiante:</label>
              <input
                type="text"
                name="id_estudiante"
                value={formData.id_estudiante}
                onChange={handleChange}
                placeholder="Ej: 2026001"
                required
                className={validationErrors.id_estudiante ? 'input-error' : ''}
              />
              {validationErrors.id_estudiante && (
                <span className="error-text">{validationErrors.id_estudiante}</span>
              )}
            </div>
            <div className="form-group">
              <label>Nombres:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Apellidos:</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tus apellidos"
                required
              />
            </div>
            <div className="form-group">
              <label>Correo Institucional:</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ej: 1234567@senati.pe"
                required
                pattern="[a-zA-Z0-9]+@senati\.pe"
                title="Solo correos @senati.pe"
              />
              <small className="form-hint">Formato: 1234567@senati.pe</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña:</label>
              <input
                type="password"
                name="contrasena_confirm"
                value={formData.contrasena_confirm}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                minLength="6"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Carrera:</label>
              <select
                name="id_carrera"
                value={formData.id_carrera}
                onChange={handleChange}
              >
                <option value="">Selecciona tu carrera</option>
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
                placeholder="Ej: IV"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Teléfono (opcional):</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 987654321"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <div className="login-hint">
            <p>¿Ya tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onClose(); window.dispatchEvent(new CustomEvent('openLogin')); }}>Inicia sesión</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroModal;
