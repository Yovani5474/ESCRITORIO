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

  return (
    <div className="bracket-container">
      <h2 className="bracket-title">Llaves del Campeonato</h2>

      {/* Diagrama del Campeón */}
      {campeón && (
        <div className="champion-diagram">
          <div className="champion-trophy">🏆</div>
          <div className="champion-info">
            <h3 className="champion-title">CAMPEÓN</h3>
            <div className="champion-team">
              {campeón.ganador_nombre}
            </div>
            <div className="champion-details">
              <span className="champion-score">
                {campeón.resultado_local} - {campeón.resultado_visitante}
              </span>
              <span className="champion-match">
                Final vs {campeón.id_ganador === campeón.id_equipo_local ? campeón.equipo_visitante_nombre : campeón.equipo_local_nombre}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bracket-grid">
        {Object.keys(partidosPorCancha).sort().map(canchaNombre => (
          <div key={canchaNombre} className="bracket-court">
            <h3 className="court-title">{canchaNombre}</h3>
            <div className="court-matches">
              {partidosPorCancha[canchaNombre].map(partido => (
                <div
                  key={partido.id_partido}
                  className={`match-card ${partido.estado_partido} ${selectedPartido?.id_partido === partido.id_partido ? 'selected' : ''}`}
                  onClick={() => handlePartidoClick(partido)}
                >
                  <div className="match-header">
                    <span className="match-round">Ronda {partido.ronda}</span>
                    <span className={`match-status ${partido.estado_partido}`}>
                      {partido.estado_partido === 'finalizado' ? '✓ Finalizado' : partido.estado_partido}
                    </span>
                  </div>

                  <div className="match-teams">
                    <div className={`match-team ${partido.id_ganador === partido.id_equipo_local ? 'winner' : ''}`}>
                      <div className="team-info">
                        <span className="team-name">{partido.equipo_local_nombre}</span>
                        {partido.equipo_local_escudo && (
                          <img src={partido.equipo_local_escudo} alt="" className="team-logo" />
                        )}
                      </div>
                      <span className="team-score">{partido.resultado_local}</span>
                    </div>

                    <div className="match-vs">VS</div>

                    <div className={`match-team ${partido.id_ganador === partido.id_equipo_visitante ? 'winner' : ''}`}>
                      <div className="team-info">
                        <span className="team-name">{partido.equipo_visitante_nombre}</span>
                        {partido.equipo_visitante_escudo && (
                          <img src={partido.equipo_visitante_escudo} alt="" className="team-logo" />
                        )}
                      </div>
                      <span className="team-score">{partido.resultado_visitante}</span>
                    </div>
                  </div>

                  {partido.estado_partido === 'finalizado' && partido.id_ganador && (
                    <div className="match-winner">
                      ✓ Ganador: {partido.ganador_nombre}
                    </div>
                  )}

                  <div className="match-details">
                    <div className="detail-row">
                      <span className="detail-label">📅 Fecha:</span>
                      <span className="detail-value">
                        {partido.fecha_partido ? new Date(partido.fecha_partido).toLocaleDateString() : 'Pendiente'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">⏰ Hora:</span>
                      <span className="detail-value">{partido.hora_inicio || 'Pendiente'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🏟️ Cancha:</span>
                      <span className="detail-value">{partido.nombre_cancha || `Cancha ${partido.id_cancha}`}</span>
                    </div>
                    {partido.id_arbitro && (
                      <div className="detail-row">
                        <span className="detail-label">👨‍⚖️ Árbitro:</span>
                        <span className="detail-value">ID: {partido.id_arbitro}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mostrar bloques de equipos por carrera */}
      <div className="teams-blocks">
        <h3 className="blocks-title">BLOQUES</h3>
        <div className="blocks-grid">
          {Object.keys(equiposPorCarrera).sort().map(carrera => (
            <div key={carrera} className="career-block">
              <h4 className="career-name">{carrera}</h4>
              <ul className="career-teams">
                {equiposPorCarrera[carrera].map(equipo => (
                  <li key={equipo.id_equipo} className="career-team">
                    {equipo.nombre_equipo}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Información del torneo */}
      <div className="tournament-info">
        <div className="info-item">
          <strong>TIEMPO:</strong> 10 x 15 minutos
        </div>
        <div className="info-item">
          <strong>EQUIPOS:</strong> {equipos.length}
        </div>
        <div className="info-item">
          <strong>HORA DE INICIO:</strong> 9:00 am
        </div>
        <div className="info-item">
          <strong>ALMUERZO:</strong> 12:30 pm
        </div>
      </div>
    </div>
  );
};

export default Bracket;
