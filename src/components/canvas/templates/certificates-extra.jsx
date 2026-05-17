// Modern minimal certificate — fully click-to-edit.

import { EditableText } from '@components/common/EditableText.jsx';

export function ModernCertificate({ accent, person, readOnly, onPatch }) {
  const c = person.certificate || {};
  const ink = '#0D1117';
  const E = (path, value, style, opts = {}) => (
    <EditableText
      value={value} readOnly={readOnly}
      onChange={(v) => onPatch?.(path, v)}
      tag={opts.tag || 'span'}
      multiline={opts.multiline}
      placeholder={opts.placeholder}
      style={style}
    />
  );
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif", height: '100%', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {[
        { top: 24, left: 24,                  borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` },
        { top: 24, right: 24,                 borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}` },
        { bottom: 24, left: 24,               borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` },
        { bottom: 24, right: 24,              borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}` },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 28, height: 28, ...s }} />
      ))}

      <div style={{ textAlign: 'center', padding: '40px 56px', maxWidth: 480 }}>
        {E('certificate.title', c.title || 'Certificate of Achievement', {
          fontSize: 9, letterSpacing: 6, textTransform: 'uppercase', color: accent, fontWeight: 700, display: 'block',
        }, { tag: 'div' })}

        <div style={{ height: 1, width: 56, background: accent, margin: '20px auto' }} />

        <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>This is presented to</div>
        {E('name', person.name || 'Recipient name', {
          fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 32,
          color: ink, letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 14, display: 'block',
        }, { tag: 'div' })}

        {E('certificate.description', c.description || 'in recognition of completing', {
          fontSize: 11, color: '#555', lineHeight: 1.8, marginBottom: 6, display: 'block',
        }, { tag: 'div', multiline: true })}
        {E('certificate.course', c.course || 'Advanced Product Design Certification', {
          fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16,
          color: ink, marginBottom: 28, display: 'block',
        }, { tag: 'div' })}

        <div style={{
          display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #e5e5e5',
          paddingTop: 16, fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: 2,
        }}>
          <div>
            {E('certificate.signatory', c.signatory || 'Authorized Signatory', {
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              fontSize: 13, color: ink, textTransform: 'none', letterSpacing: 0, marginBottom: 4, display: 'block',
            }, { tag: 'div' })}
            <div>Signature</div>
          </div>
          <div>
            {E('certificate.date', c.date || '', {
              fontFamily: "'Playfair Display', serif",
              fontSize: 13, color: ink, textTransform: 'none', letterSpacing: 0, marginBottom: 4, display: 'block',
            }, { tag: 'div', placeholder: 'Date' })}
            <div>Date</div>
          </div>
        </div>

        <div style={{ marginTop: 22, fontSize: 9, color: '#aaa', letterSpacing: 3, textTransform: 'uppercase' }}>
          {'Issued by · '}
          {E('certificate.issuer', c.issuer || 'OtangoPaper Academy', { display: 'inline' })}
        </div>
      </div>
    </div>
  );
}
