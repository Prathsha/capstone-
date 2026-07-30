import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Spinner, ErrorBlock, Tag, ConfidenceBar,
  formatCurrency, formatDate, priorityColor,
} from '../components/Helpers';
import { useTaskContext, TEAM_MEMBERS } from '../context/TaskContext';

// ── Priority helpers ──────────────────────────────────────────────────────────
const PRIORITY_LABELS = ['Critical', 'High', 'Medium', 'Low'];

const ACTION_TYPES = [
  'Follow-up', 'Renewal', 'EBR', 'POC', 'Proposal', 'Demo',
  'Contract', 'Technical', 'Workshop', 'Re-engagement', 'Review',
  'At-Risk', 'Engagement', 'Other',
];

// ── Add Action Item Modal ─────────────────────────────────────────────────────
function AddActionModal({ accounts, onClose, onSave }) {
  const [form, setForm] = useState({
    description: '',
    type: 'Follow-up',
    priority: 'High',
    account_id: accounts[0]?.id || '',
    due_date: '',
    assignedTo: 'pratham',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!form.due_date)            { setError('Due date is required.');    return; }

    const account = accounts.find(a => a.id === form.account_id);
    const action = {
      id: `local-${Date.now()}`,
      ...form,
      account_name: account?.name || '',
      source: 'user',
    };
    onSave(action);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-5)',
    }}>
      <div style={{
        background: '#fff', width: 480, maxWidth: '100%',
        border: '1px solid var(--color-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Modal header */}
        <div style={{
          padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>Add Action Item</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Create a new pending action for an account
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: 'var(--color-text-secondary)', lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto' }}>
          {error && (
            <div style={{ background: 'var(--ibm-red-10, #fff1f1)', border: '1px solid var(--ibm-red-50)', color: 'var(--ibm-red-60)', padding: '8px 12px', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Company */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
              Company <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
            </label>
            <select
              className="account-selector__select"
              style={{ width: '100%' }}
              value={form.account_id}
              onChange={e => setForm(f => ({ ...f, account_id: e.target.value }))}
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Type + Priority side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
                Action Type
              </label>
              <select
                className="account-selector__select"
                style={{ width: '100%' }}
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              >
                {ACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
                Criticality <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
              </label>
              <select
                className="account-selector__select"
                style={{ width: '100%' }}
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                {PRIORITY_LABELS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + Assign To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
                Due Date <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
              </label>
              <input
                type="date"
                className="account-selector__select"
                style={{ width: '100%', fontFamily: 'var(--font-sans)' }}
                value={form.due_date}
                onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
                Assign To
              </label>
              <select className="account-selector__select" style={{ width: '100%' }}
                value={form.assignedTo}
                onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
                {TEAM_MEMBERS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}{m.isSelf ? ' (Me)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
              Description <span style={{ color: 'var(--ibm-red-60)' }}>*</span>
            </label>
            <textarea
              rows={3}
              style={{
                width: '100%', padding: '8px 12px', fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-sm)', border: '1px solid var(--color-border)',
                resize: 'vertical', background: 'var(--color-bg)', color: 'var(--color-text-primary)',
                boxSizing: 'border-box',
              }}
              placeholder="Describe the action that needs to be taken…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
            <button type="button" onClick={onClose}
              style={{
                padding: '8px 20px', background: 'none', border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}>
              Cancel
            </button>
            <button type="submit"
              style={{
                padding: '8px 20px', background: 'var(--ibm-blue-60)', border: 'none',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', cursor: 'pointer',
                color: '#fff', fontWeight: 600,
              }}>
              Add Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Action item for pending list ──────────────────────────────────────────────
// Handles both old backend shape (description/due_date/account_name) and
// new task shape (title/dueDate/account).
function PendingActionItem({ item, onDelete }) {
  const priorityKey = (item.priority || '').toLowerCase();
  const color = priorityColor(priorityKey);
  const assignee = TEAM_MEMBERS.find(m => m.id === item.assignedTo);
  // Normalise field names across both shapes
  const displayText   = item.title || item.description || '';
  const displayAcct   = item.account || item.account_name || '';
  const displayDate   = item.dueDate || item.due_date || '';
  const displayType   = item.type || item.status || '';
  return (
    <div className="action-item" style={{ position: 'relative' }}>
      <div className={`action-item__priority-bar action-item__priority-bar--${priorityKey}`} />
      <div className="action-item__body">
        <div className="action-item__header">
          <span className="action-item__account">{displayAcct}</span>
          {displayType && <Tag color={color}>{displayType}</Tag>}
          <Tag color={color}>{(item.priority || '').toUpperCase()}</Tag>
          {assignee && <Tag color={assignee.tagClass.replace('tag--', '')}>{assignee.name.split(' ')[0]}</Tag>}
          {item.source === 'user' && <Tag color="blue">Custom</Tag>}
        </div>
        <div className="action-item__description">{displayText}</div>
        <div className="action-item__meta">
          <span>Due: {formatDate(displayDate)}</span>
        </div>
      </div>
      {(item.source === 'user' || item.source === 'system') && onDelete && (
        <button
          onClick={() => onDelete(item.id)}
          title="Remove action item"
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--ibm-gray-50)', fontSize: 14, lineHeight: 1, padding: 2,
          }}
        >✕</button>
      )}
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
  const {
    total_quota, closed, pipeline,
    weighted_pipeline, pipeline_needed,
    attainment_pct, coverage_pct, win_rate,
  } = summary;
  const closedPct   = Math.min((closed / total_quota) * 100, 100);
  // Progress bar uses probability-weighted pipeline so it doesn't look "almost done"
  const weightedPct = Math.min((weighted_pipeline / total_quota) * 100, 100 - closedPct);
  const winRatePct  = Math.round((win_rate ?? 0.35) * 100);

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
        <div className="quota-overview__title">Pipeline (Face Value)</div>
        <div className="quota-overview__value" style={{ color: 'var(--ibm-gray-40)' }}>
          {formatCurrency(pipeline)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ibm-gray-50)', marginTop: 2 }}>
          ≈ {formatCurrency(weighted_pipeline)} expected @ {winRatePct}% win rate
        </div>
      </div>
      {pipeline_needed > 0 && (
        <div>
          <div className="quota-overview__title" style={{ color: 'var(--ibm-red-50)' }}>Pipeline Gap</div>
          <div className="quota-overview__value" style={{ color: 'var(--ibm-red-50)' }}>
            {formatCurrency(pipeline_needed)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ibm-gray-50)', marginTop: 2 }}>
            more pipeline needed to close
          </div>
        </div>
      )}

      <div className="quota-overview__progress">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--ibm-gray-40)' }}>
            Attainment: <strong style={{ color: '#fff' }}>{attainment_pct}%</strong>
          </span>
          <span style={{ fontSize: 12, color: 'var(--ibm-gray-40)' }}>
            Expected coverage: <strong style={{ color: '#fff' }}>{coverage_pct}%</strong>
          </span>
        </div>
        <div className="quota-progress-bar">
          <div className="quota-progress-bar__closed"   style={{ width: `${closedPct}%` }} />
          <div className="quota-progress-bar__pipeline" style={{ left: `${closedPct}%`, width: `${weightedPct}%` }} />
        </div>
        <div className="quota-legend">
          <div className="quota-legend__item">
            <div className="quota-legend__dot quota-legend__dot--closed" />
            Closed Won
          </div>
          <div className="quota-legend__item">
            <div className="quota-legend__dot quota-legend__dot--pipeline" />
            Expected ({winRatePct}% win rate)
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
  const { tasks, addTask, deleteTask } = useTaskContext();
  const [showModal, setShowModal]   = useState(false);
  const [sortBy, setSortBy]         = useState('priority'); // 'priority' | 'assignee' | 'dueDate'

  if (dashboardLoading) return <Spinner />;
  if (dashboardError)   return <ErrorBlock message={dashboardError} />;
  if (!dashboardData)   return null;

  const { quota_summary, suggested_actions } = dashboardData;
  const displayAccounts = selectedIds.length
    ? accounts.filter(a => selectedIds.includes(a.id))
    : accounts;

  // Build a set of normalised account name fragments for filtering.
  // Tasks store short names (e.g. 'QUEST DIAGNOSTICS', 'LINCOLN NATIONAL') while
  // accounts[] use full legal names — match if either contains the other.
  const selectedAccountNames = selectedIds.length
    ? new Set(
        accounts
          .filter(a => selectedIds.includes(a.id))
          .map(a => a.name.toUpperCase())
      )
    : null; // null = show all

  const taskMatchesSelection = (task) => {
    if (!selectedAccountNames) return true;
    const taskAcct = (task.account || '').toUpperCase();
    for (const name of selectedAccountNames) {
      if (name.includes(taskAcct) || taskAcct.includes(name)) return true;
    }
    return false;
  };

  const PRIO = { Critical: 0, High: 1, Medium: 2, Low: 3, critical: 0, high: 1, medium: 2, low: 3 };

  const allPendingActions = [...tasks]
    .filter(taskMatchesSelection)
    .sort((a, b) => {
      if (sortBy === 'assignee') {
        const nameA = TEAM_MEMBERS.find(m => m.id === a.assignedTo)?.name ?? '';
        const nameB = TEAM_MEMBERS.find(m => m.id === b.assignedTo)?.name ?? '';
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'dueDate') {
        return (a.dueDate || a.due_date || '').localeCompare(b.dueDate || b.due_date || '');
      }
      // default: priority then due date
      const pa = PRIO[a.priority] ?? 3;
      const pb = PRIO[b.priority] ?? 3;
      if (pa !== pb) return pa - pb;
      return (a.dueDate || a.due_date || '').localeCompare(b.dueDate || b.due_date || '');
    });

  const handleActionAdded = (action) => {
    addTask({
      id: `local-${Date.now()}`,
      title: action.description,
      account: action.account_name,
      priority: action.priority,
      dueDate: action.due_date,
      status: 'Todo',
      done: false,
      source: 'user',
      assignedTo: action.assignedTo || 'pratham',
      type: action.type,
    });
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
  };

  return (
    <div>
      {showModal && (
        <AddActionModal
          accounts={accounts}
          onClose={() => setShowModal(false)}
          onSave={handleActionAdded}
        />
      )}

      <QuotaOverview summary={quota_summary} />

      <div className="page-content">
        <div className="page-header">
          <div className="page-header__eyebrow">
            {displayAccounts.length === accounts.length
              ? 'All Accounts'
              : `${displayAccounts.length} Account${displayAccounts.length !== 1 ? 's' : ''} Selected`}
          </div>
          <h1 className="page-header__title">Technology Sales Leader Dashboard</h1>
          <p className="page-header__subtitle">
            {displayAccounts.length === accounts.length
              ? `Overview of all ${accounts.length} assigned accounts • ${seller?.pod}`
              : `Filtered view for selected accounts`}
          </p>
        </div>

        {/* ── KPI Row ─────────────────────────────────────────────────────── */}
        <div className="grid-4 mb-6">
          <Link to="/accounts" style={{ textDecoration: 'none' }}>
            <div className="kpi-tile kpi-tile--success" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div className="kpi-tile__label">Closed Won</div>
              <div className="kpi-tile__value">{formatCurrency(quota_summary.closed)}</div>
              <div className="kpi-tile__sub">{quota_summary.attainment_pct}% attainment · View Accounts →</div>
            </div>
          </Link>
          <Link to="/accounts" style={{ textDecoration: 'none' }}>
            <div
              className={quota_summary.pipeline_needed > 0 ? 'kpi-tile kpi-tile--warning' : 'kpi-tile kpi-tile--success'}
              style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div className="kpi-tile__label">
                {quota_summary.pipeline_needed > 0 ? 'Pipeline Gap' : 'Pipeline Sufficient'}
              </div>
              <div className="kpi-tile__value">
                {quota_summary.pipeline_needed > 0
                  ? formatCurrency(quota_summary.pipeline_needed)
                  : formatCurrency(quota_summary.pipeline)}
              </div>
              <div className="kpi-tile__sub">
                {quota_summary.pipeline_needed > 0
                  ? `${formatCurrency(quota_summary.pipeline)} in pipeline — need more · View Accounts →`
                  : `${quota_summary.coverage_pct}% expected coverage · View Accounts →`}
              </div>
            </div>
          </Link>
          <Link to="/team" style={{ textDecoration: 'none' }}>
            <div className="kpi-tile kpi-tile--warning" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div className="kpi-tile__label">Pending Actions</div>
              <div className="kpi-tile__value">{allPendingActions.length}</div>
              <div className="kpi-tile__sub">
                {allPendingActions.filter(a => a.priority === 'critical').length} critical · View Tasks →
              </div>
            </div>
          </Link>
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
                <div className="card__subtitle">
                  {selectedIds.length ? `${displayAccounts.map(a => a.name.split(' ')[0]).join(', ')}` : 'All accounts'} · {allPendingActions.length} item{allPendingActions.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    height: 28, padding: '0 8px', border: '1px solid var(--color-border-strong)',
                    fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-xs)',
                    background: 'var(--color-surface)', color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }}
                  aria-label="Sort pending actions"
                >
                  <option value="priority">Sort: Priority</option>
                  <option value="assignee">Sort: Assignee</option>
                  <option value="dueDate">Sort: Due Date</option>
                </select>
                <Tag color={allPendingActions.some(a => a.priority === 'critical') ? 'red' : 'orange'}>
                  {allPendingActions.filter(a => ['critical','high'].includes((a.priority||'').toLowerCase())).length} urgent
                </Tag>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '5px 12px', background: 'var(--ibm-blue-60)', border: 'none',
                    color: '#fff', fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--font-size-xs)', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="scrollable-list">
              {allPendingActions.length === 0 ? (
                <div className="empty-state">No pending actions for selected accounts.</div>
              ) : (
                allPendingActions.map(item => (
                  <PendingActionItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteTask}
                  />
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

      </div>
    </div>
  );
}
