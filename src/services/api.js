import axios from 'axios';

// In production (Vercel) REACT_APP_API_URL is not set, so requests go to the
// same origin at /api — which Vercel routes to the Python serverless function.
// Locally, set REACT_APP_API_URL=http://localhost:8000 in .env.development.local
const BASE = process.env.REACT_APP_API_URL || '';

const api = axios.create({ baseURL: BASE, timeout: 30000 });

// ── Accounts ────────────────────────────────────────────────────────────────
export const fetchAccounts = () => api.get('/api/accounts').then(r => r.data);

export const fetchAccount = (id) => api.get(`/api/accounts/${id}`).then(r => r.data);

export const fetchDashboard = (accountIds = null) => {
  const params = accountIds && accountIds.length > 0 ? { account_ids: accountIds.join(',') } : {};
  return api.get('/api/dashboard', { params }).then(r => r.data);
};

// ── News ─────────────────────────────────────────────────────────────────────
export const fetchNews = (accountId, daysBack = 30) =>
  api.get(`/api/news/${accountId}`, { params: { days_back: daysBack } }).then(r => r.data);

// ── Financial ────────────────────────────────────────────────────────────────
export const fetchFinancial = (accountId) =>
  api.get(`/api/financial/${accountId}`).then(r => r.data);

export const fetchStockQuote = (accountId) =>
  api.get(`/api/stockquote/${accountId}`).then(r => r.data);

// ── Competitive Intelligence ──────────────────────────────────────────────────
export const fetchCompetitiveNews = (competitor = null, daysBack = 14) => {
  const params = { days_back: daysBack };
  if (competitor) params.competitor = competitor;
  return api.get('/api/competitive-news', { params }).then(r => r.data);
};

// ── Action Items (localStorage) ───────────────────────────────────────────────
const ACTIONS_KEY = 'cia_pending_actions';

export const getLocalActions = () => {
  try {
    return JSON.parse(localStorage.getItem(ACTIONS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveLocalAction = (action) => {
  const existing = getLocalActions();
  existing.unshift(action);
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(existing));
};

export const deleteLocalAction = (id) => {
  const existing = getLocalActions().filter(a => a.id !== id);
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(existing));
};
