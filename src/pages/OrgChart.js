import React from 'react';
import { CONTACTS } from '../data/contacts';
import { ORG_CHARTS } from '../data/orgCharts';

const ACCOUNTS_LIST = [
  { id: 'acc-001', company: 'QUEST DIAGNOSTICS', label: 'QUEST DIAGNOSTICS', subtitle: 'Healthcare / Diagnostics · Northeast US', source: 'https://www.theofficialboard.com/org-chart/quest-diagnostics' },
  { id: 'acc-002', company: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY', label: 'THE LINCOLN NATIONAL LIFE INSURANCE COMPANY', subtitle: 'Financial Services / Insurance · Northeast US', source: 'https://www.theofficialboard.com/org-chart/lincoln-financial-group' },
  { id: 'acc-003', company: 'SIEMENS', label: 'SIEMENS', subtitle: 'Industrial Technology / Manufacturing · Global', source: 'https://www.theofficialboard.com/org-chart/siemens' },
  { id: 'acc-004', company: 'SEI INVESTMENTS', label: 'SEI INVESTMENTS', subtitle: 'Financial Services / Asset Management · Northeast US', source: 'https://www.theofficialboard.com/org-chart/sei-investments' },
  { id: 'acc-005', company: 'INDEPENDENCE BLUECROSS', label: 'INDEPENDENCE BLUECROSS', subtitle: 'Healthcare / Insurance · Northeast US', source: 'https://www.theofficialboard.com/org-chart/independence-blue-cross-2' },
  { id: 'acc-006', company: 'SUNGARD DATA SYSTEMS', label: 'SUNGARD DATA SYSTEMS / 11:11 SYSTEMS', subtitle: 'Technology / Financial Services IT · Northeast US', source: 'https://www.theofficialboard.com/search?query=11%3A11%20Systems' },
  { id: 'acc-007', company: 'SELECT MEDICAL CORP', label: 'SELECT MEDICAL CORP', subtitle: 'Healthcare / Hospital Systems · United States', source: 'https://www.theofficialboard.com/org-chart/select-medical-2' },
  { id: 'acc-008', company: 'RICOH', label: 'RICOH USA', subtitle: 'Technology / Imaging & Document Solutions · North America', source: 'https://www.theofficialboard.com/org-chart/ricoh-usa' },
  { id: 'acc-009', company: 'SAGENT M&C LLC', label: 'SAGENT', subtitle: 'Financial Services / Mortgage Servicing · United States', source: 'https://www.theofficialboard.com/org-chart/sagent-2' },
];

function ContactNode({ contact }) {
  const subject = encodeURIComponent(`IBM follow-up for ${contact.company}`);

  return (
    <div className="org-node" style={{ minWidth: 230 }}>
      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{contact.name}</div>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: '4px 0 10px' }}>
        {contact.title}
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <a href={`mailto:${contact.email}?subject=${subject}`} style={{ fontSize: 11 }}>Email</a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11 }}>LinkedIn ↗</a>
      </div>
    </div>
  );
}

function PersonNode({ person, accent = false }) {
  return (
    <div className={`org-node${accent ? ' org-node--accent' : ''}`}>
      <div className="org-node__title">{person.title}</div>
      {person.name && <div className="org-node__name">{person.name}</div>}
    </div>
  );
}

function FunctionBranch({ branch }) {
  const contacts = (branch.contacts || [])
    .map(id => CONTACTS.find(contact => contact.id === id))
    .filter(Boolean);

  return (
    <section className="org-branch-card">
      <PersonNode person={branch} accent />
      {branch.children?.length > 0 && (
        <div className="org-children">
          {branch.children.map((title, index) => (
            <PersonNode key={`${title}-${index}`} person={{ title }} />
          ))}
        </div>
      )}
      {contacts.length > 0 && (
        <div className="org-verified-contacts">
          <div className="org-verified-contacts__label">Verified IBM contacts</div>
          {contacts.map(contact => <ContactNode key={contact.id} contact={contact} />)}
        </div>
      )}
    </section>
  );
}

function OrganizationChart({ account, showHeading = false }) {
  const chart = ORG_CHARTS[account.id];

  return (
    <section style={{ marginBottom: 'var(--space-8)' }}>
      {showHeading && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>{account.label}</h2>
          <div className="text-sm text-muted" style={{ marginTop: 'var(--space-2)' }}>{account.subtitle}</div>
        </div>
      )}
      <div className="org-tree">
        <div className="org-chart-columns">
          <section>
            <h2 className="org-section-title">Executive leadership & board</h2>
            <div className="org-leader-list">
              {chart.leaders.map((leader, index) => (
                <PersonNode key={`${leader.title}-${index}`} person={leader} accent={index === 0} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="org-section-title">Functions & business units</h2>
            <div className="org-functions-grid">
              {chart.functions.map((branch, index) => (
                <FunctionBranch key={`${branch.title}-${index}`} branch={branch} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default function OrgChart({ selectedIds = [] }) {
  const isSingleAccount = selectedIds.length === 1;
  const selectedAccount = isSingleAccount
    ? ACCOUNTS_LIST.find(item => item.id === selectedIds[0])
    : null;

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Customers</div>
        <h1 className="page-header__title">Org Chart</h1>
        <p className="page-header__subtitle">
          {selectedAccount
            ? `${selectedAccount.label} — ${selectedAccount.subtitle}`
            : 'Organization structures across all 9 accounts'}
        </p>
      </div>

      {selectedAccount
        ? <OrganizationChart account={selectedAccount} />
        : ACCOUNTS_LIST.map(account => (
            <OrganizationChart key={account.id} account={account} showHeading />
          ))}
    </div>
  );
}
