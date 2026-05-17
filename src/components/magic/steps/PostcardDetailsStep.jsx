import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Postcard: greeting, message, sender. */
export function PostcardDetailsStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const pc = person.postcard || {};
  const setP = (k) => (v) => patchPerson({ postcard: { ...pc, [k]: v } });

  return (
    <StepContainer emoji={step.emoji} title="Your postcard" subtitle={step.subtitle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Greeting"  value={pc.greeting || ''}
          onChange={setP('greeting')} placeholder="Hello from…" />
        <Field label="Place / occasion" value={pc.place || ''}
          onChange={setP('place')} placeholder="Tokyo, 2026" />
      </div>
      <Field label="Message" value={pc.message || ''}
        onChange={setP('message')}
        placeholder="A few warm sentences for the back of the card."
        textarea rows={5} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="From"  value={pc.from || person.name || ''}
          onChange={setP('from')} placeholder="Alexandra" />
        <Field label="To"    value={pc.to || ''}
          onChange={setP('to')}   placeholder="Mom" />
      </div>
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
