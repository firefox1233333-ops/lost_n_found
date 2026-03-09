import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import './UserPages.css';

const MyReports = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getMyReports();
      setItems(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <header className="user-page-header">
        <h1>My Reports</h1>
        <p className="user-page-subtitle">Items you have reported (lost or found). Track status here.</p>
      </header>

      {error && <div className="user-banner-error" role="alert">{error}</div>}

      {loading ? (
        <div className="user-loading">Loading your reports…</div>
      ) : items.length === 0 ? (
        <div className="user-empty">
          You have not reported any items yet. You can <Link to="/report-lost" style={{ color: 'var(--md-sys-color-primary)' }}>report a lost item</Link> or <Link to="/report-found" style={{ color: 'var(--md-sys-color-primary)' }}>report a found item</Link>.
        </div>
      ) : (
        <div className="user-items-grid">
          {items.map((item) => (
            <Link to={`/items/${item._id}`} key={item._id} className="user-item-card">
              <div className="user-item-card-chips">
                <span className="user-chip-type">{item.type}</span>
                <span className="user-chip-status">{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="user-item-desc">{item.description}</p>
              <div className="user-item-meta">
                <span className="user-chip-status">{item.category}</span>
                <span className="user-item-location">{item.location}</span>
              </div>
              <div className="user-item-date">
                {item.type === 'lost' ? 'Lost: ' : 'Found: '}
                {new Date(item.date).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
