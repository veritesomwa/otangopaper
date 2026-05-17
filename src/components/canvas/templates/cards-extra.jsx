// Five additional business-card designs that extend cards.jsx.
// All take ({ accent, person, readOnly, onPatch }). Every text node is editable.

import { EditableText } from '@components/common/EditableText.jsx';
import { PhotoFill } from '../PhotoFill.jsx';

const CARD_W = 340;
const CARD_H = 200;

const Page = ({ children, bg = '#fff' }) => (
  <div style={{
    fontFamily: "'DM Sans', sans-serif", height: '100%', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 28, padding: 32, background: bg,
  }}>{children}</div>
);

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

// ── Mono — minimalist black & white ────────────────────────────────────
export function BizMonoCard({ person, readOnly, onPatch }) {
  const E = makeE(readOnly, onPatch);
  return (
    <Page bg="#fafafa">
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 12, background: '#fff',
        boxShadow: '0 6px 22px rgba(0,0,0,0.08)', border: '1px solid #e5e5e5',
        flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '22px 24px',
      }}>
        <div>
          {E('name', person.name, {
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18,
            color: '#0D1117', letterSpacing: '-0.02em', display: 'block',
          }, { tag: 'div' })}
          {E('title', person.title, { fontSize: 11, color: '#888', marginTop: 4, display: 'block' }, { tag: 'div' })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 9, color: '#444', lineHeight: 1.7 }}>
            {E('email',   person.email,   { display: 'block' }, { tag: 'div' })}
            {E('phone',   person.phone,   { display: 'block' }, { tag: 'div' })}
            {E('website', person.website, { display: 'block' }, { tag: 'div' })}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 24,
            color: '#0D1117', letterSpacing: 4,
          }}>—</div>
        </div>
      </div>
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 12, background: '#0D1117',
        boxShadow: '0 6px 22px rgba(0,0,0,0.18)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 28,
          color: '#fff', letterSpacing: 6, textTransform: 'uppercase',
        }}>{person.name?.split(' ').map(w => w[0]).join('') || 'OT'}</div>
      </div>
      <div style={{ fontSize: 9, color: '#bbb' }}>Mono · 3.5″ × 2″</div>
    </Page>
  );
}

// ── Letterpress — vintage cream + serif ────────────────────────────────
export function BizLetterpressCard({ accent, person, readOnly, onPatch }) {
  const cream = '#F5EDE0';
  const ink = '#3A2E1F';
  const brown = accent !== '#1756C8' ? accent : '#8B6F47';
  const E = makeE(readOnly, onPatch);

  return (
    <Page bg="#EFE5D2">
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 4, background: cream,
        boxShadow: '0 6px 18px rgba(58,46,31,0.18)',
        border: `1px solid ${brown}33`,
        flexShrink: 0, padding: '22px 26px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ borderBottom: `1.5px solid ${brown}55`, paddingBottom: 6 }}>
          <div style={{ fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: brown }}>Established</div>
          {E('name', person.name, {
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: ink, marginTop: 4, display: 'block',
          }, { tag: 'div' })}
          {E('title', person.title, {
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontSize: 11, color: brown, marginTop: 2, display: 'block',
          }, { tag: 'div' })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: ink, lineHeight: 1.7 }}>
          <div>
            {E('email', person.email, { display: 'block' }, { tag: 'div' })}
            {E('phone', person.phone, { display: 'block' }, { tag: 'div' })}
          </div>
          <div style={{ textAlign: 'right' }}>
            {E('location', person.location, { display: 'block' }, { tag: 'div' })}
            {E('website',  person.website,  { display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 4, background: ink,
        boxShadow: '0 6px 18px rgba(58,46,31,0.25)',
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: 16,
      }}>
        <div style={{ position: 'absolute', inset: 8, border: `1px solid ${brown}` }} />
        <div style={{ textAlign: 'center', position: 'relative' }}>
          {E('company', person.company || person.name, {
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontWeight: 700, fontSize: 24, color: cream, display: 'block',
          }, { tag: 'div' })}
          <div style={{ fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: brown, marginTop: 6 }}>
            Pressed in {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </Page>
  );
}

// ── Photo Front — large face on the front ──────────────────────────────
export function BizPhotoCard({ accent, person, readOnly, onPatch }) {
  const dark = accent !== '#1756C8' ? accent : '#1A1F2E';
  const E = makeE(readOnly, onPatch);
  return (
    <Page bg="#f3f4f6">
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.18)', flexShrink: 0,
        display: 'flex', background: '#fff',
      }}>
        <div style={{
          width: CARD_H * 0.85,
          background: `linear-gradient(135deg,${dark},${dark}cc)`,
          position: 'relative', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '78%', aspectRatio: '1 / 1', borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.6)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: 'rgba(255,255,255,0.85)',
          }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
        </div>
        <div style={{
          flex: 1, padding: '20px 18px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16, color: '#111', lineHeight: 1.15, display: 'block',
            }, { tag: 'div' })}
            {E('title', person.title, { fontSize: 10, color: dark, marginTop: 3, display: 'block' }, { tag: 'div' })}
          </div>
          <div style={{ fontSize: 9, color: '#555', lineHeight: 1.7 }}>
            {E('email',   person.email,   { display: 'block' }, { tag: 'div' })}
            {E('phone',   person.phone,   { display: 'block' }, { tag: 'div' })}
            {E('website', person.website, { display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 14, background: dark,
        boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 6,
      }}>
        {E('tagline', person.tagline || '—', {
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.9)', display: 'block',
        }, { tag: 'div' })}
        {E('company', person.company || 'OtangoPaper', {
          fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 3, textTransform: 'uppercase', display: 'block',
        }, { tag: 'div' })}
      </div>
    </Page>
  );
}

