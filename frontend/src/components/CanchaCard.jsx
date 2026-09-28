const CanchaCard = ({ cancha, onReservar, canEdit }) => {
  return (
    <div className="cancha-card">
      <div className="cancha-header">
        <h3 className="cancha-name">{cancha.nombre_cancha}</h3>
        <span className="cancha-deporte">{cancha.deporte}</span>
      </div>
      <div className="cancha-details">
        <p><strong>Superficie:</strong> {cancha.superficie || 'No especificado'}</p>
        <p><strong>Ubicación:</strong> {cancha.ubicacion || 'No especificado'}</p>
        <p><strong>Capacidad:</strong> {cancha.capacidad_jugadores || 'N/A'} jugadores</p>
      </div>
      <div className="cancha-footer">
        <span className={`cancha-status ${cancha.estado}`}>
          {cancha.estado === 'disponible' ? '✅ Disponible' : '⚠️ No disponible'}
        </span>
        {cancha.estado === 'disponible' && canEdit && (
          <button
            className="btn-reservar"
            onClick={() => onReservar(cancha)}
          >
            Reservar
          </button>
        )}
      </div>
    </div>
  );
};

export default CanchaCard;
