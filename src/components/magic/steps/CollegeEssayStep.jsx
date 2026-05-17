import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** College app: the essay text. */
export function CollegeEssayStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const c = person.college || {};
  const setEssay = (v) => patchPerson({ college: { ...c, essay: v } });

  return (
    <StepContainer emoji={step.emoji} title="Your essay" subtitle={step.subtitle}>
      <Field
        label="Statement"
        value={c.essay || ''}
        onChange={setEssay}
        placeholder="Open with a story. Tell them why you, why this program, why now."
        textarea
        rows={14}
      />
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 14px', fontSize: 11.5,
        color: 'var(--fg-tertiary)', lineHeight: 1.6,
      }}>
        💡 <strong style={{ color: 'var(--fg-secondary)' }}>Tip:</strong> Most prompts cap around 500–650 words. Open with a hook, show specific evidence, end with where you want to go next.
      </div>
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
