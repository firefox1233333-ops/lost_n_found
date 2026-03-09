import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';
import AdminLayout from './admin/AdminLayout';
import SecurityLayout from './security/SecurityLayout';

/**
 * Picks one layout by role so Admin/Security never see the main app Sidebar.
 * - Admin: always AdminLayout (AdminNav) for every route.
 * - Security: always SecurityLayout (SecurityNav) for every route.
 * - User or not logged in: AppLayout (main Sidebar).
 */
export default function RoleBasedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading…</div>;
  }

  if (user?.role === 'admin') {
    return <AdminLayout />;
  }

  if (user?.role === 'security') {
    return <SecurityLayout />;
  }

  return <AppLayout />;
}
