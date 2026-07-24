import React from 'react';

const POCS = [
  {
    id: 1,
    account: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY',
    title: 'IBM Guardium Data Security POC',
    products: ['IBM Guardium', 'IBM OpenPages'],
    status: 'In Progress',
    owner: 'Sandra Osei (Client), IBM TSL + Security SE',
    targetDate: 'Aug 1, 2026',
    notes: 'Phase 1: Guardium scanning against Db2 and Oracle schemas in non-prod. SOX compliance use case confirmed. Sandra Osei driving positive momentum. Kevin Marsh (CISO) requires formal security certification documentation before Phase 2 approval.',
  },
  {
    id: 2,
    account: 'QUEST DIAGNOSTICS',
    title: 'IBM TRIRIGA — Lab Facility Optimization Pilot',
    products: ['IBM TRIRIGA', 'IBM Cloud Pak for Data'],
    status: 'Planning',
    owner: 'Brian Torres (Client), IBM TSL + GBS',
    targetDate: 'Dec 15, 2026',
    notes: 'Scoping complete. TRIRIGA connected to CP4D for facility utilization dashboards. Customer approved 3-location pilot covering NJ, TX, and CA labs. Kick-off meeting scheduled for Aug 14.',
  },
  {
    id: 3,
    account: 'INDEPENDENCE BLUECROSS',
    title: 'IBM DataStage — Claims Data Integration',
    products: ['IBM DataStage', 'IBM Watson Assistant'],
    status: 'In Progress',
    owner: 'Tara Williams (Client), IBM TSL + Data SE',
    targetDate: 'Nov 15, 2026',
    notes: 'DataStage pipeline connecting claims adjudication system to Watson Assistant knowledge base. Early results show 34% improvement in claim status resolution time. Production cut-over targeted Q1 2027.',
  },
  {
    id: 4,
    account: 'SELECT MEDICAL CORP',
    title: 'IBM QRadar SOAR — Security Automation Pilot',
    products: ['IBM QRadar SOAR', 'IBM Security QRadar'],
    status: 'Planning',
    owner: 'Lisa Trombetta (Client), IBM Security TSL',
    targetDate: 'Nov 1, 2026',
    notes: 'Extending existing QRadar SIEM with SOAR playbooks for ransomware and phishing response. 12 HIPAA-specific playbooks being customized. Lisa Trombetta confirmed this is her #1 H2 security initiative.',
  },
];

const ARCH_NOTES = [
  {
    id: 1,
    account: 'SIEMENS',
    date: 'Jul 7, 2026',
    title: 'MAS + Sterling Hybrid Integration Architecture',
    body: `Global asset management topology:
  [IBM MAS 8.11] ────── IBM MQ 9.3 ──────► [IBM Sterling Supply Chain SaaS]
        │                                              │
  [IoT Device Layer]                        [Order Management Module]
        │                                              │
  [IBM Cloud VPC – Frankfurt]       [IBM Cloud VPC – Dallas]
        │                                              │
        └──────── IBM Turbonomic (Cost Governance) ────┘

Key decisions:
  • MQ Uniform Cluster for cross-region message routing with sub-50ms latency
  • Turbonomic placed between IBM Cloud regions for continuous cost optimization
  • Ravi Patel approved architecture on Jul 7 — SOW pending legal sign-off`,
  },
  {
    id: 2,
    account: 'INDEPENDENCE BLUECROSS',
    date: 'Jul 9, 2026',
    title: 'Watson Assistant + DataStage Integration Pattern',
    body: `Member self-service channel architecture:
  [Claims System (on-prem)] ──► IBM DataStage ──► [Knowledge Base Store]
                                                         │
                                             [IBM Watson Assistant (SaaS)]
                                                         │
                                             [Member Portal / IVR / App]

  Authentication: IBM Verify (planned Phase 2)
  Observability: IBM Instana (evaluate in Phase 3)
  SLA: 99.95% uptime required — multi-zone IBM Cloud deployment`,
  },
  {
    id: 3,
    account: 'RICOH',
    date: 'Jul 4, 2026',
    title: 'Content Services Platform Modernization',
    body: `Legacy FileNet → Cloud Pak for Content migration path:
  Phase 1: FileNet 5.5 on-prem (current) → FileNet 5.6 on IBM Cloud
  Phase 2: CP4BA 23.0 workflow layer on top of FileNet
  Phase 3: watsonx Orchestrate for document routing automation

  Content volume: ~4.2TB active documents, 280M total objects
  Key risk: OpenText Content Suite in parallel for 18 months — migration window tight`,
  },
];

