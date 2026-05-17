import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Schools, degrees, year, GPA. */
export function EducationStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const education = person.education || [];

  const updateAt = (i, patch) => {
    const next = [...education];
    next[i] = { ...next[i], ...patch };
    patchPerson({ education: next });
  };

  const addOne = () => patchPerson({
    education: [
      ...education,
      { id: `edu${Date.now()}`, school: '', degree: '', year: '', gpa: '' },
    ],
  });

  const removeAt = (i) => {
    patchPerson({ education: education.filter((_, idx) => idx !== i) });
  };

  return (
    <StepContainer emoji={step.emoji} title="Education" subtitle={step.subtitle}>
      {education.length === 0 && (
        <div style={{
          background: 'var(--bg-elevated)', border: '1px dashed var(--border)',
          borderRadius: 12, padding: 24, textAlign: 'center', color: 'var(--fg-tertiary)',
          fontSize: 13, marginBottom: 14,
        }}>
          Add your most recent qualification — degree, certification, or course.
        </div>
      )}

      {education.map((e, i) => (
        <div key={e.id} style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 18, marginBottom: 14,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-secondary)', letterSpacing: 0.5 }}>
              ENTRY #{i + 1}
            </div>
            <button onClick={() => removeAt(i)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--fg-tertiary)',
            }}>Remove</button>
          </div>

          <Field label="School / institution" value={e.school} onChange={(v) => updateAt(i, { school: v })}
            placeholder="California College of the Arts" />
          <Field label="Degree / programme"   value={e.degree} onChange={(v) => updateAt(i, { degree: v })}
            placeholder="BFA Interaction Design" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Year" value={e.year} onChange={(v) => updateAt(i, { year: v })} placeholder="2018" />
            <Field label="GPA (optional)" value={e.gpa || ''} onChange={(v) => updateAt(i, { gpa: v })} placeholder="3.9" />
          </div>
        </div>
      ))}

      <button onClick={addOne} style={{
        width: '100%', padding: '11px', borderRadius: 10,
        border: '1.5px dashed var(--border)',
        background: 'transparent', cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        color: 'var(--fg-secondary)',
      }}>+ Add another</button>

      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
