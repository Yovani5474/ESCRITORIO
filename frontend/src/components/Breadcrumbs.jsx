import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const breadcrumbMap = {
    'campeonatos': 'Campeonatos',
    'deportes': 'Deportes',
    'canchas': 'Canchas',
    'estadisticas': 'Estadísticas',
    'perfil': 'Perfil',
    'usuarios': 'Usuarios',
    'equipos': 'Equipos',
    'links': 'Links',
    'registro': 'Registro',
    'gestion': 'Gestión'
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumbs">
      <ol className="breadcrumbs-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            <span className="breadcrumb-icon">🏠</span>
            Inicio
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbMap[name] || name;
          
          return (
            <li key={name} className="breadcrumb-item">
              <span className="breadcrumb-separator">/</span>
              {isLast ? (
                <span className="breadcrumb-current">{displayName}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
