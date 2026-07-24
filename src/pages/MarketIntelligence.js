import React, { useState, useEffect, useCallback } from 'react';
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
    // Default due date: 2 weeks from today
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
            contentStyle={{
              fontSize: 12,
              border: '1px solid var(--ibm-gray-20)',
              background: '#fff',
            }}
          />
          <ReferenceLine y={first} stroke="var(--ibm-gray-30)" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="close"
            stroke={isUp ? 'var(--ibm-green-50)' : 'var(--ibm-red-60)'}
            dot={false}
            strokeWidth={1.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Stock Quote Panel ─────────────────────────────────────────────────────────
function StockQuotePanel({ accountId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    fetchStockQuote(accountId)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [accountId]);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBlock message={error} />;
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
    <div className="stock-panel">
      <div className="stock-panel__header">
        <div className="stock-panel__ticker">{q.ticker}</div>
        <div className="stock-panel__name">{q.name}</div>
        {data.source === 'yfinance' && (
          <div style={{ marginTop: 4, fontSize: 10, color: 'var(--ibm-gray-50)' }}>
            via yfinance
          </div>
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
          <div>
            <div className="stock-metric__label">Market Cap</div>
            <div className="stock-metric__value">{formatCurrency(q.market_cap)}</div>
          </div>
          <div>
            <div className="stock-metric__label">Revenue</div>
            <div className="stock-metric__value">{formatCurrency(q.revenue)}</div>
          </div>
          <div>
            <div className="stock-metric__label">P/E Ratio</div>
            <div className="stock-metric__value">{q.pe_ratio?.toFixed(1) || '—'}</div>
          </div>
          <div>
            <div className="stock-metric__label">Analyst Target</div>
            <div className="stock-metric__value">
              {q.analyst_target ? `$${q.analyst_target.toFixed(2)}` : '—'}
            </div>
          </div>
          <div>
            <div className="stock-metric__label">52W High</div>
            <div className="stock-metric__value">
              {q['52w_high'] ? `$${q['52w_high'].toFixed(2)}` : '—'}
            </div>
          </div>
          <div>
            <div className="stock-metric__label">52W Low</div>
            <div className="stock-metric__value">
              {q['52w_low'] ? `$${q['52w_low'].toFixed(2)}` : '—'}
            </div>
          </div>
          <div>
            <div className="stock-metric__label">Recommendation</div>
            <div className="stock-metric__value" style={{ textTransform: 'capitalize' }}>
              {q.recommendation || '—'}
            </div>
          </div>
          <div>
            <div className="stock-metric__label">Sector</div>
            <div className="stock-metric__value">{q.sector || '—'}</div>
          </div>
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
  );
}

// ── Single-account News Section ───────────────────────────────────────────────
function NewsSection({ accountId, source, daysBack = 30 }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const loadData = useCallback(() => {
    setLoading(true); setError(null);
    const fetcher = source === 'general'
      ? fetchNews(accountId, daysBack)
      : fetchFinancial(accountId);
    fetcher
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [accountId, source, daysBack]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBlock message={error} />;

  const articles = source === 'general'
    ? (data?.articles || [])
    : (data?.news || []);

  return (
    <div>
      {articles.length === 0 ? (
        <div className="empty-state">No recent articles found for this account.</div>
      ) : (
        <div className="article-list">
          {articles.map((a, i) => <ArticleCard key={i} article={a} />)}
        </div>
      )}
    </div>
  );
}

// ── Overall News — fetches all accounts in parallel ───────────────────────────
function OverallNewsSection({ accounts, daysBack = 30 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!accounts || accounts.length === 0) return;
    setLoading(true);
    Promise.all(
      accounts.map(acc =>
        fetchNews(acc.id, daysBack)
          .then(data => ({
            data,
            accountName: acc.name,
            isMock: data?.source === 'mock',
          }))
          .catch(() => ({ data: null, accountName: acc.name, isMock: true }))
      )
    ).then(results => {
      const all = results.flatMap(r =>
        (r.data?.articles || []).map(a => ({ ...a, account_name: r.accountName }))
      );
      // Sort by published_at descending
      all.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
      setArticles(all.slice(0, 40)); // top 40 most recent across all accounts
    }).finally(() => setLoading(false));
  }, [accounts, daysBack]);

  if (loading) return <Spinner />;

  return (
    <div>
      {articles.length === 0 ? (
        <div className="empty-state">No recent articles found across accounts.</div>
      ) : (
        <div className="article-list">
          {articles.map((a, i) => <ArticleCard key={i} article={a} />)}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Market Intelligence Page
// ════════════════════════════════════════════════════════════════════════════
export default function MarketIntelligence({ accounts }) {
  const [newsView, setNewsView]   = useState('overall'); // 'overall' | account id
  const [activeTab, setActiveTab] = useState('news');
  const [selectedId, setSelectedId] = useState(accounts[0]?.id || '');

  const selectedAccount = accounts.find(a => a.id === selectedId);

  const tabs = [
    { id: 'news',      label: 'General News' },
    { id: 'financial', label: 'Financial News' },
    { id: 'stock',     label: 'Stock & Financials' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__eyebrow">Intelligence</div>
        <h1 className="page-header__title">Market Intelligence</h1>
        <p className="page-header__subtitle">
          News, financial updates, and market signals for your accounts
        </p>
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
        <div>
          {/* News view switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
            <button
              onClick={() => setNewsView('overall')}
              style={{
                padding: '6px 16px',
                border: `1px solid ${newsView === 'overall' ? 'var(--ibm-blue-60)' : 'var(--color-border)'}`,
                background: newsView === 'overall' ? 'var(--ibm-blue-60)' : 'var(--color-surface)',
                color: newsView === 'overall' ? '#fff' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', cursor: 'pointer',
              }}
            >
              All Accounts
            </button>
            {accounts.map(a => (
              <button
                key={a.id}
                onClick={() => { setNewsView(a.id); setSelectedId(a.id); }}
                style={{
                  padding: '6px 16px',
                  border: `1px solid ${newsView === a.id ? 'var(--ibm-blue-60)' : 'var(--color-border)'}`,
                  background: newsView === a.id ? 'var(--ibm-blue-60)' : 'var(--color-surface)',
                  color: newsView === a.id ? '#fff' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-xs)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {a.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {newsView === 'overall' ? (
            <OverallNewsSection key="overall" accounts={accounts} daysBack={30} />
          ) : (
            <NewsSection key={`news-${newsView}`} accountId={newsView} source="general" daysBack={30} />
          )}
        </div>
      )}

      {/* ── Financial News Tab ───────────────────────────────────────────── */}
      {activeTab === 'financial' && (
        <div>
          {/* Account Picker */}
          <div className="card mb-6">
            <div className="card__header" style={{ marginBottom: 0 }}>
              <div className="card__title">Select Account</div>
              {selectedAccount && (
                <Tag color={selectedAccount.tier === 'Strategic' ? 'blue' : 'gray'}>
                  {selectedAccount.tier}
                </Tag>
              )}
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <select
                className="account-selector__select"
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              {selectedAccount && (
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <div className="text-sm text-muted">
                    <strong>Industry:</strong> {selectedAccount.industry}
                  </div>
                  <div className="text-sm text-muted">
                    <strong>Ticker:</strong> {selectedAccount.ticker || 'Private'}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="notification notification--info" style={{ marginBottom: 'var(--space-5)' }}>
            <strong>Financial News</strong> — Earnings updates, institutional activity,
            and financial press from Finnhub.
            {selectedAccount && !selectedAccount.ticker && (
              <span> Note: This account is privately held — Finnhub coverage may be limited.</span>
            )}
          </div>
          {selectedAccount && (
            <NewsSection key={`fin-${selectedId}`} accountId={selectedId} source="financial" />
          )}
        </div>
      )}

      {/* ── Stock & Financials Tab ───────────────────────────────────────── */}
      {activeTab === 'stock' && (
        <div>
          {/* Account Picker */}
          <div className="card mb-6">
            <div className="card__header" style={{ marginBottom: 0 }}>
              <div className="card__title">Select Account</div>
              {selectedAccount && (
                <Tag color={selectedAccount.tier === 'Strategic' ? 'blue' : 'gray'}>
                  {selectedAccount.tier}
                </Tag>
              )}
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <select
                className="account-selector__select"
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              {selectedAccount && (
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <div className="text-sm text-muted">
                    <strong>Ticker:</strong> {selectedAccount.ticker || 'Private'}
                  </div>
                  <div className="text-sm text-muted">
                    <strong>Region:</strong> {selectedAccount.region}
                  </div>
                  <div className="text-sm text-muted">
                    <strong>Last Contact:</strong> {selectedAccount.last_contact_days_ago}d ago
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedAccount && (
            !selectedAccount.ticker ? (
              <div className="notification notification--info">
                <strong>{selectedAccount.name}</strong> is privately held.
                Stock and financial data is not publicly available.
              </div>
            ) : (
              <div className="grid-1-2" style={{ alignItems: 'start' }}>
                <StockQuotePanel key={`stock-${selectedId}`} accountId={selectedId} />
                <div>
                  <div className="card">
                    <div className="card__header">
                      <div className="card__title">IBM Products Owned</div>
                    </div>
                    {selectedAccount.owned_products?.map((p, i) => (
                      <div key={i} style={{
                        padding: 'var(--space-3) var(--space-4)',
                        borderBottom: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-sm)',
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)'
                      }}>
                        <span style={{ color: 'var(--ibm-blue-60)', fontSize: 12 }}>◆</span>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
