import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../../services/api';
import Notification from '../../components/Notification';
import '../admin/AdminPages.css';
import './SecurityAddFound.css';

export default function SecurityAddFound() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    location: 'Security desk',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    status: 'Found',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        imageUrl: formData.imageUrl || '',
        type: 'found',
        status: formData.status,
      });
      setSuccess('Found item added. It is now in the system.');
      setFormData({
        title: '',
        description: '',
        category: 'Other',
        location: 'Security desk',
        date: new Date().toISOString().split('T')[0],
        imageUrl: '',
        status: 'Found',
      });
      setTimeout(() => navigate('/security'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m3-page">
      <Notification message={success} type="success" onClose={() => setSuccess('')} />
      <header className="m3-page-header">
        <h1 className="m3-headline-small">Add Found Item</h1>
        <p className="m3-body-medium m3-page-subtitle">
          Record an item that was physically submitted at the security desk.
        </p>
      </header>

      {error && (
        <div className="m3-banner m3-banner-error" role="alert">
          {error}
        </div>
      )}

      <section className="m3-card m3-card-elevated sec-add-found-card">
        <form onSubmit={handleSubmit} className="sec-add-found-form">
          <div className="sec-form-row">
            <label className="sec-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., College ID Card"
              className="sec-input"
            />
          </div>
          <div className="sec-form-row">
            <label className="sec-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the item in detail..."
              className="sec-input sec-textarea"
            />
          </div>
          <div className="sec-form-row sec-form-row-inline">
            <div className="sec-form-group">
              <label className="sec-label">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="sec-input sec-select">
                <option value="Documents">Documents</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="sec-form-group">
              <label className="sec-label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Main gate security desk"
                className="sec-input"
              />
            </div>
          </div>
          <div className="sec-form-row sec-form-row-inline">
            <div className="sec-form-group">
              <label className="sec-label">Date found *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="sec-input"
              />
            </div>
            <div className="sec-form-group">
              <label className="sec-label">Initial status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="sec-input sec-select">
                <option value="Found">Found</option>
                <option value="At Security">At Security</option>
              </select>
            </div>
          </div>
          <div className="sec-form-row">
            <label className="sec-label">Image URL (optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="sec-input"
            />
          </div>
          <div className="sec-form-actions">
            <button type="button" onClick={() => navigate('/security')} className="m3-button m3-button-tonal">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="m3-button m3-button-filled">
              {loading ? 'Adding…' : 'Add found item'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
