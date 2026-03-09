import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../../services/api';
import Notification from '../../components/Notification';
import '../admin/AdminPages.css';

export default function SecurityDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [stats, setStats] = useState({
    found: 0,
    atSecurity: 0,
    returned: 0,
    total: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getAll();
      setItems(data);
      const foundCount = data.filter((i) => i.status === 'Found').length;
      const atSecurityCount = data.filter((i) => i.status === 'At Security').length;
      const returnedCount = data.filter((i) => i.status === 'Returned').length;
      setStats({
        found: foundCount,
        atSecurity: atSecurityCount,
        returned: returnedCount,
        total: data.length,
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
      setSuccess(
        newStatus === 'At Security'
          ? 'Item marked as At Security.'
          : 'Item marked as Handed Over (Returned).'
      );
      setError('');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterType && item.type !== filterType) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

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
        <h1 className="m3-headline-small">Security Dashboard</h1>
        <p className="m3-body-medium m3-page-subtitle">
          Manage items submitted at the security desk. View all reports, verify details, and update status.
        </p>
      </header>

      <section className="m3-stats" aria-label="Statistics">
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
        <div className="m3-stat-card">
          <span className="m3-stat-value">{stats.total}</span>
          <span className="m3-stat-label">Total Reports</span>
        </div>
      </section>

      {error && (
        <div className="m3-banner m3-banner-error" role="alert">
          {error}
        </div>
      )}

      <section className="m3-card m3-card-elevated">
        <div className="m3-card-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <h2 className="m3-title-medium">All reports</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="m3-select"
              aria-label="Filter by type"
            >
              <option value="">All types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="m3-select"
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
              <option value="At Security">At Security</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>
        {filteredItems.length === 0 ? (
          <div className="m3-empty">
            {items.length === 0 ? 'No items reported yet.' : 'No items match the current filters.'}
          </div>
        ) : (
          <div className="m3-list-container">
            {filteredItems.map((item) => (
              <div key={item._id} className="m3-list-item">
                <div className="m3-list-item-content">
                  <Link to={`/items/${item._id}`} className="m3-list-item-title" style={{ color: 'inherit', textDecoration: 'underline' }}>
                    {item.title}
                  </Link>
                  <div className="m3-list-item-meta">
                    <span className="m3-chip m3-chip-type">{item.type}</span>
                    <span className="m3-chip m3-chip-status">{item.status}</span>
                    <span className="m3-list-item-secondary">{item.category} · {item.location}</span>
                  </div>
                  <span className="m3-list-item-supporting">Reported by {item.userId?.name || '—'}</span>
                </div>
                <div className="m3-list-item-actions">
                  <button
                    type="button"
                    className="m3-button m3-button-tonal"
                    onClick={() => handleStatusUpdate(item._id, 'At Security')}
                    disabled={item.status === 'At Security'}
                    title="Mark as received at security desk"
                  >
                    At Security
                  </button>
                  <button
                    type="button"
                    className="m3-button m3-button-tonal"
                    onClick={() => handleStatusUpdate(item._id, 'Returned')}
                    disabled={item.status === 'Returned'}
                    title="Mark as handed over to owner"
                  >
                    Handed Over
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
