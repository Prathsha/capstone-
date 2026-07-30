import React, { useState } from 'react';

const CONTACTS = [
  // QUEST DIAGNOSTICS
  { id: 1,  name: 'Ryan Donnally',      title: 'VP Data Architecture',      company: 'QUEST DIAGNOSTICS', role: 'Champion',                  stars: 5, lastMeeting: 'Jul 10, 2026', email: 'r.donnally@questdiagnostics.com',    phone: '+1 973-520-2700', notes: 'Primary champion on Governed Data Foundation ($1.2M) and Governance for AI Projects ($960K). watsonx.data + Knowledge Catalog + Optim in scope. Wipro is the strategic partner risk.' },
  { id: 2,  name: 'Tom Walsh',          title: 'Director, AI & Governance',  company: 'QUEST DIAGNOSTICS', role: 'Technical Decision Maker',  stars: 4, lastMeeting: 'Jul 8, 2026',  email: 't.walsh@questdiagnostics.com',       phone: '+1 973-520-2711', notes: 'Key decision-maker for Governance for AI Projects (watsonx.gov + Guardium AI Security). TCS Consulting is the named competitor — requires customized solution. IBM Leader: Sonja Gorman.' },
  { id: 14, name: 'Mark Clare',         title: 'Head of BI & Analytics',    company: 'QUEST DIAGNOSTICS', role: 'Technical Decision Maker',  stars: 3, lastMeeting: 'Jun 28, 2026', email: 'm.clare@questdiagnostics.com',        phone: '+1 973-520-2720', notes: 'Leading BI Consolidation initiative ($467K Cognos opportunity). Initially pitched Content Hub but evaluating all options. Google Looker is the named competitor.' },
  { id: 15, name: 'Ravi Nekkalapu',     title: 'VP Integration Engineering', company: 'QUEST DIAGNOSTICS', role: 'Champion',                  stars: 4, lastMeeting: 'Jul 5, 2026',  email: 'r.nekkalapu@questdiagnostics.com',   phone: '+1 973-520-2730', notes: 'Integration Platform Consolidation/Modernization ($500K CP4I deal in Negotiation). IBM Leader: Alie Zimmer. Strong IBM preference for consolidating integration stack.' },
  { id: 16, name: 'Mark Ballard',       title: 'VP Infrastructure & Cloud',  company: 'QUEST DIAGNOSTICS', role: 'Economic Buyer',            stars: 3, lastMeeting: 'Jun 20, 2026', email: 'm.ballard@questdiagnostics.com',      phone: '+1 973-520-2740', notes: '#VMWARE initiative — evaluating Hybrid Cloud Modernization with Red Hat OpenShift. IBM Leader: Dawn Mack. No competitive evaluation yet, but budget not confirmed.' },
  { id: 17, name: 'Tony Barton',        title: 'VP IT Finance & FinOps',     company: 'QUEST DIAGNOSTICS', role: 'Economic Buyer',            stars: 4, lastMeeting: 'Jul 3, 2026',  email: 't.barton@questdiagnostics.com',       phone: '+1 973-520-2750', notes: 'IT Value Realization and FinOps initiative — scope includes Turbonomic, Instana, Cloudability, Apptio. IBM Leader: Chris Saulino. Has budget approval authority.' },
  { id: 18, name: 'Paddy Sundararajan', title: 'Director, Mainframe Ops',    company: 'QUEST DIAGNOSTICS', role: 'Technical Decision Maker',  stars: 3, lastMeeting: 'Jun 15, 2026', email: 'p.sundararajan@questdiagnostics.com', phone: '+1 973-520-2760', notes: 'Mainframe In-House Migration initiative — Quest evaluating repatriation from Canada outsourcer back to Quest Data Centers. IBM Leader: Dan Norremo. Early discovery stage.' },
  { id: 19, name: 'Anubha Gaur',        title: 'Director, DevOps & Infra',   company: 'QUEST DIAGNOSTICS', role: 'Technical Decision Maker',  stars: 3, lastMeeting: 'Jun 22, 2026', email: 'a.gaur@questdiagnostics.com',         phone: '+1 973-520-2770', notes: 'Automate Technology Operations initiative — Terraform, Fusion, Vault, Ansible, Red Hat OpenShift in scope. IBM Leader: Chris Saulino. No dollar amount yet — early-stage.' },
  { id: 3,  name: 'Sandra Osei',         title: 'Director of Infrastructure',  company: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY', role: 'Technical Decision Maker', stars: 4, lastMeeting: 'Jul 5, 2026',  email: 's.osei@lfg.com',                phone: '+1 215-448-1400', notes: 'Running the Guardium POC. Positive about IBM security story vs Crowdstrike.' },
  { id: 4,  name: 'Kevin Marsh',         title: 'CISO',                        company: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY', role: 'Blocker',                  stars: 2, lastMeeting: 'Jun 18, 2026', email: 'k.marsh@lfg.com',                phone: '+1 215-448-1422', notes: 'Skeptical of IBM licensing costs. Requires security certification documentation before approval.' },
  { id: 5,  name: 'Annika Brandt',       title: 'Global IT Director',          company: 'SIEMENS',                               role: 'Champion',                  stars: 5, lastMeeting: 'Jul 10, 2026', email: 'a.brandt@siemens.com',          phone: '+49 89 636-0',    notes: 'Driving MAS expansion globally. Has executive budget and strong IBM preference.' },
  { id: 6,  name: 'Ravi Patel',          title: 'Enterprise Architect',        company: 'SIEMENS',                               role: 'Technical Decision Maker',  stars: 4, lastMeeting: 'Jul 7, 2026',  email: 'r.patel@siemens.com',           phone: '+49 89 636-0112', notes: 'Owns hybrid cloud architecture decision. Evaluating IBM Cloud vs Azure for SAP workloads.' },
  { id: 7,  name: 'Carol Simmons',       title: 'VP Technology',               company: 'SEI INVESTMENTS',                       role: 'Economic Buyer',           stars: 3, lastMeeting: 'Jun 12, 2026', email: 'c.simmons@seic.com',            phone: '+1 610-676-1000', notes: 'Last contact 31 days ago — re-engagement needed. Evaluating IBM Cognos vs Power BI.' },
  { id: 8,  name: 'James Nguyen',        title: 'Chief Digital Officer',       company: 'INDEPENDENCE BLUECROSS',                role: 'Economic Buyer',           stars: 4, lastMeeting: 'Jul 6, 2026',  email: 'j.nguyen@ibx.com',              phone: '+1 215-241-2400', notes: 'Watson Assistant renewal in 45 days. Excited about member portal expansion ROI.' },
  { id: 9,  name: 'Tara Williams',       title: 'Director of Integration',     company: 'INDEPENDENCE BLUECROSS',                role: 'Champion',                  stars: 5, lastMeeting: 'Jul 9, 2026',  email: 't.williams@ibx.com',            phone: '+1 215-241-2411', notes: 'DataStage champion. Pushed DataStage evaluation through procurement herself.' },
  { id: 10, name: 'Michael Rath',        title: 'CTO',                         company: 'SUNGARD DATA SYSTEMS',                  role: 'Blocker',                   stars: 1, lastMeeting: 'May 22, 2026', email: 'm.rath@sungard.com',            phone: '+1 484-582-2000', notes: 'Health score critical. 52 days no contact. Competitive displacement signal — escalate immediately.' },
  { id: 11, name: 'Lisa Trombetta',      title: 'VP Security Operations',      company: 'SELECT MEDICAL CORP',                   role: 'Technical Decision Maker',  stars: 3, lastMeeting: 'Jul 3, 2026',  email: 'l.trombetta@selectmedical.com', phone: '+1 717-972-1100', notes: 'QRadar SIEM upgrade assessment in progress. Focused on HIPAA compliance expansion.' },
  { id: 12, name: 'David Okafor',        title: 'CIO',                         company: 'RICOH',                                 role: 'Economic Buyer',           stars: 4, lastMeeting: 'Jul 4, 2026',  email: 'd.okafor@ricoh.com',            phone: '+1 973-882-2000', notes: 'Digital transformation workshop confirmed for July. Strong advocate for content modernization.' },
  { id: 13, name: 'Amy Chen',            title: 'Head of Compliance IT',       company: 'SAGENT M&C LLC',                        role: 'Champion',                  stars: 3, lastMeeting: 'Jun 16, 2026', email: 'a.chen@sagent.com',             phone: '+1 972-590-3300', notes: 'OpenPages ROI review scheduled. Pipeline stalled — needs executive touchpoint from IBM side.' },
];

const ROLE_COLORS = {
  'Champion':                 'tag--green',
  'Blocker':                  'tag--red',
  'Neutral':                  'tag--gray',
  'Economic Buyer':           'tag--purple',
  'Technical Decision Maker': 'tag--blue',
};

function Stars({ count }) {
  return (
    <span className="contact-card__stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= count ? 'var(--ibm-yellow-30)' : 'var(--ibm-gray-30)', fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

const COMPANIES = [...new Set(CONTACTS.map(c => c.company))];
const ROLES     = [...new Set(CONTACTS.map(c => c.role))];

export default function Contacts({ accounts = [], selectedIds = [] }) {
  // Pre-select the account filter when exactly one account is selected globally
  const preselect = selectedIds.length === 1
    ? (accounts.find(a => a.id === selectedIds[0])?.name ?? 'All')
    : 'All';

  const [filterAccount, setFilterAccount] = useState(preselect);
  const [filterRole,    setFilterRole]    = useState('All');

  // Keep the local filter in sync if the global selection changes
  React.useEffect(() => {
    setFilterAccount(
      selectedIds.length === 1
        ? (accounts.find(a => a.id === selectedIds[0])?.name ?? 'All')
        : 'All'
    );
  }, [selectedIds, accounts]);

  const filtered = CONTACTS.filter(c =>
    (filterAccount === 'All' || c.company === filterAccount) &&
    (filterRole    === 'All' || c.role    === filterRole)
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Customers</div>
        <h1 className="page-header__title">Contacts</h1>
        <p className="page-header__subtitle">{CONTACTS.length} contacts across 9 accounts</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account</label>
          <select value={filterAccount} onChange={e => setFilterAccount(e.target.value)} className="account-selector__select" style={{ minWidth: 220, height: 32 }}>
            <option value="All">All Accounts</option>
            {COMPANIES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role Type</label>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="account-selector__select" style={{ minWidth: 220, height: 32 }}>
            <option value="All">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Showing {filtered.length} contacts
        </span>
      </div>

      <div className="grid-2">
        {filtered.map(c => (
          <div key={c.id} className="contact-card card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{c.name}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{c.title}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{c.company}</div>
              </div>
              <span className={`contact-role-tag tag ${ROLE_COLORS[c.role] || 'tag--gray'}`}>{c.role}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <Stars count={c.stars} />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Relationship strength</span>
            </div>

            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{c.notes}"
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Meeting</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{c.lastMeeting}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{c.email}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{c.phone}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
