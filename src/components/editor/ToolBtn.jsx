import { useState } from 'react';

/** A small icon-button used throughout the editor toolbar/tool strip. */
export function ToolBtn({ icon, label, active, onClick, size = 36 }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: size, height: size, borderRadius: 10, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(23, 86, 200,0.2)' : hov ? 'var(--bg-elevated)' : 'transparent',
        color: active ? '#5C90FF' : hov ? 'var(--fg-primary)' : 'var(--fg-secondary)',
        transition: 'background 150ms, color 150ms',
        position: 'relative',
      }}
    >
      {icon}
    </button>
  );
}

/** Vertical divider between toolbar groups. */
export function VDivider() {
  return <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />;
}
