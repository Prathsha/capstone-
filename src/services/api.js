import axios from 'axios';

const BASE = 'http://localhost:8000';

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

// ── Chat ─────────────────────────────────────────────────────────────────────
/**
 * Send the full conversation history plus optional account scope to the
 * Gemini-backed chat endpoint.
 *
 * @param {Array<{role:string, content:string}>} messages — full history
 * @param {string[]|null} accountIds — null = all accounts
 * @returns {Promise<{reply: string, suggested_actions: Array}>}
 */
export const sendChatMessage = (messages, accountIds = null) =>
  api.post('/api/chat', { messages, account_ids: accountIds }).then(r => r.data);
