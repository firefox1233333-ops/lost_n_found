import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemsAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    returned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [allItems, lostItems, foundItems, returnedItems] = await Promise.all([
        itemsAPI.getAll(),
        itemsAPI.getAll({ status: 'Lost' }),
        itemsAPI.getAll({ status: 'Found' }),
        itemsAPI.getAll({ status: 'Returned' }),
      ]);

      setStats({
        total: allItems.length,
        lost: lostItems.length,
        found: foundItems.length,
        returned: returnedItems.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats if error occurs (backend not running)
      setStats({
        total: 0,
        lost: 0,
        found: 0,
        returned: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Lost & Found Management System</h1>
        <p>Helping you recover lost items and return found items on campus</p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn-primary-large">
              Get Started
            </Link>
            <Link to="/items" className="btn-secondary-large">
              Browse Items
            </Link>
          </div>
        )}
      </div>

      {!loading && (
        <div className="stats-section">
          <h2>Current Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Items</div>
            </div>
            <div className="stat-card stat-lost">
              <div className="stat-number">{stats.lost}</div>
              <div className="stat-label">Lost Items</div>
            </div>
            <div className="stat-card stat-found">
              <div className="stat-number">{stats.found}</div>
              <div className="stat-label">Found Items</div>
            </div>
            <div className="stat-card stat-returned">
              <div className="stat-number">{stats.returned}</div>
              <div className="stat-label">Returned Items</div>
            </div>
          </div>
        </div>
      )}

      <div className="features-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Report Lost Items</h3>
            <p>Lost something? Report it with details and location to help others find it.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Report Found Items</h3>
            <p>Found something? Report it so the owner can claim it.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔎</div>
            <h3>Search & Filter</h3>
            <p>Easily search and filter items by category, location, type, and status.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Admin Management</h3>
            <p>Admins can verify items and update status to track the recovery process.</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/report-lost" className="action-card">
              <span className="action-icon">➕</span>
              <span>Report Lost Item</span>
            </Link>
            <Link to="/report-found" className="action-card">
              <span className="action-icon">📦</span>
              <span>Report Found Item</span>
            </Link>
            <Link to="/items" className="action-card">
              <span className="action-icon">🔍</span>
              <span>Browse All Items</span>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="action-card">
                <span className="action-icon">⚙️</span>
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

