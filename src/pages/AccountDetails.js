import React, { useState } from 'react';

// Per-account detail data keyed to the real 9 accounts
const ACCOUNT_DATA = {
  'acc-001': {
    name: 'QUEST DIAGNOSTICS', industry: 'Healthcare / Diagnostics', region: 'Northeast US',
    arr: '$1.24M', arTrend: '+8.2% YoY', health: 72, healthNote: 'Watson Health renewal in 60 days',
    products: [
      { name: 'IBM Watson Health',        version: 'SaaS', renewal: 'Sep 15, 2026', arr: '$680,000' },
      { name: 'IBM Cloud Pak for Data',   version: '4.8',  renewal: 'Jan 20, 2027', arr: '$560,000' },
    ],
    competitors: [
      { name: 'Microsoft Azure', products: ['Azure Health Data Services', 'Power BI'], scope: 'Analytics & reporting workloads' },
      { name: 'Veeva Systems',   products: ['Veeva Vault'],                            scope: 'Clinical data management' },
    ],
    opportunities: [
      { name: 'CP4D Enterprise Tier Upgrade',        stage: 'Qualification',    value: '$320,000', closeDate: 'Oct 31, 2026' },
      { name: 'IBM TRIRIGA — Lab Facility Mgmt',     stage: 'Proof of Concept', value: '$210,000', closeDate: 'Dec 15, 2026' },
    ],
    contacts: [
      { name: 'Dr. Patricia Hale', title: 'CIO',                  role: 'Economic Buyer',           strength: '★★★★☆' },
      { name: 'Brian Torres',      title: 'VP Data & Analytics',   role: 'Technical Decision Maker', strength: '★★★★★' },
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
      { name: 'IBM OpenPages',                  version: '9.0', renewal: 'Nov 1, 2026',  arr: '$890,000' },
      { name: 'IBM Financial Crimes Insight',   version: 'SaaS', renewal: 'Mar 1, 2027', arr: '$1,210,000' },
    ],
    competitors: [
      { name: 'Crowdstrike',  products: ['Falcon XDR'],             scope: 'Endpoint security' },
      { name: 'ServiceNow',   products: ['GRC Module'],             scope: 'Risk & compliance workflows' },
    ],
    opportunities: [
      { name: 'IBM Guardium — Data Security',   stage: 'Proof of Concept', value: '$480,000', closeDate: 'Aug 1, 2026' },
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
      { name: 'IBM MAS (Maximo)',           version: '8.11', renewal: 'Dec 31, 2026', arr: '$1,820,000' },
      { name: 'IBM Sterling Supply Chain',  version: 'SaaS', renewal: 'Jun 30, 2027', arr: '$1,240,000' },
      { name: 'IBM Cloud',                  version: 'VPC',  renewal: 'Dec 31, 2026', arr: '$740,000'   },
    ],
    competitors: [
      { name: 'SAP',         products: ['S/4HANA', 'SAP Asset Intelligence'], scope: 'ERP & asset management' },
      { name: 'Microsoft',   products: ['Azure IoT Hub', 'Dynamics 365'],     scope: 'IoT & field service' },
    ],
    opportunities: [
      { name: 'IBM Turbonomic — Cloud Cost Optimization', stage: 'Qualification', value: '$620,000', closeDate: 'Sep 30, 2026' },
      { name: 'Sterling Order Mgmt Expansion',             stage: 'Negotiation',  value: '$480,000', closeDate: 'Aug 15, 2026' },
    ],
    contacts: [
      { name: 'Annika Brandt', title: 'Global IT Director',  role: 'Champion',                  strength: '★★★★★' },
      { name: 'Ravi Patel',    title: 'Enterprise Architect', role: 'Technical Decision Maker', strength: '★★★★☆' },
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
      { name: 'Microsoft',   products: ['Power Automate', 'Power BI'], scope: 'Process automation & reporting' },
      { name: 'UiPath',      products: ['RPA Platform'],               scope: 'Robotic process automation' },
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
      { name: 'IBM Watson Assistant',         version: 'SaaS', renewal: 'Aug 30, 2026', arr: '$680,000' },
      { name: 'IBM Cloud Pak for Integration', version: '16.1', renewal: 'Feb 28, 2027', arr: '$800,000' },
    ],
    competitors: [
      { name: 'AWS',     products: ['Amazon Connect', 'Lex'], scope: 'Contact center AI' },
      { name: 'Nuance',  products: ['Dragon Medical'],        scope: 'Clinical NLP' },
    ],
    opportunities: [
      { name: 'Watson Assistant — Member Portal Expansion', stage: 'Negotiation',      value: '$420,000', closeDate: 'Sep 1, 2026' },
      { name: 'IBM DataStage — Claims Integration',         stage: 'Proof of Concept', value: '$290,000', closeDate: 'Nov 15, 2026' },
    ],
    contacts: [
      { name: 'James Nguyen', title: 'Chief Digital Officer',   role: 'Economic Buyer', strength: '★★★★☆' },
      { name: 'Tara Williams', title: 'Director of Integration', role: 'Champion',       strength: '★★★★★' },
    ],
    revenue: [
      { period: 'Q2 FY24', amount: 980000 }, { period: 'Q3 FY24', amount: 1080000 },
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
      { name: 'IBM Cloud',              version: 'VPC',  renewal: 'Nov 15, 2026', arr: '$420,000' },
      { name: 'IBM Security QRadar',    version: '7.5',  renewal: 'Nov 15, 2026', arr: '$500,000' },
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
      { name: 'IBM FileNet Content Manager',             version: '5.5', renewal: 'Feb 1, 2027',  arr: '$820,000' },
      { name: 'IBM Cloud Pak for Business Automation',   version: '23.0', renewal: 'Feb 1, 2027', arr: '$800,000' },
    ],
    competitors: [
      { name: 'OpenText',    products: ['Content Suite'],           scope: 'Legacy ECM footprint' },
      { name: 'Microsoft',   products: ['SharePoint Online'],       scope: 'Unstructured content collaboration' },
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
      { name: 'Wolters Kluwer', products: ['OneSumX GRC'],           scope: 'Regulatory compliance' },
      { name: 'MetricStream',   products: ['GRC Platform'],          scope: 'Risk management evaluation' },
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

const ACCOUNTS_LIST = [
  { id: 'acc-001', name: 'QUEST DIAGNOSTICS' },
  { id: 'acc-002', name: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY' },
  { id: 'acc-003', name: 'SIEMENS' },
  { id: 'acc-004', name: 'SEI INVESTMENTS' },
  { id: 'acc-005', name: 'INDEPENDENCE BLUECROSS' },
  { id: 'acc-006', name: 'SUNGARD DATA SYSTEMS' },
  { id: 'acc-007', name: 'SELECT MEDICAL CORP' },
  { id: 'acc-008', name: 'RICOH' },
  { id: 'acc-009', name: 'SAGENT M&C LLC' },
];

const STAGE_COLOR = { 'Proof of Concept': 'tag--blue', 'Negotiation': 'tag--green', 'Qualification': 'tag--yellow', 'Discovery': 'tag--gray' };

export default function AccountDetails() {
  const [selectedId, setSelectedId] = useState('acc-001');
  const d = ACCOUNT_DATA[selectedId];
  const maxRev = Math.max(...d.revenue.map(r => r.amount));

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div className="page-header__eyebrow">Customers</div>
            <h1 className="page-header__title">{d.name}</h1>
            <p className="page-header__subtitle">{d.industry} · {d.region}</p>
          </div>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="account-selector__select"
            style={{ minWidth: 260, height: 36, marginTop: 4 }}
          >
            {ACCOUNTS_LIST.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </div>

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
          <div className="kpi-tile__sub">${(d.opportunities.reduce((s, o) => s + parseInt(o.value.replace(/[$,]/g, '')), 0) / 1000).toFixed(0)}K pipeline</div>
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
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-end', height: 90 }}>
          {d.revenue.map((r, i) => {
            const h = Math.round((r.amount / maxRev) * 80);
            const fmt = r.amount >= 1000000
              ? `$${(r.amount / 1000000).toFixed(2)}M`
              : `$${(r.amount / 1000).toFixed(0)}K`;
            return (
              <div key={r.period} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{fmt}</div>
                <div style={{ width: '100%', height: h, background: i === d.revenue.length - 1 ? 'var(--ibm-blue-60)' : 'var(--ibm-gray-20)' }} />
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{r.period}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
