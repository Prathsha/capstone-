import React, { useEffect, useRef } from 'react';

const WXO_HOST_ID   = 'wxo-chat-host';
const WXO_SCRIPT_ID = 'wxo-loader-script';

const WXO_CONFIG = {
  orchestrationID:
    '20260715-1849-1485-409b-29a44d219373_20260716-1619-0360-405c-07897e68baa4',
  hostURL: 'https://dl.watson-orchestrate.ibm.com',
  chatOptions: {
    agentId: '20adb73a-16fa-4857-92c6-57da2931f27b',
  },
};

export default function OrchestrateChat() {
  const bodyRef     = useRef(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    let host = document.getElementById(WXO_HOST_ID);
    if (!host) {
      host = document.createElement('div');
      host.id = WXO_HOST_ID;
      host.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';
    }

    if (bodyRef.current && !bodyRef.current.contains(host)) {
      bodyRef.current.appendChild(host);
    }

    if (!document.getElementById(WXO_SCRIPT_ID)) {
      window.wxOConfiguration = { ...WXO_CONFIG, rootElementID: WXO_HOST_ID };
      const script    = document.createElement('script');
      script.id       = WXO_SCRIPT_ID;
      script.src      = `${WXO_CONFIG.hostURL}/wxochat/wxoLoader.js?embed=true`;
      script.onload   = () => { if (window.wxoLoader) window.wxoLoader.init(); };
      document.head.appendChild(script);
    } else {
      if (window.wxoLoader) {
        window.wxOConfiguration = { ...WXO_CONFIG, rootElementID: WXO_HOST_ID };
        window.wxoLoader.init();
      }
    }
  }, []);

  // Keep host inside our container on every render
  useEffect(() => {
    const host      = document.getElementById(WXO_HOST_ID);
    const container = bodyRef.current;
    if (host && container && !container.contains(host)) {
      container.appendChild(host);
    }
  });

  return (
    <div className="wxo-page__body" ref={bodyRef} style={{ flex: 1, position: 'relative', minHeight: 0 }} />
  );
}
