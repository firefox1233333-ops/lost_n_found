import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import './AppLayout.css';

const AUTH_PATHS = ['/login', '/register'];

const AppLayout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Auth pages get a full-screen experience (no sidebar/topbar)
  if (AUTH_PATHS.includes(pathname)) {
    return <Outlet />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar on left (hidden on mobile) */}
      {user && <Sidebar />}

      {/* Right column: topbar + scrollable content */}
      <div className="app-right">
        <TopBar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
