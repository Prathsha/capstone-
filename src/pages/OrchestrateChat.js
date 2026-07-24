import React, { useEffect, useRef } from 'react';

// ════════════════════════════════════════════════════════════════════════════
// Watson Orchestrate Chat Page
// The wxO loader must NOT be pointed at #root — that element is owned by
// React. We create a dedicated sibling div (#wxo-host) directly on <body>
// so the loader can mount its widget there without touching React's DOM.
// ════════════════════════════════════════════════════════════════════════════
const WXO_HOST_ID = 'wxo-host';

export default function OrchestrateChat() {
  const initialised = useRef(false);

  useEffect(() => {
    // React 18 Strict Mode double-invokes effects in dev — guard against that.
    if (initialised.current) return;
    initialised.current = true;

    // Create a mount point for the widget outside React's #root.
    let host = document.getElementById(WXO_HOST_ID);
    if (!host) {
      host = document.createElement('div');
      host.id = WXO_HOST_ID;
      document.body.appendChild(host);
    }

    window.wxOConfiguration = {
      orchestrationID:
        '20260715-1849-1485-409b-29a44d219373_20260716-1619-0360-405c-07897e68baa4',
      hostURL: 'https://dl.watson-orchestrate.ibm.com',
      rootElementID: WXO_HOST_ID,
      chatOptions: {
        agentId: '20adb73a-16fa-4857-92c6-57da2931f27b',
      },
    };

    const script = document.createElement('script');
    script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.addEventListener('load', () => {
      if (window.wxoLoader) {
        window.wxoLoader.init();
      }
    });
    document.head.appendChild(script);
  }, []);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">AI Assistant</div>
        <h1 className="page-header__title">Seller Intelligence Chat</h1>
        <p className="page-header__subtitle">
          Powered by IBM Watson Orchestrate — use the chat button in the
          bottom-right corner to get started.
        </p>
      </div>
    </div>
  );
}
