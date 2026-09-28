import React, { useState } from 'react';
import { usuariosService } from '../services/usuariosService';
import { carrerasService } from '../services/carrerasService';

const FormularioParticipante = ({ onRegistroExitoso }) => {
  const [formData, setFormData] = useState({
    id_estudiante: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    id_carrera: '',
    semestre: '',
    rol: 'participante'
  });

  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadCarreras();
  }, []);

  const loadCarreras = async () => {
    try {
      const data = await carrerasService.getAll();
      setCarreras(data);
    } catch (err) {
      console.error('Error cargando carreras:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldValue = name === 'id_estudiante'
      ? value.replace(/\D/g, '').slice(0, 7)
      : value;
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await usuariosService.create(formData);
      setLoading(false);
      alert('Participante registrado exitosamente');
      setFormData({
        id_estudiante: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        id_carrera: '',
        semestre: '',
        rol: 'participante'
      });
      if (onRegistroExitoso) onRegistroExitoso();
    } catch (err) {
      setLoading(false);
      setError('Error al registrar participante. El ID de estudiante o correo ya existe.');
    }
  };

  return (
    <div className="formulario-participante">
      <h2 className="form-title">Registro de Participante</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="participant-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="id_estudiante">ID Estudiante (7 dígitos) *</label>
            <input
              type="text"
              id="id_estudiante"
              name="id_estudiante"
              value={formData.id_estudiante}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={7}
              pattern="[0-9]{7}"
              title="Ingresa exactamente 7 dígitos"
              required
              placeholder="Ej: 1234567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="semestre">Semestre</label>
            <input
              type="text"
              id="semestre"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              placeholder="Ej: V, VI, 2026-I"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombres *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Nombres completos"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellidos *</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Apellidos completos"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="1234567@senati.pe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+51 987 654 321"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="id_carrera">Carrera</label>
          <select
            id="id_carrera"
            name="id_carrera"
            value={formData.id_carrera}
            onChange={handleChange}
          >
            <option value="">Seleccionar carrera</option>
            {carreras.map(carrera => (
              <option key={carrera.id_carrera} value={carrera.id_carrera}>
                {carrera.nombre_carrera}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Participante'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioParticipante;
