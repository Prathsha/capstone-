import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import { fetchAccounts, fetchDashboard } from './services/api';
import { useState, useEffect, useCallback } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MarketIntelligence from './pages/MarketIntelligence';
import ChatPage from './pages/Chat';
import { Spinner, ErrorBlock } from './components/Helpers';
import { ChatProvider, useChatContext } from './context/ChatContext';

// ── Account Selector Bar ──────────────────────────────────────────────────────
function AccountSelectorBar({ accounts, selectedIds, onChange }) {
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === 'all') {
      onChange([]);
    } else if (val === 'group-strategic') {
      onChange(accounts.filter(a => a.tier === 'Strategic').map(a => a.id));
    } else if (val === 'group-premier') {
      onChange(accounts.filter(a => a.tier === 'Premier').map(a => a.id));
    } else {
      onChange([val]);
    }
  };

  const getCurrentValue = () => {
    if (selectedIds.length === 0) return 'all';
    if (selectedIds.length === 1) return selectedIds[0];
    const strategicIds = accounts.filter(a => a.tier === 'Strategic').map(a => a.id);
    const premierIds   = accounts.filter(a => a.tier === 'Premier').map(a => a.id);
    if (
      selectedIds.length === strategicIds.length &&
      selectedIds.every(id => strategicIds.includes(id))
    ) return 'group-strategic';
    if (
      selectedIds.length === premierIds.length &&
      selectedIds.every(id => premierIds.includes(id))
    ) return 'group-premier';
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
        <optgroup label="Account Groups">
          <option value="group-premier">Premier Accounts</option>
          <option value="group-strategic">Strategic Accounts</option>
        </optgroup>
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

// ════════════════════════════════════════════════════════════════════════════
// App Inner (needs ChatContext already mounted)
// ════════════════════════════════════════════════════════════════════════════
function AppInner() {
  const [accounts, setAccounts]           = useState([]);
  const [seller, setSeller]               = useState(null);
  const [selectedIds, setSelectedIds]     = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [dashboardLoading, setDashLoading] = useState(false);
  const [error, setError]                 = useState(null);
  const [dashboardError, setDashError]    = useState(null);

  const { pinnedActions } = useChatContext();

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

  // Merge backend suggested_actions with chat-pinned actions for the dashboard
  const mergedDashboard = dashboardData ? {
    ...dashboardData,
    suggested_actions: [
      ...pinnedActions.map(a => ({
        ...a,
        // Normalise field names to match existing SuggestedActionItem shape
        account_name: a.account_name,
      })),
      ...(dashboardData.suggested_actions || []),
    ],
  } : null;

  return (
    <div className="app-body">
      <Topbar seller={seller} />
      <div className="app-shell">
        <Sidebar seller={seller} />
        <div className="app-main">
          <AccountSelectorBar
            accounts={accounts}
            selectedIds={selectedIds}
            onChange={handleSelectionChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  accounts={accounts}
                  seller={seller}
                  selectedIds={selectedIds}
                  dashboardData={mergedDashboard}
                  dashboardLoading={dashboardLoading}
                  dashboardError={dashboardError}
                />
              }
            />
            <Route
              path="/intelligence"
              element={<MarketIntelligence accounts={accounts} />}
            />
            <Route
              path="/chat"
              element={<ChatPage accounts={accounts} seller={seller} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ChatProvider>
        <AppInner />
      </ChatProvider>
    </Router>
  );
}
