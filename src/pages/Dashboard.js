import React from 'react';
import {
  Spinner, ErrorBlock, Tag, HealthBadge, ConfidenceBar,
  formatCurrency, formatDate, priorityColor,
} from '../components/Helpers';

// ── Action item for pending list ──────────────────────────────────────────────
function PendingActionItem({ item }) {
  const color = priorityColor(item.priority);
  return (
    <div className="action-item">
      <div className={`action-item__priority-bar action-item__priority-bar--${item.priority}`} />
      <div className="action-item__body">
        <div className="action-item__header">
          <span className="action-item__account">{item.account_name}</span>
          <Tag color={color}>{item.type}</Tag>
          <Tag color={color}>{(item.priority || '').toUpperCase()}</Tag>
        </div>
        <div className="action-item__description">{item.description}</div>
        <div className="action-item__meta">
          <span>Due: {formatDate(item.due_date)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Suggested action item ─────────────────────────────────────────────────────
function SuggestedActionItem({ item }) {
  const isFromChat = item.source === 'gemini';
  return (
    <div className={`action-item${isFromChat ? ' action-item--chat' : ''}`}>
      <div className="action-item__priority-bar" style={{ background: isFromChat ? 'var(--ibm-purple-50)' : 'var(--ibm-blue-50)' }} />
      <div className="action-item__body">
        <div className="action-item__header">
          <span className="action-item__account">{item.account_name}</span>
          <Tag color={isFromChat ? 'purple' : 'blue'}>{item.type}</Tag>
          {isFromChat && <Tag color="purple">Chat</Tag>}
        </div>
        <div className="action-item__description">{item.description}</div>
        <div className="action-item__meta">
          <ConfidenceBar value={item.confidence} />
          <span>AI Confidence</span>
        </div>
      </div>
    </div>
  );
}

// ── Quota progress bar ────────────────────────────────────────────────────────
function QuotaOverview({ summary }) {
  const { total_quota, closed, pipeline, attainment_pct, coverage_pct } = summary;
  const closedPct = Math.min((closed / total_quota) * 100, 100);
  const pipelinePct = Math.min((pipeline / total_quota) * 100, 100 - closedPct);

  return (
    <div className="quota-overview">
      <div>
        <div className="quota-overview__title">Total Quota</div>
        <div className="quota-overview__value">{formatCurrency(total_quota)}</div>
      </div>
      <div>
        <div className="quota-overview__title">Closed Won</div>
        <div className="quota-overview__value" style={{ color: 'var(--ibm-green-40)' }}>
          {formatCurrency(closed)}
        </div>
      </div>
      <div>
        <div className="quota-overview__title">In Pipeline</div>
        <div className="quota-overview__value" style={{ color: 'var(--ibm-blue-40)' }}>
          {formatCurrency(pipeline)}
        </div>
      </div>

      <div className="quota-overview__progress">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--ibm-gray-40)' }}>
            Attainment: <strong style={{ color: '#fff' }}>{attainment_pct}%</strong>
          </span>
          <span style={{ fontSize: 12, color: 'var(--ibm-gray-40)' }}>
            Coverage: <strong style={{ color: '#fff' }}>{coverage_pct}%</strong>
          </span>
        </div>
        <div className="quota-progress-bar">
          <div className="quota-progress-bar__closed"   style={{ width: `${closedPct}%` }} />
          <div className="quota-progress-bar__pipeline" style={{ left: `${closedPct}%`, width: `${pipelinePct}%` }} />
        </div>
        <div className="quota-legend">
          <div className="quota-legend__item">
            <div className="quota-legend__dot quota-legend__dot--closed" />
            Closed Won
          </div>
          <div className="quota-legend__item">
            <div className="quota-legend__dot quota-legend__dot--pipeline" />
            Pipeline
          </div>
          <div className="quota-legend__item">
            <div className="quota-legend__dot quota-legend__dot--gap" />
            Gap
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Per-account attainment row ────────────────────────────────────────────────
function AccountAttainmentRow({ account }) {
  const pct = Math.round((account.closed / account.quota) * 100);
  const color = pct >= 80 ? 'var(--ibm-green-50)' : pct >= 50 ? 'var(--ibm-yellow-30)' : 'var(--ibm-red-60)';
  return (
    <div className="account-row">
      <HealthBadge score={account.health_score} />
      <div className="account-row__name">{account.name.replace('THE ', '')}</div>
      <Tag color={account.tier === 'Premier' ? 'purple' : account.tier === 'Strategic' ? 'blue' : 'gray'}>
        {account.tier}
      </Tag>
      <div className="account-row__attainment" style={{ color }}>
        {pct}%
      </div>
      <div style={{ width: 80 }}>
        <div style={{ height: 4, background: 'var(--ibm-gray-20)' }}>
          <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Dashboard Page
// ════════════════════════════════════════════════════════════════════════════
export default function Dashboard({
  accounts,
  seller,
  selectedIds,
  dashboardData,
  dashboardLoading,
  dashboardError,
}) {
  if (dashboardLoading) return <Spinner />;
  if (dashboardError)   return <ErrorBlock message={dashboardError} />;
  if (!dashboardData)   return null;

  const { quota_summary, pending_actions, suggested_actions } = dashboardData;
  const displayAccounts = selectedIds.length
    ? accounts.filter(a => selectedIds.includes(a.id))
    : accounts;

  return (
    <div>
      {/* ── Quota Overview Bar ───────────────────────────────────────────── */}
      <QuotaOverview summary={quota_summary} />

      <div className="page-content">
        <div className="page-header">
          <div className="page-header__eyebrow">
            {displayAccounts.length === accounts.length
              ? 'All Accounts'
              : `${displayAccounts.length} Account${displayAccounts.length !== 1 ? 's' : ''} Selected`}
          </div>
          <h1 className="page-header__title">Seller Dashboard</h1>
          <p className="page-header__subtitle">
            {displayAccounts.length === accounts.length
              ? `Overview of all ${accounts.length} assigned accounts • ${seller?.pod}`
              : `Filtered view for selected accounts`}
          </p>
        </div>

        {/* ── KPI Row ─────────────────────────────────────────────────────── */}
        <div className="grid-4 mb-6">
          <div className="kpi-tile kpi-tile--success">
            <div className="kpi-tile__label">Closed Won</div>
            <div className="kpi-tile__value">{formatCurrency(quota_summary.closed)}</div>
            <div className="kpi-tile__sub">{quota_summary.attainment_pct}% attainment</div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-tile__label">Active Pipeline</div>
            <div className="kpi-tile__value">{formatCurrency(quota_summary.pipeline)}</div>
            <div className="kpi-tile__sub">{quota_summary.coverage_pct}% coverage</div>
          </div>
          <div className="kpi-tile kpi-tile--warning">
            <div className="kpi-tile__label">Pending Actions</div>
            <div className="kpi-tile__value">{pending_actions.length}</div>
            <div className="kpi-tile__sub">
              {pending_actions.filter(a => a.priority === 'critical').length} critical
            </div>
          </div>
          <div className="kpi-tile kpi-tile--purple">
            <div className="kpi-tile__label">AI Suggestions</div>
            <div className="kpi-tile__value">{suggested_actions.length}</div>
            <div className="kpi-tile__sub">
              Top: {suggested_actions[0]?.type || '—'}
            </div>
          </div>
        </div>

        {/* ── Main Grid ───────────────────────────────────────────────────── */}
        <div className="grid-2">
          {/* Pending Actions */}
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Pending Action Items</div>
                <div className="card__subtitle">Requires your attention</div>
              </div>
              <Tag color={pending_actions.some(a => a.priority === 'critical') ? 'red' : 'orange'}>
                {pending_actions.filter(a => ['critical','high'].includes(a.priority)).length} urgent
              </Tag>
            </div>
            <div className="scrollable-list">
              {pending_actions.length === 0 ? (
                <div className="empty-state">No pending actions for selected accounts.</div>
              ) : (
                pending_actions.map(item => (
                  <PendingActionItem key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">AI-Suggested Actions</div>
                <div className="card__subtitle">Ranked by opportunity confidence</div>
              </div>
              <Tag color="blue">AI</Tag>
            </div>
            <div className="scrollable-list">
              {suggested_actions.length === 0 ? (
                <div className="empty-state">No suggestions for selected accounts.</div>
              ) : (
                suggested_actions.map(item => (
                  <SuggestedActionItem key={item.id} item={item} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Account Attainment Table ─────────────────────────────────────── */}
        <div className="card mt-6">
          <div className="card__header">
            <div>
              <div className="card__title">Account Attainment Overview</div>
              <div className="card__subtitle">Quota progress per account</div>
            </div>
          </div>
          <div>
            {displayAccounts.map(account => (
              <AccountAttainmentRow key={account.id} account={account} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
