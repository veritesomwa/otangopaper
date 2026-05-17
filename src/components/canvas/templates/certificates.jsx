// Classic certificate — every text node is click-to-edit.

import { EditableText } from '@components/common/EditableText.jsx';

export function CertificateCanvas({ accent, person, readOnly, onPatch }) {
  const c = person?.certificate || {};
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
      fontFamily: "'Space Grotesk', sans-serif", height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, ${accent}11, ${accent}06)`,
      border: `4px solid ${accent}33`, position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 10, border: `1px solid ${accent}22`, borderRadius: 4 }}></div>
      <div style={{ textAlign: 'center', padding: '30px 40px' }}>
        {E('certificate.title', c.title || 'Certificate of Achievement', {
          fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 12, display: 'block',
        }, { tag: 'div' })}
        <div style={{ fontSize: 10, color: '#888', marginBottom: 12 }}>This is to certify that</div>
        {E('name', person?.name || 'Recipient Name', {
          fontWeight: 800, fontSize: 22, color: '#111', letterSpacing: '-0.02em', marginBottom: 8, display: 'block',
        }, { tag: 'div' })}
        <div style={{ fontSize: 9, color: '#666', lineHeight: 1.8, marginBottom: 16, maxWidth: 280, margin: '0 auto 16px' }}>
          {E('certificate.description', c.description || 'has successfully completed the requirements of the', { display: 'inline' })}
          <br />
          {E('certificate.course', c.course || 'Course or Award', { color: '#111', fontWeight: 700, display: 'inline' })}
        </div>
        <div style={{ height: 1, background: `${accent}33`, width: 120, margin: '16px auto' }}></div>
        <div style={{ fontSize: 8, color: '#999' }}>
          {E('certificate.date', c.date || '', { display: 'inline' }, { placeholder: 'Date' })}
          {' · '}
          {E('certificate.issuer', c.issuer || 'OtangoPaper Academy', { display: 'inline' })}
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 2, width: 80, background: accent, borderRadius: 999, margin: '0 auto 4px' }}></div>
          {E('certificate.signatory', c.signatory || 'Authorized Signature', {
            fontSize: 8, color: '#aaa', display: 'block',
          }, { tag: 'div' })}
        </div>
      </div>
    </div>
  );
}
