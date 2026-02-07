import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import './ItemsList.css';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const data = await itemsAPI.getAll(activeFilters);
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
    });
  };

  return (
    <div className="items-container">
      <div className="items-header">
        <h1>Lost & Found Items</h1>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <input
            type="text"
            placeholder="Search items..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
            <option value="Returned">Returned</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Documents">Documents</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={clearFilters} className="btn-clear">
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="no-items">No items found. Try adjusting your filters.</div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <Link to={`/items/${item._id}`} key={item._id} className="item-card">
              <div className="item-badge item-badge-type">{item.type}</div>
              <div className="item-badge item-badge-status">{item.status}</div>
              <h3>{item.title}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-details">
                <span className="item-category">{item.category}</span>
                <span className="item-location">📍 {item.location}</span>
              </div>
              <div className="item-date">
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

