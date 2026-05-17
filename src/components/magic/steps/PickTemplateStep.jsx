import { useState } from 'react';
import { useDocument }  from '@hooks/useDocument.js';
import { useTemplates } from '@hooks/useTemplates.js';
import { TemplateCanvas } from '@components/canvas/TemplateCanvas.jsx';
import { StepContainer }  from '../StepContainer.jsx';

const RESUME_CATS = ['Resume', 'Cover Letter', 'Portfolio', 'Business Card', 'LinkedIn'];

/**
 * Final step. Renders every template with the user's actual person data so
 * they can pick a look that fits. Clicking a template opens the editor with
 * that selection — switching to another template later preserves content.
 */
export function PickTemplateStep({ step, magic, onChooseTemplate }) {
  const { templates }     = useTemplates();
  const { person, sections, fontPair } = useDocument();
  const [filter, setFilter] = useState('Resume');

  const visible = templates.filter((t) => t.cat === filter);

  return (
    <StepContainer emoji={step.emoji} title="Pick your design" subtitle={step.subtitle}>
      {/* Category filter */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22,
      }}>
        {RESUME_CATS.map((c) => {
          const active = filter === c;
          return (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: '1.5px solid', fontFamily: "'DM Sans', sans-serif",
              background: active ? 'rgba(23, 86, 200,0.15)' : 'transparent',
              borderColor: active ? '#1756C8' : 'var(--border)',
              color: active ? '#5C90FF' : 'var(--fg-secondary)',
              transition: 'all 150ms',
            }}>{c}</button>
          );
        })}
      </div>

      {/* Live thumbnail grid populated with the user's data */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 14,
      }}>
        {visible.map((t) => (
          <LivePreviewCard
            key={t.id} template={t}
            person={person} sections={sections} fontPair={fontPair}
            onClick={() => onChooseTemplate(t)}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--fg-tertiary)', fontSize: 13 }}>
          No templates in this category yet — try Resume.
        </div>
      )}

      <div style={{
        marginTop: 24, padding: '14px 18px', borderRadius: 12,
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        fontSize: 12, color: 'var(--fg-tertiary)', textAlign: 'center', lineHeight: 1.6,
      }}>
        💡 You can switch templates any time inside the editor — your content travels with you.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 22 }}>
        <button onClick={magic.back} style={{
          background: 'transparent', border: '1.5px solid var(--border)',
          borderRadius: 999, padding: '11px 22px',
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: 'var(--fg-secondary)', cursor: 'pointer',
        }}>← Back</button>
      </div>
    </StepContainer>
  );
}

/** A scaled, clickable preview that renders the user's data inside one template. */
function LivePreviewCard({ template, person, sections, fontPair, onClick }) {
  const [hov, setHov] = useState(false);
  const SCALE = 0.24;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        background: 'var(--bg-elevated)',
        border: hov ? '2px solid #1756C8' : '1px solid var(--border)',
        boxShadow: hov ? '0 12px 32px rgba(23, 86, 200,0.25)' : '0 2px 8px rgba(0,0,0,0.08)',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div style={{
        width:  Math.round(595 * SCALE),
        height: Math.round(842 * SCALE),
        overflow: 'hidden', position: 'relative', background: '#fff',
      }}>
        <div style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
          <TemplateCanvas
            template={template}
            person={person} sections={sections}
            fontPair={fontPair} readOnly
          />
        </div>

        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(23, 86, 200,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hov ? 1 : 0, transition: 'opacity 180ms',
        }}>
          <span style={{
            background: '#fff', color: '#1756C8', fontWeight: 600, fontSize: 12,
            padding: '7px 14px', borderRadius: 999,
            fontFamily: "'DM Sans', sans-serif",
          }}>Use this template →</span>
        </div>
      </div>
      <div style={{
        padding: '8px 11px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)',
        }}>{template.name}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
          background: template.free ? 'rgba(34,197,94,0.18)' : 'linear-gradient(135deg,#1756C8,#00C8D4)',
          color: template.free ? '#22C55E' : '#fff',
        }}>{template.free ? 'Free' : 'Pro'}</span>
      </div>
    </div>
  );
}
