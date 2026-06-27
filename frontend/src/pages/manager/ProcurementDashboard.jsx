import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import POCard from '../../components/POCard';
import './ProcurementDashboard.css';

export default function ProcurementDashboard() {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    item_description: '',
    quantity: '',
    target_delivery_date: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/procurement/po');
      setPurchaseOrders(response.data.purchase_orders);
    } catch (err) {
      setError('Failed to load purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormLoading(true);

    try {
      await axiosClient.post('/procurement/po', formData);
      setSuccess('Purchase order created successfully!');
      setFormData({ item_description: '', quantity: '', target_delivery_date: '' });
      setShowCreateForm(false);
      fetchPOs();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.join(', ') ||
        'Failed to create purchase order.';
      setError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  // Stats
  const totalPOs = purchaseOrders.length;
  const openPOs = purchaseOrders.filter((po) => po.status === 'open_for_bids').length;
  const awardedPOs = purchaseOrders.filter((po) => po.status === 'awarded').length;
  const totalBids = purchaseOrders.reduce((sum, po) => sum + (po.bid_count || 0), 0);

  return (
    <div className="page-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Header */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title" id="dashboard-title">Procurement Dashboard</h1>
          <p className="page-subtitle">Manage your corporate RFQs and vendor bids</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
          id="btn-create-po"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New RFQ
        </button>
      </div>

      {/* Alerts */}
      {success && <div className="alert alert-success mb-6">{success}</div>}
      {error && <div className="alert alert-error mb-6">{error}</div>}

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{totalPOs}</div>
          <div className="stat-label">Total RFQs</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-value">{openPOs}</div>
          <div className="stat-label">Open for Bids</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-value">{awardedPOs}</div>
          <div className="stat-label">Awarded</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalBids}</div>
          <div className="stat-label">Total Bids</div>
        </div>
      </div>

      {/* Create PO Form Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New RFQ</h2>
            <form onSubmit={handleCreatePO} className="flex flex-col gap-4" id="create-po-form">
              <div className="form-group">
                <label className="form-label" htmlFor="item-desc">Item Description</label>
                <textarea
                  id="item-desc"
                  className="form-textarea"
                  placeholder="Describe the items you need to procure..."
                  value={formData.item_description}
                  onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  className="form-input"
                  placeholder="100"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  min={1}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="delivery-date">Target Delivery Date</label>
                <input
                  id="delivery-date"
                  type="date"
                  className="form-input"
                  value={formData.target_delivery_date}
                  onChange={(e) => setFormData({ ...formData, target_delivery_date: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3" style={{ marginTop: 'var(--space-2)' }}>
                <button type="submit" className="btn btn-primary w-full" disabled={formLoading} id="btn-submit-po">
                  {formLoading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Create RFQ'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Orders Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
          <span>Loading purchase orders...</span>
        </div>
      ) : purchaseOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No RFQs yet</h3>
          <p className="empty-state-text">
            Create your first Request for Quote to start receiving competitive bids from vendors.
          </p>
          <button
            className="btn btn-primary mt-6"
            onClick={() => setShowCreateForm(true)}
          >
            Create Your First RFQ
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {purchaseOrders.map((po) => (
            <POCard
              key={po.id}
              po={po}
              onClick={() => navigate(`/dashboard/po/${po.id}/bids`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
