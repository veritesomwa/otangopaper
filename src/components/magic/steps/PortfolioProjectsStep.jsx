import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Portfolio: up to four project cards. */
export function PortfolioProjectsStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const port = person.portfolio || {};
  const projects = port.projects || [];

  const setProjects = (next) => patchPerson({ portfolio: { ...port, projects: next } });
  const updateAt = (i, patch) => {
    const next = [...projects]; next[i] = { ...next[i], ...patch }; setProjects(next);
  };
  const addOne   = () => setProjects([...projects, { title: '', client: '', year: '', tags: [] }]);
  const removeAt = (i) => setProjects(projects.filter((_, idx) => idx !== i));

  return (
    <StepContainer emoji={step.emoji} title="Selected work" subtitle={step.subtitle}>
      {projects.length === 0 && (
        <div style={{
          background: 'var(--bg-elevated)', border: '1px dashed var(--border)',
          borderRadius: 12, padding: 24, textAlign: 'center', color: 'var(--fg-tertiary)',
          fontSize: 13, marginBottom: 14,
        }}>
          Add up to four project highlights to feature.
        </div>
      )}

      {projects.map((p, i) => (
        <div key={i} style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 16, marginBottom: 12,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-secondary)', letterSpacing: 0.5 }}>
              PROJECT #{i + 1}
            </div>
            <button onClick={() => removeAt(i)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--fg-tertiary)',
            }}>Remove</button>
          </div>

          <Field label="Project title" value={p.title}  onChange={(v) => updateAt(i, { title: v })}
            placeholder="Design System Overhaul" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Client / company" value={p.client} onChange={(v) => updateAt(i, { client: v })} placeholder="Figma" />
            <Field label="Year" value={p.year} onChange={(v) => updateAt(i, { year: v })} placeholder="2024" />
          </div>
          <Field label="Tags (comma separated)" value={(p.tags || []).join(', ')}
            onChange={(v) => updateAt(i, { tags: v.split(',').map((t) => t.trim()).filter(Boolean) })}
            placeholder="UX, Systems, Mobile" />
        </div>
      ))}

      {projects.length < 4 && (
        <button onClick={addOne} style={{
          width: '100%', padding: '11px', borderRadius: 10,
          border: '1.5px dashed var(--border)', background: 'transparent', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
          color: 'var(--fg-secondary)',
        }}>+ Add another project</button>
      )}

      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
