import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import { fetchAccounts, fetchDashboard } from './services/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MyAccounts from './pages/MyAccounts';
import MarketIntelligence from './pages/MarketIntelligence';
import CompetitiveIntelligence from './pages/CompetitiveIntelligence';
import Contacts from './pages/Contacts';
import OrgChart from './pages/OrgChart';
import InstallBase from './pages/InstallBase';
import TeamManagement from './pages/TeamManagement';
import { Spinner, ErrorBlock } from './components/Helpers';
import { TaskProvider } from './context/TaskContext';

// ── Account Selector Bar ──────────────────────────────────────────────────────
function AccountSelectorBar({ accounts, selectedIds, onChange }) {
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === 'all') {
      onChange([]);
    } else {
      onChange([val]);
    }
  };

  const getCurrentValue = () => {
    if (selectedIds.length === 0) return 'all';
    if (selectedIds.length === 1) return selectedIds[0];
    return 'all';
  };

  const displayCount = selectedIds.length || accounts.length;

  return (
    <div className="account-selector">
      <span className="account-selector__label">Viewing:</span>
      <select
        className="account-selector__select"
        value={getCurrentValue()}
        onChange={handleChange}
        aria-label="Select accounts to view"
      >
        <option value="all">All Accounts ({accounts.length})</option>
        <optgroup label="Individual Accounts">
          {accounts.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </optgroup>
      </select>
      <span className="account-selector__badge">
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
          {displayCount} account{displayCount !== 1 ? 's' : ''}
        </span>
      </span>
    </div>
  );
}

// Routes where the AccountSelectorBar should be hidden
const HIDE_SELECTOR_PATHS = ['/competitive', '/team', '/accounts'];

