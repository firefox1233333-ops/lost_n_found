import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import Notification from '../../components/Notification';
import './AdminPages.css';

const roleLabel = { user: 'User', security: 'Security Officer', admin: 'Admin' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await usersAPI.updateRole(id, newRole);
      setSuccess('Role updated.');
      setError('');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="m3-page">
        <div className="m3-loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="m3-page">
      <Notification message={success} type="success" onClose={() => setSuccess('')} />
      <header className="m3-page-header">
        <h1 className="m3-headline-small">User Management</h1>
        <p className="m3-body-medium m3-page-subtitle">Change roles for users and security officers</p>
      </header>

      {error && (
        <div className="m3-banner m3-banner-error" role="alert">
          {error}
        </div>
      )}

      <section className="m3-card m3-card-elevated">
        <div className="m3-card-header">
          <h2 className="m3-title-medium">All users</h2>
        </div>
        {users.length === 0 ? (
          <div className="m3-empty">No users found.</div>
        ) : (
          <div className="m3-list-container">
            {users.map((user) => (
              <div key={user._id} className="m3-list-item">
                <div className="m3-list-item-content">
                  <span className="m3-list-item-title">{user.name}</span>
                  <span className="m3-list-item-supporting">{user.email}</span>
                  <span className="m3-chip m3-chip-role">{roleLabel[user.role] || user.role}</span>
                </div>
                <div className="m3-list-item-actions">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="m3-select"
                    aria-label="Role"
                  >
                    <option value="user">User</option>
                    <option value="security">Security Officer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
