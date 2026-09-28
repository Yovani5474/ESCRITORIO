import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import partidosService from '../services/partidosService';
import campeonatosService from '../services/campeonatosService';
import { useAuth } from '../contexts/AuthContext';

const GestionPartidosPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const [campeonato, setCampeonato] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPartido, setEditingPartido] = useState(null);
  const [resultados, setResultados] = useState({ local: 0, visitante: 0 });

  useEffect(() => {
    if (!canEdit()) {
      alert('Solo el administrador puede gestionar partidos');
      navigate('/campeonatos');
      return;
    }
    loadCampeonato();
    loadPartidos();
  }, [id]);

  const loadCampeonato = async () => {
    try {
      const data = await campeonatosService.getById(id);
      setCampeonato(data);
    } catch (err) {
      console.error('Error cargando campeonato:', err);
    }
  };

  const loadPartidos = async () => {
    try {
      setLoading(true);
      const data = await partidosService.getByCampeonato(id);
      setPartidos(data);
    } catch (err) {
      console.error('Error cargando partidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarPartido = (partido) => {
    setEditingPartido(partido);
    setResultados({
      local: partido.resultado_local || 0,
      visitante: partido.resultado_visitante || 0
    });
  };

  const handleGuardarResultado = async () => {
    try {
      // Determinar ganador
      let ganadorId = null;
      if (resultados.local > resultados.visitante) {
        ganadorId = editingPartido.id_equipo_local;
      } else if (resultados.visitante > resultados.local) {
        ganadorId = editingPartido.id_equipo_visitante;
      }

      await partidosService.updateResultado(editingPartido.id_partido, {
        resultado_local: resultados.local,
        resultado_visitante: resultados.visitante,
        id_ganador: ganadorId,
        estado_partido: 'finalizado'
      });

      setEditingPartido(null);
      loadPartidos(); // Recargar partidos para actualizar en tiempo real
    } catch (err) {
      console.error('Error guardando resultado:', err);
      alert('Error al guardar resultado');
    }
  };

  const handleIniciarPartido = async (partido) => {
    try {
      await partidosService.updateEstado(partido.id_partido, 'en_curso');
      loadPartidos();
    } catch (err) {
      console.error('Error iniciando partido:', err);
      alert('Error al iniciar partido');
    }
  };

  const handleCancelarEdicion = () => {
    setEditingPartido(null);
  };

  if (loading) {
    return <div className="loading">Cargando partidos...</div>;
  }

  return (
    <div className="gestion-partidos-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Partidos - Tiempo Real</h1>
          <button className="btn-back" onClick={() => navigate('/campeonatos')}>
            ← Volver a Campeonatos
          </button>
        </div>

        {campeonato && (
          <div className="campeonato-info">
            <h2>{campeonato.nombre_campeonato}</h2>
            <p>{campeonato.descripcion}</p>
          </div>
        )}

        <div className="partidos-list">
          {partidos.length === 0 ? (
            <div className="empty-state">
              <p>No hay partidos programados</p>
            </div>
          ) : (
            partidos.map((partido) => (
              <div key={partido.id_partido} className={`partido-card ${partido.estado_partido}`}>
                {editingPartido?.id_partido === partido.id_partido ? (
                  <div className="partido-edit">
                    <h3>Editar Resultado</h3>
                    <div className="partido-teams">
                      <div className="team-edit">
                        <label>{partido.equipo_local_nombre}</label>
                        <input
                          type="number"
                          min="0"
                          value={resultados.local}
                          onChange={(e) => setResultados({ ...resultados, local: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="team-edit">
                        <label>{partido.equipo_visitante_nombre}</label>
                        <input
                          type="number"
                          min="0"
                          value={resultados.visitante}
                          onChange={(e) => setResultados({ ...resultados, visitante: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button className="btn-submit" onClick={handleGuardarResultado}>
                        Guardar Resultado
                      </button>
                      <button className="btn-cancelar" onClick={handleCancelarEdicion}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="partido-view">
                    <div className="partido-header">
                      <span className="partido-ronda">Ronda {partido.ronda}</span>
                      <span className={`partido-status ${partido.estado_partido}`}>
                        {partido.estado_partido === 'programado' ? '⏰ Programado' : 
                         partido.estado_partido === 'en_curso' ? '🔴 En Curso' : 
                         '✓ Finalizado'}
                      </span>
                    </div>
                    <div className="partido-teams">
                      <div className={`team ${partido.id_ganador === partido.id_equipo_local ? 'winner' : ''}`}>
                        <span className="team-name">{partido.equipo_local_nombre}</span>
                        <span className="team-score">{partido.resultado_local}</span>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className={`team ${partido.id_ganador === partido.id_equipo_visitante ? 'winner' : ''}`}>
                        <span className="team-name">{partido.equipo_visitante_nombre}</span>
                        <span className="team-score">{partido.resultado_visitante}</span>
                      </div>
                    </div>
                    {partido.estado_partido === 'finalizado' && partido.id_ganador && (
                      <div className="partido-winner">
                        ✓ Ganador: {partido.id_ganador === partido.id_equipo_local ? 
                          partido.equipo_local_nombre : partido.equipo_visitante_nombre}
                      </div>
                    )}
                    <div className="partido-details">
                      <span>📅 {partido.fecha_partido ? new Date(partido.fecha_partido).toLocaleDateString() : 'Pendiente'}</span>
                      <span>⏰ {partido.hora_inicio || 'Pendiente'}</span>
                      <span>🏟️ {partido.nombre_cancha || `Cancha ${partido.id_cancha}`}</span>
                    </div>
                    <div className="partido-actions">
                      {partido.estado_partido === 'programado' && (
                        <button className="btn-start" onClick={() => handleIniciarPartido(partido)}>
                          ▶️ Iniciar Partido
                        </button>
                      )}
                      {partido.estado_partido === 'en_curso' && (
                        <button className="btn-edit" onClick={() => handleEditarPartido(partido)}>
                          ✏️ Registrar Resultado
                        </button>
                      )}
                      {partido.estado_partido === 'finalizado' && (
                        <button className="btn-edit" onClick={() => handleEditarPartido(partido)}>
                          ✏️ Editar Resultado
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionPartidosPage;
