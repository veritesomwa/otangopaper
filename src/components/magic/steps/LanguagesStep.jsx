import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';

const LEVELS = ['Native', 'Fluent', 'Conversational', 'Basic'];

/** Languages with a fluency dropdown. */
export function LanguagesStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const languages = person.languages || [];

  const updateAt = (i, patch) => {
    const next = [...languages];
    next[i] = { ...next[i], ...patch };
    patchPerson({ languages: next });
  };
  const addOne   = () => patchPerson({ languages: [...languages, { lang: '', level: 'Fluent' }] });
  const removeAt = (i) => patchPerson({ languages: languages.filter((_, idx) => idx !== i) });

  return (
    <StepContainer emoji={step.emoji} title="Languages" subtitle={step.subtitle}>
      {languages.map((l, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr auto',
          gap: 10, alignItems: 'center', marginBottom: 10,
        }}>
          <input
            value={l.lang} onChange={(e) => updateAt(i, { lang: e.target.value })}
            placeholder="Language" onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10,
              padding: '11px 14px', color: 'var(--fg-primary)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none',
              transition: 'border-color 150ms',
            }}
          />
          <select value={l.level} onChange={(e) => updateAt(i, { level: e.target.value })} style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '11px 14px', color: 'var(--fg-primary)',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none',
          }}>
            {LEVELS.map((lv) => <option key={lv}>{lv}</option>)}
          </select>
          <button onClick={() => removeAt(i)} style={{
            background: 'transparent', border: '1px solid var(--border)', borderRadius: 10,
            padding: '0 14px', color: 'var(--fg-tertiary)', cursor: 'pointer', fontSize: 14,
            height: 41,
          }}>×</button>
        </div>
      ))}

      <button onClick={addOne} style={{
        width: '100%', padding: 11, borderRadius: 10,
        border: '1.5px dashed var(--border)', background: 'transparent', cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        color: 'var(--fg-secondary)',
      }}>+ Add a language</button>

      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} onSkip={magic.next} />
    </StepContainer>
  );
}
