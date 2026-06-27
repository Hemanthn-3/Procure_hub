import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import POCard from '../../components/POCard';
import './VendorMarketplace.css';

export default function VendorMarketplace() {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/vendor/marketplace');
      setPurchaseOrders(response.data.purchase_orders);
    } catch (err) {
      setError('Failed to load marketplace.');
    } finally {
      setLoading(false);
    }
  };

  // Filter POs by search term
  const filteredPOs = purchaseOrders.filter((po) =>
    po.item_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title" id="marketplace-title">Vendor Marketplace</h1>
        <p className="page-subtitle">Browse open tenders and submit competitive proposals</p>
      </div>

      {/* Search & Stats */}
      <div className="marketplace__toolbar">
        <div className="marketplace__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="marketplace__search-input"
            placeholder="Search tenders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-marketplace"
          />
        </div>
        <div className="marketplace__count">
          <span className="marketplace__count-number">{filteredPOs.length}</span>
          <span className="marketplace__count-label">Open Tender{filteredPOs.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {error && <div className="alert alert-error mb-6">{error}</div>}

      {/* PO Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
          <span>Loading marketplace...</span>
        </div>
      ) : filteredPOs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <h3 className="empty-state-title">
            {searchTerm ? 'No matching tenders' : 'No open tenders'}
          </h3>
          <p className="empty-state-text">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'There are currently no purchase orders open for bids. Check back later.'}
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {filteredPOs.map((po) => (
            <POCard
              key={po.id}
              po={po}
              showCompany={true}
              actionLabel="Submit Quote"
              onAction={(po) => navigate(`/marketplace/bid/${po.id}`)}
              onClick={() => navigate(`/marketplace/bid/${po.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
