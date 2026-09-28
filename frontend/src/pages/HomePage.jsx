import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deportesService from '../services/deportesService';
import campeonatosService from '../services/campeonatosService';
import partidosService from '../services/partidosService';
import DeporteCard from '../components/DeporteCard';
import MatchCard from '../components/MatchCard';

const HomePage = () => {
  const [deportes, setDeportes] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);
  const [proximosPartidos, setProximosPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deportesData, campeonatosData] = await Promise.all([
        deportesService.getAll(),
        campeonatosService.getAll({ estado: 'en_curso' })
      ]);
      setDeportes(deportesData);
      setCampeonatos(campeonatosData);
      
      // Cargar próximos partidos del campeonato principal
      if (campeonatosData.length > 0) {
        try {
          const partidosData = await partidosService.getByCampeonato(campeonatosData[0].id_campeonato);
          const proximos = partidosData
            .filter(p => p.estado_partido === 'programado' || p.estado_partido === 'en_curso')
            .slice(0, 4);
          setProximosPartidos(proximos);
        } catch (err) {
          console.error('Error cargando partidos:', err);
        }
      }
      
      setError(null);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeporteClick = (deporte) => {
    navigate(`/campeonatos?deporte_id=${deporte.id_deporte}`);
  };

  const handleCampeonatoClick = (campeonato) => {
    navigate(`/campeonatos/${campeonato.id_campeonato}`);
  };

  const handlePartidoClick = (partido) => {
    navigate(`/campeonatos/${partido.id_campeonato}`);
  };

  const campeonatoPrincipal = campeonatos.length > 0 ? campeonatos[0] : null;

  return (
    <div className="home-page-modern">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">🏆 Sistema de Campeonatos Deportivos</h1>
            <p className="hero-subtitle">Gestión profesional de torneos y competencias deportivas</p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">{campeonatos.length}</span>
                <span className="hero-stat-label">Campeonatos</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">{deportes.length}</span>
                <span className="hero-stat-label">Deportes</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">{proximosPartidos.length}</span>
                <span className="hero-stat-label">Próximos Partidos</span>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading-modern">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        )}

        {error && (
          <div className="error-modern">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Campeonato Principal */}
            {campeonatoPrincipal && (
              <section className="featured-tournament">
                <div className="section-header">
                  <h2 className="section-title-modern">🎯 Campeonato Principal</h2>
                  <button 
                    className="btn-view-all"
                    onClick={() => handleCampeonatoClick(campeonatoPrincipal)}
                  >
                    Ver Campeonato →
                  </button>
                </div>
                <div className="featured-tournament-card" onClick={() => handleCampeonatoClick(campeonatoPrincipal)}>
                  <div className="tournament-banner">
                    <div className="tournament-overlay">
                      <h3 className="tournament-name">{campeonatoPrincipal.nombre_campeonato}</h3>
                      <div className="tournament-meta">
                        <span className="tournament-badge">{campeonatoPrincipal.estado}</span>
                        <span className="tournament-info">
                          {campeonatoPrincipal.deporte} • {campeonatoPrincipal.numero_equipos} equipos
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="tournament-footer">
                    <div className="tournament-dates">
                      <span className="date-icon">📅</span>
                      {campeonatoPrincipal.fecha_inicio} - {campeonatoPrincipal.fecha_fin}
                    </div>
                    <div className="tournament-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '65%' }}></div>
                      </div>
                      <span className="progress-text">65% completado</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Próximos Partidos */}
            {proximosPartidos.length > 0 && (
              <section className="upcoming-matches">
                <div className="section-header">
                  <h2 className="section-title-modern">⚽ Próximos Partidos</h2>
                  <button 
                    className="btn-view-all"
                    onClick={() => campeonatoPrincipal && handleCampeonatoClick(campeonatoPrincipal)}
                  >
                    Ver Todos →
                  </button>
                </div>
                <div className="matches-grid">
                  {proximosPartidos.map(partido => (
                    <MatchCard
                      key={partido.id_partido}
                      partido={partido}
                      onClick={handlePartidoClick}
                      compact={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Deportes Activos */}
            <section className="active-sports">
              <div className="section-header">
                <h2 className="section-title-modern">🏅 Deportes Activos</h2>
                <button 
                  className="btn-view-all"
                  onClick={() => navigate('/deportes')}
                >
                  Ver Todos →
                </button>
              </div>
              <div className="deportes-grid-modern">
                {deportes.map((deporte) => (
                  <DeporteCard
                    key={deporte.id_deporte}
                    deporte={deporte}
                    onClick={handleDeporteClick}
                  />
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
              <h2 className="section-title-modern">🚀 Acciones Rápidas</h2>
              <div className="actions-grid">
                <button 
                  className="action-card"
                  onClick={() => navigate('/campeonatos')}
                >
                  <span className="action-icon">🏆</span>
                  <span className="action-title">Ver Campeonatos</span>
                  <span className="action-description">Explora todos los torneos activos</span>
                </button>
                <button 
                  className="action-card"
                  onClick={() => navigate('/deportes')}
                >
                  <span className="action-icon">⚽</span>
                  <span className="action-title">Explorar Deportes</span>
                  <span className="action-description">Fútbol, básquet, vóley y más</span>
                </button>
                <button 
                  className="action-card"
                  onClick={() => navigate('/canchas')}
                >
                  <span className="action-icon">🏟️</span>
                  <span className="action-title">Ver Canchas</span>
                  <span className="action-description">Ubicaciones y disponibilidad</span>
                </button>
                <button 
                  className="action-card"
                  onClick={() => navigate('/estadisticas')}
                >
                  <span className="action-icon">📊</span>
                  <span className="action-title">Estadísticas</span>
                  <span className="action-description">Resultados y rankings</span>
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
