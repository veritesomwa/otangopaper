import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Cover letter: who is the letter for + the role being applied for. */
export function LetterRecipientStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const letter = person.letter || {};
  const setL = (k) => (v) => patchPerson({ letter: { ...letter, [k]: v } });

  return (
    <StepContainer emoji={step.emoji} title="Who's the letter to?" subtitle={step.subtitle}>
      <Field label="Recipient name" value={letter.recipientName || ''}
        onChange={setL('recipientName')} placeholder="Hiring Manager" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Company"   value={letter.recipientCompany || ''}
          onChange={setL('recipientCompany')} placeholder="Acme, Inc." />
        <Field label="Role"      value={letter.role || ''}
          onChange={setL('role')} placeholder="Senior Product Designer" />
      </div>
      <Field label="Date" value={letter.date || ''}
        onChange={setL('date')} placeholder="April 25, 2026" />
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
