import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import espaciosJuegosMesaService from '../services/espaciosJuegosMesaService';
import deportesService from '../services/deportesService';
import EspacioJuegoMesaCard from '../components/EspacioJuegoMesaCard';

const JuegosMesaPage = () => {
  const [espacios, setEspacios] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const deporteId = searchParams.get('deporte_id');

  useEffect(() => {
    loadDeportes();
    loadEspacios();
  }, [deporteId]);

  const loadDeportes = async () => {
    try {
      const data = await deportesService.getAll('juego_mesa');
      setDeportes(data);
    } catch (err) {
      console.error('Error cargando deportes:', err);
    }
  };

  const loadEspacios = async () => {
    try {
      setLoading(true);
      const data = await espaciosJuegosMesaService.getAll(deporteId, 'disponible');
      setEspacios(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar espacios de juegos de mesa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReservar = (espacio) => {
    // Aquí implementaríamos la lógica de reserva
    alert(`Reservando espacio: ${espacio.nombre_espacio}`);
  };

  const handleFiltroChange = (e) => {
    const value = e.target.value;
    if (value === 'todos') {
      loadEspacios();
    } else {
      loadEspacios();
    }
  };

  return (
    <div className="juegos-mesa-page">
      <div className="container">
        <h1 className="page-title">Juegos de Mesa</h1>

        <div className="filtros">
          <select
            className="filtro-select"
            value={deporteId || 'todos'}
            onChange={handleFiltroChange}
          >
            <option value="todos">Todos los juegos</option>
            {deportes.map((deporte) => (
              <option key={deporte.id_deporte} value={deporte.id_deporte}>
                {deporte.nombre}
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="loading">Cargando espacios...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {espacios.length === 0 ? (
              <div className="empty-state">
                <p>No hay espacios de juegos de mesa disponibles</p>
              </div>
            ) : (
              <div className="espacios-grid">
                {espacios.map((espacio) => (
                  <EspacioJuegoMesaCard
                    key={espacio.id_espacio}
                    espacio={espacio}
                    onReservar={handleReservar}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JuegosMesaPage;
