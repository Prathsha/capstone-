import React, { useState, useRef, useEffect } from 'react';

export default function Topbar({ seller }) {
  const [open, setOpen] = useState(false);
  const dropdownRef     = useRef(null);

  const initials = seller?.name
    ? seller.name.split(' ').map(w => w[0]).join('').slice(0, 2)
    : 'AK';

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <header className="topbar">
      <div className="topbar__logo">
        <span className="topbar__ibm-wordmark">IBM</span>
        <div className="topbar__divider" />
        <span className="topbar__product-name">Client Intelligence Agent</span>
      </div>

      <div className="topbar__spacer" />

      {/* ── User area with dropdown ── */}
      <div className="topbar__user-area" ref={dropdownRef}>
        <button
          className="topbar__user-btn"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div style={{ textAlign: 'right', lineHeight: 1.3 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>
              {seller?.name || 'Seller'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ibm-gray-40)' }}>
              {seller?.title || 'Technical Sales Leader'}
            </div>
          </div>
          <div className="topbar__avatar" aria-hidden="true">{initials}</div>
          <span style={{ color: 'var(--ibm-gray-40)', fontSize: 10, marginLeft: 2 }}>▾</span>
        </button>

        {open && (
          <div className="topbar__profile-dropdown">
            {/* Profile header */}
            <div className="topbar__profile-header">
              <div className="topbar__profile-avatar">{initials}</div>
              <div>
                <div className="topbar__profile-name">{seller?.name || 'Seller'}</div>
                <div className="topbar__profile-title">{seller?.title || 'Technical Sales Leader'}</div>
                <div className="topbar__profile-pod">{seller?.pod}</div>
              </div>
            </div>

            <div className="topbar__profile-divider" />

            {/* Details */}
            <div className="topbar__profile-section">
              <div className="topbar__profile-section-label">Contact</div>
              {seller?.email && (
                <div className="topbar__profile-row">
                  <span className="topbar__profile-icon">✉</span>
                  <span>{seller.email}</span>
                </div>
              )}
              {seller?.phone && (
                <div className="topbar__profile-row">
                  <span className="topbar__profile-icon">☎</span>
                  <span>{seller.phone}</span>
                </div>
              )}
              {seller?.location && (
                <div className="topbar__profile-row">
                  <span className="topbar__profile-icon">◎</span>
                  <span>{seller.location}</span>
                </div>
              )}
            </div>

            {seller?.region && (
              <>
                <div className="topbar__profile-divider" />
                <div className="topbar__profile-section">
                  <div className="topbar__profile-section-label">Territory</div>
                  <div className="topbar__profile-row">
                    <span className="topbar__profile-icon">◈</span>
                    <span>{seller.region}</span>
                  </div>
                  <div className="topbar__profile-row">
                    <span className="topbar__profile-icon">▤</span>
                    <span>{seller.accounts_count || 9} accounts</span>
                  </div>
                </div>
              </>
            )}

            {seller?.team && seller.team.length > 0 && (
              <>
                <div className="topbar__profile-divider" />
                <div className="topbar__profile-section">
                  <div className="topbar__profile-section-label">My Team</div>
                  {seller.team.map((m, i) => (
                    <div key={i} className="topbar__profile-row">
                      <span className="topbar__profile-icon">◉</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {seller?.bio && (
              <>
                <div className="topbar__profile-divider" />
                <div className="topbar__profile-section">
                  <div className="topbar__profile-bio">{seller.bio}</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
