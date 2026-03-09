import { useState, useEffect } from 'react';
import { itemsAPI } from '../../services/api';
import Notification from '../../components/Notification';
import './AdminPages.css';

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    atSecurity: 0,
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
      const lostCount = data.filter((i) => i.status === 'Lost').length;
      const foundCount = data.filter((i) => i.status === 'Found').length;
      const atSecurityCount = data.filter((i) => i.status === 'At Security').length;
      const returnedCount = data.filter((i) => i.status === 'Returned').length;
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
      setSuccess('Item status updated.');
      setError('');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      await itemsAPI.delete(itemId);
      setSuccess('Item deleted.');
      setError('');
      fetchItems();
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
        <h1 className="m3-headline-small">Dashboard</h1>
        <p className="m3-body-medium m3-page-subtitle">Manage lost and found items</p>
      </header>

      {items.length > 0 && (
        <section className="m3-stats" aria-label="Statistics">
          <div className="m3-stat-card">
            <span className="m3-stat-value">{stats.total}</span>
            <span className="m3-stat-label">Total</span>
          </div>
          <div className="m3-stat-card m3-stat-lost">
            <span className="m3-stat-value">{stats.lost}</span>
            <span className="m3-stat-label">Lost</span>
          </div>
          <div className="m3-stat-card m3-stat-found">
            <span className="m3-stat-value">{stats.found}</span>
            <span className="m3-stat-label">Found</span>
          </div>
          <div className="m3-stat-card m3-stat-security">
            <span className="m3-stat-value">{stats.atSecurity}</span>
            <span className="m3-stat-label">At Security</span>
          </div>
          <div className="m3-stat-card m3-stat-returned">
            <span className="m3-stat-value">{stats.returned}</span>
            <span className="m3-stat-label">Returned</span>
          </div>
        </section>
      )}

      {error && (
        <div className="m3-banner m3-banner-error" role="alert">
          {error}
        </div>
      )}

      <section className="m3-card m3-card-elevated">
        <div className="m3-card-header">
          <h2 className="m3-title-medium">All items</h2>
        </div>
        {items.length === 0 ? (
          <div className="m3-empty">No items yet.</div>
        ) : (
          <div className="m3-list-container">
            {items.map((item) => (
              <div key={item._id} className="m3-list-item">
                <div className="m3-list-item-content">
                  <span className="m3-list-item-title">{item.title}</span>
                  <div className="m3-list-item-meta">
                    <span className="m3-chip m3-chip-type">{item.type}</span>
                    <span className="m3-chip m3-chip-status">{item.status}</span>
                    <span className="m3-list-item-secondary">{item.category} · {item.location}</span>
                  </div>
                  <span className="m3-list-item-supporting">Reported by {item.userId?.name || '—'}</span>
                </div>
                <div className="m3-list-item-actions">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                    className="m3-select"
                    aria-label="Status"
                  >
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                    <option value="At Security">At Security</option>
                    <option value="Returned">Returned</option>
                  </select>
                  <button
                    type="button"
                    className="m3-button m3-button-tonal m3-button-error"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
