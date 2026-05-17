// 3 additional LinkedIn banner styles. Each accepts ({ accent, person, readOnly, onPatch }).

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

const Frame = ({ children, bg }) => (
  <div style={{
    fontFamily: "'DM Sans', sans-serif", height: '100%', background: bg,
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, gap: 20,
  }}>{children}</div>
);

// ── Minimalist Banner — pure typography ────────────────────────────────
export function LinkedInMinimalBanner({ person, readOnly, onPatch }) {
  const E = makeE(readOnly, onPatch);
  return (
    <Frame bg="#f5f5f5">
      <div style={{
        width: '100%', height: 160, background: '#fff', borderRadius: 10,
        border: '1px solid #e0e0e0', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, padding: '28px 36px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {E('name', person.name, {
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 36,
            color: '#0D1117', letterSpacing: '-0.04em', lineHeight: 1, display: 'block',
          }, { tag: 'div' })}
          {E('title', person.title, { fontSize: 13, color: '#777', marginTop: 8, letterSpacing: 1, display: 'block' }, { tag: 'div' })}
        </div>
        <div style={{
          position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#bbb',
          textAlign: 'right', lineHeight: 1.8,
        }}>
          {E('email',    person.email,    { display: 'block' }, { tag: 'div' })}
          {E('website',  person.website,  { display: 'block' }, { tag: 'div' })}
          {E('location', person.location, { display: 'block' }, { tag: 'div' })}
        </div>
      </div>
      <div style={{
        width: '100%', background: '#fff', borderRadius: 10, padding: '16px 22px',
        border: '1px solid #e0e0e0', flex: 1,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
            background: '#0D1117', border: '3px solid #fff', marginTop: -36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22,
          }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
          <div style={{ paddingTop: 4 }}>
            {E('name',  person.name,  { fontWeight: 700, fontSize: 13, color: '#111', display: 'block' }, { tag: 'div' })}
            {E('title', person.title, { fontSize: 10, color: '#777', display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 9, color: '#aaa' }}>1584 × 396px · Minimalist</div>
    </Frame>
  );
}

// ── Quote Banner — signature pull-quote with photo ────────────────────
export function LinkedInQuoteBanner({ accent, person, readOnly, onPatch }) {
  const dark = accent !== '#1756C8' ? accent : '#1A1F2E';
  const E = makeE(readOnly, onPatch);
  return (
    <Frame bg="#f3f2ef">
      <div style={{
        width: '100%', height: 160, background: dark, borderRadius: 10,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)',
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: 80, color: 'rgba(255,255,255,0.12)', lineHeight: 1,
        }}>"</div>
        <div style={{
          position: 'absolute', inset: 0, padding: '24px 60px',
          display: 'flex', alignItems: 'center', gap: 28,
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.4)',
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#fff',
          }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
          <div style={{ flex: 1 }}>
            {E('summary',
              person.summary || 'Designing for the next billion users.',
              {
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontSize: 16, color: '#fff', lineHeight: 1.4, marginBottom: 8, display: 'block',
              },
              { tag: 'div', multiline: true })}
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', display: 'block',
            }, { tag: 'div' })}
            {E('title', person.title, { fontSize: 10, color: 'rgba(255,255,255,0.6)', display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
      <div style={{
        width: '100%', background: '#fff', borderRadius: 10, padding: '16px 20px',
        border: '1px solid #e0e0e0', flex: 1,
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: dark, marginTop: -36, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, border: '3px solid #fff',
          }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
          <div style={{ paddingTop: 4 }}>
            {E('name',  person.name,  { fontWeight: 700, fontSize: 13, color: '#111', display: 'block' }, { tag: 'div' })}
            {E('title', person.title, { fontSize: 10, color: '#777', display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ── Skills Banner — chips showcase ────────────────────────────────────
export function LinkedInSkillsBanner({ accent, person, readOnly, onPatch }) {
  const teal = accent !== '#1756C8' ? accent : '#0A7C6E';
  const E = makeE(readOnly, onPatch);
  return (
    <Frame bg="#f3f2ef">
      <div style={{
        width: '100%', height: 160, borderRadius: 10, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg,${teal},${teal}dd 60%,#0D1117 100%)`,
      }}>
        <div style={{
          position: 'absolute', inset: 0, padding: '20px 32px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            {E('title', person.title, {
              fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', display: 'block',
            }, { tag: 'div' })}
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 26,
              color: '#fff', marginTop: 4, display: 'block',
            }, { tag: 'div' })}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(person.skills || []).slice(0, 8).map(s => (
              <span key={s} style={{
                background: 'rgba(255,255,255,0.18)', color: '#fff',
                fontSize: 10, padding: '4px 10px', borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.3)',
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        width: '100%', background: '#fff', borderRadius: 10, padding: '16px 20px',
        border: '1px solid #e0e0e0', flex: 1,
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: teal, marginTop: -36, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, border: '3px solid #fff',
          }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
          <div style={{ paddingTop: 4 }}>
            {E('name',     person.name,     { fontWeight: 700, fontSize: 13, color: '#111', display: 'block' }, { tag: 'div' })}
            {E('location', person.location, { fontSize: 10, color: '#777', display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
    </Frame>
  );
}
