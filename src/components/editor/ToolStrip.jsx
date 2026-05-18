// Vertical strip on the left of the editor (Canva-style tool palette).
//
// Two visual states, animated between via a width transition rather than
// swapping out the DOM — that way the user sees the strip slide in / out
// instead of popping. Inner content is faded when collapsed.
//   open   → 56 px wide, full tool buttons.
//   closed → 22 px thin rail with only a chevron.
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

const FULL_W = 56;
const RAIL_W = 22;
const TRANSITION = 'width 240ms cubic-bezier(0.32, 0.72, 0.27, 1), padding 240ms';

export function ToolStrip({
  activeTool, setActiveTool,
  onToggleTemplates, templatesOpen,
  open = true, onToggle,
}) {
  return (
    <div style={{
      width: open ? FULL_W : RAIL_W,
      background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: open ? '10px 0' : '10px 0',
      gap: 4, flexShrink: 0,
      overflow: 'hidden',
      transition: TRANSITION,
    }}>
      {/* Chevron pinned to the top when collapsed, bottom when open. */}
      {!open && (
        <RailToggle direction="right" title="Show tools ([)" onClick={onToggle} />
      )}

      {/* Tool buttons fade in/out so the slide stays clean. */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 180ms ease',
        flex: 1, width: '100%',
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
      </div>

      {/* Collapse chevron at the bottom when open. */}
      {open && (
        <div style={{ paddingBottom: 6 }}>
          <RailToggle direction="left" title="Hide tools ([)" onClick={onToggle} />
        </div>
      )}
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
