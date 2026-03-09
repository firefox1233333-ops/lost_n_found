import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemsAPI } from '../services/api';
import Notification from '../components/Notification';
import './UserPages.css';

const ReportItem = ({ itemType }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    location: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return false;
    }
    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters');
      return false;
    }
    if (formData.location.trim().length < 2) {
      setError('Location must be at least 2 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await itemsAPI.create({
        ...formData,
        type: itemType,
      });
      setSuccess(`${itemType === 'lost' ? 'Lost' : 'Found'} item reported successfully.`);
      setTimeout(() => navigate('/items'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <Notification message={success} type="success" onClose={() => setSuccess('')} />
      <div className="user-report-card">
        <h2>Report {itemType === 'lost' ? 'Lost' : 'Found'} Item</h2>
        {error && <div className="user-banner-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="user-report-form">
          <div className="user-report-row">
            <label className="user-report-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., College ID Card"
              className="user-report-input"
            />
          </div>
          <div className="user-report-row">
            <label className="user-report-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the item in detail..."
              className="user-report-input user-report-textarea"
            />
          </div>
          <div className="user-report-row user-report-row-inline">
            <div className="user-report-group">
              <label className="user-report-label">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="user-report-input user-report-select">
                <option value="Documents">Documents</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="user-report-group">
              <label className="user-report-label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Library, Cafeteria"
                className="user-report-input"
              />
            </div>
          </div>
          <div className="user-report-row user-report-row-inline">
            <div className="user-report-group">
              <label className="user-report-label">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="user-report-input"
              />
            </div>
            <div className="user-report-group">
              <label className="user-report-label">Image URL (optional)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="user-report-input"
              />
            </div>
          </div>
          <div className="user-report-actions">
            <button type="button" onClick={() => navigate('/items')} className="user-btn-clear">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="user-btn-submit">
              {loading ? 'Submitting…' : `Report ${itemType === 'lost' ? 'Lost' : 'Found'} Item`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItem;
