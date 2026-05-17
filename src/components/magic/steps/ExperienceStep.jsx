import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Multiple jobs — each with company, role, period, bullets. */
export function ExperienceStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const experience = person.experience || [];

  const updateAt = (i, patch) => {
    const next = [...experience];
    next[i] = { ...next[i], ...patch };
    patchPerson({ experience: next });
  };

  const addOne = () => patchPerson({
    experience: [
      ...experience,
      { id: `e${Date.now()}`, company: '', role: '', period: '', bullets: [''] },
    ],
  });

  const removeAt = (i) => {
    const next = experience.filter((_, idx) => idx !== i);
    patchPerson({ experience: next });
  };

  return (
    <StepContainer emoji={step.emoji} title="Work experience" subtitle={step.subtitle}>
      {experience.length === 0 && (
        <div style={{
          background: 'var(--bg-elevated)', border: '1px dashed var(--border)',
          borderRadius: 12, padding: 24, textAlign: 'center', color: 'var(--fg-tertiary)',
          fontSize: 13, marginBottom: 14,
        }}>
          No experience yet — add your most recent role first.
        </div>
      )}

      {experience.map((e, i) => (
        <div key={e.id} style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 18, marginBottom: 14, position: 'relative',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-secondary)', letterSpacing: 0.5 }}>
              ROLE #{i + 1}
            </div>
            <button onClick={() => removeAt(i)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--fg-tertiary)',
            }}>Remove</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Company"      value={e.company}  onChange={(v) => updateAt(i, { company: v })} placeholder="Figma" />
            <Field label="Role / title" value={e.role}     onChange={(v) => updateAt(i, { role: v })}    placeholder="Senior Designer" />
          </div>
          <Field label="Period" value={e.period} onChange={(v) => updateAt(i, { period: v })} placeholder="2021 – Present" />

          <BulletsEditor
            bullets={e.bullets || ['']}
            onChange={(bullets) => updateAt(i, { bullets })}
          />
        </div>
      ))}

      <button onClick={addOne} style={{
        width: '100%', padding: '11px', borderRadius: 10,
        border: '1.5px dashed var(--border)',
        background: 'transparent', cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        color: 'var(--fg-secondary)',
      }}>+ Add another role</button>

      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}

function BulletsEditor({ bullets, onChange }) {
  const setAt = (i, v) => {
    const next = [...bullets]; next[i] = v; onChange(next);
  };
  const remove = (i) => {
    const next = bullets.filter((_, idx) => idx !== i);
    onChange(next.length ? next : ['']);
  };
  const add = () => onChange([...bullets, '']);

  return (
    <div style={{ marginTop: 4 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--fg-tertiary)',
        marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.8px',
      }}>Highlights</label>

      {bullets.map((b, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <input
            value={b}
            onChange={(e) => setAt(i, e.target.value)}
            placeholder="Led the redesign of X — +32% completion rate"
            onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            style={{
              flex: 1, background: 'var(--bg-overlay)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '9px 12px', color: 'var(--fg-primary)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, outline: 'none',
              transition: 'border-color 150ms',
            }}
          />
          {bullets.length > 1 && (
            <button onClick={() => remove(i)} style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 8, padding: '0 10px', color: 'var(--fg-tertiary)', cursor: 'pointer', fontSize: 14,
            }}>×</button>
          )}
        </div>
      ))}

      <button onClick={add} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
        color: '#5C90FF', padding: '4px 0',
      }}>+ Add bullet</button>
    </div>
  );
}
