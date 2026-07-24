import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

// ── Per-account detail data ───────────────────────────────────────────────────
const ACCOUNT_DATA = {
  'acc-001': {
    name: 'QUEST DIAGNOSTICS', industry: 'Healthcare / Diagnostics', region: 'Northeast US',
    arr: '$1.24M', arTrend: '+8.2% YoY', health: 72, healthNote: 'Cloud Pak renewal in 60 days',
    products: [
      { name: 'IBM Cloud Pak for Data',   version: '4.8',  renewal: 'Jan 20, 2027', arr: '$560,000' },
      { name: 'IBM watsonx.data',         version: 'SaaS', renewal: 'Sep 15, 2026', arr: '$680,000' },
    ],
    competitors: [
      { name: 'Microsoft Azure', products: ['Azure Health Data Services', 'Power BI'], scope: 'Analytics & reporting workloads' },
      { name: 'Veeva Systems',   products: ['Veeva Vault'],                            scope: 'Clinical data management' },
    ],
    opportunities: [
      { name: 'CP4D Enterprise Tier Upgrade',    stage: 'Qualification',    value: '$320,000', closeDate: 'Oct 31, 2026' },
      { name: 'IBM TRIRIGA — Lab Facility Mgmt', stage: 'Proof of Concept', value: '$210,000', closeDate: 'Dec 15, 2026' },
    ],
    contacts: [
      { name: 'Dr. Patricia Hale', title: 'CIO',                role: 'Economic Buyer',           strength: '★★★★☆' },
      { name: 'Brian Torres',      title: 'VP Data & Analytics', role: 'Technical Decision Maker', strength: '★★★★★' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 950000 }, { period: 'Q3 FY24', amount: 1010000 },
      { period: 'Q4 FY24', amount: 1080000 }, { period: 'Q1 FY25', amount: 1130000 },
      { period: 'Q2 FY25', amount: 1190000 }, { period: 'Q3 FY25', amount: 1220000 },
      { period: 'Q4 FY25', amount: 1240000 },
    ],
  },
  'acc-002': {
    name: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY', industry: 'Financial Services / Insurance', region: 'Mid-Atlantic US',
    arr: '$2.1M', arTrend: '+12.4% YoY', health: 65, healthNote: 'Guardium POC in progress',
    products: [
      { name: 'IBM OpenPages',                version: '9.0',  renewal: 'Nov 1, 2026',  arr: '$890,000'   },
      { name: 'IBM Financial Crimes Insight', version: 'SaaS', renewal: 'Mar 1, 2027',  arr: '$1,210,000' },
    ],
    competitors: [
      { name: 'Crowdstrike', products: ['Falcon XDR'],   scope: 'Endpoint security' },
      { name: 'ServiceNow',  products: ['GRC Module'],   scope: 'Risk & compliance workflows' },
    ],
    opportunities: [
      { name: 'IBM Guardium — Data Security',   stage: 'Proof of Concept', value: '$480,000', closeDate: 'Aug 1, 2026'  },
      { name: 'OpenPages Enterprise Risk Mgmt', stage: 'Negotiation',      value: '$310,000', closeDate: 'Sep 30, 2026' },
    ],
    contacts: [
      { name: 'Sandra Osei', title: 'Director of Infrastructure', role: 'Technical Decision Maker', strength: '★★★★☆' },
      { name: 'Kevin Marsh',  title: 'CISO',                      role: 'Blocker',                  strength: '★★☆☆☆' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 1600000 }, { period: 'Q3 FY24', amount: 1720000 },
      { period: 'Q4 FY24', amount: 1850000 }, { period: 'Q1 FY25', amount: 1960000 },
      { period: 'Q2 FY25', amount: 2020000 }, { period: 'Q3 FY25', amount: 2080000 },
      { period: 'Q4 FY25', amount: 2100000 },
    ],
  },
  'acc-003': {
    name: 'SIEMENS', industry: 'Industrial Technology / Manufacturing', region: 'Global',
    arr: '$3.8M', arTrend: '+15.1% YoY', health: 81, healthNote: 'SOW signature pending',
    products: [
      { name: 'IBM MAS (Maximo)',          version: '8.11', renewal: 'Dec 31, 2026', arr: '$1,820,000' },
      { name: 'IBM Sterling Supply Chain', version: 'SaaS', renewal: 'Jun 30, 2027', arr: '$1,240,000' },
      { name: 'IBM Cloud',                 version: 'VPC',  renewal: 'Dec 31, 2026', arr: '$740,000'   },
    ],
    competitors: [
      { name: 'SAP',       products: ['S/4HANA', 'SAP Asset Intelligence'], scope: 'ERP & asset management' },
      { name: 'Microsoft', products: ['Azure IoT Hub', 'Dynamics 365'],     scope: 'IoT & field service' },
    ],
    opportunities: [
      { name: 'IBM Turbonomic — Cloud Cost Optimization', stage: 'Qualification', value: '$620,000', closeDate: 'Sep 30, 2026' },
      { name: 'Sterling Order Mgmt Expansion',             stage: 'Negotiation',  value: '$480,000', closeDate: 'Aug 15, 2026' },
    ],
    contacts: [
      { name: 'Annika Brandt', title: 'Global IT Director',   role: 'Champion',                  strength: '★★★★★' },
      { name: 'Ravi Patel',    title: 'Enterprise Architect',  role: 'Technical Decision Maker',  strength: '★★★★☆' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 2800000 }, { period: 'Q3 FY24', amount: 3050000 },
      { period: 'Q4 FY24', amount: 3200000 }, { period: 'Q1 FY25', amount: 3420000 },
      { period: 'Q2 FY25', amount: 3600000 }, { period: 'Q3 FY25', amount: 3720000 },
      { period: 'Q4 FY25', amount: 3800000 },
    ],
  },
  'acc-004': {
    name: 'SEI INVESTMENTS', industry: 'Financial Services / Asset Management', region: 'Southeast US',
    arr: '$620,000', arTrend: '-2.1% YoY', health: 58, healthNote: 'No contact in 31 days — re-engage',
    products: [
      { name: 'IBM Cloud Pak for Business Automation', version: '23.0', renewal: 'Jan 15, 2027', arr: '$620,000' },
    ],
    competitors: [
      { name: 'Microsoft', products: ['Power Automate', 'Power BI'], scope: 'Process automation & reporting' },
      { name: 'UiPath',    products: ['RPA Platform'],               scope: 'Robotic process automation' },
    ],
    opportunities: [
      { name: 'IBM Cognos Analytics — Portfolio Reporting', stage: 'Discovery', value: '$280,000', closeDate: 'Nov 30, 2026' },
      { name: 'IBM Garage Engagement',                      stage: 'Discovery', value: '$150,000', closeDate: 'Oct 15, 2026' },
    ],
    contacts: [
      { name: 'Carol Simmons', title: 'VP Technology', role: 'Economic Buyer', strength: '★★★☆☆' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 680000 }, { period: 'Q3 FY24', amount: 660000 },
      { period: 'Q4 FY24', amount: 650000 }, { period: 'Q1 FY25', amount: 630000 },
      { period: 'Q2 FY25', amount: 625000 }, { period: 'Q3 FY25', amount: 620000 },
      { period: 'Q4 FY25', amount: 620000 },
    ],
  },
  'acc-005': {
    name: 'INDEPENDENCE BLUECROSS', industry: 'Healthcare / Insurance', region: 'Mid-Atlantic US',
    arr: '$1.48M', arTrend: '+18.6% YoY', health: 77, healthNote: 'Watson Assistant renewal in 45 days',
    products: [
      { name: 'IBM Watson Assistant',          version: 'SaaS', renewal: 'Aug 30, 2026', arr: '$680,000' },
      { name: 'IBM Cloud Pak for Integration', version: '16.1', renewal: 'Feb 28, 2027', arr: '$800,000' },
    ],
    competitors: [
      { name: 'AWS',    products: ['Amazon Connect', 'Lex'], scope: 'Contact center AI' },
      { name: 'Nuance', products: ['Dragon Medical'],        scope: 'Clinical NLP' },
    ],
    opportunities: [
      { name: 'Watson Assistant — Member Portal Expansion', stage: 'Negotiation',      value: '$420,000', closeDate: 'Sep 1, 2026'  },
      { name: 'IBM DataStage — Claims Integration',         stage: 'Proof of Concept', value: '$290,000', closeDate: 'Nov 15, 2026' },
    ],
    contacts: [
      { name: 'James Nguyen',  title: 'Chief Digital Officer',   role: 'Economic Buyer', strength: '★★★★☆' },
      { name: 'Tara Williams', title: 'Director of Integration',  role: 'Champion',       strength: '★★★★★' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 980000  }, { period: 'Q3 FY24', amount: 1080000 },
      { period: 'Q4 FY24', amount: 1180000 }, { period: 'Q1 FY25', amount: 1300000 },
      { period: 'Q2 FY25', amount: 1380000 }, { period: 'Q3 FY25', amount: 1440000 },
      { period: 'Q4 FY25', amount: 1480000 },
    ],
  },
  'acc-006': {
    name: 'SUNGARD DATA SYSTEMS', industry: 'Financial Technology / Data Services', region: 'Northeast US',
    arr: '$380,000', arTrend: '-14.2% YoY', health: 44, healthNote: 'CRITICAL — competitive displacement risk',
    products: [
      { name: 'IBM Db2 on Cloud', version: 'SaaS', renewal: 'Oct 1, 2026', arr: '$380,000' },
    ],
    competitors: [
      { name: 'Snowflake', products: ['Snowflake Data Cloud'], scope: 'Cloud data warehouse — active eval' },
      { name: 'AWS',       products: ['Aurora PostgreSQL'],    scope: 'Proposed Db2 replacement' },
    ],
    opportunities: [
      { name: 'Db2 Renewal — Multi-year Commit', stage: 'Negotiation', value: '$420,000', closeDate: 'Jul 14, 2026' },
    ],
    contacts: [
      { name: 'Michael Rath', title: 'CTO', role: 'Blocker', strength: '★☆☆☆☆' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 490000 }, { period: 'Q3 FY24', amount: 470000 },
      { period: 'Q4 FY24', amount: 450000 }, { period: 'Q1 FY25', amount: 430000 },
      { period: 'Q2 FY25', amount: 400000 }, { period: 'Q3 FY25', amount: 385000 },
      { period: 'Q4 FY25', amount: 380000 },
    ],
  },
  'acc-007': {
    name: 'SELECT MEDICAL CORP', industry: 'Healthcare / Hospital Systems', region: 'Central US',
    arr: '$920,000', arTrend: '+6.3% YoY', health: 69, healthNote: 'QRadar upgrade assessment due',
    products: [
      { name: 'IBM Cloud',           version: 'VPC', renewal: 'Nov 15, 2026', arr: '$420,000' },
      { name: 'IBM Security QRadar', version: '7.5', renewal: 'Nov 15, 2026', arr: '$500,000' },
    ],
    competitors: [
      { name: 'Palo Alto',  products: ['Prisma Cloud', 'Cortex XSOAR'], scope: 'Security orchestration' },
      { name: 'Microsoft',  products: ['Defender for Cloud'],            scope: 'Cloud workload protection' },
    ],
    opportunities: [
      { name: 'IBM Verify — Zero-Trust Identity', stage: 'Qualification',    value: '$380,000', closeDate: 'Oct 1, 2026' },
      { name: 'QRadar SOAR Add-on',               stage: 'Proof of Concept', value: '$220,000', closeDate: 'Nov 1, 2026' },
    ],
    contacts: [
      { name: 'Lisa Trombetta', title: 'VP Security Operations', role: 'Technical Decision Maker', strength: '★★★☆☆' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 780000 }, { period: 'Q3 FY24', amount: 810000 },
      { period: 'Q4 FY24', amount: 850000 }, { period: 'Q1 FY25', amount: 875000 },
      { period: 'Q2 FY25', amount: 900000 }, { period: 'Q3 FY25', amount: 915000 },
      { period: 'Q4 FY25', amount: 920000 },
    ],
  },
  'acc-008': {
    name: 'RICOH', industry: 'Technology / Imaging & Document Solutions', region: 'Global',
    arr: '$1.62M', arTrend: '+9.8% YoY', health: 73, healthNote: 'CSP expansion proposal pending',
    products: [
      { name: 'IBM FileNet Content Manager',           version: '5.5',  renewal: 'Feb 1, 2027', arr: '$820,000' },
      { name: 'IBM Cloud Pak for Business Automation', version: '23.0', renewal: 'Feb 1, 2027', arr: '$800,000' },
    ],
    competitors: [
      { name: 'OpenText',  products: ['Content Suite'],     scope: 'Legacy ECM footprint' },
      { name: 'Microsoft', products: ['SharePoint Online'], scope: 'Unstructured content collaboration' },
    ],
    opportunities: [
      { name: 'watsonx Orchestrate — Workflow Automation', stage: 'Qualification', value: '$520,000', closeDate: 'Oct 30, 2026' },
      { name: 'FileNet to Content Services Platform',       stage: 'Negotiation',  value: '$380,000', closeDate: 'Aug 30, 2026' },
    ],
    contacts: [
      { name: 'David Okafor', title: 'CIO', role: 'Economic Buyer', strength: '★★★★☆' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 1280000 }, { period: 'Q3 FY24', amount: 1360000 },
      { period: 'Q4 FY24', amount: 1450000 }, { period: 'Q1 FY25', amount: 1510000 },
      { period: 'Q2 FY25', amount: 1560000 }, { period: 'Q3 FY25', amount: 1590000 },
      { period: 'Q4 FY25', amount: 1620000 },
    ],
  },
  'acc-009': {
    name: 'SAGENT M&C LLC', industry: 'Financial Services / Mortgage', region: 'Northeast US',
    arr: '$310,000', arTrend: '-5.2% YoY', health: 53, healthNote: 'Pipeline stalled — outreach needed',
    products: [
      { name: 'IBM OpenPages', version: '9.0', renewal: 'Oct 15, 2026', arr: '$310,000' },
    ],
    competitors: [
      { name: 'Wolters Kluwer', products: ['OneSumX GRC'],  scope: 'Regulatory compliance' },
      { name: 'MetricStream',   products: ['GRC Platform'], scope: 'Risk management evaluation' },
    ],
    opportunities: [
      { name: 'IBM Safer Payments — Fraud Detection', stage: 'Discovery', value: '$180,000', closeDate: 'Nov 30, 2026' },
      { name: 'IBM Consulting — CFPB Compliance',     stage: 'Discovery', value: '$120,000', closeDate: 'Dec 15, 2026' },
    ],
    contacts: [
      { name: 'Amy Chen', title: 'Head of Compliance IT', role: 'Champion', strength: '★★★☆☆' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 370000 }, { period: 'Q3 FY24', amount: 360000 },
      { period: 'Q4 FY24', amount: 345000 }, { period: 'Q1 FY25', amount: 330000 },
      { period: 'Q2 FY25', amount: 320000 }, { period: 'Q3 FY25', amount: 315000 },
      { period: 'Q4 FY25', amount: 310000 },
    ],
  },
};

