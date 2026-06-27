import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './SupplierBiddingBox.css';

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    open_for_bids: 'bidbox__badge--open',
    open:    'bidbox__badge--open',
    closed:  'bidbox__badge--closed',
    pending: 'bidbox__badge--pending',
    awarded: 'bidbox__badge--closed',
  };
  const labels = {
    open_for_bids: 'Open for Bids',
    open: 'Open',
    closed: 'Closed',
    pending: 'Pending',
    awarded: 'Awarded',
  };
  const label = labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`bidbox__badge ${map[status] ?? map.pending}`}>
      <span className="bidbox__badge-dot" />
      {label}
    </span>
  );
}

export default function SupplierBiddingBox() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    bid_amount: '',
    promised_delivery_days: '',
  });

  useEffect(() => { fetchPO(); }, [id]);

  const fetchPO = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/vendor/marketplace');
      const found = response.data.purchase_orders.find((p) => p.id === parseInt(id));
      if (found) setPO(found);
      else setError('Purchase order not found or no longer accepting bids.');
    } catch {
      setError('Failed to load purchase order details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await axiosClient.post('/vendor/bids/submit', {
        po_id: parseInt(id),
        bid_amount: parseFloat(formData.bid_amount),
        promised_delivery_days: parseInt(formData.promised_delivery_days),
      });
      setSuccess('Your bid has been submitted successfully!');
      setFormData({ bid_amount: '', promised_delivery_days: '' });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.join(', ') ||
        'Failed to submit bid.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  if (loading) {
    return (
      <div className="bidbox__page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="bidbox__spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div className="bidbox__page">
      <div className="bidbox__glow" />

      <div className="bidbox__container">
        {/* Back */}
        <button className="bidbox__back" onClick={() => navigate('/marketplace')} id="btn-back-marketplace">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Marketplace
        </button>

        <div className="bidbox__layout">

          {/* ── PO Details ── */}
          {po && (
            <div className="bidbox__card">
              <div className="bidbox__card-inner">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="bidbox__rfq-id">RFQ-{String(po.id).padStart(4, '0')}</span>
                  <StatusBadge status={po.status} />
                </div>

                <h1 className="bidbox__title">{po.item_description}</h1>

                <div className="bidbox__info-grid">
                  <div className="bidbox__info-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    <div>
                      <span className="bidbox__info-label">Quantity Required</span>
                      <span className="bidbox__info-value">{po.quantity} units</span>
                    </div>
                  </div>

                  <div className="bidbox__info-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <div>
                      <span className="bidbox__info-label">Target Delivery</span>
                      <span className="bidbox__info-value">{formatDate(po.target_delivery_date)}</span>
                    </div>
                  </div>

                  <div className="bidbox__info-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <div>
                      <span className="bidbox__info-label">Requesting Company</span>
                      <span className="bidbox__info-value">{po.company}</span>
                    </div>
                  </div>
                </div>

                <p className="bidbox__fine-print">
                  By submitting a bid you agree to the platform&apos;s supplier terms.
                  Prices quoted are binding for 30 days after submission.
                </p>
              </div>
            </div>
          )}

          {/* ── Bid Form ── */}
          <div className="bidbox__card bidbox__form-card">
            <div className="bidbox__card-inner">
              <h2 className="bidbox__form-title">
                <span className="bidbox__form-title-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </span>
                Submit Your Quote
              </h2>

              {success && (
                <div className="bidbox__alert-success">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {success}
                </div>
              )}
              {error && (
                <div className="bidbox__alert-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {error}
                </div>
              )}

              {!success && (
                <form onSubmit={handleSubmit} className="bidbox__form" id="bid-form">

                  {/* Bid Amount */}
                  <div className="bidbox__form-group">
                    <label className="bidbox__label" htmlFor="bid-amount">Bid Amount (INR)</label>
                    <div className="bidbox__input-wrapper">
                      <span className="bidbox__input-prefix">₹</span>
                      <input
                        id="bid-amount"
                        type="number"
                        className="bidbox__input"
                        placeholder="0.00"
                        value={formData.bid_amount}
                        onChange={(e) => setFormData({ ...formData, bid_amount: e.target.value })}
                        required
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Delivery Days */}
                  <div className="bidbox__form-group">
                    <label className="bidbox__label" htmlFor="delivery-days">Promised Delivery (Days)</label>
                    <div className="bidbox__input-wrapper">
                      <span className="bidbox__input-prefix">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                        </svg>
                      </span>
                      <input
                        id="delivery-days"
                        type="number"
                        className="bidbox__input"
                        placeholder="30"
                        value={formData.promised_delivery_days}
                        onChange={(e) => setFormData({ ...formData, promised_delivery_days: e.target.value })}
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Estimated total */}
                  {formData.bid_amount && po && (
                    <div className="bidbox__total">
                      <span className="bidbox__total-label">Estimated total</span>
                      <span className="bidbox__total-value">
                        ₹{(parseFloat(formData.bid_amount) * po.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bidbox__btn-submit"
                    disabled={submitting}
                    id="btn-submit-bid"
                  >
                    {submitting ? (
                      <><div className="bidbox__spinner" /> Submitting...</>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Submit Bid
                      </>
                    )}
                  </button>
                </form>
              )}

              {success && (
                <button className="bidbox__btn-browse" onClick={() => navigate('/marketplace')}>
                  Browse More Tenders
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
