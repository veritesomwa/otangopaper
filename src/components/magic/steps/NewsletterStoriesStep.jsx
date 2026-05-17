import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';

/** Newsletter: list of follow-up stories. */
export function NewsletterStoriesStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const nl = person.newsletter || {};
  const stories = nl.stories || [];

  const setStories = (next) => patchPerson({ newsletter: { ...nl, stories: next } });
  const updateAt = (i, patch) => {
    const next = [...stories]; next[i] = { ...next[i], ...patch }; setStories(next);
  };
  const addOne   = () => setStories([...stories, { headline: '', summary: '' }]);
  const removeAt = (i) => setStories(stories.filter((_, idx) => idx !== i));

  return (
    <StepContainer emoji={step.emoji} title="Follow-up stories" subtitle={step.subtitle}>
      {stories.length === 0 && (
        <div style={{
          background: 'var(--bg-elevated)', border: '1px dashed var(--border)',
          borderRadius: 12, padding: 24, textAlign: 'center', color: 'var(--fg-tertiary)',
          fontSize: 13, marginBottom: 14,
        }}>
          Add 2–4 short follow-up stories. Skip if you just want a single hero piece.
        </div>
      )}

      {stories.map((s, i) => (
        <div key={i} style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 16, marginBottom: 12,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-secondary)', letterSpacing: 0.5 }}>
              STORY #{i + 1}
            </div>
            <button onClick={() => removeAt(i)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--fg-tertiary)',
            }}>Remove</button>
          </div>
          <input value={s.headline} onChange={(e) => updateAt(i, { headline: e.target.value })}
            placeholder="Headline" style={inputStyle()} />
          <textarea value={s.summary} onChange={(e) => updateAt(i, { summary: e.target.value })}
            placeholder="One-sentence summary" rows={2}
            style={{ ...inputStyle(), marginTop: 8, resize: 'vertical', lineHeight: 1.5 }} />
        </div>
      ))}

      <button onClick={addOne} style={{
        width: '100%', padding: '11px', borderRadius: 10,
        border: '1.5px dashed var(--border)', background: 'transparent', cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        color: 'var(--fg-secondary)',
      }}>+ Add another story</button>

      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} onSkip={magic.next} />
    </StepContainer>
  );
}

function inputStyle() {
  return {
    width: '100%', background: 'var(--bg-overlay)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '9px 12px', color: 'var(--fg-primary)',
    fontFamily: "'DM Sans', sans-serif", fontSize: 12, outline: 'none',
  };
}
