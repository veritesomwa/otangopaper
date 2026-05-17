// Business cards — every text node is click-to-edit on the canvas.

import { EditableText } from '@components/common/EditableText.jsx';

function makeE(readOnly, onPatch) {
  return (path, value, style, opts = {}) => (
    <EditableText
      value={value} readOnly={readOnly}
      onChange={(v) => onPatch?.(path, v)}
      tag={opts.tag || 'span'}
      multiline={opts.multiline}
      placeholder={opts.placeholder}
      style={style}
    />
  );
}

export function BizModernCard({ accent, person, readOnly, onPatch }) {
  const E = makeE(readOnly, onPatch);
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 32, padding: '32px', background: '#fff' }}>
      {/* Front side */}
      <div style={{ width: 340, height: 190, borderRadius: 14, background: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: 8, background: accent, flexShrink: 0 }}></div>
        <div style={{ flex: 1, padding: '22px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 17, color: '#111', marginBottom: 3, display: 'block',
            }, { tag: 'div' })}
            {E('title', person.title, { fontSize: 11, color: accent, fontWeight: 500, display: 'block' }, { tag: 'div' })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {E('email',   person.email,   { fontSize: 9.5, color: '#666', display: 'block' }, { tag: 'div' })}
            {E('phone',   person.phone,   { fontSize: 9.5, color: '#666', display: 'block' }, { tag: 'div' })}
            {E('website', person.website, { fontSize: 9.5, color: '#666', display: 'block' }, { tag: 'div' })}
          </div>
        </div>
        <div style={{ width: 70, background: `${accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: accent, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 18, color: '#fff' }}>
            {(person.name || 'OT').split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
        </div>
      </div>
      {/* Back side */}
      <div style={{ width: 340, height: 190, borderRadius: 14, background: `linear-gradient(135deg,${accent},${accent}dd)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.14)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
        <div style={{ position: 'absolute', bottom: -30, left: -10, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          {E('company', person.company || 'OTANGOPAPER', {
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: 2, display: 'block',
          }, { tag: 'div' })}
          {E('tagline', person.tagline || 'Design Studio', {
            fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4, display: 'block',
          }, { tag: 'div' })}
        </div>
      </div>
      <div style={{ fontSize: 9, color: '#bbb', textAlign: 'center' }}>Front &amp; back — print-ready at 3.5" × 2"</div>
    </div>
  );
}


export function BizBoldCard({ accent, person, readOnly, onPatch }) {
  const E = makeE(readOnly, onPatch);
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 28, padding: '32px', background: '#f5f5f5' }}>
      <div style={{ width: 340, height: 190, borderRadius: 12, background: '#0D1117', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)', display: 'flex', flexShrink: 0 }}>
        <div style={{ flex: 1, padding: '22px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {E('title', person.title || 'Designer', {
              fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 6, fontWeight: 700, display: 'block',
            }, { tag: 'div' })}
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1.15, display: 'block',
            }, { tag: 'div' })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {E('email',   person.email,   { fontSize: 9, color: '#A8B0C0', display: 'block' }, { tag: 'div' })}
            {E('phone',   person.phone,   { fontSize: 9, color: '#A8B0C0', display: 'block' }, { tag: 'div' })}
            {E('website', person.website, { fontSize: 9, color: accent,    display: 'block' }, { tag: 'div' })}
          </div>
        </div>
        <div style={{ width: 4, background: `linear-gradient(180deg,${accent},#00C8D4)`, flexShrink: 0 }}></div>
      </div>
      <div style={{ width: 340, height: 190, borderRadius: 12, background: '#0D1117', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', border: `1px solid ${accent}22`,
            width: 120 + i * 80, height: 120 + i * 80 }}></div>
        ))}
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 28, color: '#fff',
          letterSpacing: 3, position: 'relative' }}>
          {(person.name || 'OT').split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
      </div>
    </div>
  );
}


export function BizCreativeCard({ accent, person, readOnly, onPatch }) {
  const E = makeE(readOnly, onPatch);
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 28, padding: '32px', background: '#f8f5ff' }}>
      <div style={{ width: 340, height: 190, borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(23, 86, 200,0.25)', flexShrink: 0,
        background: `linear-gradient(135deg, ${accent} 0%, #00C8D4 100%)` }}>
        <div style={{ padding: '22px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              {E('name', person.name, {
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', display: 'block',
              }, { tag: 'div' })}
              {E('title', person.title, { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 3, display: 'block' }, { tag: 'div' })}
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 14, color: '#fff' }}>
              {(person.name || 'O')[0]}
            </div>
          </div>
          <div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 12 }}></div>
            <div style={{ display: 'flex', gap: 14, fontSize: 9.5, color: 'rgba(255,255,255,0.85)' }}>
              {E('email',   person.email,   { display: 'inline' })}
              {E('website', person.website, { display: 'inline' })}
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: 340, height: 190, borderRadius: 14, background: '#fff',
        boxShadow: '0 8px 32px rgba(23, 86, 200,0.12)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, border: `2px solid ${accent}22` }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: `linear-gradient(135deg,${accent},#00C8D4)`, WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: 2 }}>
            {(person.name || 'OT').split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          {E('company', person.company || 'OtangoPaper Studio', {
            fontSize: 9, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', marginTop: 3, display: 'block',
          }, { tag: 'div' })}
        </div>
      </div>
    </div>
  );
}
