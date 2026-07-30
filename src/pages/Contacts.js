import React, { useState } from 'react';
import { CONTACTS } from '../data/contacts';

export default function Contacts({ accounts = [], selectedIds = [] }) {
  // Pre-select the account filter when exactly one account is selected globally
  const preselect = selectedIds.length === 1
    ? (accounts.find(a => a.id === selectedIds[0])?.name ?? 'All')
    : 'All';

  const [filterAccount, setFilterAccount] = useState(preselect);
  // Keep the local filter in sync if the global selection changes
  React.useEffect(() => {
    setFilterAccount(
      selectedIds.length === 1
        ? (accounts.find(a => a.id === selectedIds[0])?.name ?? 'All')
        : 'All'
    );
  }, [selectedIds, accounts]);

  const filtered = CONTACTS.filter(contact =>
    filterAccount === 'All' || contact.company === filterAccount
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Customers</div>
        <h1 className="page-header__title">Contacts</h1>
        <p className="page-header__subtitle">{CONTACTS.length} verified contacts across 9 accounts</p>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Showing {filtered.length} contacts
        </span>
      </div>

      <div className="grid-2">
        {filtered.map(contact => {
          const subject = encodeURIComponent(`IBM follow-up for ${contact.company}`);
          const emailHref = `mailto:${contact.email}?subject=${subject}`;
          const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, '')}`;
          const level = /chief|cio|ciso/i.test(contact.title)
            ? 'Executive'
            : /vp|vice president/i.test(contact.title)
              ? 'Vice President'
              : 'Technology Leader';

          return (
            <div key={contact.id} className="contact-card card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{contact.name}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{contact.title}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>{contact.company}</div>
                </div>
                <span className="contact-role-tag tag tag--blue">{level}</span>
              </div>

              <div style={{ background: 'var(--ibm-gray-10)', padding: 'var(--space-3)', marginBottom: 'var(--space-4)', display: 'grid', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div>
                  <a href={emailHref} style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{contact.email}</a>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</div>
                  <a href={phoneHref} style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{contact.phone}</a>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <a href={emailHref} className="btn btn--primary" style={{ fontSize: 'var(--font-size-xs)', textDecoration: 'none' }}>✉ Send Email</a>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn--secondary" style={{ fontSize: 'var(--font-size-xs)', textDecoration: 'none' }}>
                  Message on LinkedIn ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
