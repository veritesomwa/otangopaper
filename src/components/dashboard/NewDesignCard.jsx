import { useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';

/** "+ New design" tile inside the recent-designs grid. */
export function NewDesignCard({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        borderRadius: 12,
        border: `1.5px dashed ${hovered ? '#1756C8' : 'rgba(255,255,255,0.14)'}`,
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
        minHeight: 160,
        background: hovered ? 'rgba(23, 86, 200,0.06)' : 'transparent',
        transition: 'all 180ms', color: 'var(--fg-tertiary)',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 999,
        background: hovered ? 'rgba(23, 86, 200,0.18)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered ? '#5C90FF' : 'var(--fg-tertiary)', transition: 'all 180ms',
      }}>
        <Icon name="plus" />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 500,
        color: hovered ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
      }}>New design</span>
    </div>
  );
}
