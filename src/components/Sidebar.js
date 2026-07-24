import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { path: '/',         label: 'Dashboard',         icon: '▦' },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { path: '/intelligence', label: 'Market Intelligence', icon: '◈' },
    ],
  },
  {
    section: 'AI Assistant',
    items: [
      { path: '/chat', label: 'AI Assistant (Orchestrate)', icon: '◎' },
    ],
  },
];

export default function Sidebar({ seller }) {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      {NAV_ITEMS.map(section => (
        <div key={section.section}>
          <div className="sidebar__section-label">{section.section}</div>
          <ul className="sidebar__nav">
            {section.items.map(item => (
              <li key={item.path} className="sidebar__nav-item">
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar__nav-link${isActive ? ' active' : ''}`
                  }
                >
                  <span className="sidebar__nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="sidebar__spacer" />

      {seller && (
        <div className="sidebar__footer">
          <div className="sidebar__footer-text">
            <div style={{ fontWeight: 600, color: 'var(--ibm-gray-30)', marginBottom: 2 }}>
              {seller.name}
            </div>
            <div>{seller.title}</div>
            <div>{seller.pod}</div>
          </div>
        </div>
      )}
    </nav>
  );
}
