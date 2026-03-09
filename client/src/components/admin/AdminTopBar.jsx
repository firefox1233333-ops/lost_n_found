import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminTopBar.css';

const roleLabel = { admin: 'Admin', security: 'Security Officer', user: 'User' };

function getInitials(name) {
  return name.trim().split(/\s+/).map((s) => s[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminTopBar({ onMenuClick }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header className="m3-top-app-bar">
      <button type="button" className="m3-icon-button m3-top-app-bar-nav m3-icon-button-menu" onClick={onMenuClick} aria-label="Open menu">
        <span aria-hidden />
      </button>
      <Link to="/admin" className="m3-top-app-bar-title">
        Lost & Found
      </Link>
      <div className="m3-top-app-bar-actions">
        <div className="m3-user-chip">
          <div className="m3-avatar" aria-hidden>{getInitials(user.name)}</div>
          <div className="m3-user-chip-text">
            <span className="m3-user-chip-name">{user.name}</span>
            <span className="m3-user-chip-role">{roleLabel[user.role] || user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
