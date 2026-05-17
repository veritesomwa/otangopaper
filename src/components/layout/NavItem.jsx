import { useState } from 'react';

/** Single row inside the left sidebar. */
export function NavItem({ icon, label, active, onClick, badge }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
        borderRadius: 10, cursor: 'pointer', userSelect: 'none',
        background: active ? 'rgba(23, 86, 200,0.16)' : hov ? 'var(--bg-elevated)' : 'transparent',
        color: active ? '#5C90FF' : hov ? 'var(--fg-primary)' : 'var(--fg-secondary)',
        transition: 'all 150ms', fontSize: 13, fontWeight: active ? 600 : 500,
      }}
    >
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          background: 'linear-gradient(135deg,#1756C8,#00C8D4)', color: '#fff',
          fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
        }}>{badge}</span>
      )}
    </div>
  );
}
