import React from 'react';

export default function Topbar({ seller }) {
  const initials = seller?.name
    ? seller.name.split(' ').map(w => w[0]).join('').slice(0, 2)
    : 'AR';

  return (
    <header className="topbar">
      <div className="topbar__logo">
        <span className="topbar__ibm-wordmark">IBM</span>
        <div className="topbar__divider" />
        <span className="topbar__product-name">Client Intelligence Agent</span>
      </div>

      <div className="topbar__spacer" />

      <div className="topbar__user">
        <span>{seller?.name || 'Seller'}</span>
        <div className="topbar__avatar" aria-hidden="true">{initials}</div>
      </div>
    </header>
  );
}
