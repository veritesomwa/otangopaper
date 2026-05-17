import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Newsletter: top-of-page metadata. */
export function NewsletterMetaStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const nl = person.newsletter || {};
  const setN = (k) => (v) => patchPerson({ newsletter: { ...nl, [k]: v } });

  return (
    <StepContainer emoji={step.emoji} title="Issue info" subtitle={step.subtitle}>
      <Field label="Newsletter title" value={nl.title || ''}
        onChange={setN('title')} placeholder="This Week in Tech" />
      <Field label="Subtitle / vertical" value={nl.subtitle || ''}
        onChange={setN('subtitle')} placeholder="Weekly Digest" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Issue #"  value={nl.issue || ''}
          onChange={setN('issue')} placeholder="42" />
        <Field label="Date"     value={nl.date || ''}
          onChange={setN('date')}  placeholder="April 25, 2026" />
      </div>
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
