import StatusBadge from './StatusBadge';
import './BidCard.css';

export default function BidCard({ bid, showVendor = true, showPO = false, onAccept }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bid-card glass-card animate-in" id={`bid-card-${bid.id}`}>
      <div className="bid-card__header">
        <StatusBadge status={bid.status} />
        {showVendor && (
          <span className="bid-card__vendor">{bid.vendor_company || bid.vendor_email}</span>
        )}
      </div>

      {showPO && (
        <div className="bid-card__po-info">
          <span className="bid-card__po-label">For:</span>
          <span className="bid-card__po-name">{bid.item_description}</span>
        </div>
      )}

      <div className="bid-card__metrics">
        <div className="bid-card__metric">
          <span className="bid-card__metric-label">Bid Amount</span>
          <span className="bid-card__metric-value bid-card__metric-value--price">
            {formatCurrency(bid.bid_amount)}
          </span>
        </div>
        <div className="bid-card__metric">
          <span className="bid-card__metric-label">Delivery</span>
          <span className="bid-card__metric-value">
            {bid.promised_delivery_days} day{bid.promised_delivery_days !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {onAccept && bid.status === 'submitted' && (
        <div className="bid-card__actions">
          <button
            className="btn btn-success btn-sm w-full"
            onClick={() => onAccept(bid.id)}
            id={`accept-bid-${bid.id}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Accept Bid
          </button>
        </div>
      )}
    </div>
  );
}
