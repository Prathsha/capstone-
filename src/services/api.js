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

// ── Export ────────────────────────────────────────────────────────────────────
/**
 * Export a Gemini-generated document reply as a Word (.docx) file download.
 *
 * @param {string} content    — the raw markdown text from the model
 * @param {string} docType    — "strategy" or "sales_play"
 * @param {string} accountName — used to name the downloaded file
 */
export const exportDocx = (content, docType, accountName) =>
  api.post(
    '/api/export/docx',
    { content, doc_type: docType, account_name: accountName },
    { responseType: 'blob' },
  ).then(r => {
    const url = URL.createObjectURL(new Blob([r.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${accountName.replace(/\s+/g, '_')}_${docType}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
