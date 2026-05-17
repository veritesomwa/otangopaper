import { useState } from 'react';
import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';

/**
 * Generic tag-pill step. Reused by the Skills step and the Hobbies step —
 * the only difference is which key on `person` it writes back to.
 */
export function TagInputStep({ step, magic, fieldKey, placeholder, suggestions = [] }) {
  const { person, patchPerson } = useDocument();
  const tags = person[fieldKey] || [];

  const [draft, setDraft] = useState('');

  const setTags = (next) => patchPerson({ [fieldKey]: next });

  const add = (raw) => {
    const v = (raw ?? draft).trim();
    if (!v) return;
    if (!tags.includes(v)) setTags([...tags, v]);
    setDraft('');
  };

  const remove = (t) => setTags(tags.filter((x) => x !== t));

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); add();
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      remove(tags[tags.length - 1]);
    }
  };

  const remaining = suggestions.filter((s) => !tags.includes(s)).slice(0, 8);

  return (
    <StepContainer emoji={step.emoji} title={step.label} subtitle={step.subtitle}>
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '10px 12px', display: 'flex', flexWrap: 'wrap', gap: 6,
      }}>
        {tags.map((t) => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(23, 86, 200,0.15)', color: '#5C90FF',
            border: '1px solid rgba(23, 86, 200,0.3)', borderRadius: 999,
            padding: '4px 11px', fontSize: 12, fontWeight: 500,
          }}>
            {t}
            <button onClick={() => remove(t)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#5C90FF',
              fontSize: 14, lineHeight: 1,
            }}>×</button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => add()}
          placeholder={placeholder || 'Type a tag and press Enter…'}
          style={{
            flex: 1, minWidth: 140, background: 'transparent', border: 'none',
            outline: 'none', padding: '4px 6px', color: 'var(--fg-primary)',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          }}
        />
      </div>

      {remaining.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
            color: 'var(--fg-tertiary)', marginBottom: 8,
          }}>Suggestions</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {remaining.map((s) => (
              <button key={s} onClick={() => add(s)} style={{
                background: 'transparent', border: '1px dashed var(--border)',
                color: 'var(--fg-secondary)', borderRadius: 999, padding: '4px 11px',
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: 'pointer',
                transition: 'all 150ms',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1756C8')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >+ {s}</button>
            ))}
          </div>
        </div>
      )}

      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} onSkip={magic.next} />
    </StepContainer>
  );
}
