import { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getAll();
      setItems(data);
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
      setSelectedItem(null);
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
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all lost and found items</p>
      </div>

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

