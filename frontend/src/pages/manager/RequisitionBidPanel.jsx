import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import BidCard from '../../components/BidCard';
import StatusBadge from '../../components/StatusBadge';
import './RequisitionBidPanel.css';

export default function RequisitionBidPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPO] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    fetchBids();
  }, [id]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/procurement/po/${id}/bids`);
      setPO(response.data.purchase_order);
      setBids(response.data.bids);
    } catch (err) {
      setError('Failed to load bid data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to accept this bid? Other bids will be rejected.')) {
      return;
    }

    setAccepting(bidId);
    setError('');
    setSuccess('');

    try {
      await axiosClient.put(`/procurement/bids/${bidId}/accept`);
      setSuccess('Bid accepted! Purchase order has been awarded.');
      fetchBids();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept bid.');
    } finally {
      setAccepting(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner spinner-lg"></div>
        <span>Loading bid panel...</span>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="bg-glow bg-glow-1"></div>

      {/* Back button */}
      <button className="bid-panel__back" onClick={() => navigate('/dashboard')} id="btn-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Dashboard
      </button>

      {/* PO Details Header */}
      {po && (
        <div className="bid-panel__header glass-card">
          <div className="bid-panel__header-top">
            <div>
              <span className="bid-panel__rfq-id">RFQ-{String(po.id).padStart(4, '0')}</span>
              <h1 className="bid-panel__title">{po.item_description}</h1>
            </div>
            <StatusBadge status={po.status} />
          </div>
          <div className="bid-panel__meta">
            <div className="bid-panel__meta-item">
              <span className="bid-panel__meta-label">Quantity</span>
              <span className="bid-panel__meta-value">{po.quantity} units</span>
            </div>
            <div className="bid-panel__meta-item">
              <span className="bid-panel__meta-label">Delivery By</span>
              <span className="bid-panel__meta-value">{formatDate(po.target_delivery_date)}</span>
            </div>
            <div className="bid-panel__meta-item">
              <span className="bid-panel__meta-label">Total Bids</span>
              <span className="bid-panel__meta-value">{bids.length}</span>
            </div>
            {bids.length > 0 && (
              <div className="bid-panel__meta-item">
                <span className="bid-panel__meta-label">Lowest Bid</span>
                <span className="bid-panel__meta-value bid-panel__meta-value--highlight">
                  {formatCurrency(Math.min(...bids.map((b) => b.bid_amount)))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alerts */}
      {success && <div className="alert alert-success mt-6">{success}</div>}
      {error && <div className="alert alert-error mt-6">{error}</div>}

      {/* Bids Section */}
      <div className="bid-panel__section">
        <h2 className="bid-panel__section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Vendor Quotes
        </h2>

        {bids.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">No bids yet</h3>
            <p className="empty-state-text">
              Vendors haven't submitted quotes for this RFQ yet. Check back later.
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {bids.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                showVendor={true}
                onAccept={po?.status === 'open_for_bids' ? handleAcceptBid : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
