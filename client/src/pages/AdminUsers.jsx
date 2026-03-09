import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import Notification from '../components/Notification';
import './AdminDashboard.css';

const AdminUsers = () => {
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
      setSuccess('User role updated successfully');
      setError('');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-container">
      <Notification
        message={success}
        type="success"
        onClose={() => setSuccess('')}
      />
      <div className="admin-header">
        <h1>User Management</h1>
        <p>Manage roles for users and security officers</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 ? (
        <div className="no-items">No users found.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-status">{user.role}</span>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="user">User</option>
                      <option value="security">Security Officer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

