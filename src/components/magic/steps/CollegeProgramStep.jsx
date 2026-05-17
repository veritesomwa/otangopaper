import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** College app: where applying. */
export function CollegeProgramStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const c = person.college || {};
  const setC = (k) => (v) => patchPerson({ college: { ...c, [k]: v } });

  return (
    <StepContainer emoji={step.emoji} title="Where are you applying?" subtitle={step.subtitle}>
      <Field label="School / university" value={c.school || ''}
        onChange={setC('school')} placeholder="Stanford University" />
      <Field label="Program" value={c.program || ''}
        onChange={setC('program')} placeholder="MS Computer Science" />
      <Field label="Statement type" value={c.statementType || ''}
        onChange={setC('statementType')} placeholder="Statement of Purpose" />
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
