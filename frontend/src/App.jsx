import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DeportesPage from './pages/DeportesPage';
import CanchasPage from './pages/CanchasPage';
import CampeonatosPage from './pages/CampeonatosPage';
import GestionPartidosPage from './pages/GestionPartidosPage';
import PerfilPage from './pages/PerfilPage';
import EstadisticasPage from './pages/EstadisticasPage';
import FormularioParticipante from './components/FormularioParticipante';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/deportes" element={<DeportesPage />} />
                <Route path="/canchas" element={<CanchasPage />} />
                <Route path="/campeonatos" element={<CampeonatosPage />} />
                <Route path="/campeonatos/:id" element={<CampeonatosPage />} />
                <Route path="/campeonatos/:id/gestion" element={<GestionPartidosPage />} />
                <Route path="/perfil" element={<PerfilPage />} />
                <Route path="/estadisticas" element={<EstadisticasPage />} />
                <Route path="/registro" element={<FormularioParticipante />} />
                {/* Rutas placeholder para futuras implementaciones */}
                <Route path="/usuarios" element={<div className="placeholder-page"><h2>👥 Gestión de Usuarios</h2><p>Próximamente...</p></div>} />
                <Route path="/equipos" element={<div className="placeholder-page"><h2>🏅 Gestión de Equipos</h2><p>Próximamente...</p></div>} />
                <Route path="/links" element={<div className="placeholder-page"><h2>🔗 Gestión de Links</h2><p>Próximamente...</p></div>} />
              </Routes>
            </main>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
