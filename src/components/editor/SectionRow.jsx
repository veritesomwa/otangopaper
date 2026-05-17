import { useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';

/** A single draggable section in the editor's right-panel "Sections" list. */
export function SectionRow({ section, onToggle, onDragStart, onDragOver, onDrop, dragOver }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      draggable={!section.locked}
      onDragStart={() => onDragStart(section.id)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(section.id); }}
      onDrop={() => onDrop(section.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 10px', borderRadius: 8,
        cursor: section.locked ? 'default' : 'grab',
        background: dragOver
          ? 'rgba(23, 86, 200,0.12)'
          : hov
            ? 'var(--bg-elevated)'
            : 'transparent',
        border: dragOver ? '1px solid rgba(23, 86, 200,0.4)' : '1px solid transparent',
        transition: 'all 150ms', marginBottom: 2,
        opacity: section.visible ? 1 : 0.45,
      }}
    >
      <span style={{
        color: 'var(--fg-tertiary)',
        opacity: section.locked ? 0 : hov ? 0.8 : 0.3,
        fontSize: 14, display: 'flex',
      }}>
        <Icon name="drag" />
      </span>

      <span style={{
        fontSize: 12.5, color: 'var(--fg-primary)', flex: 1, fontWeight: 500,
      }}>{section.label}</span>

      {section.locked && (
        <span style={{
          fontSize: 9, color: 'var(--fg-tertiary)', background: 'var(--bg-elevated)',
          padding: '1px 5px', borderRadius: 4,
        }}>locked</span>
      )}

      {!section.locked && (
        <button onClick={() => onToggle(section.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: section.visible ? 'var(--fg-tertiary)' : 'var(--fg-disabled)',
          padding: 2, transition: 'color 150ms', display: 'flex', alignItems: 'center',
        }}>
          <Icon name={section.visible ? 'eye' : 'eyeOff'} />
        </button>
      )}
    </div>
  );
}
