import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchNews, fetchFinancial, fetchStockQuote } from '../services/api';
import { Spinner, ErrorBlock, Tag, formatRelativeDate, formatCurrency } from '../components/Helpers';
import { useTaskContext } from '../context/TaskContext';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ── Add to Tasks button (inline) ─────────────────────────────────────────────
function AddToTasksBtn({ title, account, dueDate }) {
  const { addTask, tasks } = useTaskContext();
  const alreadyAdded = tasks.some(t => t.title === title);
  const [added, setAdded] = useState(alreadyAdded);

  const handleAdd = () => {
    if (added) return;
    const defaultDue = dueDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    addTask({
      id: `mi-${Date.now()}-${Math.random()}`,
      title: `Follow up: ${title.slice(0, 80)}${title.length > 80 ? '…' : ''}`,
      account: account || 'General',
      priority: 'Medium',
      dueDate: defaultDue,
      status: 'Todo',
      done: false,
      assignedTo: 'pratham',
      source: 'user',
      type: 'Follow-up',
    });
    setAdded(true);
  };

  return (
    <button onClick={handleAdd} disabled={added} style={{
      marginTop: 'var(--space-2)',
      padding: '3px 10px', fontSize: 11,
      background: added ? 'var(--color-bg-subtle)' : 'var(--ibm-blue-10)',
      border: `1px solid ${added ? 'var(--color-border)' : 'var(--ibm-blue-40)'}`,
      color: added ? 'var(--color-text-secondary)' : 'var(--ibm-blue-70)',
      cursor: added ? 'default' : 'pointer', fontFamily: 'var(--font-sans)',
      fontWeight: 600,
    }}>
      {added ? '✓ Added to Tasks' : '+ Add to Tasks'}
    </button>
  );
}

// ── Article Card ──────────────────────────────────────────────────────────────
function ArticleCard({ article }) {
  const hasLink = article.url && article.url !== '#';
  return (
    <div className="article-card">
      <div className="article-card__source-row">
        <span className="article-card__source">{article.source}</span>
        <span className="article-card__date">{formatRelativeDate(article.published_at)}</span>
        {article.account_name && (
          <span style={{ marginLeft: 'auto' }}>
            <span className="tag tag--blue" style={{ fontSize: 10 }}>{article.account_name}</span>
          </span>
        )}
      </div>
      <div className="article-card__title">
        {hasLink ? (
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        ) : (
          article.title
        )}
      </div>
      {article.description && (
        <div className="article-card__description">{article.description}</div>
      )}
      {hasLink && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--ibm-blue-60)', fontWeight: 600 }}>
            Read article →
          </a>
        </div>
      )}
      <AddToTasksBtn title={article.title} account={article.account_name} />
    </div>
  );
}

