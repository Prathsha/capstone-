import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage, exportDocx } from '../services/api';
import { useChatContext } from '../context/ChatContext';
import { Spinner } from '../components/Helpers';

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message, onPinAction, accounts, contextIds }) {
  const isUser = message.role === 'user';

  // Render model replies with simple markdown-style formatting
  const renderContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('### ')) return <h4 key={i} className="chat-heading">{line.slice(4)}</h4>;
      if (line.startsWith('## '))  return <h3 key={i} className="chat-heading chat-heading--lg">{line.slice(3)}</h3>;
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={{ fontWeight: 600 }}>{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <p key={i} className="chat-bullet">{line}</p>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="chat-line">{line}</p>;
    });
  };

  return (
    <div className={`chat-bubble chat-bubble--${isUser ? 'user' : 'model'}`}>
      <div className="chat-bubble__label">{isUser ? 'You' : 'IBM CIA'}</div>
      <div className="chat-bubble__content">
        {isUser ? message.content : renderContent(message.content)}
      </div>

      {/* Pin-able action items attached to this message */}
      {message.suggestedActions && message.suggestedActions.length > 0 && (
        <div className="chat-actions">
          <div className="chat-actions__label">Suggested action items — pin to dashboard:</div>
          {message.suggestedActions.map(action => (
            <div key={action.id} className="chat-action-chip">
              <div className="chat-action-chip__body">
                <span className="chat-action-chip__type">{action.type}</span>
                <span className="chat-action-chip__account">{action.account_name}</span>
                <span className="chat-action-chip__desc">{action.description}</span>
              </div>
              <button
                className="chat-action-chip__pin"
                onClick={() => onPinAction(action)}
                title="Pin to AI-Suggested Actions"
              >
                + Pin
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Export button for structured documents */}
      {!isUser && message.docType && (
        <div className="chat-export">
          <button
            className="chat-export-btn"
            onClick={() => {
              const accountName = contextIds && accounts
                ? (accounts.find(a => a.id === contextIds[0])?.name || 'Account')
                : 'Account';
              exportDocx(message.content, message.docType, accountName);
            }}
            title="Download this document as a Word file"
          >
            ⬇ Export as Word
          </button>
        </div>
      )}
    </div>
  );
}

// ── Account scope selector ────────────────────────────────────────────────────
function ScopeSelector({ accounts, contextIds, onChange }) {
  return (
    <div className="chat-scope">
      <span className="chat-scope__label">Context:</span>
      <select
        className="account-selector__select"
        style={{ minWidth: 200, height: 30, fontSize: 12 }}
        value={contextIds === null ? 'all' : contextIds[0] || 'all'}
        onChange={e => {
          const v = e.target.value;
          onChange(v === 'all' ? null : [v]);
        }}
      >
        <option value="all">All Accounts</option>
        {accounts.map(a => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Chat Page
// ════════════════════════════════════════════════════════════════════════════
export default function ChatPage({ accounts, seller }) {
  const {
    messages, setMessages, appendMessage,
    pinnedActions, pinAction,
    isLoading, setIsLoading,
    contextIds, setContextIds,
    clearConversation,
  } = useChatContext();

  const [input, setInput]         = useState('');
  const [error, setError]         = useState(null);
  const [pinFeedback, setPinFeedback] = useState(null);
  const bottomRef                 = useRef(null);
  const textareaRef               = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handlePinAction = useCallback((action) => {
    pinAction(action);
    setPinFeedback(action.id);
    setTimeout(() => setPinFeedback(null), 2000);
  }, [pinAction]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    setError(null);

    appendMessage('user', text);
    setIsLoading(true);

    const history = [...messages, { role: 'user', content: text }];
    try {
      const data = await sendChatMessage(history, contextIds);

      // Attach any suggested actions directly to this model message
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: data.reply,
          suggestedActions: data.suggested_actions || [],
          docType: data.doc_type || null,
        },
      ]);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message;
      setError(`Error: ${detail}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, contextIds, appendMessage, setIsLoading, setMessages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Starter prompts to help the user get going
  const starterPrompts = [
    "What's my lowest-hanging fruit this quarter?",
    "Which accounts are most at risk of churn?",
    "Show me the best cross-sell opportunities right now.",
    "Which renewal should I prioritize this month?",
  ];

  return (
    <div className="chat-page">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="chat-header">
        <div>
          <div className="page-header__eyebrow">AI Assistant</div>
          <h1 className="page-header__title" style={{ marginBottom: 0 }}>Seller Intelligence Chat</h1>
          <p className="page-header__subtitle">
            Ask anything about your accounts, quota, or pipeline. Pinned insights appear on the dashboard.
          </p>
        </div>
        <div className="chat-header__controls">
          <ScopeSelector
            accounts={accounts}
            contextIds={contextIds}
            onChange={setContextIds}
          />
          {messages.length > 0 && (
            <button
              className="chat-clear-btn"
              onClick={clearConversation}
              title="Clear conversation"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Pinned actions summary ────────────────────────────────────────── */}
      {pinnedActions.length > 0 && (
        <div className="chat-pinned-banner">
          <span className="chat-pinned-banner__icon">◆</span>
          <span>
            <strong>{pinnedActions.length}</strong> action item{pinnedActions.length !== 1 ? 's' : ''} pinned to the
            <strong> AI-Suggested Actions</strong> panel on the Dashboard.
          </span>
        </div>
      )}

      {/* ── Message list ─────────────────────────────────────────────────── */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty__title">Ready to help you close deals.</div>
            <div className="chat-empty__sub">Try one of these to get started:</div>
            <div className="chat-starters">
              {starterPrompts.map((p, i) => (
                <button
                  key={i}
                  className="chat-starter-btn"
                  onClick={() => { setInput(p); textareaRef.current?.focus(); }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            onPinAction={handlePinAction}
            accounts={accounts}
            contextIds={contextIds}
          />
        ))}

        {isLoading && (
          <div className="chat-bubble chat-bubble--model chat-bubble--loading">
            <div className="chat-bubble__label">IBM CIA</div>
            <div className="chat-typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {error && (
          <div className="notification notification--error" style={{ margin: '8px 24px' }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <div className="chat-input-bar">
        {pinFeedback && (
          <div className="chat-pin-toast">✓ Action pinned to dashboard</div>
        )}
        <div className="chat-input-row">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            rows={2}
            placeholder="Ask about your accounts, pipeline, or renewal risks… (Shift+Enter for new line)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Send'}
          </button>
        </div>
        <div className="chat-input-hint">
          Context: {contextIds === null ? `All ${accounts.length} accounts` : accounts.find(a => a.id === contextIds?.[0])?.name || '—'}
          &nbsp;·&nbsp;{messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
        </div>
      </div>
    </div>
  );
}