const STAGE_COLOR = {
  'Proof of Concept': 'tag--blue',
  'Negotiation':      'tag--green',
  'Qualification':    'tag--yellow',
  'Discovery':        'tag--gray',
};

// ── Account Detail View ───────────────────────────────────────────────────────
function AccountDetailView({ accountId }) {
  const d = ACCOUNT_DATA[accountId];
  if (!d) return <div className="empty-state">No detail data available for this account.</div>;

  const chartData = d.revenue.map(r => ({
    period: r.period,
    amount: r.amount,
    fmt: r.amount >= 1000000
      ? `$${(r.amount / 1000000).toFixed(2)}M`
      : `$${(r.amount / 1000).toFixed(0)}K`,
  }));

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
            ${(d.opportunities.reduce((s, o) => s + parseInt(o.value.replace(/[$,]/g, '')), 0) / 1000).toFixed(0)}K pipeline
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

  // 'list' = account overview, or an account id = showing detail for that account
  const [view, setView] = useState('list');

  const selectedAccount = view !== 'list' ? list.find(a => a.id === view) : null;
  const detailData = view !== 'list' ? ACCOUNT_DATA[view] : null;

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
                <h1 className="page-header__title">{detailData?.name || selectedAccount?.name}</h1>
                <p className="page-header__subtitle">
                  {detailData?.industry} · {detailData?.region}
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

          <AccountDetailView accountId={view} />
        </>
      )}
    </div>
  );
}

