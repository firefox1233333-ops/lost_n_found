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
      <section className="home-hero" aria-labelledby="home-title">
        <h1 id="home-title">Lost & Found Management System</h1>
        <p>Helping you recover lost items and return found items on campus</p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="home-btn-primary">
              Get Started
            </Link>
            <Link to="/items" className="home-btn-secondary">
              Browse Items
            </Link>
          </div>
        )}
      </section>

      {!loading && (
        <section className="stats-section" aria-label="Current statistics">
          <h2>Current Statistics</h2>
          <div className="stats-grid">
            <div className="home-stat-card">
              <div className="home-stat-value">{stats.total}</div>
              <div className="home-stat-label">Total Items</div>
            </div>
            <div className="home-stat-card stat-lost">
              <div className="home-stat-value">{stats.lost}</div>
              <div className="home-stat-label">Lost Items</div>
            </div>
            <div className="home-stat-card stat-found">
              <div className="home-stat-value">{stats.found}</div>
              <div className="home-stat-label">Found Items</div>
            </div>
            <div className="home-stat-card stat-returned">
              <div className="home-stat-value">{stats.returned}</div>
              <div className="home-stat-label">Returned Items</div>
            </div>
          </div>
        </section>
      )}

      <section className="features-section" aria-labelledby="how-it-works">
        <h2 id="how-it-works">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" aria-hidden>1</div>
            <h3>Report Lost Items</h3>
            <p>Lost something? Report it with details and location to help others find it.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden>2</div>
            <h3>Report Found Items</h3>
            <p>Found something? Report it so the owner can claim it.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden>3</div>
            <h3>Search & Filter</h3>
            <p>Easily search and filter items by category, location, type, and status.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden>4</div>
            <h3>Admin Management</h3>
            <p>Admins can verify items and update status to track the recovery process.</p>
          </div>
        </div>
      </section>

      {user && (
        <section className="quick-actions" aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/report-lost" className="action-card">
              <span className="action-icon" aria-hidden>&rarr;</span>
              <span>Report Lost Item</span>
            </Link>
            <Link to="/report-found" className="action-card">
              <span className="action-icon" aria-hidden>&rarr;</span>
              <span>Report Found Item</span>
            </Link>
            <Link to="/items" className="action-card">
              <span className="action-icon" aria-hidden>&rarr;</span>
              <span>Browse All Items</span>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="action-card">
                <span className="action-icon" aria-hidden>&rarr;</span>
                <span>Admin Dashboard</span>
              </Link>
            )}
            {user.role === 'security' && (
              <Link to="/security" className="action-card">
                <span className="action-icon" aria-hidden>&rarr;</span>
                <span>Security Dashboard</span>
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
