// References step in the resume Magic Tool wizard. Lets the user list up to
// ~5 professional references — each with name, title, company, contact, and
// the nature of the working relationship. Mirrors the look of ExperienceStep.

import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav } from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

export function ReferencesStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const refs = person.references || [];

  const updateAt = (i, patch) => {
    const next = [...refs];
    next[i] = { ...next[i], ...patch };
    patchPerson({ references: next });
  };

  const addOne = () => patchPerson({
    references: [
      ...refs,
      { id: `r${Date.now()}`, name: '', title: '', company: '', email: '', phone: '', relationship: '' },
    ],
  });

  const removeAt = (i) => {
    const next = refs.filter((_, idx) => idx !== i);
    patchPerson({ references: next });
  };

  return (
    <StepContainer emoji={step.emoji} title="References" subtitle={step.subtitle}>
      {refs.length === 0 && (
        <div style={{
          background: 'var(--bg-elevated)', border: '1px dashed var(--border)',
          borderRadius: 12, padding: 24, textAlign: 'center', color: 'var(--fg-tertiary)',
          fontSize: 13, marginBottom: 14,
        }}>
          No references yet — add one or two people who can vouch for you.
        </div>
      )}

      {refs.map((r, i) => (
        <div key={r.id || i} style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 18, marginBottom: 14, position: 'relative',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-secondary)', letterSpacing: 0.5 }}>
              REFERENCE #{i + 1}
            </div>
            <button onClick={() => removeAt(i)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--fg-tertiary)',
            }}>Remove</button>
          </div>

          <Field label="Full name" value={r.name} onChange={(v) => updateAt(i, { name: v })} placeholder="Dr. Sarah Johnson" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Title"   value={r.title}   onChange={(v) => updateAt(i, { title: v })}   placeholder="Engineering Manager" />
            <Field label="Company" value={r.company} onChange={(v) => updateAt(i, { company: v })} placeholder="Figma" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Email" value={r.email} onChange={(v) => updateAt(i, { email: v })} placeholder="sarah@figma.com" />
            <Field label="Phone" value={r.phone} onChange={(v) => updateAt(i, { phone: v })} placeholder="+1 (555) 111-2233" />
          </div>

          <Field
            label="Relationship"
            value={r.relationship}
            onChange={(v) => updateAt(i, { relationship: v })}
            placeholder="Direct manager · 2 years"
          />
        </div>
      ))}

      <button onClick={addOne} style={{
        width: '100%', padding: '11px', borderRadius: 10,
        border: '1.5px dashed var(--border)',
        background: 'transparent', cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        color: 'var(--fg-secondary)',
      }}>+ Add another reference</button>

      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
