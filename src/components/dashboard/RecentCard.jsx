import { useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { TemplateThumbnail } from '@components/canvas/TemplateThumbnail.jsx';
import { PAGE_HEIGHT } from '@components/canvas/TemplateCanvas.jsx';
import { useTemplates } from '@hooks/useTemplates.js';

const SCALE = 0.22;

/** Card representing a previously edited document. */
export function RecentCard({ design, onOpen, idx }) {
  const { templates } = useTemplates();
  const tpl = templates.find((t) => t.id === design.templateId)
    || { style: 'modern', accent: design.accent };

  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen({ ...tpl, designName: design.name })}
      className="fade-up"
      style={{
        borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)',
        cursor: 'pointer', background: 'var(--bg-elevated)',
        transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 24px ${design.accent}33` : 'none',
        borderColor: hovered ? design.accent : 'var(--border)',
        animationDelay: `${idx * 0.04}s`,
      }}
    >
      <div style={{
        height: Math.round(PAGE_HEIGHT * SCALE),
        background: '#f0f2f6', overflow: 'hidden', position: 'relative',
      }}>
        <TemplateThumbnail template={tpl} scale={SCALE} />
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 8,
          opacity: hovered ? 1 : 0, transition: 'opacity 180ms',
        }}>
          <span style={{ color: '#fff', display: 'flex' }}><Icon name="edit" /></span>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>Continue editing</span>
        </div>
      </div>

      <div style={{ padding: '9px 11px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          fontSize: 12, fontWeight: 500, color: 'var(--fg-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{design.name}</div>
        <div style={{
          fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 2,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="clock" size={12} /> {design.date}
        </div>
      </div>
    </div>
  );
}
