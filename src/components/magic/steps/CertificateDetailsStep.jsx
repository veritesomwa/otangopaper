import { useDocument } from '@hooks/useDocument.js';
import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';
import { Field } from '../Field.jsx';

/** Certificate: recipient + award + signatory. */
export function CertificateDetailsStep({ step, magic }) {
  const { person, patchPerson } = useDocument();
  const cert = person.certificate || {};
  const setC = (k) => (v) => patchPerson({ certificate: { ...cert, [k]: v } });
  const setName = (v) => patchPerson({ name: v });

  return (
    <StepContainer emoji={step.emoji} title="Certificate details" subtitle={step.subtitle}>
      <Field label="Recipient name" value={person.name} onChange={setName} placeholder="Alexandra Chen" />
      <Field label="Title (heading)" value={cert.title || ''}
        onChange={setC('title')} placeholder="Certificate of Achievement" />
      <Field label="Course / award" value={cert.course || ''}
        onChange={setC('course')} placeholder="Advanced Product Design Certification" />
      <Field label="Description" value={cert.description || ''}
        onChange={setC('description')}
        placeholder="has successfully completed the requirements of the…"
        textarea rows={3} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Issuer"     value={cert.issuer || ''}
          onChange={setC('issuer')}  placeholder="OtangoPaper Academy" />
        <Field label="Date"       value={cert.date || ''}
          onChange={setC('date')}    placeholder="April 25, 2026" />
      </div>
      <Field label="Signatory" value={cert.signatory || ''}
        onChange={setC('signatory')} placeholder="Authorized Signature" />
      <MagicStepNav {...magic} onBack={magic.back} onNext={magic.next} />
    </StepContainer>
  );
}
