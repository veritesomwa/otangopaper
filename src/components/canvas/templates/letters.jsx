// Cover-letter renderer — every text node is click-to-edit on the canvas.

import { EditableText } from '@components/common/EditableText.jsx';

export function LetterProResume({ person, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const letter = person.letter || {};
  const E = (path, value, style, opts = {}) => (
    <EditableText
      value={value}
      readOnly={readOnly}
      onChange={(v) => onPatch?.(path, v)}
      tag={opts.tag || 'span'}
      multiline={opts.multiline}
      placeholder={opts.placeholder}
      style={style}
    />
  );

  return (
    <div style={{ fontFamily: fontBody, padding: '40px', fontSize: 10, color: '#222', height: '100%' }}>
      <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 12, marginBottom: 20 }}>
        {E('name', person.name, {
          fontFamily: fontHeading, fontWeight: 700, fontSize: 18, color: '#111', display: 'block',
        }, { tag: 'div' })}
        <div style={{ fontSize: 9, color: '#777', marginTop: 3 }}>
          {E('email', person.email, { display: 'inline' })}
          {' · '}
          {E('phone', person.phone, { display: 'inline' })}
          {' · '}
          {E('location', person.location, { display: 'inline' })}
        </div>
      </div>

      {E('letter.date', letter.date || '', {
        fontSize: 9, color: '#888', marginBottom: 14, display: 'block',
      }, { tag: 'div', placeholder: 'Date' })}

      <div style={{ fontSize: 10, color: '#444', marginBottom: 18, lineHeight: 1.6 }}>
        {E('letter.recipientName', letter.recipientName || 'Hiring Manager', {
          fontWeight: 600, color: '#111', display: 'block',
        }, { tag: 'div' })}
        {E('letter.recipientCompany', letter.recipientCompany || '', { display: 'block' }, { tag: 'div', placeholder: 'Recipient company' })}
        {E('letter.role', letter.role ? `RE: ${letter.role}` : '', {
          color: accent, display: 'block',
        }, { tag: 'div', placeholder: 'RE: Role' })}
      </div>

      <div style={{ fontSize: 10, lineHeight: 1.9, color: '#444' }}>
        <p style={{ marginBottom: 12 }}>
          Dear {E('letter.recipientName', letter.recipientName || 'Hiring Manager', { display: 'inline' })},
        </p>
        {E('letter.body',
          letter.body || 'Write the body of your letter here. Press Shift+Enter for new lines.',
          { display: 'block', lineHeight: 1.9 },
          { tag: 'div', multiline: true })}
        <p style={{ marginTop: 12 }}>Sincerely,</p>
        <p style={{ fontWeight: 700, color: '#111', marginTop: 16, fontFamily: fontHeading, fontSize: 12 }}>
          {E('name', person.name, { display: 'inline' })}
        </p>
      </div>
    </div>
  );
}
