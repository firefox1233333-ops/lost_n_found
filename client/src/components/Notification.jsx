import { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="notification-close">
        ×
      </button>
    </div>
  );
};

export default Notification;

