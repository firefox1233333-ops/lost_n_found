import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout, isAdmin, isSecurity } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const linkClass = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {/* Admin: Home, Dashboard, User Management, Items */}
        {isAdmin && (
          <>
            <NavLink to="/" end className={linkClass}>
              <span className="sidebar-label">Home</span>
            </NavLink>
            <NavLink to="/admin" end className={linkClass}>
              <span className="sidebar-label">Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" className={linkClass}>
              <span className="sidebar-label">User Management</span>
            </NavLink>
            <NavLink to="/items" className={linkClass}>
              <span className="sidebar-label">Items</span>
            </NavLink>
          </>
        )}

        {/* Security: Home, Security Dashboard, Items */}
        {isSecurity && !isAdmin && (
          <>
            <NavLink to="/" end className={linkClass}>
              <span className="sidebar-label">Home</span>
            </NavLink>
            <NavLink to="/security" end className={linkClass}>
              <span className="sidebar-label">Security Dashboard</span>
            </NavLink>
            <NavLink to="/items" className={linkClass}>
              <span className="sidebar-label">Items</span>
            </NavLink>
          </>
        )}

        {/* User: Home, Items, My Reports, Report Lost, Report Found */}
        {!isAdmin && !isSecurity && (
          <>
            <NavLink to="/" end className={linkClass}>
              <span className="sidebar-label">Home</span>
            </NavLink>
            <NavLink to="/items" className={linkClass}>
              <span className="sidebar-label">Items</span>
            </NavLink>
            <NavLink to="/my-reports" className={linkClass}>
              <span className="sidebar-label">My Reports</span>
            </NavLink>
            <NavLink to="/report-lost" className={linkClass}>
              <span className="sidebar-label">Report Lost</span>
            </NavLink>
            <NavLink to="/report-found" className={linkClass}>
              <span className="sidebar-label">Report Found</span>
            </NavLink>
          </>
        )}

        <div className="sidebar-spacer" />
        <button type="button" className="sidebar-link sidebar-link-logout" onClick={handleLogout}>
          <span className="sidebar-label">Log out</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
