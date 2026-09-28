import React, { useState } from 'react';

const Bracket = ({ bracketData, onPartidoClick }) => {
  const { equipos, partidos, max_ronda } = bracketData;
  const [selectedPartido, setSelectedPartido] = useState(null);

  // Agrupar partidos por cancha
  const partidosPorCancha = {};
  partidos.forEach(partido => {
    const canchaNombre = partido.nombre_cancha || `Cancha ${partido.id_cancha}`;
    if (!partidosPorCancha[canchaNombre]) {
      partidosPorCancha[canchaNombre] = [];
    }
    partidosPorCancha[canchaNombre].push(partido);
  });

  // Agrupar equipos por carrera (bloques)
  const equiposPorCarrera = {};
  equipos.forEach(equipo => {
    const carrera = equipo.nombre_equipo.split(' ')[0];
    if (!equiposPorCarrera[carrera]) {
      equiposPorCarrera[carrera] = [];
    }
    equiposPorCarrera[carrera].push(equipo);
  });

  // Encontrar el campeón (último partido finalizado con ganador)
  const campeón = partidos.find(p => p.estado_partido === 'finalizado' && p.id_ganador && p.ronda === max_ronda);

  const handlePartidoClick = (partido) => {
    setSelectedPartido(partido);
    if (onPartidoClick) {
      onPartidoClick(partido);
    }
  };

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

  return (
    <div className="bracket-container-modern">
      <div className="bracket-header">
        <h2 className="bracket-title">🏆 Llaves del Campeonato</h2>
        <div className="bracket-stats">
          <span className="stat-badge">{equipos.length} Equipos</span>
          <span className="stat-badge">{partidos.length} Partidos</span>
        </div>
      </div>

      {/* Diagrama del Campeón */}
      {campeón && (
        <div className="champion-section">
          <div className="champion-card">
            <div className="champion-trophy">🏆</div>
            <div className="champion-content">
              <div className="champion-label">CAMPEÓN</div>
              <div className="champion-team-name">{campeón.ganador_nombre}</div>
              <div className="champion-final-score">
                {campeón.resultado_local} - {campeón.resultado_visitante}
              </div>
              <div className="champion-opponent">
                vs {campeón.id_ganador === campeón.id_equipo_local ? campeón.equipo_visitante_nombre : campeón.equipo_local_nombre}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bracket-grid-modern">
        {Object.keys(partidosPorCancha).sort().map(canchaNombre => (
          <div key={canchaNombre} className="bracket-court-modern">
            <div className="court-header">
              <h3 className="court-title">🏟️ {canchaNombre}</h3>
              <span className="court-matches-count">{partidosPorCancha[canchaNombre].length} partidos</span>
            </div>
            <div className="court-matches-modern">
              {partidosPorCancha[canchaNombre].map(partido => {
                const statusBadge = getStatusBadge(partido.estado_partido);
                return (
                  <div
                    key={partido.id_partido}
                    className={`match-card-modern ${partido.estado_partido} ${selectedPartido?.id_partido === partido.id_partido ? 'selected' : ''}`}
                    onClick={() => handlePartidoClick(partido)}
                  >
                    <div className="match-header-modern">
                      <span className="match-round">Ronda {partido.ronda}</span>
                      <span 
                        className="match-status-badge"
                        style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}
                      >
                        {statusBadge.text}
                      </span>
                    </div>

                    <div className="match-teams-modern">
                      <div className={`match-team-modern ${partido.id_ganador === partido.id_equipo_local ? 'winner' : ''}`}>
                        <div className="team-avatar" style={{ backgroundColor: getTeamColor(partido.equipo_local_nombre) }}>
                          {partido.equipo_local_escudo ? (
                            <img src={partido.equipo_local_escudo} alt="" className="team-logo-img" />
                          ) : (
                            <span className="team-initials">{getTeamInitials(partido.equipo_local_nombre)}</span>
                          )}
                        </div>
                        <div className="team-info-modern">
                          <span className="team-name-modern">{partido.equipo_local_nombre}</span>
                        </div>
                        <span className="team-score-modern">{partido.resultado_local}</span>
                      </div>

                      <div className="match-divider">
                        <span className="vs-text">VS</span>
                      </div>

                      <div className={`match-team-modern ${partido.id_ganador === partido.id_equipo_visitante ? 'winner' : ''}`}>
                        <div className="team-avatar" style={{ backgroundColor: getTeamColor(partido.equipo_visitante_nombre) }}>
                          {partido.equipo_visitante_escudo ? (
                            <img src={partido.equipo_visitante_escudo} alt="" className="team-logo-img" />
                          ) : (
                            <span className="team-initials">{getTeamInitials(partido.equipo_visitante_nombre)}</span>
                          )}
                        </div>
                        <div className="team-info-modern">
                          <span className="team-name-modern">{partido.equipo_visitante_nombre}</span>
                        </div>
                        <span className="team-score-modern">{partido.resultado_visitante}</span>
                      </div>
                    </div>

                    {partido.estado_partido === 'finalizado' && partido.id_ganador && (
                      <div className="match-winner-banner">
                        <span className="winner-icon">🏅</span>
                        <span className="winner-text">Ganador: {partido.ganador_nombre}</span>
                      </div>
                    )}

                    <div className="match-footer-modern">
                      <div className="match-meta">
                        <span className="meta-item">
                          <span className="meta-icon">📅</span>
                          {partido.fecha_partido ? new Date(partido.fecha_partido).toLocaleDateString() : 'Pendiente'}
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">⏰</span>
                          {partido.hora_inicio || 'Pendiente'}
                        </span>
                      </div>
                      <button className="btn-details">Ver Detalles →</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mostrar bloques de equipos por carrera */}
      <div className="teams-blocks-modern">
        <h3 className="blocks-title-modern">📋 Equipos por Carrera</h3>
        <div className="blocks-grid-modern">
          {Object.keys(equiposPorCarrera).sort().map(carrera => (
            <div key={carrera} className="career-block-modern">
              <div className="career-header">
                <h4 className="career-name-modern">{carrera}</h4>
                <span className="career-count">{equiposPorCarrera[carrera].length} equipos</span>
              </div>
              <ul className="career-teams-modern">
                {equiposPorCarrera[carrera].map(equipo => (
                  <li key={equipo.id_equipo} className="career-team-modern">
                    <div className="team-dot" style={{ backgroundColor: getTeamColor(equipo.nombre_equipo) }}></div>
                    {equipo.nombre_equipo}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Información del torneo */}
      <div className="tournament-info-modern">
        <h3 className="info-title">ℹ️ Información del Torneo</h3>
        <div className="info-grid-modern">
          <div className="info-card-modern">
            <span className="info-icon">⏱️</span>
            <div className="info-content">
              <span className="info-label">TIEMPO</span>
              <span className="info-value">10 x 15 min</span>
            </div>
          </div>
          <div className="info-card-modern">
            <span className="info-icon">👥</span>
            <div className="info-content">
              <span className="info-label">EQUIPOS</span>
              <span className="info-value">{equipos.length}</span>
            </div>
          </div>
          <div className="info-card-modern">
            <span className="info-icon">🕐</span>
            <div className="info-content">
              <span className="info-label">INICIO</span>
              <span className="info-value">9:00 am</span>
            </div>
          </div>
          <div className="info-card-modern">
            <span className="info-icon">🍽️</span>
            <div className="info-content">
              <span className="info-label">ALMUERZO</span>
              <span className="info-value">12:30 pm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bracket;
