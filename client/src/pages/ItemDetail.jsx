import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import './UserPages.css';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const { user } = useAuth();

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

  const handleClaim = async () => {
    setClaimError('');
    setClaimSuccess('');
    setClaimLoading(true);
    try {
      await itemsAPI.claim(item._id);
      setClaimSuccess('Claim submitted successfully. Security will verify and contact you.');
      await fetchItem();
    } catch (err) {
      setClaimError(err.message || 'Failed to submit claim');
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return <div className="user-page"><div className="user-loading">Loading item details…</div></div>;
  }

  if (error) {
    return (
      <div className="user-page">
        <div className="user-banner-error" role="alert">{error}</div>
        <Link to="/items" className="user-link-back">Back to Items</Link>
      </div>
    );
  }

  if (!item) {
    return <div className="user-page"><div className="user-loading">Item not found</div></div>;
  }

  const isClaimedByMe = user && item.claimedBy && String(item.claimedBy._id || item.claimedBy) === String(user._id);
  const isClaimedByOther = item.claimedBy && !isClaimedByMe;
  const canClaim = user && user.role === 'user' && item.type === 'found' && item.status !== 'Returned';

  return (
    <div className="user-page">
      <Notification
        message={claimSuccess}
        type="success"
        onClose={() => setClaimSuccess('')}
      />
      <Link to="/items" className="user-link-back">Back to Items</Link>

      <div className="user-detail-card">
        <div className="user-detail-header">
          <span className="user-chip-type">{item.type}</span>
          <span className="user-chip-status">{item.status}</span>
          <h1 className="user-detail-title">{item.title}</h1>
        </div>

        <div className="user-detail-content">
          <div className="user-detail-section">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="user-detail-info">
            <div className="user-info-item">
              <strong>Category</strong>
              <span>{item.category}</span>
            </div>
            <div className="user-info-item">
              <strong>Location</strong>
              <span>{item.location}</span>
            </div>
            <div className="user-info-item">
              <strong>{item.type === 'lost' ? 'Lost date' : 'Found date'}</strong>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="user-info-item">
              <strong>Reported by</strong>
              <span>{item.userId?.name || 'Unknown'}</span>
            </div>
            {item.userId?.email && (
              <div className="user-info-item">
                <strong>Contact</strong>
                <span>{item.userId.email}</span>
              </div>
            )}
            {item.claimedBy && (
              <div className="user-info-item">
                <strong>Claimed by</strong>
                <span>{item.claimedBy?.name ?? 'Pending'}</span>
              </div>
            )}
            {item.claimStatus && (
              <div className="user-info-item">
                <strong>Claim status</strong>
                <span>{item.claimStatus}</span>
              </div>
            )}
          </div>

          {item.imageUrl && (
            <div className="user-detail-section">
              <h3>Image</h3>
              <img src={item.imageUrl} alt={item.title} className="user-detail-image" />
            </div>
          )}

          {canClaim && (
            <div className="user-claim-section">
              {isClaimedByMe && (
                <p className="user-claim-msg">
                  You have claimed this item. Status: {item.claimStatus || 'Pending'}. Security will verify and contact you when it is ready for pickup.
                </p>
              )}
              {isClaimedByOther && (
                <p className="user-claim-msg">This item has been claimed by another user.</p>
              )}
              {!item.claimedBy && (
                <>
                  <h3>Claim this item</h3>
                  <p className="user-claim-msg">If this is your lost item, submit a claim. Security will verify ownership and contact you.</p>
                  {claimError && <div className="user-banner-error">{claimError}</div>}
                  <button
                    type="button"
                    className="user-btn-claim"
                    disabled={claimLoading}
                    onClick={handleClaim}
                  >
                    {claimLoading ? 'Submitting…' : 'Claim this item'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
