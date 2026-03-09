import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import './AppLayout.css';

const AppLayout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isAdminOrSecurity = pathname.startsWith('/admin') || pathname.startsWith('/security');

  return (
    <div className="app-layout">
      <TopBar />
      <div className="app-body">
        {user && !isAdminOrSecurity && <Sidebar />}
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
