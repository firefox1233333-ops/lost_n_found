import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconHome, IconDashboard, IconUsers, IconItems,
  IconSettings, IconHelp, IconLogout,
} from '../Icons';
import '../Sidebar.css';
import './AdminNav.css';

export default function AdminNav({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login');
  };

  const cls = ({ isActive }) => `fm-nav-item${isActive ? ' fm-nav-item-active' : ''}`;

  return (
    <>
      <div className={`fm-nav-scrim ${open ? 'fm-nav-scrim-open' : ''}`} onClick={onClose} aria-hidden />
      <aside className={`fm-sidebar fm-admin-nav ${open ? 'fm-admin-nav-open' : ''}`}>
        {/* Brand */}
        <div className="fm-sidebar-brand">
          <div className="fm-sidebar-logo">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="fm-sidebar-brand-name">Lost &amp; Found</span>
        </div>

        <nav className="fm-sidebar-nav">
          <div className="fm-nav-section">
            <span className="fm-nav-section-label">Menu</span>

            <NavLink to="/" end className={cls} onClick={onClose}>
              <IconHome /><span>Home</span>
            </NavLink>
            <NavLink to="/admin" end className={cls} onClick={onClose}>
              <IconDashboard /><span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" className={cls} onClick={onClose}>
              <IconUsers /><span>User Management</span>
            </NavLink>
            <NavLink to="/items" className={cls} onClick={onClose}>
              <IconItems /><span>Items</span>
            </NavLink>
          </div>

          <div className="fm-nav-section fm-nav-section-bottom">
            <span className="fm-nav-section-label">Preferences</span>
            <button type="button" className="fm-nav-item" onClick={onClose}>
              <IconSettings /><span>Settings</span>
            </button>
            <button type="button" className="fm-nav-item" onClick={onClose}>
              <IconHelp /><span>Help</span>
            </button>
            <button type="button" className="fm-nav-item fm-nav-item-logout" onClick={handleLogout}>
              <IconLogout /><span>Log out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
