import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Inicio', show: true },
    { path: '/campeonatos', icon: '🏆', label: 'Campeonatos', show: true },
    { path: '/deportes', icon: '⚽', label: 'Deportes', show: true },
    { path: '/canchas', icon: '🏟️', label: 'Canchas', show: true },
    { path: '/estadisticas', icon: '📊', label: 'Estadísticas', show: true },
    { path: '/usuarios', icon: '👥', label: 'Usuarios', show: isAdmin() },
    { path: '/equipos', icon: '🏅', label: 'Equipos', show: isAdmin() },
    { path: '/links', icon: '🔗', label: 'Links', show: isAdmin() },
    { path: '/perfil', icon: '👤', label: 'Perfil', show: !!user },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🏆</span>
          {!collapsed && <span className="logo-text">Campeonatos</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            item.show && (
              <li key={item.path} className="sidebar-item">
                <Link
                  to={item.path}
                  className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {!collapsed && <span className="sidebar-label">{item.label}</span>}
                  {item.path === '/perfil' && unreadCount > 0 && !collapsed && (
                    <span className="sidebar-badge">{unreadCount}</span>
                  )}
                </Link>
              </li>
            )
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {user && !collapsed && (
          <div className="user-info-sidebar">
            <div className="user-avatar-sidebar">
              {user.nombre.charAt(0)}{user.apellido.charAt(0)}
            </div>
            <div className="user-details-sidebar">
              <span className="user-name-sidebar">{user.nombre} {user.apellido}</span>
              <span className={`user-role-sidebar ${user.rol}`}>{user.rol}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
