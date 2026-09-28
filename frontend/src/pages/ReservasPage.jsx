import { useState, useEffect } from 'react';
import reservasService from '../services/reservasService';

const ReservasPage = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      // En un sistema real, aquí filtraríamos por el usuario actual
      const data = await reservasService.getAll({ estado: 'confirmada' });
      setReservas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      try {
        await reservasService.cancel(id);
        loadReservas();
      } catch (err) {
        setError('Error al cancelar reserva');
        console.error(err);
      }
    }
  };

  return (
    <div className="reservas-page">
      <div className="container">
        <h1 className="page-title">Mis Reservas</h1>

        {loading && <div className="loading">Cargando reservas...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {reservas.length === 0 ? (
              <div className="empty-state">
                <p>No tienes reservas activas</p>
              </div>
            ) : (
              <div className="reservas-list">
                {reservas.map((reserva) => (
                  <div key={reserva.id_reserva} className="reserva-item">
                    <div className="reserva-header">
                      <h3>{reserva.nombre_espacio}</h3>
                      <span className={`reserva-status ${reserva.estado_reserva}`}>
                        {reserva.estado_reserva}
                      </span>
                    </div>
                    <div className="reserva-details">
                      <p><strong>Deporte:</strong> {reserva.nombre_deporte}</p>
                      <p><strong>Fecha:</strong> {reserva.fecha_reserva}</p>
                      <p><strong>Horario:</strong> {reserva.hora_inicio} - {reserva.hora_fin}</p>
                      <p><strong>Monto:</strong> ${reserva.monto_total}</p>
                      {reserva.nombre_equipo && (
                        <p><strong>Equipo:</strong> {reserva.nombre_equipo}</p>
                      )}
                      {reserva.arbitro_nombre && (
                        <p><strong>Árbitro:</strong> {reserva.arbitro_nombre} {reserva.arbitro_apellido}</p>
                      )}
                    </div>
                    <div className="reserva-actions">
                      <button
                        className="btn-cancelar"
                        onClick={() => handleCancelar(reserva.id_reserva)}
                      >
                        Cancelar
                      </button>
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

export default ReservasPage;
