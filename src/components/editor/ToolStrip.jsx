import { Icon } from '@components/common/Icon.jsx';
import { ToolBtn } from './ToolBtn.jsx';

const TOOLS = [
  { id: 'select', label: 'Select (V)', icon: 'cursor' },
  { id: 'text',   label: 'Text (T)',   icon: 'type' },
  { id: 'image',  label: 'Image (I)',  icon: 'image' },
  { id: 'shapes', label: 'Shapes (S)', icon: 'shapes' },
  { id: 'layers', label: 'Layers (L)', icon: 'layers' },
];

/** Vertical strip on the left of the editor (Canva-style tool palette). */
export function ToolStrip({ activeTool, setActiveTool, onToggleTemplates, templatesOpen }) {
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
    </div>
  );
}
