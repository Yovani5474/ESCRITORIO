import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🏆 Sistema de Campeonatos
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Inicio</Link>
          </li>
          <li className="navbar-item">
            <Link to="/campeonatos" className="navbar-link">Campeonatos</Link>
          </li>
          {isAdmin() && (
            <>
              <li className="navbar-item">
                <Link to="/usuarios" className="navbar-link">Usuarios</Link>
              </li>
              <li className="navbar-item">
                <Link to="/equipos" className="navbar-link">Equipos</Link>
              </li>
            </>
          )}
          <li className="navbar-item">
            <Link to="/deportes" className="navbar-link">Deportes</Link>
          </li>
          <li className="navbar-item">
            <Link to="/canchas" className="navbar-link">Canchas</Link>
          </li>
          {isAdmin() && (
            <li className="navbar-item">
              <Link to="/links" className="navbar-link">Links</Link>
            </li>
          )}
          <li className="navbar-item">
            <Link to="/registro" className="navbar-link">Registro</Link>
          </li>
        </ul>
        <div className="navbar-auth">
          {user ? (
            <div className="user-info">
              <span className="user-name">{user.nombre} {user.apellido}</span>
              <span className={`user-role ${user.rol}`}>{user.rol}</span>
              <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => setShowLoginModal(true)}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </nav>
  );
};

export default Navbar;
