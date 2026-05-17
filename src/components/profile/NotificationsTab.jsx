import { useState } from 'react';

const PREFS = [
  { key: 'email',   label: 'Email notifications',   sub: 'Receive updates and tips by email',     defaultValue: true },
  { key: 'browser', label: 'Browser notifications', sub: 'Get alerts directly in your browser',   defaultValue: false },
  { key: 'updates', label: 'Product updates',       sub: 'New templates and feature announcements', defaultValue: true },
];

/** Notification preferences (toggle switches). */
export function NotificationsTab() {
  const [state, setState] = useState(
    Object.fromEntries(PREFS.map((p) => [p.key, p.defaultValue]))
  );
  const toggle = (k) => setState((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="fade-up" style={{
      background: 'var(--bg-surface)', borderRadius: 16, padding: 24,
      border: '1px solid var(--border)', maxWidth: 540,
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15,
        color: 'var(--fg-primary)', marginBottom: 20,
      }}>Notification preferences</div>

      {PREFS.map((p) => (
        <div key={p.key} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 0', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)' }}>{p.label}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 2 }}>{p.sub}</div>
          </div>
          <Toggle on={state[p.key]} onClick={() => toggle(p.key)} />
        </div>
      ))}
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 44, height: 24, borderRadius: 999, cursor: 'pointer', position: 'relative',
      background: on ? 'linear-gradient(135deg,#1756C8,#00C8D4)' : 'var(--bg-elevated)',
      border: '1px solid var(--border)', transition: 'background 200ms', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 22 : 3, width: 16, height: 16,
        borderRadius: '50%', background: '#fff', transition: 'left 200ms',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}
