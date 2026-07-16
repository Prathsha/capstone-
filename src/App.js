import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import { fetchAccounts, fetchDashboard } from './services/api';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MarketIntelligence from './pages/MarketIntelligence';
import { Spinner, ErrorBlock } from './components/Helpers';

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
// App
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

  // ── Watson Orchestrate floating chat widget ───────────────────────────────
  // Initialised once for the lifetime of the app so the button is always
  // visible regardless of which page the user is on.
  const wxoInitialised = useRef(false);
  useEffect(() => {
    if (wxoInitialised.current) return;
    wxoInitialised.current = true;

    let host = document.getElementById('wxo-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'wxo-host';
      document.body.appendChild(host);
    }

    window.wxOConfiguration = {
      orchestrationID:
        '20260715-1849-1485-409b-29a44d219373_20260716-1619-0360-405c-07897e68baa4',
      hostURL: 'https://dl.watson-orchestrate.ibm.com',
      rootElementID: 'wxo-host',
      chatOptions: {
        agentId: '20adb73a-16fa-4857-92c6-57da2931f27b',
      },
    };

    const script = document.createElement('script');
    script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.addEventListener('load', () => {
      if (window.wxoLoader) window.wxoLoader.init();
    });
    document.head.appendChild(script);
  }, []);

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
                  dashboardData={dashboardData}
                  dashboardLoading={dashboardLoading}
                  dashboardError={dashboardError}
                />
              }
            />
            <Route
              path="/intelligence"
              element={<MarketIntelligence accounts={accounts} />}
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
      <AppInner />
    </Router>
  );
}
