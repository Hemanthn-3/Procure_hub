import StatusBadge from './StatusBadge';
import './POCard.css';

export default function POCard({ po, onClick, showCompany = false, actionLabel, onAction }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="po-card glass-card animate-in" onClick={onClick} id={`po-card-${po.id}`}>
      <div className="po-card__header">
        <div className="po-card__id">RFQ-{String(po.id).padStart(4, '0')}</div>
        <StatusBadge status={po.status} />
      </div>

      <h3 className="po-card__title">{po.item_description}</h3>

      <div className="po-card__details">
        <div className="po-card__detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <span>Qty: <strong>{po.quantity}</strong></span>
        </div>
        <div className="po-card__detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Deliver by: <strong>{formatDate(po.target_delivery_date)}</strong></span>
        </div>
        {showCompany && po.company && (
          <div className="po-card__detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>{po.company}</span>
          </div>
        )}
        {po.bid_count !== undefined && (
          <div className="po-card__detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span><strong>{po.bid_count}</strong> bid{po.bid_count !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="po-card__actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction(po);
            }}
            id={`po-action-${po.id}`}
          >
            {actionLabel}
          </button>
        </div>
      )}

      <div className="po-card__footer">
        <span className="po-card__date">Created {formatDate(po.created_at)}</span>
      </div>
    </div>
  );
}
