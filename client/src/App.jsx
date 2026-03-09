import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleBasedLayout from './components/RoleBasedLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ItemsList from './pages/ItemsList';
import ItemDetail from './pages/ItemDetail';
import ReportItem from './pages/ReportItem';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import SecurityDashboard from './pages/security/SecurityDashboard';
import SecurityAddFound from './pages/security/SecurityAddFound';
import MyReports from './pages/MyReports';
import NotFound from './pages/NotFound';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/items" />;
  return children;
};

const SecurityRoute = ({ children }) => {
  const { user, isSecurity, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!isSecurity) return <Navigate to="/items" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* One layout per role: Admin and Security always see their own nav (no main Sidebar). */}
        <Route element={<RoleBasedLayout />}>
          <Route index element={<Home />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/security" element={<SecurityRoute><SecurityDashboard /></SecurityRoute>} />
          <Route path="/security/add-found" element={<SecurityRoute><SecurityAddFound /></SecurityRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items" element={<ItemsList />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/report-lost" element={<ProtectedRoute><ReportItem itemType="lost" /></ProtectedRoute>} />
          <Route path="/report-found" element={<ProtectedRoute><ReportItem itemType="found" /></ProtectedRoute>} />
          <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
