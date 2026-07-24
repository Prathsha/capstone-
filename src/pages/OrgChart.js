import React, { useState } from 'react';

const ACCOUNTS_LIST = [
  { id: 'acc-001', label: 'QUEST DIAGNOSTICS',                           subtitle: 'Healthcare / Diagnostics · Northeast US' },
  { id: 'acc-002', label: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY', subtitle: 'Financial Services / Insurance · Mid-Atlantic US' },
  { id: 'acc-003', label: 'SIEMENS',                                     subtitle: 'Industrial Technology / Manufacturing · Global' },
  { id: 'acc-004', label: 'SEI INVESTMENTS',                             subtitle: 'Financial Services / Asset Management · Southeast US' },
  { id: 'acc-005', label: 'INDEPENDENCE BLUECROSS',                      subtitle: 'Healthcare / Insurance · Mid-Atlantic US' },
  { id: 'acc-006', label: 'SUNGARD DATA SYSTEMS',                        subtitle: 'Technology / Financial Services IT · Northeast US' },
  { id: 'acc-007', label: 'SELECT MEDICAL CORP',                         subtitle: 'Healthcare / Hospital Systems · Central US' },
  { id: 'acc-008', label: 'RICOH',                                       subtitle: 'Technology / Imaging & Document Solutions · Global' },
  { id: 'acc-009', label: 'SAGENT M&C LLC',                              subtitle: 'Financial Services / Mortgage Servicing · Southwest US' },
];

const ORGS = {
  'acc-001': {
    root: { name: 'Dr. Patricia Hale', title: 'CIO', rel: 'champion' },
    children: [
      {
        node: { name: 'Brian Torres', title: 'VP Data & Analytics', rel: 'champion' },
        children: [
          { node: { name: 'Wei Zhang', title: 'Data Platform Architect', rel: 'neutral' }, children: [] },
          { node: { name: 'Kiran Mehta', title: 'ML Engineering Lead', rel: 'neutral' }, children: [] },
        ],
      },
      {
        node: { name: 'Angela Ross', title: 'VP Infrastructure', rel: 'neutral' },
        children: [
          { node: { name: 'Derek Holmes', title: 'Cloud Operations Director', rel: 'neutral' }, children: [] },
        ],
      },
    ],
  },
  'acc-002': {
    root: { name: 'Robert Fenn', title: 'CIO', rel: 'neutral' },
    children: [
      {
        node: { name: 'Sandra Osei', title: 'Director of Infrastructure', rel: 'champion' },
        children: [
          { node: { name: 'Paul Kwan', title: 'Integration Architect', rel: 'neutral' }, children: [] },
        ],
      },
      {
        node: { name: 'Kevin Marsh', title: 'CISO', rel: 'blocker' },
        children: [
          { node: { name: 'Nina Reyes', title: 'Security Operations Manager', rel: 'neutral' }, children: [] },
        ],
      },
    ],
  },
  'acc-003': {
    root: { name: 'Annika Brandt', title: 'Global IT Director', rel: 'champion' },
    children: [
      {
        node: { name: 'Ravi Patel', title: 'Enterprise Architect', rel: 'champion' },
        children: [
          { node: { name: 'Lars Becker', title: 'Cloud Platform Lead', rel: 'neutral' }, children: [] },
          { node: { name: 'Fatima Al-Rashid', title: 'Integration Specialist', rel: 'neutral' }, children: [] },
        ],
      },
      {
        node: { name: 'Stefan Müller', title: 'VP Operations Technology', rel: 'neutral' },
        children: [
          { node: { name: 'Yuki Tanaka', title: 'Supply Chain Tech Lead', rel: 'neutral' }, children: [] },
        ],
      },
    ],
  },
  'acc-005': {
    root: { name: 'James Nguyen', title: 'Chief Digital Officer', rel: 'champion' },
    children: [
      {
        node: { name: 'Tara Williams', title: 'Director of Integration', rel: 'champion' },
        children: [
          { node: { name: 'Marcus Bell', title: 'API Platform Architect', rel: 'neutral' }, children: [] },
        ],
      },
      {
        node: { name: 'Donna Harper', title: 'VP Member Technology', rel: 'neutral' },
        children: [
          { node: { name: 'Chen Wei', title: 'Digital Product Manager', rel: 'neutral' }, children: [] },
        ],
      },
    ],
  },
  'acc-007': {
    root: { name: 'Tom Kerr', title: 'CIO', rel: 'neutral' },
    children: [
      {
        node: { name: 'Lisa Trombetta', title: 'VP Security Operations', rel: 'neutral' },
        children: [
          { node: { name: 'Andre Brooks', title: 'SOC Director', rel: 'neutral' }, children: [] },
        ],
      },
      {
        node: { name: 'Mark Shapiro', title: 'Director of Cloud & Infrastructure', rel: 'neutral' },
        children: [],
      },
    ],
  },
  'acc-004': {
    root: { name: 'Carol Simmons', title: 'VP Technology', rel: 'neutral' },
    children: [
      {
        node: { name: 'Derek Flynn', title: 'Director of Enterprise Architecture', rel: 'neutral' },
        children: [
          { node: { name: 'Priya Nair', title: 'Cloud Platform Lead', rel: 'neutral' }, children: [] },
        ],
      },
      {
        node: { name: 'James Cho', title: 'Head of Data & Analytics', rel: 'neutral' },
        children: [
          { node: { name: 'Lin Wei', title: 'BI & Reporting Manager', rel: 'neutral' }, children: [] },
        ],
      },
    ],
  },
  'acc-006': {
    root: { name: 'Michael Rath', title: 'CTO', rel: 'blocker' },
    children: [
      {
        node: { name: 'Patrick Nolan', title: 'VP Infrastructure', rel: 'neutral' },
        children: [
          { node: { name: 'Kim Lee', title: 'Database Platform Architect', rel: 'neutral' }, children: [] },
        ],
      },
      {
        node: { name: 'Rachel Ortiz', title: 'Director of Cloud Strategy', rel: 'neutral' },
        children: [],
      },
    ],
  },
  'acc-008': {
    root: { name: 'David Okafor', title: 'CIO', rel: 'champion' },
    children: [
      {
        node: { name: 'Sophie Laurent', title: 'VP Digital Transformation', rel: 'champion' },
        children: [
          { node: { name: 'Kenji Ito', title: 'Content Platform Architect', rel: 'neutral' }, children: [] },
          { node: { name: 'Maria Santos', title: 'Automation Lead', rel: 'neutral' }, children: [] },
        ],
      },
    ],
  },
  'acc-009': {
    root: { name: 'Robert Yuen', title: 'CIO', rel: 'neutral' },
    children: [
      {
        node: { name: 'Amy Chen', title: 'Head of Compliance IT', rel: 'champion' },
        children: [
          { node: { name: 'Tom Bradley', title: 'GRC Platform Architect', rel: 'neutral' }, children: [] },
        ],
      },
      {
        node: { name: 'Marcus Webb', title: 'VP Technology Operations', rel: 'neutral' },
        children: [],
      },
    ],
  },
};

const REL = {
  champion: { bg: 'var(--ibm-green-50)',  label: 'Champion', tag: 'tag--green' },
  neutral:  { bg: 'var(--ibm-yellow-30)', label: 'Neutral',  tag: 'tag--yellow' },
  blocker:  { bg: 'var(--ibm-red-60)',    label: 'Blocker',  tag: 'tag--red' },
};

function OrgNode({ name, title, rel }) {
  const r = REL[rel] || REL.neutral;
  return (
    <div className="org-node">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{name}</div>
        <div title={r.label} style={{ width: 10, height: 10, borderRadius: '50%', background: r.bg, flexShrink: 0, marginTop: 2 }} />
      </div>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: 4 }}>{title}</div>
      <span className={`tag ${r.tag}`} style={{ fontSize: 10 }}>{r.label}</span>
    </div>
  );
}

