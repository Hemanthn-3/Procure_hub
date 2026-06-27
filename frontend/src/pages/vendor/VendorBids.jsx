import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import BidCard from '../../components/BidCard';

export default function VendorBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/vendor/bids');
      setBids(response.data.bids);
    } catch (err) {
      setError('Failed to load your bids.');
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const submitted = bids.filter((b) => b.status === 'submitted').length;
  const accepted = bids.filter((b) => b.status === 'accepted').length;
  const rejected = bids.filter((b) => b.status === 'rejected').length;

  return (
    <div className="page-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title" id="mybids-title">My Bids</h1>
        <p className="page-subtitle">Track the status of all your submitted proposals</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{bids.length}</div>
          <div className="stat-label">Total Bids</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{submitted}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-value">{accepted}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-value">{rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {error && <div className="alert alert-error mb-6">{error}</div>}

      {/* Bids Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
          <span>Loading your bids...</span>
        </div>
      ) : bids.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No bids yet</h3>
          <p className="empty-state-text">
            Visit the marketplace to browse open tenders and submit your first bid.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {bids.map((bid) => (
            <BidCard key={bid.id} bid={bid} showVendor={false} showPO={true} />
          ))}
        </div>
      )}
    </div>
  );
}
