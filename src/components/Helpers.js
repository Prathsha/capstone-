import React from 'react';

export function formatCurrency(value) {
  if (value == null) return '—';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function priorityColor(priority) {
  switch ((priority || '').toLowerCase()) {
    case 'critical': return 'red';
    case 'high':     return 'orange';
    case 'medium':   return 'yellow';
    case 'low':      return 'green';
    default:         return 'gray';
  }
}

export function healthColor(score) {
  if (score >= 70) return 'good';
  if (score >= 55) return 'medium';
  if (score >= 40) return 'bad';
  return 'critical';
}

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />
      <div>Loading…</div>
    </div>
  );
}

// ── Error block ───────────────────────────────────────────────────────────────
export function ErrorBlock({ message }) {
  return (
    <div className="error-state">
      <strong>Error:</strong> {message || 'Something went wrong. Is the backend running?'}
    </div>
  );
}

// ── Tag component ─────────────────────────────────────────────────────────────
export function Tag({ color = 'gray', children }) {
  return <span className={`tag tag--${color}`}>{children}</span>;
}

// ── Health score badge ────────────────────────────────────────────────────────
export function HealthBadge({ score }) {
  const cls = healthColor(score);
  return (
    <div className="health-score">
      <div className={`health-score__circle health-score__circle--${cls}`}>
        {score}
      </div>
    </div>
  );
}

// ── Confidence bar ────────────────────────────────────────────────────────────
export function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  return (
    <span className="action-item__confidence">
      <div className="confidence-bar">
        <div className="confidence-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span>{pct}%</span>
    </span>
  );
}
