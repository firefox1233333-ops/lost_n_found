import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import './ItemDetail.css';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getOne(id);
      setItem(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading item details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/items" className="btn-back">
          Back to Items
        </Link>
      </div>
    );
  }

  if (!item) {
    return <div className="loading">Item not found</div>;
  }

  return (
    <div className="item-detail-container">
      <Link to="/items" className="btn-back">
        ← Back to Items
      </Link>

      <div className="item-detail-card">
        <div className="item-detail-header">
          <div>
            <span className="badge badge-type">{item.type}</span>
            <span className="badge badge-status">{item.status}</span>
          </div>
          <h1>{item.title}</h1>
        </div>

        <div className="item-detail-content">
          <div className="item-detail-section">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="item-detail-info">
            <div className="info-item">
              <strong>Category:</strong>
              <span>{item.category}</span>
            </div>
            <div className="info-item">
              <strong>Location:</strong>
              <span>📍 {item.location}</span>
            </div>
            <div className="info-item">
              <strong>{item.type === 'lost' ? 'Lost Date:' : 'Found Date:'}</strong>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <strong>Reported by:</strong>
              <span>{item.userId?.name || 'Unknown'}</span>
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <span>{item.userId?.email || 'N/A'}</span>
            </div>
          </div>

          {item.imageUrl && (
            <div className="item-detail-section">
              <h3>Image</h3>
              <img src={item.imageUrl} alt={item.title} className="item-image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;

