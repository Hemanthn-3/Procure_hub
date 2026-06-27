import './StatusBadge.css';

const statusConfig = {
  // PO statuses
  open_for_bids: { label: 'Open for Bids', variant: 'blue' },
  awarded: { label: 'Awarded', variant: 'emerald' },
  closed: { label: 'Closed', variant: 'muted' },

  // Bid statuses
  submitted: { label: 'Submitted', variant: 'amber' },
  accepted: { label: 'Accepted', variant: 'emerald' },
  rejected: { label: 'Rejected', variant: 'red' },

  // User statuses
  active: { label: 'Active', variant: 'emerald' },
  inactive: { label: 'Inactive', variant: 'muted' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, variant: 'muted' };

  return (
    <span className={`status-badge status-badge--${config.variant}`} id={`status-${status}`}>
      <span className="status-badge__dot"></span>
      {config.label}
    </span>
  );
}
