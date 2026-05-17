import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';
import { PhotoUploadControl } from '@components/common/PhotoUploadControl.jsx';

/** Business card: name, role, company, photo. */
export function CardIdentityStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const set = (k) => (v) => patchPerson({ [k]: v });
  const valid = !!person.name?.trim();

  return (
    <StepContainer emoji={step.emoji} title="Who's on this card?" subtitle={step.subtitle}>
      <div style={{ marginBottom: 18 }}>
        <PhotoUploadControl
          photoUrl={person.photoUrl}
          onChange={(url) => patchPerson({ photoUrl: url })}
          label="Profile photo (optional)"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Full name *" value={person.name}    onChange={set('name')}    placeholder="Alexandra Chen" />
        <Field label="Title"       value={person.title}   onChange={set('title')}   placeholder="Senior Product Designer" />
      </div>
      <Field label="Company / studio (optional)" value={person.company || ''}
        onChange={set('company')} placeholder="OtangoPaper Studio" />

      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} nextDisabled={!valid} />
    </StepContainer>
  );
}
