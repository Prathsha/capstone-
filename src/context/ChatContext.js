import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * ChatContext
 * -----------
 * Global state for the chatbot feature, shared between:
 *   - ChatPage      (full conversation view)
 *   - Dashboard     (receives pinned actions)
 *   - ChatPanel     (floating panel, future use)
 *
 * State shape
 * -----------
 * messages       — full conversation history [{role, content}]
 * pinnedActions  — actions the user promoted from the chat to the dashboard
 * isLoading      — true while waiting for a Gemini reply
 * contextIds     — account IDs to scope the chat context (null = all)
 */

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages]           = useState([]);
  const [pinnedActions, setPinnedActions] = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [contextIds, setContextIds]       = useState(null);  // null = all accounts

  // Append a single message (used by both user sends and model replies)
  const appendMessage = useCallback((role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  }, []);

  // Pin an action item from the chat into the dashboard's suggested actions list
  const pinAction = useCallback((action) => {
    setPinnedActions(prev => {
      // Avoid exact duplicates by description
      if (prev.some(a => a.description === action.description && a.account_name === action.account_name)) {
        return prev;
      }
      return [action, ...prev];
    });
  }, []);

  const unpinAction = useCallback((actionId) => {
    setPinnedActions(prev => prev.filter(a => a.id !== actionId));
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      appendMessage,
      pinnedActions,
      pinAction,
      unpinAction,
      isLoading,
      setIsLoading,
      contextIds,
      setContextIds,
      clearConversation,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used inside <ChatProvider>');
  return ctx;
}
