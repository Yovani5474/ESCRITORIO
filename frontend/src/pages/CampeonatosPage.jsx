import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import campeonatosService from '../services/campeonatosService';
import deportesService from '../services/deportesService';
import Bracket from '../components/Bracket';
import ColorThemeSelector from '../components/ColorThemeSelector';
import { useAuth } from '../contexts/AuthContext';

const CampeonatosPage = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [campeonatoSeleccionado, setCampeonatoSeleccionado] = useState(null);
  const [bracketData, setBracketData] = useState(null);
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBracket, setShowBracket] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const deporteId = searchParams.get('deporte_id');

  useEffect(() => {
    loadDeportes();
    loadCampeonatos();
  }, [deporteId]);

  const loadDeportes = async () => {
    try {
      const data = await deportesService.getAll();
      setDeportes(data);
    } catch (err) {
      console.error('Error cargando deportes:', err);
    }
  };

  const loadCampeonatos = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (deporteId) filters.deporte_id = deporteId;
      const data = await campeonatosService.getAll(filters);
      setCampeonatos(data);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando campeonatos:', err);
      setLoading(false);
    }
  };

  const handleVerBracket = async (campeonato) => {
    try {
      setCampeonatoSeleccionado(campeonato);
      const bracket = await campeonatosService.getBracket(campeonato.id_campeonato);
      setBracketData(bracket);
      setShowBracket(true);
      // Aplicar colores del campeonato
      if (campeonato.color_tema) {
        document.documentElement.style.setProperty('--color-primario', campeonato.color_tema);
      }
      if (campeonato.color_fondo) {
        document.documentElement.style.setProperty('--color-fondo', campeonato.color_fondo);
      }
    } catch (err) {
      console.error('Error cargando bracket:', err);
      alert('Error al cargar las llaves del campeonato');
    }
  };

  const handlePartidoClick = (partido) => {
    navigate(`/partidos/${partido.id_partido}`);
  };

  const handleThemeChange = (theme) => {
    // Aquí podríamos guardar el tema en el backend
    console.log('Tema cambiado:', theme);
  };

  const handleFiltroChange = (e) => {
    const value = e.target.value;
    if (value === 'todos') {
      navigate('/campeonatos');
    } else {
      navigate(`/campeonatos?deporte_id=${value}`);
    }
  };

  return (
    <div className="campeonatos-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🏆 Campeonatos Deportivos</h1>
          <button
            className="btn-new-tournament"
            onClick={() => setShowThemeSelector(!showThemeSelector)}
          >
            🎨 Personalizar Colores
          </button>
        </div>

        {showThemeSelector && (
          <ColorThemeSelector
            campeonato={campeonatoSeleccionado}
            onThemeChange={handleThemeChange}
          />
        )}

        <div className="filtros">
          <select
            className="filtro-select"
            value={deporteId || 'todos'}
            onChange={handleFiltroChange}
          >
            <option value="todos">Todos los deportes</option>
            {deportes.map((deporte) => (
              <option key={deporte.id_deporte} value={deporte.id_deporte}>
                {deporte.nombre}
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="loading">Cargando campeonatos...</div>}

        {!loading && campeonatos.length === 0 && (
          <div className="empty-state">
            <p>No hay campeonatos disponibles</p>
          </div>
        )}

        {!loading && campeonatos.length > 0 && (
          <>
            {!showBracket ? (
              <div className="campeonatos-grid">
                {campeonatos.map((campeonato) => (
                  <div key={campeonato.id_campeonato} className="campeonato-card">
                    <div className="campeonato-header">
                      <h3>{campeonato.nombre_campeonato}</h3>
                      <span className={`campeonato-status ${campeonato.estado}`}>
                        {campeonato.estado}
                      </span>
                    </div>
                    <div className="campeonato-details">
                      <p><strong>Deporte:</strong> {campeonato.deporte}</p>
                      <p><strong>Organizador:</strong> {campeonato.organizador_nombre} {campeonato.organizador_apellido}</p>
                      <p><strong>Fecha:</strong> {campeonato.fecha_inicio} - {campeonato.fecha_fin}</p>
                      <p><strong>Tipo:</strong> {campeonato.tipo_sistema}</p>
                      <p><strong>Equipos:</strong> {campeonato.numero_equipos}</p>
                      {campeonato.descripcion && (
                        <p><strong>Descripción:</strong> {campeonato.descripcion}</p>
                      )}
                    </div>
                    <div className="campeonato-actions">
                      <button
                        className="btn-view-bracket"
                        onClick={() => handleVerBracket(campeonato)}
                      >
                        👁️ Ver Llaves
                      </button>
                      {isAdmin() && (
                        <button
                          className="btn-new-tournament"
                          onClick={() => navigate(`/campeonatos/${campeonato.id_campeonato}/gestion`)}
                        >
                          ⚙️ Gestionar Partidos
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <button
                  className="btn-back"
                  onClick={() => setShowBracket(false)}
                >
                  ← Volver a Campeonatos
                </button>
                {bracketData && (
                  <Bracket
                    bracketData={bracketData}
                    onPartidoClick={handlePartidoClick}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CampeonatosPage;
