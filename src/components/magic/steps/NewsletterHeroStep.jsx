import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Newsletter: lead story headline + body. */
export function NewsletterHeroStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const nl   = person.newsletter || {};
  const hero = nl.hero || {};
  const setH = (k) => (v) => patchPerson({ newsletter: { ...nl, hero: { ...hero, [k]: v } } });

  return (
    <StepContainer emoji={step.emoji} title="Lead story" subtitle={step.subtitle}>
      <Field label="Headline" value={hero.headline || ''}
        onChange={setH('headline')} placeholder="AI reshapes the design industry in 2026" />
      <Field label="Body" value={hero.body || ''}
        onChange={setH('body')}
        placeholder="Two or three sentences of the most important thing in this issue."
        textarea rows={5} />
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