// ════════════════════════════════════════════════════════════════════════════
// App Inner
// ════════════════════════════════════════════════════════════════════════════
function AppInner() {
  const [accounts, setAccounts]            = useState([]);
  const [seller, setSeller]                = useState(null);
  const [selectedIds, setSelectedIds]      = useState([]);
  const [dashboardData, setDashboardData]  = useState(null);
  const [loading, setLoading]              = useState(true);
  const [dashboardLoading, setDashLoading] = useState(false);
  const [error, setError]                  = useState(null);
  const [dashboardError, setDashError]     = useState(null);
  const location = useLocation();

  const showSelector = !HIDE_SELECTOR_PATHS.includes(location.pathname);

  // ── Initial load: accounts ────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetchAccounts()
      .then(data => {
        setAccounts(data.accounts);
        setSeller(data.seller);
      })
      .catch(e => setError(`Cannot reach backend. Is the FastAPI server running? (${e.message})`))
      .finally(() => setLoading(false));
  }, []);

  // ── Reload dashboard whenever selection changes ───────────────────────────
  const reloadDashboard = useCallback((ids) => {
    setDashLoading(true); setDashError(null);
    fetchDashboard(ids.length ? ids : null)
      .then(setDashboardData)
      .catch(e => setDashError(e.message))
      .finally(() => setDashLoading(false));
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      reloadDashboard(selectedIds);
    }
  }, [accounts, selectedIds, reloadDashboard]);

  const handleSelectionChange = (ids) => {
    setSelectedIds(ids);
  };

  if (loading) {
    return (
      <div className="app-body">
        <Topbar seller={null} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-body">
        <Topbar seller={null} />
        <div style={{ padding: 40 }}>
          <ErrorBlock message={error} />
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--color-text-secondary)' }}>
            <strong>To start the backend:</strong>
            <pre style={{ background: 'var(--ibm-gray-10)', padding: 12, marginTop: 8, fontFamily: 'var(--font-mono)' }}>
              cd backend{'\n'}
              pip install -r requirements.txt{'\n'}
              uvicorn main:app --reload
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-body">
      <Topbar seller={seller} />
      <div className="app-shell">
        <Sidebar seller={seller} />
        <div className="app-main">
          {showSelector && (
            <AccountSelectorBar
              accounts={accounts}
              selectedIds={selectedIds}
              onChange={handleSelectionChange}
            />
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  accounts={accounts}
                  seller={seller}
                  selectedIds={selectedIds}
                  dashboardData={dashboardData}
                  dashboardLoading={dashboardLoading}
                  dashboardError={dashboardError}
                />
              }
            />
            <Route path="/accounts"     element={<MyAccounts accounts={accounts} selectedIds={selectedIds} />} />
            <Route path="/intelligence" element={<MarketIntelligence accounts={accounts} selectedIds={selectedIds} />} />
            <Route path="/competitive"  element={<CompetitiveIntelligence />} />
            <Route path="/contacts"     element={<Contacts accounts={accounts} selectedIds={selectedIds} />} />
            <Route path="/org-chart"    element={<OrgChart selectedIds={selectedIds} />} />
            <Route path="/install-base" element={<InstallBase accounts={accounts} selectedIds={selectedIds} />} />
            <Route path="/team"         element={<TeamManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// ── WxO chat widget — loads after React mounts ───────────────────────────────
function WxOChat() {
  const chatInstanceRef = useRef(null);
  const [chatReady, setChatReady] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMaximized, setChatMaximized] = useState(false);

  useEffect(() => {
    const host = document.getElementById('wxo-chat-host');
    host?.classList.toggle('wxo-chat-host--maximized', chatMaximized);
    host?.classList.toggle('wxo-chat-host--closed', !chatOpen);
    return () => {
      host?.classList.remove('wxo-chat-host--maximized');
      host?.classList.remove('wxo-chat-host--closed');
    };
  }, [chatMaximized, chatOpen]);

  useEffect(() => {
    const chatHost = document.getElementById('wxo-chat-host');

    window.wxOConfiguration = {
      orchestrationID: "20260715-1849-1485-409b-29a44d219373_20260716-1619-0360-405c-07897e68baa4",
      hostURL: "https://dl.watson-orchestrate.ibm.com",
      showLauncher: true,
      layout: {
        form: "custom",
        customElement: chatHost,
        showOrchestrateHeader: true,
      },
      chatOptions: {
        agentId: "20adb73a-16fa-4857-92c6-57da2931f27b",
        onLoad: (instance) => {
          chatInstanceRef.current = instance;
          const initializeClosedView = () => {
            instance.changeView({ launcher: false, mainWindow: false });
          };
          instance.on('chat:ready', initializeClosedView);
          initializeClosedView();
          setChatReady(true);
        },
      },
    };

    if (document.getElementById('wxo-loader-script')) {
      return undefined;
    }

    const script = document.createElement('script');
    script.id  = 'wxo-loader-script';
    script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.addEventListener('load', () => {
      if (window.wxoLoader) {
        window.wxoLoader.init();
      }
    });
    document.head.appendChild(script);
  }, []);

  const openChat = async () => {
    await chatInstanceRef.current?.changeView({ launcher: false, mainWindow: true });
    setChatOpen(true);
  };

  const minimizeChat = async () => {
    await chatInstanceRef.current?.changeView({ launcher: false, mainWindow: false });
    setChatMaximized(false);
    setChatOpen(false);
  };

  const resetChat = async () => {
    await chatInstanceRef.current?.restartConversation();
  };

  const toggleMaximizeChat = () => {
    setChatMaximized(current => !current);
  };

  return (
    <>
      {chatOpen && (
        <div className={`chat-custom-header${chatMaximized ? ' chat-custom-header--maximized' : ''}`} role="banner" aria-label="AI chat header">
          <span>Capstone</span>
          <div className="chat-custom-header__actions">
            <button type="button" onClick={resetChat} aria-label="Reset chat" title="Reset chat">↻</button>
            <button
              type="button"
              onClick={toggleMaximizeChat}
              aria-label={chatMaximized ? 'Restore chat' : 'Maximize chat'}
              title={chatMaximized ? 'Restore chat' : 'Maximize chat'}
            >
              {chatMaximized ? '↙' : '↗'}
            </button>
            <button type="button" onClick={minimizeChat} aria-label="Minimize chat" title="Minimize chat">—</button>
          </div>
        </div>
      )}
      {!chatOpen && (
        <button
          type="button"
          className="chat-text-launcher"
          onClick={openChat}
          disabled={!chatReady}
          aria-label="Open AI chat"
        >
          AI Chat
        </button>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <TaskProvider>
        <WxOChat />
        <AppInner />
      </TaskProvider>
    </Router>
  );
}