// Mock fallback accounts (used when backend is not available)
const MOCK_ACCOUNTS = [
  { id: 'acc-001', name: 'QUEST DIAGNOSTICS',                           tier: 'Strategic', health_score: 72, quota: 2000000, closed: 1440000 },
  { id: 'acc-002', name: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY', tier: 'Strategic', health_score: 65, quota: 3000000, closed: 1380000 },
  { id: 'acc-003', name: 'SIEMENS',                                     tier: 'Strategic', health_score: 83, quota: 5000000, closed: 4150000 },
  { id: 'acc-004', name: 'SEI INVESTMENTS',                             tier: 'Premier',   health_score: 48, quota: 1800000, closed: 630000  },
  { id: 'acc-005', name: 'INDEPENDENCE BLUECROSS',                      tier: 'Premier',   health_score: 76, quota: 1500000, closed: 1125000 },
  { id: 'acc-006', name: 'SUNGARD DATA SYSTEMS',                        tier: 'Premier',   health_score: 38, quota: 1200000, closed: 360000  },
  { id: 'acc-007', name: 'SELECT MEDICAL CORP',                         tier: 'Premier',   health_score: 62, quota: 1000000, closed: 580000  },
  { id: 'acc-008', name: 'RICOH',                                       tier: 'Strategic', health_score: 80, quota: 2200000, closed: 1760000 },
  { id: 'acc-009', name: 'SAGENT M&C LLC',                              tier: 'Premier',   health_score: 55, quota: 900000,  closed: 450000  },
];
