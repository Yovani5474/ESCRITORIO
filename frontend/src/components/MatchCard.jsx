import React from 'react';

const MatchCard = ({ partido, onClick, compact = false }) => {
  const getTeamInitials = (teamName) => {
    const words = teamName.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return teamName.substring(0, 2).toUpperCase();
  };

  const getTeamColor = (teamName) => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
      '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
    ];
    const hash = teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'en_curso':
        return { text: '🔴 EN VIVO', color: '#e74c3c', bg: '#fee' };
      case 'finalizado':
        return { text: '✅ FINALIZADO', color: '#27ae60', bg: '#efe' };
      case 'programado':
        return { text: '⏰ PENDIENTE', color: '#95a5a6', bg: '#f5f5f5' };
      case 'suspendido':
        return { text: '⚠️ SUSPENDIDO', color: '#f39c12', bg: '#fef9e7' };
      default:
        return { text: '❓ DESCONOCIDO', color: '#7f8c8d', bg: '#f8f9fa' };
    }
  };

  const statusBadge = getStatusBadge(partido.estado_partido);

  if (compact) {
    return (
      <div 
        className={`match-card-compact ${partido.estado_partido}`}
        onClick={() => onClick && onClick(partido)}
      >
        <div className="match-compact-header">
          <span className="match-compact-status" style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}>
            {statusBadge.text}
          </span>
          <span className="match-compact-time">
            {partido.hora_inicio || 'Pendiente'}
          </span>
        </div>
        <div className="match-compact-teams">
          <div className={`match-compact-team ${partido.id_ganador === partido.id_equipo_local ? 'winner' : ''}`}>
            <div className="team-compact-avatar" style={{ backgroundColor: getTeamColor(partido.equipo_local_nombre) }}>
              {partido.equipo_local_escudo ? (
                <img src={partido.equipo_local_escudo} alt="" className="team-logo-img-compact" />
              ) : (
                <span className="team-initials-compact">{getTeamInitials(partido.equipo_local_nombre)}</span>
              )}
            </div>
            <span className="team-compact-name">{partido.equipo_local_nombre}</span>
            <span className="team-compact-score">{partido.resultado_local}</span>
          </div>
          <div className="match-compact-vs">-</div>
          <div className={`match-compact-team ${partido.id_ganador === partido.id_equipo_visitante ? 'winner' : ''}`}>
            <div className="team-compact-avatar" style={{ backgroundColor: getTeamColor(partido.equipo_visitante_nombre) }}>
              {partido.equipo_visitante_escudo ? (
                <img src={partido.equipo_visitante_escudo} alt="" className="team-logo-img-compact" />
              ) : (
                <span className="team-initials-compact">{getTeamInitials(partido.equipo_visitante_nombre)}</span>
              )}
            </div>
            <span className="team-compact-name">{partido.equipo_visitante_nombre}</span>
            <span className="team-compact-score">{partido.resultado_visitante}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`match-card-full ${partido.estado_partido}`}
      onClick={() => onClick && onClick(partido)}
    >
      <div className="match-full-header">
        <div className="match-full-meta">
          <span className="match-full-round">Ronda {partido.ronda}</span>
          <span className="match-full-court">
            🏟️ {partido.nombre_cancha || `Cancha ${partido.id_cancha}`}
          </span>
        </div>
        <span 
          className="match-full-status"
          style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}
        >
          {statusBadge.text}
        </span>
      </div>

      <div className="match-full-teams">
        <div className={`match-full-team ${partido.id_ganador === partido.id_equipo_local ? 'winner' : ''}`}>
          <div className="team-full-avatar" style={{ backgroundColor: getTeamColor(partido.equipo_local_nombre) }}>
            {partido.equipo_local_escudo ? (
              <img src={partido.equipo_local_escudo} alt="" className="team-logo-img-full" />
            ) : (
              <span className="team-initials-full">{getTeamInitials(partido.equipo_local_nombre)}</span>
            )}
          </div>
          <div className="team-full-info">
            <span className="team-full-name">{partido.equipo_local_nombre}</span>
            <span className="team-full-carrera">
              {partido.equipo_local_nombre.split(' ')[0]}
            </span>
          </div>
          <span className="team-full-score">{partido.resultado_local}</span>
        </div>

        <div className="match-full-divider">
          <span className="vs-text-full">VS</span>
        </div>

        <div className={`match-full-team ${partido.id_ganador === partido.id_equipo_visitante ? 'winner' : ''}`}>
          <div className="team-full-avatar" style={{ backgroundColor: getTeamColor(partido.equipo_visitante_nombre) }}>
            {partido.equipo_visitante_escudo ? (
              <img src={partido.equipo_visitante_escudo} alt="" className="team-logo-img-full" />
            ) : (
              <span className="team-initials-full">{getTeamInitials(partido.equipo_visitante_nombre)}</span>
            )}
          </div>
          <div className="team-full-info">
            <span className="team-full-name">{partido.equipo_visitante_nombre}</span>
            <span className="team-full-carrera">
              {partido.equipo_visitante_nombre.split(' ')[0]}
            </span>
          </div>
          <span className="team-full-score">{partido.resultado_visitante}</span>
        </div>
      </div>

      {partido.estado_partido === 'finalizado' && partido.id_ganador && (
        <div className="match-full-winner">
          <span className="winner-icon-full">🏅</span>
          <span className="winner-text-full">Ganador: {partido.ganador_nombre}</span>
        </div>
      )}

      <div className="match-full-footer">
        <div className="match-full-details">
          <span className="detail-item-full">
            <span className="detail-icon-full">📅</span>
            {partido.fecha_partido ? new Date(partido.fecha_partido).toLocaleDateString() : 'Pendiente'}
          </span>
          <span className="detail-item-full">
            <span className="detail-icon-full">⏰</span>
            {partido.hora_inicio || 'Pendiente'}
          </span>
        </div>
        <button className="btn-view-details">Ver Detalles →</button>
      </div>
    </div>
  );
};

export default MatchCard;
