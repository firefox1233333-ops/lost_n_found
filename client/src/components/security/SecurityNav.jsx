import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../admin/AdminNav.css';

export default function SecurityNav({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `m3-nav-item ${isActive ? 'm3-nav-item-active' : ''}`;

  return (
    <>
      <div className={`m3-nav-scrim ${open ? 'm3-nav-scrim-open' : ''}`} onClick={onClose} aria-hidden />
      <aside className={`m3-nav-drawer ${open ? 'm3-nav-drawer-open' : ''}`}>
        <div className="m3-nav-header">
          <span className="m3-nav-header-title">Security</span>
        </div>
        <nav className="m3-nav-list">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <span>Home</span>
          </NavLink>
          <NavLink to="/security" end className={linkClass} onClick={onClose}>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/security/add-found" className={linkClass} onClick={onClose}>
            <span>Add Found Item</span>
          </NavLink>
          <NavLink to="/items" className={linkClass} onClick={onClose}>
            <span>Items</span>
          </NavLink>
          <div className="m3-nav-spacer" />
          <button type="button" className="m3-nav-item m3-nav-item-logout" onClick={handleLogout}>
            <span>Log out</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
