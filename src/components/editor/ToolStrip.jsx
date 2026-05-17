// Vertical strip on the left of the editor (Canva-style tool palette).
// Two states:
//   open   → 56 px wide, full tool buttons + a chevron at the bottom that
//            collapses the strip.
//   closed → 22 px thin rail with only the chevron, ready to re-expand.
// Keyboard shortcut: '[' toggles open/closed (wired in Editor.jsx).

import { Icon } from '@components/common/Icon.jsx';
import { ToolBtn } from './ToolBtn.jsx';

const TOOLS = [
  { id: 'select', label: 'Select (V)', icon: 'cursor' },
  { id: 'text',   label: 'Text (T)',   icon: 'type' },
  { id: 'image',  label: 'Image (I)',  icon: 'image' },
  { id: 'shapes', label: 'Shapes (S)', icon: 'shapes' },
  { id: 'layers', label: 'Layers (L)', icon: 'layers' },
];

export function ToolStrip({
  activeTool, setActiveTool,
  onToggleTemplates, templatesOpen,
  open = true, onToggle,
}) {
  if (!open) {
    // Collapsed rail — just the expand chevron.
    return (
      <div style={{
        width: 22, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 10, flexShrink: 0,
      }}>
        <RailToggle direction="right" title="Show tools ([)" onClick={onToggle} />
      </div>
    );
  }

  return (
    <div style={{
      width: 56, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 0', gap: 4, flexShrink: 0,
    }}>
      {TOOLS.map((t) => (
        <ToolBtn
          key={t.id} icon={<Icon name={t.icon} />} label={t.label}
          active={activeTool === t.id}
          onClick={() => setActiveTool(t.id)}
        />
      ))}

      <div style={{ height: 1, background: 'var(--border)', width: '70%', margin: '6px 0' }} />

      <ToolBtn
        icon={<Icon name="template" />} label="Templates"
        active={templatesOpen} onClick={onToggleTemplates}
      />

      {/* Collapse chevron pinned to the bottom */}
      <div style={{ marginTop: 'auto', paddingBottom: 6 }}>
        <RailToggle direction="left" title="Hide tools ([)" onClick={onToggle} />
      </div>
    </div>
  );
}

/** Slim chevron button used to expand/collapse the rail. */
function RailToggle({ direction, title, onClick }) {
  return (
    <button
      title={title} onClick={onClick}
      style={{
        width: 22, height: 28, borderRadius: 6, padding: 0,
        background: 'transparent', border: '1px solid var(--border)',
        color: 'var(--fg-tertiary)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 130ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = '#5C90FF'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent';        e.currentTarget.style.color = 'var(--fg-tertiary)'; }}
    >
      <Icon name={direction === 'left' ? 'chevronL' : 'chevronR'} size={12} strokeWidth={2.2} />
    </button>
  );
}
