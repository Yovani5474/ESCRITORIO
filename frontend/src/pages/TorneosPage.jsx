import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TorneosPage = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTorneos();
  }, []);

  const loadTorneos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/torneos-juegos-mesa');
      setTorneos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar torneos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInscribirse = async (torneoId) => {
    try {
      await api.post(`/torneos-juegos-mesa/${torneoId}/inscribir`, {
        id_usuario: 1 // En un sistema real, esto sería el ID del usuario actual
      });
      alert('Inscripción exitosa');
      loadTorneos();
    } catch (err) {
      alert('Error al inscribirse');
      console.error(err);
    }
  };

  const handleVerDetalles = (torneoId) => {
    navigate(`/torneos/${torneoId}`);
  };

  return (
    <div className="torneos-page">
      <div className="container">
        <h1 className="page-title">Torneos de Juegos de Mesa</h1>

        {loading && <div className="loading">Cargando torneos...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {torneos.length === 0 ? (
              <div className="empty-state">
                <p>No hay torneos disponibles</p>
              </div>
            ) : (
              <div className="torneos-grid">
                {torneos.map((torneo) => (
                  <div key={torneo.id_torneo} className="torneo-card">
                    <div className="torneo-header">
                      <h3>{torneo.nombre_torneo}</h3>
                      <span className={`torneo-status ${torneo.estado_torneo}`}>
                        {torneo.estado_torneo}
                      </span>
                    </div>
                    <div className="torneo-details">
                      <p><strong>Deporte:</strong> {torneo.deporte}</p>
                      <p><strong>Organizador:</strong> {torneo.organizador_nombre} {torneo.organizador_apellido}</p>
                      <p><strong>Fecha:</strong> {torneo.fecha_inicio} - {torneo.fecha_fin}</p>
                      <p><strong>Tipo:</strong> {torneo.tipo_torneo}</p>
                      <p><strong>Participantes:</strong> {torneo.numero_participantes}</p>
                      {torneo.numero_rondas && (
                        <p><strong>Rondas:</strong> {torneo.numero_rondas}</p>
                      )}
                      {torneo.premio && (
                        <p><strong>Premio:</strong> {torneo.premio}</p>
                      )}
                      {torneo.descripcion && (
                        <p><strong>Descripción:</strong> {torneo.descripcion}</p>
                      )}
                    </div>
                    <div className="torneo-actions">
                      <button
                        className="btn-detalles"
                        onClick={() => handleVerDetalles(torneo.id_torneo)}
                      >
                        Ver Detalles
                      </button>
                      {torneo.estado_torneo === 'inscripcion_abierta' && (
                        <button
                          className="btn-inscribir"
                          onClick={() => handleInscribirse(torneo.id_torneo)}
                        >
                          Inscribirse
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TorneosPage;
