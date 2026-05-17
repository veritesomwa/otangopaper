import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';
import { PhotoUploadControl } from '@components/common/PhotoUploadControl.jsx';

/** Name, title, contact details + profile photo. */
export function BasicsStep({ step, magic }) {
  const { person, patchPerson } = useDocument();

  const set = (k) => (v) => patchPerson({ [k]: v });
  const valid = !!person.name?.trim();

  return (
    <StepContainer emoji={step.emoji} title="Tell us about you" subtitle={step.subtitle}>
      <div style={{ marginBottom: 18 }}>
        <PhotoUploadControl
          photoUrl={person.photoUrl}
          onChange={(url) => patchPerson({ photoUrl: url })}
          label="Profile photo (optional)"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Full name *"   value={person.name}     onChange={set('name')}     placeholder="Alexandra Chen" />
        <Field label="Job title"     value={person.title}    onChange={set('title')}    placeholder="Senior Product Designer" />
        <Field label="Email"         value={person.email}    onChange={set('email')}    placeholder="you@email.com" type="email" />
        <Field label="Phone"         value={person.phone}    onChange={set('phone')}    placeholder="+1 (555) 234-5678" />
        <Field label="Location"      value={person.location} onChange={set('location')} placeholder="San Francisco, CA" />
        <Field label="Website"       value={person.website}  onChange={set('website')}  placeholder="yoursite.com" />
      </div>
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next}
        nextDisabled={!valid} />
    </StepContainer>
  );
}
