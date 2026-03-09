import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isSecurity } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Lost & Found
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/items">Items</Link>
              <Link to="/report-lost">Report Lost</Link>
              <Link to="/report-found">Report Found</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              {isSecurity && !isAdmin && <Link to="/security">Security</Link>}
              <span className="navbar-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

