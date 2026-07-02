import React, { useState, useEffect, useCallback } from 'react';
import { fetchNews, fetchFinancial, fetchStockQuote } from '../services/api';
import { Spinner, ErrorBlock, Tag, formatRelativeDate, formatCurrency } from '../components/Helpers';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ── Article Card ──────────────────────────────────────────────────────────────
function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <div className="article-card__source-row">
        <span className="article-card__source">{article.source}</span>
        <span className="article-card__date">{formatRelativeDate(article.published_at)}</span>
      </div>
      <div className="article-card__title">
        {article.url && article.url !== '#' ? (
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
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

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

// ── News Section ──────────────────────────────────────────────────────────────
function NewsSection({ accountId, title, source, daysBack = 30 }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

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

  const isMock = data?.source === 'mock';

  return (
    <div>
      {isMock && (
        <div className="notification notification--warning" style={{ marginBottom: 'var(--space-4)' }}>
          <strong>API key not configured.</strong> Showing sample data.
          {source === 'general'
            ? ' Add NEWS_API_KEY to backend/main.py to fetch live articles from NewsAPI.'
            : ' Add FINNHUB_API_KEY to backend/main.py for live financial news.'}
        </div>
      )}

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

// ════════════════════════════════════════════════════════════════════════════
// Market Intelligence Page
// ════════════════════════════════════════════════════════════════════════════
export default function MarketIntelligence({ accounts }) {
  const [selectedId, setSelectedId] = useState(accounts[0]?.id || '');
  const [activeTab, setActiveTab]   = useState('news');

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

      {/* ── Account Picker ──────────────────────────────────────────────── */}
      <div className="card mb-6">
        <div className="card__header" style={{ marginBottom: 0 }}>
          <div>
            <div className="card__title">Select Account</div>
          </div>
          {selectedAccount && (
            <Tag color={selectedAccount.tier === 'Premier' ? 'purple' : 'blue'}>
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
        <>
          {/* ── Tabs ──────────────────────────────────────────────────── */}
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

          {/* ── Tab Content ──────────────────────────────────────────── */}
          {activeTab === 'news' && (
            <div>
              <div className="notification notification--info" style={{ marginBottom: 'var(--space-5)' }}>
                <div>
                  <strong>General News</strong> — Latest coverage from NewsAPI using precise,
                  company-specific queries to avoid false positives (e.g. "Lincoln" won't return
                  Abraham Lincoln articles).
                </div>
              </div>
              <NewsSection
                key={`news-${selectedId}`}
                accountId={selectedId}
                title="General News"
                source="general"
                daysBack={30}
              />
            </div>
          )}

          {activeTab === 'financial' && (
            <div>
              <div className="notification notification--info" style={{ marginBottom: 'var(--space-5)' }}>
                <div>
                  <strong>Financial News</strong> — Earnings updates, institutional activity,
                  and financial press from Finnhub.
                  {!selectedAccount.ticker && (
                    <span> Note: This account is privately held — Finnhub coverage may be limited.</span>
                  )}
                </div>
              </div>
              <NewsSection
                key={`fin-${selectedId}`}
                accountId={selectedId}
                title="Financial News"
                source="financial"
              />
            </div>
          )}

          {activeTab === 'stock' && (
            <div>
              {!selectedAccount.ticker ? (
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
                      {selectedAccount.owned_products.map((p, i) => (
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
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
