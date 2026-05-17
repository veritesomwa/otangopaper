// LinkedIn banner renderers — every text node is click-to-edit.

import { EditableText } from '@components/common/EditableText.jsx';
import { PhotoFill } from '../PhotoFill.jsx';

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

export function LinkedInProBanner({ accent, person, readOnly, onPatch }) {
  const E = makeE(readOnly, onPatch);
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', background: '#f3f2ef', display: 'flex',
      flexDirection: 'column', alignItems: 'center', padding: '24px', gap: 20 }}>
      <div style={{ width: '100%', height: 160, borderRadius: 10, overflow: 'hidden',
        background: `linear-gradient(135deg, ${accent} 0%, ${accent}aa 60%, #00C8D4 100%)`,
        position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}></div>
        <div style={{ position: 'absolute', bottom: -40, left: 40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
          <div>
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 5, display: 'block',
            }, { tag: 'div' })}
            {E('title', person.title, { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 10, display: 'block' }, { tag: 'div' })}
            <div style={{ display: 'flex', gap: 8 }}>
              {['Open to Work', 'Hiring', 'Connecting'].map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 9,
                  padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.3)' }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
            {E('location', person.location, { fontSize: 10, color: 'rgba(255,255,255,0.7)', display: 'block' }, { tag: 'div' })}
            {E('website',  person.website,  { marginTop: 4, display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
      <div style={{ width: '100%', background: '#fff', borderRadius: 10, padding: '18px 20px',
        border: '1px solid #e0e0e0', flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${accent}22`,
            border: `3px solid ${accent}44`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 26, flexShrink: 0, marginTop: -36 }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
          <div style={{ flex: 1, paddingTop: 4 }}>
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: '#111', display: 'block',
            }, { tag: 'div' })}
            <div style={{ fontSize: 11, color: '#555', marginBottom: 8 }}>
              {E('title', person.title, { display: 'inline' })}
              {' · '}
              {E('location', person.location, { display: 'inline' })}
            </div>
            {E('summary',
              (person.summary || '').slice(0, 120) + (person.summary?.length > 120 ? '…' : ''),
              { fontSize: 10, color: '#888', lineHeight: 1.6, display: 'block' },
              { tag: 'div', multiline: true })}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 9, color: '#aaa' }}>1584 × 396px · Optimised for LinkedIn profile</div>
    </div>
  );
}


export function LinkedInCreativeBanner({ accent, person, readOnly, onPatch }) {
  const E = makeE(readOnly, onPatch);
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', background: '#f3f2ef', display: 'flex',
      flexDirection: 'column', alignItems: 'center', padding: '24px', gap: 20 }}>
      <div style={{ width: '100%', height: 160, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
        background: '#0D1117', position: 'relative' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%',
            border: `1px solid ${accent}${i % 2 === 0 ? '22' : '11'}`,
            width: 80 + i * 60, height: 80 + i * 60,
            top: '50%', left: '30%',
            transform: 'translate(-50%, -50%)' }}></div>
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '24px 32px', gap: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg,${accent},#00C8D4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
          <div>
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 4, display: 'block',
            }, { tag: 'div' })}
            {E('title', person.title, {
              background: `linear-gradient(135deg,${accent},#00C8D4)`, WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: 12, fontWeight: 600, marginBottom: 8, display: 'block',
            }, { tag: 'div' })}
            <div style={{ display: 'flex', gap: 16, fontSize: 9.5, color: '#7C8698' }}>
              <span>📧 {E('email',   person.email,   { display: 'inline' })}</span>
              <span>🌐 {E('website', person.website, { display: 'inline' })}</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', background: '#fff', borderRadius: 10, padding: '16px 20px',
        border: '1px solid #e0e0e0', flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${accent},#00C8D4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, marginTop: -36 }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
          <div style={{ paddingTop: 4 }}>
            {E('name',  person.name,  { fontWeight: 700, fontSize: 13, color: '#111', display: 'block' }, { tag: 'div' })}
            {E('title', person.title, { fontSize: 10, color: '#777', marginBottom: 6, display: 'block' }, { tag: 'div' })}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(person.skills || []).slice(0, 4).map(s => (
                <span key={s} style={{ background: `${accent}14`, color: accent, fontSize: 8.5,
                  padding: '2px 8px', borderRadius: 999, border: `1px solid ${accent}33` }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
