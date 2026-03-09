import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './UserPages.css';

const ItemsList = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: '',
    search: '',
    reportedBy: '',
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let data;
      if (filters.reportedBy === 'me' && user) {
        data = await itemsAPI.getMyReports();
        if (filters.type) data = data.filter((i) => i.type === filters.type);
        if (filters.status) data = data.filter((i) => i.status === filters.status);
        if (filters.category) data = data.filter((i) => i.category === filters.category);
        if (filters.search) {
          const s = filters.search.toLowerCase();
          data = data.filter(
            (i) =>
              i.title.toLowerCase().includes(s) || (i.description && i.description.toLowerCase().includes(s))
          );
        }
      } else {
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([k, value]) => value !== '' && k !== 'reportedBy')
        );
        data = await itemsAPI.getAll(activeFilters);
      }
      setItems(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      category: '',
      search: '',
      reportedBy: user ? '' : filters.reportedBy,
    });
  };

  return (
    <div className="user-page">
      <header className="user-page-header">
        <h1>Lost & Found Items</h1>
        <p className="user-page-subtitle">Search and filter items reported on campus</p>
      </header>

      <div className="user-filters">
        <input
          type="text"
          placeholder="Search items..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="user-filter-input"
          aria-label="Search"
        />
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="user-filter-select"
          aria-label="Type"
        >
          <option value="">All types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="user-filter-select"
          aria-label="Status"
        >
          <option value="">All status</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
          <option value="At Security">At Security</option>
          <option value="Returned">Returned</option>
        </select>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="user-filter-select"
          aria-label="Category"
        >
          <option value="">All categories</option>
          <option value="Documents">Documents</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Clothing">Clothing</option>
          <option value="Other">Other</option>
        </select>
        {user && (
          <select
            value={filters.reportedBy}
            onChange={(e) => handleFilterChange('reportedBy', e.target.value)}
            className="user-filter-select"
            aria-label="Scope"
          >
            <option value="">All items</option>
            <option value="me">My reports</option>
          </select>
        )}
        <button type="button" onClick={clearFilters} className="user-btn-clear">
          Clear
        </button>
      </div>

      {error && <div className="user-banner-error" role="alert">{error}</div>}

      {loading ? (
        <div className="user-loading">Loading items…</div>
      ) : items.length === 0 ? (
        <div className="user-empty">
          {filters.reportedBy === 'me' ? 'You have not reported any items yet.' : 'No items found. Try adjusting your filters.'}
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

export default ItemsList;
