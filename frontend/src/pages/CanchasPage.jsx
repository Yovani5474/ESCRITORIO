import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import canchasService from '../services/canchasService';
import deportesService from '../services/deportesService';
import CanchaCard from '../components/CanchaCard';
import { useAuth } from '../contexts/AuthContext';

const CanchasPage = () => {
  const [canchas, setCanchas] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { canEdit } = useAuth();
  const deporteId = searchParams.get('deporte_id');

  useEffect(() => {
    loadDeportes();
    loadCanchas();
  }, [deporteId]);

  const loadDeportes = async () => {
    try {
      const data = await deportesService.getAll('deporte');
      setDeportes(data);
    } catch (err) {
      console.error('Error cargando deportes:', err);
    }
  };

  const loadCanchas = async () => {
    try {
      setLoading(true);
      const data = await canchasService.getAll(deporteId, 'disponible');
      setCanchas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar canchas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReservar = (cancha) => {
    if (!canEdit()) {
      alert('Solo el administrador puede reservar canchas');
      return;
    }
    alert(`Reservando cancha: ${cancha.nombre_cancha}`);
  };

  const handleFiltroChange = (e) => {
    const value = e.target.value;
    if (value === 'todos') {
      loadCanchas();
    } else {
      loadCanchas();
    }
  };

  return (
    <div className="canchas-page">
      <div className="container">
        <h1 className="page-title">Canchas Deportivas</h1>

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

        {loading && <div className="loading">Cargando canchas...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {canchas.length === 0 ? (
              <div className="empty-state">
                <p>No hay canchas disponibles</p>
              </div>
            ) : (
              <div className="canchas-grid">
                {canchas.map((cancha) => (
                  <CanchaCard
                    key={cancha.id_cancha}
                    cancha={cancha}
                    onReservar={handleReservar}
                    canEdit={canEdit()}
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

export default CanchasPage;
