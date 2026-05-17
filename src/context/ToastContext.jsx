import { createContext, useCallback, useEffect, useState } from 'react';

export const ToastContext = createContext(null);

let toastCounter = 0;

/**
 * In-app feedback. Anywhere in the tree:
 *
 *   const { push } = useToast();
 *   push('Document saved');
 *   push('Login failed', { type: 'error' });
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((all) => all.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((msg, opts = {}) => {
    const id = ++toastCounter;
    const t = { id, msg, type: opts.type || 'info', ttl: opts.ttl ?? 3500 };
    setToasts((all) => [...all, t]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, dismiss }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => <ToastItem key={t.id} toast={t} dismiss={dismiss} />)}
    </div>
  );
}

function ToastItem({ toast, dismiss }) {
  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), toast.ttl);
    return () => clearTimeout(id);
  }, [toast, dismiss]);

  const palette = {
    info:    { bg: 'var(--bg-surface)',          fg: 'var(--fg-primary)', border: 'var(--border-strong)', icon: '💬' },
    success: { bg: 'rgba(34,197,94,0.95)',       fg: '#fff',              border: 'rgba(34,197,94,1)',     icon: '✓' },
    error:   { bg: 'rgba(239,68,68,0.95)',       fg: '#fff',              border: 'rgba(239,68,68,1)',     icon: '⚠' },
  };
  const p = palette[toast.type] || palette.info;

  return (
    <div onClick={() => dismiss(toast.id)} style={{
      pointerEvents: 'auto',
      background: p.bg, color: p.fg, border: `1px solid ${p.border}`,
      borderRadius: 12, padding: '10px 16px',
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
      boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', gap: 10,
      cursor: 'pointer', minWidth: 240, maxWidth: 480,
      animation: 'fadeUp 0.22s cubic-bezier(0.34,1.2,0.64,1) both',
    }}>
      <span style={{ fontSize: 16 }}>{p.icon}</span>
      <span style={{ flex: 1 }}>{toast.msg}</span>
      <span style={{ opacity: 0.6, fontSize: 11 }}>×</span>
    </div>
  );
}
