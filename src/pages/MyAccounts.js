import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmtCurrency(n) {
  if (n === 0) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function fmtDate(iso) {
  if (!iso) return 'TBD';
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

// ── Health / tier helpers ─────────────────────────────────────────────────────
function healthClass(score) {
  if (score >= 80) return 'good';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'bad';
  return 'critical';
}

function tierTagColor(tier) {
  if (tier === 'Strategic') return 'tag--purple';
  if (tier === 'Premier')   return 'tag--blue';
  return 'tag--gray';
}

function attainmentColor(pct) {
  if (pct >= 100) return 'progress-bar__fill--success';
  if (pct >= 70)  return '';
  if (pct >= 40)  return 'progress-bar__fill--warning';
  return 'progress-bar__fill--error';
}

const STAGE_COLOR = {
  'Proof of Concept': 'tag--blue',
  'Negotiation':      'tag--green',
  'Qualification':    'tag--yellow',
  'Discovery':        'tag--gray',
};

// ── Account Detail View ───────────────────────────────────────────────────────
function AccountDetailView({ account }) {
  if (!account) return <div className="empty-state">No detail data available for this account.</div>;

  // Derive display values from the live account object
  const totalArr = (account.install_base || []).reduce((s, p) => s + (p.arr || 0), 0);
  const products = (account.install_base || []).map(p => ({
    name:    p.product,
    version: p.version || '—',
    renewal: fmtDate(p.renewal),
    arr:     fmtCurrency(p.arr),
  }));
  const opportunities = (account.opportunities || []).map(o => ({
    name:      o.name,
    stage:     o.stage,
    value:     fmtCurrency(o.value),
    closeDate: fmtDate(o.close_date),
  }));
  const chartData = (account.revenue_trend || []).map(r => ({
    period: r.period,
    amount: r.amount,
    fmt:    fmtCurrency(r.amount),
  }));

  const d = {
    name:        account.name,
    industry:    account.industry,
    region:      account.region,
    arr:         fmtCurrency(totalArr),
    arTrend:     account.arr_trend || '',
    health:      account.health_score,
    healthNote:  account.health_note || '',
    products,
    competitors: account.competitors || [],
    opportunities,
    contacts:    account.contacts || [],
  };

  const pipelineTotal = (account.opportunities || []).reduce((s, o) => s + (o.value || 0), 0);

  return (
    <div>
      {/* KPI Row */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="kpi-tile kpi-tile--success">
          <div className="kpi-tile__label">Annual Revenue</div>
          <div className="kpi-tile__value kpi-tile__value--md">{d.arr}</div>
          <div className="kpi-tile__sub">{d.arTrend}</div>
        </div>
        <div className="kpi-tile">
          <div className="kpi-tile__label">Active Opportunities</div>
          <div className="kpi-tile__value kpi-tile__value--md">{d.opportunities.length}</div>
          <div className="kpi-tile__sub">
            {fmtCurrency(pipelineTotal)} pipeline
          </div>
        </div>
        <div className={`kpi-tile ${d.health >= 70 ? 'kpi-tile--success' : d.health >= 55 ? 'kpi-tile--warning' : 'kpi-tile--error'}`}>
          <div className="kpi-tile__label">Health Score</div>
          <div className="kpi-tile__value kpi-tile__value--md">{d.health}</div>
          <div className="kpi-tile__sub">{d.healthNote}</div>
        </div>
        <div className="kpi-tile kpi-tile--purple">
          <div className="kpi-tile__label">IBM Products</div>
          <div className="kpi-tile__value kpi-tile__value--md">{d.products.length}</div>
          <div className="kpi-tile__sub">{d.products.map(p => p.name.split(' ').pop()).join(', ')}</div>
        </div>
      </div>

      <div className="grid-2">
        {/* IBM Products Owned */}
        <div className="card">
          <div className="card__header"><div className="card__title">IBM Portfolio</div></div>
          <table className="data-table">
            <thead><tr><th>Product</th><th>Version</th><th>Renewal</th><th>ARR</th></tr></thead>
            <tbody>
              {d.products.map(p => (
                <tr key={p.name}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.version}</td>
                  <td><span className="tag tag--gray">{p.renewal}</span></td>
                  <td style={{ fontWeight: 600 }}>{p.arr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Active Opportunities */}
        <div className="card">
          <div className="card__header"><div className="card__title">Active Opportunities</div></div>
          {d.opportunities.map(o => (
            <div key={o.name} style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{o.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-interactive)' }}>{o.value}</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span className={`tag ${STAGE_COLOR[o.stage] || 'tag--gray'}`}>{o.stage}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Close: {o.closeDate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Competitive Footprint */}
        <div className="card">
          <div className="card__header"><div className="card__title">Installed Competitors</div></div>
          {d.competitors.map(c => (
            <div key={c.name} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
              <div style={{ minWidth: 120, fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{c.name}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 4 }}>
                  {c.products.map(p => <span key={p} className="tag tag--gray">{p}</span>)}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{c.scope}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Contacts */}
        <div className="card">
          <div className="card__header"><div className="card__title">Key Contacts</div></div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Title</th><th>Role</th><th>Strength</th></tr></thead>
            <tbody>
              {d.contacts.map(c => (
                <tr key={c.name}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{c.title}</td>
                  <td><span className={`tag ${c.role === 'Blocker' ? 'tag--red' : c.role === 'Champion' ? 'tag--green' : 'tag--blue'}`}>{c.role}</span></td>
                  <td style={{ color: 'var(--ibm-yellow-30)', letterSpacing: 2 }}>{c.strength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card__header">
          <div className="card__title">Revenue Trend</div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Last 7 quarters</span>
        </div>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [
                  v >= 1000000 ? `$${(v / 1000000).toFixed(2)}M` : `$${(v / 1000).toFixed(0)}K`,
                  'Revenue'
                ]}
                contentStyle={{ fontSize: 12, border: '1px solid var(--ibm-gray-20)', background: '#fff' }}
              />
              <Bar dataKey="amount" fill="var(--ibm-blue-60)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Account List Row ──────────────────────────────────────────────────────────
function AccountRow({ account, onSelect }) {
  const attainment = account.quota > 0
    ? Math.round((account.closed / account.quota) * 100)
    : 0;
  const closedFmt = `$${(account.closed / 1e6).toFixed(1)}M`;
  const quotaFmt  = `$${(account.quota  / 1e6).toFixed(1)}M`;

  return (
    <div className="card" style={{ padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)' }}>
        {/* Health Score */}
        <div className="health-score" style={{ flexShrink: 0, flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div className={`health-score__circle health-score__circle--${healthClass(account.health_score)}`}>
            {account.health_score}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Health</span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>{account.name}</span>
            <span className={`tag ${tierTagColor(account.tier)}`}>{account.tier}</span>
          </div>
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              <span>Quota Attainment</span>
              <span style={{ fontWeight: 600 }}>{attainment}% — {closedFmt} / {quotaFmt}</span>
            </div>
            <div className="progress-bar__track">
              <div
                className={`progress-bar__fill ${attainmentColor(attainment)}`}
                style={{ width: `${Math.min(attainment, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action */}
        <div style={{ flexShrink: 0 }}>
          <button
            onClick={() => onSelect(account.id)}
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              border: '1px solid var(--color-interactive)',
              color: 'var(--color-interactive)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'nowrap',
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main Page
// ════════════════════════════════════════════════════════════════════════════
export default function MyAccounts({ accounts = [] }) {
  const list = accounts.length > 0 ? accounts : MOCK_ACCOUNTS;
  const [searchParams, setSearchParams] = useSearchParams();

  // 'list' = account overview, or an account id = showing detail for that account
  const [view, setView] = useState(() => searchParams.get('account') || 'list');

  // Sync view → URL: keep ?account= when in detail, remove when in list
  useEffect(() => {
    if (view === 'list') {
      searchParams.delete('account');
    } else {
      searchParams.set('account', view);
    }
    setSearchParams(searchParams, { replace: true });
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedAccount = view !== 'list' ? list.find(a => a.id === view) : null;

  return (
    <div className="page-content">
      {view === 'list' ? (
        <>
          <div className="page-header">
            <div className="page-header__eyebrow">Overview</div>
            <h1 className="page-header__title">My Accounts</h1>
            <p className="page-header__subtitle">{list.length} accounts — Q3 FY2026</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {list.map(account => (
              <AccountRow key={account.id} account={account} onSelect={id => setView(id)} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Breadcrumb + account picker */}
          <div className="page-header">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <div className="page-header__eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => setView('list')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ibm-blue-60)', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-sans)', padding: 0, fontWeight: 600 }}
                  >
                    ← My Accounts
                  </button>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>/</span>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>Account Details</span>
                </div>
                <h1 className="page-header__title">{selectedAccount?.name}</h1>
                <p className="page-header__subtitle">
                  {selectedAccount?.industry} · {selectedAccount?.region}
                </p>
              </div>
              {/* Account switcher */}
              <select
                value={view}
                onChange={e => setView(e.target.value)}
                className="account-selector__select"
                style={{ minWidth: 260, height: 36, marginTop: 4 }}
              >
                {list.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <AccountDetailView account={list.find(a => a.id === view)} />
        </>
      )}
    </div>
  );
}

// Mock fallback accounts (used when backend is not available)
const MOCK_ACCOUNTS = [
  { id: 'acc-001', name: 'QUEST DIAGNOSTICS',                           tier: 'Horizon', health_score: 72, health_note: 'watsonx.data renewal Sep 15', arr_trend: '+11.4% YoY', quota: 2900000, pipeline: 3800000, closed: 3800000, install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
  { id: 'acc-002', name: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY', tier: 'Horizon', health_score: 65, health_note: 'Guardium POC in progress',     arr_trend: '+12.4% YoY', quota: 1200000, pipeline: 780000,  closed: 520000,  install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
  { id: 'acc-003', name: 'SIEMENS',                                     tier: 'Horizon', health_score: 81, health_note: 'SOW signature pending',         arr_trend: '+15.1% YoY', quota: 2100000, pipeline: 1450000, closed: 980000,  install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
  { id: 'acc-004', name: 'SEI INVESTMENTS',                             tier: 'Horizon', health_score: 58, health_note: 'No contact in 31 days',         arr_trend: '-2.1% YoY',  quota: 600000,  pipeline: 310000,  closed: 210000,  install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
  { id: 'acc-005', name: 'INDEPENDENCE BLUECROSS',                      tier: 'Horizon', health_score: 77, health_note: 'Watson Assistant renewal soon',  arr_trend: '+18.6% YoY', quota: 750000,  pipeline: 490000,  closed: 380000,  install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
  { id: 'acc-006', name: 'SUNGARD DATA SYSTEMS',                        tier: 'Horizon', health_score: 44, health_note: 'CRITICAL — displacement risk',  arr_trend: '-14.2% YoY', quota: 420000,  pipeline: 180000,  closed: 95000,   install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
  { id: 'acc-007', name: 'SELECT MEDICAL CORP',                         tier: 'Horizon', health_score: 69, health_note: 'QRadar upgrade assessment due',  arr_trend: '+6.3% YoY',  quota: 480000,  pipeline: 290000,  closed: 185000,  install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
  { id: 'acc-008', name: 'RICOH',                                       tier: 'Horizon', health_score: 73, health_note: 'CSP expansion proposal pending', arr_trend: '+9.8% YoY',  quota: 560000,  pipeline: 350000,  closed: 260000,  install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
  { id: 'acc-009', name: 'SAGENT M&C LLC',                              tier: 'Horizon', health_score: 53, health_note: 'Pipeline stalled',               arr_trend: '-5.2% YoY',  quota: 310000,  pipeline: 140000,  closed: 75000,   install_base: [], opportunities: [], competitors: [], contacts: [], revenue_trend: [] },
];