function OrgBranch({ item }) {
  return (
    <div className="org-branch">
      <OrgNode name={item.node.name} title={item.node.title} rel={item.node.rel} />
      {item.children.length > 0 && (
        <>
          <div className="org-connector org-connector--down" />
          <div className="org-level">
            {item.children.map((child, i) => (
              <OrgBranch key={i} item={child} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrgChart() {
  const [selectedId, setSelectedId] = useState('acc-001');
  const acct = ACCOUNTS_LIST.find(a => a.id === selectedId);
  const org  = ORGS[selectedId];

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div className="page-header__eyebrow">Customers</div>
            <h1 className="page-header__title">Org Chart</h1>
            <p className="page-header__subtitle">{acct.label} — {acct.subtitle}</p>
          </div>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="account-selector__select"
            style={{ minWidth: 260, height: 36, marginTop: 4 }}
          >
            {ACCOUNTS_LIST.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {Object.entries(REL).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: v.bg, flexShrink: 0 }} />
            {v.label}
          </div>
        ))}
      </div>

      <div className="org-tree">
        <div className="org-level" style={{ justifyContent: 'center' }}>
          <OrgNode name={org.root.name} title={org.root.title} rel={org.root.rel} />
        </div>
        {org.children.length > 0 && (
          <>
            <div className="org-connector org-connector--down" />
            <div className="org-level">
              {org.children.map((child, i) => (
                <OrgBranch key={i} item={child} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
