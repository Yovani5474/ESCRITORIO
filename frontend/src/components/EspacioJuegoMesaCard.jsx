const EspacioJuegoMesaCard = ({ espacio, onReservar }) => {
  return (
    <div className="espacio-card">
      <div className="espacio-header">
        <h3 className="espacio-name">{espacio.nombre_espacio}</h3>
        <span className="espacio-deporte">{espacio.deporte}</span>
      </div>
      <div className="espacio-details">
        <p><strong>Tipo:</strong> {espacio.tipo_espacio}</p>
        <p><strong>Mesas:</strong> {espacio.numero_mesas}</p>
        <p><strong>Tipo de mesa:</strong> {espacio.tipo_mesa || 'Genérico'}</p>
        <p><strong>Ubicación:</strong> {espacio.ubicacion || 'No especificado'}</p>
        <p><strong>Capacidad:</strong> {espacio.capacidad_jugadores || 'N/A'} jugadores</p>
        <p><strong>Iluminación:</strong> {espacio.iluminacion}</p>
        <p><strong>Climatizado:</strong> {espacio.climatizado ? '✅ Sí' : '❌ No'}</p>
      </div>
      <div className="espacio-footer">
        <span className="espacio-price">
          ${espacio.precio_por_hora}/hora
          {espacio.precio_por_mesa && ` + $${espacio.precio_por_mesa}/mesa`}
        </span>
        <span className={`espacio-status ${espacio.estado}`}>
          {espacio.estado === 'disponible' ? '✅ Disponible' : '⚠️ No disponible'}
        </span>
        {espacio.estado === 'disponible' && (
          <button
            className="btn-reservar"
            onClick={() => onReservar(espacio)}
          >
            Reservar
          </button>
        )}
      </div>
    </div>
  );
};

export default EspacioJuegoMesaCard;