// ── Stock Price Chart ─────────────────────────────────────────────────────────
function PriceChart({ data }) {
  if (!data || data.length === 0) return null;
  const prices = data.map(d => d.close);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const first = data[0]?.close;
  const last = data[data.length - 1]?.close;
  const isUp = last >= first;

  return (
    <div style={{ marginTop: 'var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
        <span className="text-xs text-muted">90-Day Price History</span>
        <span className="text-xs text-muted">{data[0]?.date} → {data[data.length - 1]?.date}</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <XAxis dataKey="date" hide />
          <YAxis domain={[min * 0.97, max * 1.03]} hide />
          <Tooltip
            formatter={(v) => [`$${v}`, 'Close']}
            labelFormatter={(l) => l}
            contentStyle={{ fontSize: 12, border: '1px solid var(--ibm-gray-20)', background: '#fff' }}
          />
          <ReferenceLine y={first} stroke="var(--ibm-gray-30)" strokeDasharray="3 3" />
          <Line
            type="monotone" dataKey="close"
            stroke={isUp ? 'var(--ibm-green-50)' : 'var(--ibm-red-60)'}
            dot={false} strokeWidth={1.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Pure display components (no fetching) ─────────────────────────────────────
function NewsDisplay({ articles, loading, error }) {
  if (loading) return <Spinner />;
  if (error)   return <ErrorBlock message={error} />;
  if (!articles || articles.length === 0)
    return <div className="empty-state">No recent articles found.</div>;
  return (
    <div className="article-list">
      {articles.map((a, i) => <ArticleCard key={i} article={a} />)}
    </div>
  );
}

function StockDisplay({ data, loading, error, account }) {
  if (loading) return <Spinner />;
  if (error)   return <ErrorBlock message={error} />;
  if (!account) return null;

  if (!account.ticker) {
    return (
      <div className="notification notification--info">
        <strong>{account.name}</strong> is privately held. Stock and financial data is not publicly available.
      </div>
    );
  }

  if (!data || !data.quote) {
    return (
      <div className="notification notification--info">
        {data?.note || 'No stock data available for this account.'}
      </div>
    );
  }

  const q = data.quote;
  const isUp = (q.change_pct || 0) >= 0;

  return (
    <div className="grid-1-2" style={{ alignItems: 'start' }}>
      <div className="stock-panel">
        <div className="stock-panel__header">
          <div className="stock-panel__ticker">{q.ticker}</div>
          <div className="stock-panel__name">{q.name}</div>
          {data.source === 'yfinance' && (
            <div style={{ marginTop: 4, fontSize: 10, color: 'var(--ibm-gray-50)' }}>via yfinance</div>
          )}
        </div>
        <div className="stock-panel__body">
          <div className="stock-panel__price">
            {q.price != null ? `$${q.price.toFixed(2)}` : '—'}
          </div>
          {q.change_pct != null && (
            <div className={`stock-panel__change stock-panel__change--${isUp ? 'up' : 'down'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(q.change_pct)}%
            </div>
          )}
          <div className="stock-metrics">
            {[
              ['Market Cap',    formatCurrency(q.market_cap)],
              ['Revenue',       formatCurrency(q.revenue)],
              ['P/E Ratio',     q.pe_ratio?.toFixed(1) || '—'],
              ['Analyst Target',q.analyst_target ? `$${q.analyst_target.toFixed(2)}` : '—'],
              ['52W High',      q['52w_high'] ? `$${q['52w_high'].toFixed(2)}` : '—'],
              ['52W Low',       q['52w_low']  ? `$${q['52w_low'].toFixed(2)}`  : '—'],
              ['Recommendation',<span style={{ textTransform: 'capitalize' }}>{q.recommendation || '—'}</span>],
              ['Sector',        q.sector || '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="stock-metric__label">{label}</div>
                <div className="stock-metric__value">{value}</div>
              </div>
            ))}
          </div>
          {data.price_history && <PriceChart data={data.price_history} />}
          {q.description && (
            <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                Company Overview
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {q.description}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="card">
        <div className="card__header">
          <div className="card__title">IBM Products Owned</div>
        </div>
        {account.owned_products?.map((product, index) => (
          <div key={index} style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          }}>
            <span style={{ color: 'var(--ibm-blue-60)', fontSize: 12 }}>◆</span>
            {product}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cache helpers ─────────────────────────────────────────────────────────────
// Cache lives outside the component so it persists across navigation away and back.
// It is keyed by `${refreshCount}:${cacheKey}` so a manual refresh busts all entries.
const _cache = {};

function cacheKey(refreshCount, ...parts) {
  return `${refreshCount}:${parts.join(':')}`;
}

// ════════════════════════════════════════════════════════════════════════════
// Market Intelligence Page
// ════════════════════════════════════════════════════════════════════════════
export default function MarketIntelligence({ accounts, selectedIds = [] }) {
  const [activeTab, setActiveTab] = useState('news');

  // Derive the active single account from the global topbar selection.
  const derivedId = selectedIds.length === 1 ? selectedIds[0] : (accounts[0]?.id || '');
  const [selectedId, setSelectedId] = useState(derivedId);
  useEffect(() => {
    setSelectedId(selectedIds.length === 1 ? selectedIds[0] : (accounts[0]?.id || ''));
  }, [selectedIds, accounts]);

  // refreshCount is bumped only by the manual refresh button — not by tab switches.
  const [refreshCount, setRefreshCount] = useState(0);

  // Per-fetch-type loading / error / data state, all managed here.
  const [newsState,      setNewsState]      = useState({ loading: false, error: null, data: null });
  const [finNewsState,   setFinNewsState]   = useState({ loading: false, error: null, data: null });
  const [stockState,     setStockState]     = useState({ loading: false, error: null, data: null });

  // Track which cache keys are already in flight so we never double-fetch.
  const inflight = useRef(new Set());

  const isSingleAccount = selectedIds.length === 1;
  const selectedAccount = accounts.find(a => a.id === selectedId);

  // ── Fetch helpers ─────────────────────────────────────────────────────────
  const fetchOnce = useCallback((key, fetcher, setState) => {
    if (_cache[key] !== undefined) {
      // Already cached — apply immediately, no network call.
      setState(_cache[key]);
      return;
    }
    if (inflight.current.has(key)) return; // request already in flight
    inflight.current.add(key);
    setState(prev => ({ ...prev, loading: true, error: null }));
    fetcher()
      .then(data => {
        const result = { loading: false, error: null, data };
        _cache[key] = result;
        setState(result);
      })
      .catch(e => {
        const result = { loading: false, error: e.message, data: null };
        setState(result);
        // Don't cache errors — allow retry on next tab visit.
      })
      .finally(() => inflight.current.delete(key));
  }, []);

  // ── General News ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'news') return;
    if (isSingleAccount) {
      const key = cacheKey(refreshCount, 'news', selectedId);
      fetchOnce(key, () => fetchNews(selectedId, 30), setNewsState);
    } else {
      const key = cacheKey(refreshCount, 'news-overall');
      fetchOnce(key, () =>
        Promise.all(accounts.map(acc =>
          fetchNews(acc.id, 30)
            .then(d => ({ data: d, accountName: acc.name }))
            .catch(() => ({ data: null, accountName: acc.name }))
        )).then(results => {
          const all = results.flatMap(r =>
            (r.data?.articles || []).map(a => ({ ...a, account_name: r.accountName }))
          );
          all.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
          return { articles: all.slice(0, 40) };
        }),
        setNewsState
      );
    }
  }, [activeTab, isSingleAccount, selectedId, accounts, refreshCount, fetchOnce]);

  // ── Financial News ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'financial') return;
    if (isSingleAccount) {
      const key = cacheKey(refreshCount, 'financial', selectedId);
      fetchOnce(key, () => fetchFinancial(selectedId), setFinNewsState);
    } else {
      const key = cacheKey(refreshCount, 'financial-overall');
      fetchOnce(key, () =>
        Promise.all(accounts.map(acc =>
          fetchFinancial(acc.id)
            .then(d => ({ data: d, accountName: acc.name }))
            .catch(() => ({ data: null, accountName: acc.name }))
        )).then(results => {
          const all = results.flatMap(r =>
            (r.data?.news || []).map(a => ({ ...a, account_name: r.accountName }))
          );
          all.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
          return { news: all.slice(0, 40) };
        }),
        setFinNewsState
      );
    }
  }, [activeTab, isSingleAccount, selectedId, accounts, refreshCount, fetchOnce]);

  // ── Stock & Financials ────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'stock') return;
    if (!selectedAccount?.ticker) return; // privately held — nothing to fetch
    const key = cacheKey(refreshCount, 'stock', selectedId);
    fetchOnce(key, () => fetchStockQuote(selectedId), setStockState);
  }, [activeTab, selectedId, selectedAccount, refreshCount, fetchOnce]);

  // ── Derived display data ──────────────────────────────────────────────────
  const newsArticles    = isSingleAccount
    ? (newsState.data?.articles || [])
    : (newsState.data?.articles || []);
  const finArticles     = isSingleAccount
    ? (finNewsState.data?.news || [])
    : (finNewsState.data?.news || []);

  const handleRefresh = () => {
    // Clear cache entries for the current refresh epoch and bump the counter.
    // The next render's useEffects will see a new refreshCount and re-fetch.
    setRefreshCount(c => c + 1);
    setNewsState({ loading: false, error: null, data: null });
    setFinNewsState({ loading: false, error: null, data: null });
    setStockState({ loading: false, error: null, data: null });
  };

  const tabs = [
    { id: 'news',      label: 'General News' },
    { id: 'financial', label: 'Financial News' },
    { id: 'stock',     label: 'Stock & Financials' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <div className="page-header__eyebrow">Intelligence</div>
            <h1 className="page-header__title">Market Intelligence</h1>
            <p className="page-header__subtitle">
              {isSingleAccount && selectedAccount
                ? `${selectedAccount.name} — ${selectedAccount.industry}`
                : 'News, financial updates, and market signals for your accounts'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            title="Reload news from API"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', marginTop: 4,
              border: '1px solid var(--color-border-strong)',
              background: 'var(--color-surface)',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)', cursor: 'pointer',
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* ── Main Tabs ───────────────────────────────────────────────────── */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── General News Tab ─────────────────────────────────────────────── */}
      {activeTab === 'news' && (
        <NewsDisplay
          articles={newsArticles}
          loading={newsState.loading}
          error={newsState.error}
        />
      )}

      {/* ── Financial News Tab ───────────────────────────────────────────── */}
      {activeTab === 'financial' && (
        <div>
          {isSingleAccount && selectedAccount && (
            <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Tag color={selectedAccount.tier === 'Strategic' ? 'blue' : 'gray'}>{selectedAccount.tier}</Tag>
              <span className="text-sm text-muted"><strong>Industry:</strong> {selectedAccount.industry}</span>
              <span className="text-sm text-muted"><strong>Ticker:</strong> {selectedAccount.ticker || 'Private'}</span>
            </div>
          )}
          {isSingleAccount && selectedAccount && !selectedAccount.ticker && (
            <div className="notification notification--info" style={{ marginBottom: 'var(--space-5)' }}>
              This account is privately held, so financial-news coverage may be limited.
            </div>
          )}
          <NewsDisplay
            articles={finArticles}
            loading={finNewsState.loading}
            error={finNewsState.error}
          />
        </div>
      )}

      {/* ── Stock & Financials Tab ───────────────────────────────────────── */}
      {activeTab === 'stock' && (
        <div>
          {isSingleAccount && selectedAccount && (
            <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Tag color={selectedAccount.tier === 'Strategic' ? 'blue' : 'gray'}>{selectedAccount.tier}</Tag>
              <span className="text-sm text-muted"><strong>Ticker:</strong> {selectedAccount.ticker || 'Private'}</span>
              <span className="text-sm text-muted"><strong>Region:</strong> {selectedAccount.region}</span>
              <span className="text-sm text-muted"><strong>Last Contact:</strong> {selectedAccount.last_contact_days_ago}d ago</span>
            </div>
          )}
          {isSingleAccount
            ? <StockDisplay
                data={stockState.data}
                loading={stockState.loading}
                error={stockState.error}
                account={selectedAccount}
              />
            : accounts.map(account => (
                <StockDisplay
                  key={account.id}
                  data={null}
                  loading={false}
                  error={null}
                  account={account}
                />
              ))
          }
        </div>
      )}
    </div>
  );
}
