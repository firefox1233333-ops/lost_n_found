import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconSearch, IconBell } from './Icons';
import './TopBar.css';

const PAGE_TITLES = {
  '/': 'Home',
  '/items': 'Items',
  '/my-reports': 'My Reports',
  '/report-lost': 'Report Lost Item',
  '/report-found': 'Report Found Item',
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/security': 'Security Dashboard',
  '/security/add-found': 'Add Found Item',
  '/login': 'Login',
  '/register': 'Register',
};

function getInitials(name) {
  return name.trim().split(/\s+/).map((s) => s[0]).join('').toUpperCase().slice(0, 2);
}

const TopBar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'Lost & Found';

  return (
    <header className="fm-topbar">
      {/* Page title */}
      <h1 className="fm-topbar-title">{title}</h1>

      {/* Search */}
      <div className="fm-topbar-search">
        <IconSearch size={16} />
        <input type="text" placeholder="Search anything" className="fm-topbar-search-input" />
      </div>

      {/* Right actions */}
      <div className="fm-topbar-actions">
        <button type="button" className="fm-topbar-icon-btn" aria-label="Notifications">
          <IconBell />
        </button>

        {user ? (
          <div className="fm-topbar-user">
            <div className="fm-topbar-avatar" aria-hidden>{getInitials(user.name)}</div>
            <span className="fm-topbar-username">{user.name}</span>
          </div>
        ) : (
          <div className="fm-topbar-guest">
            <Link to="/login" className="fm-topbar-guest-link">Log in</Link>
            <Link to="/register" className="fm-topbar-guest-link fm-topbar-guest-primary">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
