import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return { icon: '✅', bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
      case 'error':
        return { icon: '❌', bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };
      case 'warning':
        return { icon: '⚠️', bg: '#fff3cd', color: '#856404', border: '#ffeeba' };
      case 'info':
        return { icon: 'ℹ️', bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' };
      default:
        return { icon: 'ℹ️', bg: '#e2e3e5', color: '#383d41', border: '#d6d8db' };
    }
  };

  const config = getToastConfig();

  return (
    <div 
      className="toast"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderLeft: `4px solid ${config.border}`
      }}
    >
      <span className="toast-icon">{config.icon}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;
