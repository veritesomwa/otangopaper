import { useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { TemplateThumbnail } from '@components/canvas/TemplateThumbnail.jsx';
import { PAGE_HEIGHT } from '@components/canvas/TemplateCanvas.jsx';
import { CAT_COLORS } from './categoryColors.js';

const SCALE = 0.228;

/** Tile shown inside the template gallery grid. */
export function TemplateCard({ tpl, onOpen, idx }) {
  const [hovered, setHovered] = useState(false);
  const cat = CAT_COLORS[tpl.cat] || { bg: 'rgba(255,255,255,0.08)', color: '#aaa' };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(tpl)}
      className="fade-up"
      style={{
        borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)',
        cursor: 'pointer', background: 'var(--bg-elevated)',
        transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 32px rgba(23, 86, 200,0.22)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        borderColor: hovered ? '#1756C8' : 'var(--border)',
        animationDelay: `${idx * 0.035}s`,
      }}
    >
      <div style={{
        position: 'relative', background: '#f0f2f6', overflow: 'hidden',
        height: Math.round(PAGE_HEIGHT * SCALE),
      }}>
        <TemplateThumbnail template={tpl} scale={SCALE} />

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(23, 86, 200,0.82)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 200ms ease',
        }}>
          <button style={{
            background: '#fff', color: '#1756C8', border: 'none', borderRadius: 999,
            padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="edit" size={12} /> Use template
          </button>
        </div>

        <span style={{
          position: 'absolute', top: 8, right: 8, padding: '2px 8px', borderRadius: 999,
          fontSize: 9, fontWeight: 700,
          background: tpl.free
            ? 'rgba(34,197,94,0.18)'
            : 'linear-gradient(135deg,#1756C8,#00C8D4)',
          color: tpl.free ? '#22C55E' : '#fff',
        }}>{tpl.free ? 'Free' : 'Pro'}</span>
      </div>

      <div style={{ padding: '10px 12px 11px' }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 12.5,
          color: 'var(--fg-primary)', marginBottom: 3,
        }}>{tpl.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 9.5, padding: '2px 7px', borderRadius: 999, fontWeight: 600,
            background: cat.bg, color: cat.color,
          }}>{tpl.cat}</span>
          <span style={{ fontSize: 9.5, color: 'var(--fg-tertiary)' }}>
            {tpl.desc?.slice(0, 22)}…
          </span>
        </div>
      </div>
    </div>
  );
}
