import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    // Polling para nuevas notificaciones cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notificaciones');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.leida).length);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notificaciones/${id}/leer`);
      setNotifications(prev =>
        prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notificaciones/leer-todas');
      setNotifications(prev =>
        prev.map(n => ({ ...n, leida: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marcando todas las notificaciones como leídas:', err);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
