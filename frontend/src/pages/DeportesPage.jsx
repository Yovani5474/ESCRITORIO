import { useState, useEffect } from 'react';
import deportesService from '../services/deportesService';
import DeporteCard from '../components/DeporteCard';
import { useNavigate } from 'react-router-dom';

const DeportesPage = () => {
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    loadDeportes();
  }, [filtro]);

  const loadDeportes = async () => {
    try {
      setLoading(true);
      const tipoActividad = filtro === 'todos' ? null : filtro;
      const data = await deportesService.getAll(tipoActividad);
      setDeportes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar deportes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeporteClick = (deporte) => {
    if (deporte.tipo_actividad === 'deporte') {
      navigate(`/canchas?deporte_id=${deporte.id_deporte}`);
    } else {
      navigate(`/juegos-mesa?deporte_id=${deporte.id_deporte}`);
    }
  };

  return (
    <div className="deportes-page">
      <div className="container">
        <h1 className="page-title">Deportes y Juegos de Mesa</h1>

        <div className="filtros">
          <button
            className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          <button
            className={`filtro-btn ${filtro === 'deporte' ? 'active' : ''}`}
            onClick={() => setFiltro('deporte')}
          >
            ⚽ Deportes
          </button>
          <button
            className={`filtro-btn ${filtro === 'juego_mesa' ? 'active' : ''}`}
            onClick={() => setFiltro('juego_mesa')}
          >
            🎲 Juegos de Mesa
          </button>
        </div>

        {loading && <div className="loading">Cargando deportes...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="deportes-grid">
            {deportes.map((deporte) => (
              <DeporteCard
                key={deporte.id_deporte}
                deporte={deporte}
                onClick={handleDeporteClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeportesPage;
