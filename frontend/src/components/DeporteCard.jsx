import ajedrezBanner from '../../../img/ajedrez_banner.webp';
import basquetBanner from '../../../img/basquet_banner.jpg';
import futsalBanner from '../../../img/futsal_banner.jpg';
import futbolBanner from '../../../img/futbol-banner.webp';
import voleyBanner from '../../../img/boley_banner.jpg';

const bannersPorDeporte = {
  ajedrez: ajedrezBanner,
  basquet: basquetBanner,
  futsal: futsalBanner,
  futbol: futbolBanner,
  voley: voleyBanner,
};

const DeporteCard = ({ deporte, onClick }) => {
  const nombreNormalizado = deporte.nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const banner = bannersPorDeporte[nombreNormalizado];

  return (
    <div className="deporte-card" onClick={() => onClick(deporte)}>
      <div className={`deporte-icon${banner ? ' deporte-icon--banner' : ''}`}>
        {banner || deporte.icono_url ? (
          <img src={banner || deporte.icono_url} alt={deporte.nombre} />
        ) : (
          <span>🏆</span>
        )}
      </div>
      <h3 className="deporte-name">{deporte.nombre}</h3>
      <span className="deporte-type">
        {deporte.tipo_actividad === 'deporte' ? '⚽ Deporte' : '🎲 Juego de Mesa'}
      </span>
    </div>
  );
};

export default DeporteCard;
