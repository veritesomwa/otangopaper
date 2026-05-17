import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Business card: contact details + an optional tagline. */
export function CardContactStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const set = (k) => (v) => patchPerson({ [k]: v });

  return (
    <StepContainer emoji={step.emoji} title="How do they reach you?" subtitle={step.subtitle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Email"    value={person.email}    onChange={set('email')}    placeholder="you@email.com" type="email" />
        <Field label="Phone"    value={person.phone}    onChange={set('phone')}    placeholder="+1 (555) 234-5678" />
        <Field label="Location" value={person.location} onChange={set('location')} placeholder="San Francisco, CA" />
        <Field label="Website"  value={person.website}  onChange={set('website')}  placeholder="yoursite.com" />
      </div>
      <Field label="Tagline (optional)" value={person.tagline || ''}
        onChange={set('tagline')} placeholder="Designing for the next billion users." />
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
