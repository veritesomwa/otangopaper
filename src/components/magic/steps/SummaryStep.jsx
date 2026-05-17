import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Free-form professional summary. */
export function SummaryStep({ step, magic }) {
  const { person, patchPerson } = useDocument();

  return (
    <StepContainer emoji={step.emoji} title="Your professional summary" subtitle={step.subtitle}>
      <Field
        label="Summary"
        value={person.summary}
        onChange={(v) => patchPerson({ summary: v })}
        placeholder="Two or three sentences about who you are and what you do well."
        textarea rows={5}
      />
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 14px', fontSize: 11.5,
        color: 'var(--fg-tertiary)', lineHeight: 1.6,
      }}>
        💡 <strong style={{ color: 'var(--fg-secondary)' }}>Tip:</strong> Lead with what you do, then how long you've done it, then a stand-out detail. Keep it under 60 words.
      </div>
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
