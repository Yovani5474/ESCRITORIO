import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deportesService from '../services/deportesService';
import campeonatosService from '../services/campeonatosService';
import DeporteCard from '../components/DeporteCard';

const HomePage = () => {
  const [deportes, setDeportes] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);
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

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="page-title">🏆 Sistema de Campeonatos Deportivos</h1>
        <p className="page-subtitle">Gestión de torneos y competencias deportivas</p>

        {loading && <div className="loading">Cargando datos...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {/* Campeonatos en curso */}
            {campeonatos.length > 0 && (
              <section className="active-tournaments">
                <h2 className="section-title">🎯 Campeonatos en Curso</h2>
                <div className="tournaments-grid">
                  {campeonatos.map(campeonato => (
                    <div
                      key={campeonato.id_campeonato}
                      className="tournament-card"
                      onClick={() => handleCampeonatoClick(campeonato)}
                    >
                      <div className="tournament-header">
                        <h3>{campeonato.nombre_campeonato}</h3>
                        <span className={`tournament-status ${campeonato.estado}`}>
                          {campeonato.estado}
                        </span>
                      </div>
                      <div className="tournament-details">
                        <p><strong>Deporte:</strong> {campeonato.deporte}</p>
                        <p><strong>Fecha:</strong> {campeonato.fecha_inicio} - {campeonato.fecha_fin}</p>
                        <p><strong>Equipos:</strong> {campeonato.numero_equipos}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Selección de deportes */}
            <section className="sports-selection">
              <h2 className="section-title">⚽ Selecciona un Deporte</h2>
              <div className="deportes-grid">
                {deportes.map((deporte) => (
                  <DeporteCard
                    key={deporte.id_deporte}
                    deporte={deporte}
                    onClick={handleDeporteClick}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
