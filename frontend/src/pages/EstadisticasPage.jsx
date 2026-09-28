import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EstadisticasPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampeonatos();
  }, []);

  useEffect(() => {
    if (selectedCampeonato) {
      loadEstadisticas(selectedCampeonato);
    }
  }, [selectedCampeonato]);

  const loadCampeonatos = async () => {
    try {
      const response = await api.get('/campeonatos');
      setCampeonatos(response.data);
      if (response.data.length > 0) {
        setSelectedCampeonato(response.data[0].id_campeonato);
      }
    } catch (err) {
      console.error('Error cargando campeonatos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEstadisticas = async (campeonatoId) => {
    try {
      // Aquí cargarías las estadísticas reales del campeonato
      // Por ahora, datos de ejemplo
      setStats({
        total_partidos: 24,
        partidos_finalizados: 12,
        partidos_pendientes: 12,
        total_equipos: 24,
        total_canchas: 4,
        promedio_goles: 3.5,
        equipo_mas_goleador: {
          nombre: 'AMOD III',
          goles: 15,
          partidos: 3
        },
        mejor_jugador: {
          nombre: 'Juan Pérez',
          equipo: 'EIND 201',
          goles: 8,
          asistencias: 5
        },
        top_equipos: [
          { nombre: 'AMOD III', puntos: 9, partidos: 3, ganados: 3 },
          { nombre: 'EIND 201', puntos: 7, partidos: 3, ganados: 2 },
          { nombre: 'NAED II', puntos: 6, partidos: 3, ganados: 2 },
          { nombre: 'PIAD II', puntos: 4, partidos: 3, ganados: 1 },
          { nombre: 'AMTD 201', puntos: 3, partidos: 3, ganados: 1 }
        ],
        partidos_recientes: [
          {
            equipo_local: 'AMOD III',
            equipo_visitante: 'EIND 201',
            resultado_local: 3,
            resultado_visitante: 1,
            fecha: '2026-01-15'
          },
          {
            equipo_local: 'NAED II',
            equipo_visitante: 'PIAD II',
            resultado_local: 2,
            resultado_visitante: 2,
            fecha: '2026-01-15'
          },
          {
            equipo_local: 'AMTD 201',
            equipo_visitante: 'EE66',
            resultado_local: 4,
            resultado_visitante: 0,
            fecha: '2026-01-14'
          }
        ]
      });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <div className="estadisticas-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">📊 Estadísticas del Campeonato</h1>
          <button className="btn-back" onClick={() => navigate('/')}>
            ← Volver al Inicio
          </button>
        </div>

        <div className="estadisticas-container">
          <div className="estadisticas-selector">
            <label>Seleccionar Campeonato:</label>
            <select
              value={selectedCampeonato || ''}
              onChange={(e) => setSelectedCampeonato(parseInt(e.target.value))}
            >
              {campeonatos.map(campeonato => (
                <option key={campeonato.id_campeonato} value={campeonato.id_campeonato}>
                  {campeonato.nombre}
                </option>
              ))}
            </select>
          </div>

          {stats && (
            <>
              {/* Stats principales */}
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-icon">⚽</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.total_partidos}</div>
                    <div className="stat-label">Total Partidos</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.partidos_finalizados}</div>
                    <div className="stat-label">Finalizados</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏰</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.partidos_pendientes}</div>
                    <div className="stat-label">Pendientes</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.total_equipos}</div>
                    <div className="stat-label">Equipos</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏟️</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.total_canchas}</div>
                    <div className="stat-label">Canchas</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.promedio_goles}</div>
                    <div className="stat-label">Promedio Goles</div>
                  </div>
                </div>
              </div>

              <div className="estadisticas-grid">
                {/* Equipo más goleador */}
                <div className="estadistica-card">
                  <h3>🏆 Equipo Más Goleador</h3>
                  <div className="equipo-destacado">
                    <div className="equipo-nombre">{stats.equipo_mas_goleador.nombre}</div>
                    <div className="equipo-stats">
                      <span>{stats.equipo_mas_goleador.goles} goles</span>
                      <span>{stats.equipo_mas_goleador.partidos} partidos</span>
                    </div>
                  </div>
                </div>

                {/* Mejor jugador */}
                <div className="estadistica-card">
                  <h3>⭐ Mejor Jugador</h3>
                  <div className="jugador-destacado">
                    <div className="jugador-nombre">{stats.mejor_jugador.nombre}</div>
                    <div className="jugador-equipo">{stats.mejor_jugador.equipo}</div>
                    <div className="jugador-stats">
                      <span>⚽ {stats.mejor_jugador.goles} goles</span>
                      <span>👟 {stats.mejor_jugador.asistencias} asistencias</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de clasificación */}
              <div className="clasificacion-card">
                <h3>📋 Tabla de Clasificación</h3>
                <div className="clasificacion-table">
                  <div className="clasificacion-header">
                    <div>Pos</div>
                    <div>Equipo</div>
                    <div>Pts</div>
                    <div>PJ</div>
                    <div>G</div>
                  </div>
                  {stats.top_equipos.map((equipo, index) => (
                    <div key={index} className="clasificacion-row">
                      <div className="posicion">{index + 1}</div>
                      <div className="equipo">{equipo.nombre}</div>
                      <div className="puntos">{equipo.puntos}</div>
                      <div className="partidos">{equipo.partidos}</div>
                      <div className="ganados">{equipo.ganados}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partidos recientes */}
              <div className="partidos-recientes-card">
                <h3>📅 Partidos Recientes</h3>
                <div className="partidos-list">
                  {stats.partidos_recientes.map((partido, index) => (
                    <div key={index} className="partido-reciente">
                      <div className="partido-equipos">
                        <span className="equipo-local">{partido.equipo_local}</span>
                        <span className="partido-resultado">
                          {partido.resultado_local} - {partido.resultado_visitante}
                        </span>
                        <span className="equipo-visitante">{partido.equipo_visitante}</span>
                      </div>
                      <div className="partido-fecha">
                        {new Date(partido.fecha).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPage;
