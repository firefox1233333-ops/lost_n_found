import { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import Notification from '../components/Notification';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    returned: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getAll();
      setItems(data);

      // Calculate statistics
      const lostCount = data.filter((item) => item.status === 'Lost').length;
      const foundCount = data.filter((item) => item.status === 'Found').length;
      const atSecurityCount = data.filter((item) => item.status === 'At Security').length;
      const returnedCount = data.filter((item) => item.status === 'Returned').length;

      setStats({
        total: data.length,
        lost: lostCount,
        found: foundCount,
        atSecurity: atSecurityCount,
        returned: returnedCount,
      });
      
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      await itemsAPI.updateStatus(itemId, newStatus);
      setError('');
      setSuccess('Item status updated successfully!');
      fetchItems(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await itemsAPI.delete(itemId);
      setError('');
      setSuccess('Item deleted successfully!');
      fetchItems(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  return (
    <div className="admin-container">
      <Notification
        message={success}
        type="success"
        onClose={() => setSuccess('')}
      />
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all lost and found items</p>
      </div>

      {!loading && items.length > 0 && (
        <div className="admin-stats">
          <div className="stat-box">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-box stat-lost">
            <div className="stat-value">{stats.lost}</div>
            <div className="stat-label">Lost</div>
          </div>
          <div className="stat-box stat-found">
            <div className="stat-value">{stats.found}</div>
            <div className="stat-label">Found</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.atSecurity}</div>
            <div className="stat-label">At Security</div>
          </div>
          <div className="stat-box stat-returned">
            <div className="stat-value">{stats.returned}</div>
            <div className="stat-label">Returned</div>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {items.length === 0 ? (
        <div className="no-items">No items found.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Category</th>
                <th>Location</th>
                <th>Reported By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>
                    <span className="badge badge-type">{item.type}</span>
                  </td>
                  <td>
                    <span className="badge badge-status">{item.status}</span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>{item.userId?.name || 'Unknown'}</td>
                  <td>
                    <div className="action-buttons">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                        <option value="At Security">At Security</option>
                        <option value="Returned">Returned</option>
                      </select>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
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

export default AdminDashboard;

