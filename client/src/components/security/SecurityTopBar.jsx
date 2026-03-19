import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconSearch, IconBell, IconMenu } from '../Icons';
import '../TopBar.css';

const PAGE_TITLES = {
  '/': 'Home',
  '/items': 'Items',
  '/security': 'Security Dashboard',
  '/security/add-found': 'Add Found Item',
};

function getInitials(name) {
  return name.trim().split(/\s+/).map((s) => s[0]).join('').toUpperCase().slice(0, 2);
}

export default function SecurityTopBar({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'Security Dashboard';

  if (!user) return null;

  return (
    <header className="fm-topbar">
      {/* Hamburger (mobile only) */}
      <button type="button" className="fm-topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <IconMenu />
      </button>

      {/* Page title */}
      <h1 className="fm-topbar-title">{title}</h1>

      {/* Search */}
      <div className="fm-topbar-search">
        <IconSearch size={16} />
        <input type="text" placeholder="Search anything" className="fm-topbar-search-input" />
      </div>

      {/* Actions */}
      <div className="fm-topbar-actions">
        <button type="button" className="fm-topbar-icon-btn" aria-label="Notifications">
          <IconBell />
        </button>
        <div className="fm-topbar-user">
          <div className="fm-topbar-avatar" aria-hidden>{getInitials(user.name)}</div>
          <span className="fm-topbar-username">{user.name}</span>
        </div>
      </div>
    </header>
  );
}
