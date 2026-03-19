import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconHome, IconDashboard, IconUsers, IconItems,
  IconMyReports, IconReport, IconPlus,
  IconSettings, IconHelp, IconLogout,
} from './Icons';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const cls = ({ isActive }) => `fm-nav-item${isActive ? ' fm-nav-item-active' : ''}`;

  return (
    <aside className="fm-sidebar">
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
        {/* MENU section */}
        <div className="fm-nav-section">
          <span className="fm-nav-section-label">Menu</span>

          <NavLink to="/" end className={cls}>
            <IconHome /><span>Home</span>
          </NavLink>

          <NavLink to="/items" className={cls}>
            <IconItems /><span>Items</span>
          </NavLink>

          <NavLink to="/my-reports" className={cls}>
            <IconMyReports /><span>My Reports</span>
          </NavLink>

          <NavLink to="/report-lost" className={cls}>
            <IconReport /><span>Report Lost</span>
          </NavLink>

          <NavLink to="/report-found" className={cls}>
            <IconPlus /><span>Report Found</span>
          </NavLink>
        </div>

        {/* PREFERENCES section */}
        <div className="fm-nav-section fm-nav-section-bottom">
          <span className="fm-nav-section-label">Preferences</span>

          <button type="button" className="fm-nav-item">
            <IconSettings /><span>Settings</span>
          </button>

          <button type="button" className="fm-nav-item">
            <IconHelp /><span>Help</span>
          </button>

          <button type="button" className="fm-nav-item fm-nav-item-logout" onClick={handleLogout}>
            <IconLogout /><span>Log out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