const DECISIONS = [
  { date: 'Jul 10, 2026', account: 'SIEMENS',                    decision: 'Approved IBM Turbonomic for multi-cloud cost governance over Apptio. ROI model showed 23% cloud spend reduction within 12 months.' },
  { date: 'Jul 7, 2026',  account: 'SIEMENS',                    decision: 'MAS 8.11 selected over SAP Asset Intelligence Network for global asset management. IBM support SLA and existing MQ integration were deciding factors.' },
  { date: 'Jul 5, 2026',  account: 'THE LINCOLN NATIONAL',        decision: 'Guardium POC approved for Phase 1 non-production scanning. Kevin Marsh (CISO) required formal IBM security certifications — provided Jul 3.' },
  { date: 'Jul 2, 2026',  account: 'QUEST DIAGNOSTICS',           decision: 'CP4D Enterprise tier upgrade approved by Brian Torres. Annual contract value increases from $560K to $820K on renewal.' },
  { date: 'Jun 30, 2026', account: 'INDEPENDENCE BLUECROSS',      decision: 'Watson Assistant SaaS renewal confirmed at $680K + member portal expansion scope added. DataStage POC kicked off same week.' },
  { date: 'Jun 16, 2026', account: 'SAGENT M&C LLC',              decision: 'OpenPages renewal deferred 60 days pending CFPB regulatory update. IBM Consulting engagement proposed to accelerate compliance readiness.' },
  { date: 'Jun 12, 2026', account: 'SEI INVESTMENTS',             decision: 'IBM Cognos vs Power BI evaluation extended to Q4. Carol Simmons (VP Tech) requested IBM reference from an asset management firm of similar size.' },
];

const STATUS_COLOR = { 'Planning': 'tag--yellow', 'In Progress': 'tag--blue', 'Complete': 'tag--green' };

export default function SolutionWorkspace() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Technical</div>
        <h1 className="page-header__title">Solution Workspace</h1>
        <p className="page-header__subtitle">Active POCs, architecture notes, and technical decisions across your 9 accounts</p>
      </div>

      {/* POC Tracker */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__header">
          <div className="card__title">POC Tracker</div>
          <span className="tag tag--blue">{POCS.length} active</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {POCS.map(poc => (
            <div key={poc.id} style={{ border: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{poc.title}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{poc.account}</div>
                </div>
                <span className={`tag ${STATUS_COLOR[poc.status]}`}>{poc.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                {poc.products.map(p => <span key={p} className="tag tag--purple">{p}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Owner</div>
                  <div style={{ fontSize: 'var(--font-size-sm)' }}>{poc.owner}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Target Date</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{poc.targetDate}</div>
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', background: 'var(--color-bg-subtle)', padding: 'var(--space-3)', lineHeight: 1.6 }}>
                {poc.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Notes */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__header"><div className="card__title">Architecture Notes</div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {ARCH_NOTES.map(note => (
            <div key={note.id} style={{ border: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>{note.title}</div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <span className="tag tag--gray">{note.account}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{note.date}</span>
                </div>
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-sm)', background: 'var(--ibm-gray-100)', color: 'var(--ibm-gray-20)', padding: 'var(--space-4)', overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {note.body}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Decisions Log */}
      <div className="card">
        <div className="card__header"><div className="card__title">Technical Decisions Log</div></div>
        <table className="data-table">
          <thead><tr><th>Date</th><th>Account</th><th>Decision</th></tr></thead>
          <tbody>
            {DECISIONS.map((d, i) => (
              <tr key={i}>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>{d.date}</td>
                <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{d.account}</td>
                <td style={{ lineHeight: 1.5 }}>{d.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
