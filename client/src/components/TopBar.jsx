import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TopBar.css';

const roleLabel = {
  admin: 'Admin',
  security: 'Security Officer',
  user: 'User',
};

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const TopBar = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <header className="topbar topbar-guest">
        <div className="topbar-inner">
          <Link to="/" className="topbar-brand">
            Lost & Found
          </Link>
          <div className="topbar-actions">
            <Link to="/login" className="topbar-link">Log in</Link>
            <Link to="/register" className="topbar-link topbar-link-primary">Sign up</Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="topbar-brand">
          Lost & Found
        </Link>
        <div className="topbar-user">
          <div className="topbar-avatar" aria-hidden>
            {getInitials(user.name)}
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user.name}</span>
            <span className="topbar-user-role">{roleLabel[user.role] || user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
