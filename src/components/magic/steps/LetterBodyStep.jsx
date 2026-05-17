import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Cover letter: the body. Each blank line becomes a paragraph in the canvas. */
export function LetterBodyStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const letter = person.letter || {};
  const setBody = (v) => patchPerson({ letter: { ...letter, body: v } });

  return (
    <StepContainer emoji={step.emoji} title="Write the letter" subtitle={step.subtitle}>
      <Field
        label="Letter body"
        value={letter.body || ''}
        onChange={setBody}
        placeholder="Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Designer position…\n\nThank you for your consideration."
        textarea
        rows={10}
      />
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 14px', fontSize: 11.5,
        color: 'var(--fg-tertiary)', lineHeight: 1.6,
      }}>
        💡 <strong style={{ color: 'var(--fg-secondary)' }}>Tip:</strong> Keep it under 350 words. Open with the role you want, follow with two specific accomplishments, close with a friendly call-to-action. Separate paragraphs with a blank line.
      </div>
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
