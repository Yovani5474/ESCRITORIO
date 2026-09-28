import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationPanel = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'partido_finalizado':
        return '✅';
      case 'partido_programado':
        return '📅';
      case 'campeonato_creado':
        return '🏆';
      case 'equipo_inscrito':
        return '👥';
      case 'resultado_actualizado':
        return '📊';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case 'partido_finalizado':
        return '#27ae60';
      case 'partido_programado':
        return '#f39c12';
      case 'campeonato_creado':
        return '#9b59b6';
      case 'equipo_inscrito':
        return '#3498db';
      case 'resultado_actualizado':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const formatTime = (fecha) => {
    const now = new Date();
    const notifDate = new Date(fecha);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="notification-container">
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read"
                onClick={markAllAsRead}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id_notificacion}
                  className={`notification-item ${!notif.leida ? 'unread' : ''}`}
                  onClick={() => markAsRead(notif.id_notificacion)}
                >
                  <div
                    className="notification-icon"
                    style={{ backgroundColor: getNotificationColor(notif.tipo) }}
                  >
                    {getNotificationIcon(notif.tipo)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">
                      {notif.mensaje}
                    </div>
                    <div className="notification-time">
                      {formatTime(notif.fecha)}
                    </div>
                  </div>
                  {!notif.leida && (
                    <div className="notification-dot"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