// ── Geometric Luxe — gold accents on dark ──────────────────────────────
export function BizLuxeCard({ accent, person, readOnly, onPatch }) {
  const gold = accent !== '#1756C8' ? accent : '#B8860B';
  const E = makeE(readOnly, onPatch);
  return (
    <Page bg="#0a0a0a">
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 8, background: '#111315',
        flexShrink: 0, padding: '22px 26px', position: 'relative', overflow: 'hidden',
        boxShadow: `0 12px 36px ${gold}33`,
        border: `1px solid ${gold}55`,
      }}>
        <svg viewBox="0 0 200 100" style={{ position: 'absolute', right: -20, bottom: -30, width: 220, height: 120, opacity: 0.45 }}>
          <polygon points="0,100 100,0 200,100" fill="none" stroke={gold} strokeWidth="0.4" />
          <polygon points="40,100 100,30 160,100" fill="none" stroke={gold} strokeWidth="0.4" />
          <polygon points="80,100 100,60 120,100" fill="none" stroke={gold} strokeWidth="0.4" />
        </svg>
        <div style={{ position: 'relative' }}>
          {E('company', person.company || 'Studio', {
            fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: gold, marginBottom: 14, display: 'block',
          }, { tag: 'div' })}
          {E('name', person.name, {
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: '-0.02em', display: 'block',
          }, { tag: 'div' })}
          {E('title', person.title, { fontStyle: 'italic', fontSize: 10, color: gold, marginTop: 2, display: 'block' }, { tag: 'div' })}
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginTop: 24, lineHeight: 1.7 }}>
            {E('email',   person.email,   { display: 'block' }, { tag: 'div' })}
            {E('phone',   person.phone,   { display: 'block' }, { tag: 'div' })}
            {E('website', person.website, { display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 8, background: gold,
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 12px 36px ${gold}55`, position: 'relative', overflow: 'hidden',
      }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
          <circle cx="50" cy="50" r="36" fill="none" stroke="#0D1117" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#0D1117" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#0D1117" strokeWidth="0.4" />
        </svg>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 28,
          color: '#0D1117', letterSpacing: 6, position: 'relative',
        }}>{person.name?.split(' ').map(w => w[0]).join('') || 'OT'}</div>
      </div>
    </Page>
  );
}

// ── Holographic Foil — iridescent gradient ─────────────────────────────
export function BizFoilCard({ person, readOnly, onPatch }) {
  const E = makeE(readOnly, onPatch);
  return (
    <Page bg="#f8f5ff">
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 14, overflow: 'hidden',
        position: 'relative', flexShrink: 0,
        background: 'linear-gradient(135deg,#FF80B5 0%,#9089FC 35%,#56CCF2 70%,#A0EEFF 100%)',
        boxShadow: '0 12px 36px rgba(144,137,252,0.45)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.35), transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, padding: '22px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          {E('company', person.company || 'Holo Studio', {
            display: 'inline-block', alignSelf: 'flex-start',
            background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(6px)',
            padding: '5px 12px', borderRadius: 999, fontSize: 9, fontWeight: 700,
            color: '#0D1117', letterSpacing: 1.5,
          })}
          <div>
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 22,
              color: '#0D1117', letterSpacing: '-0.03em', display: 'block',
            }, { tag: 'div' })}
            {E('title', person.title, { fontSize: 11, color: '#0D1117', opacity: 0.7, marginTop: 2, display: 'block' }, { tag: 'div' })}
          </div>
        </div>
      </div>
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 14, overflow: 'hidden',
        flexShrink: 0, padding: '22px 24px', background: '#0D1117',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 12px 36px rgba(13,17,23,0.35)',
      }}>
        <div style={{ fontSize: 10.5, lineHeight: 1.8, color: '#A8B0C0' }}>
          {E('email',   person.email,   { display: 'block' }, { tag: 'div' })}
          {E('phone',   person.phone,   { display: 'block' }, { tag: 'div' })}
          {E('website', person.website, { display: 'block' }, { tag: 'div' })}
        </div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 28,
          background: 'linear-gradient(135deg,#FF80B5,#9089FC,#56CCF2)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{person.name?.split(' ').map(w => w[0]).join('') || 'OT'}</div>
      </div>
    </Page>
  );
}
