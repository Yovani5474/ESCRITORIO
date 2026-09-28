import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useState } from 'react';
import LoginModal from './LoginModal';
import RegistroModal from './RegistroModal';
import NotificationPanel from './NotificationPanel';

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout, isAdmin } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false);

  const handleOpenRegistro = () => {
    setShowLoginModal(false);
    setShowRegistroModal(true);
  };

  const handleOpenLogin = () => {
    setShowRegistroModal(false);
    setShowLoginModal(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
        <Link to="/" className="navbar-logo">
          🏆 Sistema de Campeonatos
        </Link>
        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
          </li>
          <li className="navbar-item">
            <Link to="/campeonatos" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Campeonatos</Link>
          </li>
          {isAdmin() && (
            <>
              <li className="navbar-item">
                <Link to="/usuarios" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Usuarios</Link>
              </li>
              <li className="navbar-item">
                <Link to="/equipos" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Equipos</Link>
              </li>
            </>
          )}
          <li className="navbar-item">
            <Link to="/deportes" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Deportes</Link>
          </li>
          <li className="navbar-item">
            <Link to="/canchas" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Canchas</Link>
          </li>
          <li className="navbar-item">
            <Link to="/estadisticas" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Estadísticas</Link>
          </li>
          {isAdmin() && (
            <li className="navbar-item">
              <Link to="/links" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Links</Link>
            </li>
          )}
          <li className="navbar-item">
            <Link to="/perfil" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Perfil</Link>
          </li>
        </ul>
        <div className="navbar-auth">
          {user ? (
            <div className="user-info">
              <NotificationPanel />
              <span className="user-name">{user.nombre} {user.apellido}</span>
              <span className={`user-role ${user.rol}`}>{user.rol}</span>
              <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-login" onClick={() => setShowLoginModal(true)}>
                Iniciar Sesión
              </button>
              <button className="btn-register" onClick={handleOpenRegistro}>
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegistroModal && <RegistroModal onClose={() => setShowRegistroModal(false)} />}
    </nav>
  );
};

export default Navbar;
