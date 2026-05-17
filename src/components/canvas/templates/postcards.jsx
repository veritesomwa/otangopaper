// Postcard renderers. The doc canvas is 595 × 842; postcards are landscape,
// so we centre an inner 4×6 card inside the page background.
// All accept ({ accent, person, readOnly, onPatch }). Every text node is editable.

import { EditableText } from '@components/common/EditableText.jsx';

const CARD_W = 480;
const CARD_H = 320;

const Frame = ({ children, bg = '#f5f1eb' }) => (
  <div style={{
    fontFamily: "'DM Sans', sans-serif", height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: bg,
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

// ── Travel postcard — vintage stamp + place ───────────────────────────
export function PostcardTravel({ accent, person, readOnly, onPatch }) {
  const pc = person.postcard || {};
  const orange = accent !== '#1756C8' ? accent : '#D2603A';
  const E = makeE(readOnly, onPatch);

  return (
    <Frame bg="#F5EDE0">
      <div style={{
        width: CARD_W, height: CARD_H, background: '#FBF6EE', borderRadius: 6,
        boxShadow: '0 14px 38px rgba(58,46,31,0.18)',
        position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(58,46,31,0.18)',
      }}>
        {/* Faux-stamp */}
        <div style={{
          position: 'absolute', top: 22, right: 22,
          width: 78, height: 92, background: '#fff',
          border: `2px dashed ${orange}aa`, borderRadius: 4,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: orange, fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700,
          padding: 6, textAlign: 'center', lineHeight: 1.1,
        }}>
          <div style={{ fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>POSTCARD</div>
          <div style={{ fontSize: 22, lineHeight: 1 }}>★</div>
          <div style={{ fontSize: 9, marginTop: 3, color: '#666', letterSpacing: 0.5 }}>
            {(pc.place || 'WORLDWIDE').toUpperCase().slice(0, 12)}
          </div>
        </div>

        {/* Big place name */}
        {E('postcard.place', pc.place || 'Tokyo, 2026', {
          position: 'absolute', top: 26, left: 32,
          fontFamily: "'Playfair Display', serif", fontWeight: 800,
          fontSize: 40, color: orange, letterSpacing: '-0.03em',
          lineHeight: 0.95, display: 'block',
        }, { tag: 'div' })}
        {E('postcard.greeting', pc.greeting || 'Hello from', {
          position: 'absolute', top: 78, left: 32,
          fontSize: 10, letterSpacing: 5, textTransform: 'uppercase',
          color: '#3A2E1F', fontWeight: 600, display: 'block',
        }, { tag: 'div' })}

        {/* Centerline */}
        <div style={{
          position: 'absolute', top: 110, left: 32, right: 32,
          height: 1, background: 'rgba(58,46,31,0.18)',
        }} />

        {/* Message */}
        {E('postcard.message',
          pc.message || 'Wish you were here. The cherry blossoms are unreal this year.',
          {
            position: 'absolute', top: 126, left: 32, width: '52%',
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontSize: 14, color: '#3A2E1F', lineHeight: 1.55, display: 'block',
          },
          { tag: 'div', multiline: true })}

        {/* Address column */}
        <div style={{
          position: 'absolute', top: 130, right: 32, width: 170,
          paddingLeft: 14, borderLeft: `1px solid ${orange}55`,
          fontSize: 11, color: '#3A2E1F', lineHeight: 1.7,
        }}>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: orange, marginBottom: 6 }}>
            To
          </div>
          {E('postcard.to', pc.to || 'A friend', { fontWeight: 600, fontSize: 13, display: 'block' }, { tag: 'div' })}
          <div style={{ marginTop: 14, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: orange, marginBottom: 4 }}>
            From
          </div>
          {E('postcard.from', pc.from || person.name, { fontStyle: 'italic', display: 'block' }, { tag: 'div' })}
        </div>
      </div>
    </Frame>
  );
}

// ── Event postcard — modern hero ───────────────────────────────────────
export function PostcardEvent({ accent, person, readOnly, onPatch }) {
  const pc = person.postcard || {};
  const purple = accent !== '#1756C8' ? accent : '#FF7A1F';
  const E = makeE(readOnly, onPatch);

  return (
    <Frame bg="#0D1117">
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 14, overflow: 'hidden',
        background: '#fff', boxShadow: '0 18px 44px rgba(0,0,0,0.35)',
        display: 'flex',
      }}>
        <div style={{
          flex: '0 0 55%', position: 'relative',
          background: `linear-gradient(135deg,${purple} 0%,#0D1117 100%)`,
          color: '#fff', padding: 24,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          {E('postcard.greeting', pc.greeting || 'You are invited', {
            fontSize: 9, letterSpacing: 5, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)', display: 'block',
          }, { tag: 'div' })}
          <div>
            {E('postcard.place', pc.place || 'OtangoPaper Launch Party', {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 32,
              lineHeight: 1.05, letterSpacing: '-0.02em', display: 'block',
            }, { tag: 'div' })}
            {E('postcard.message', pc.message || 'Join us for an evening of new templates, drinks, and design talks.', {
              fontSize: 12, color: 'rgba(255,255,255,0.78)', marginTop: 8, lineHeight: 1.6, maxWidth: 220, display: 'block',
            }, { tag: 'div', multiline: true })}
          </div>
        </div>
        <div style={{
          flex: 1, padding: 24, color: '#0D1117',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <DetailRow label="When"  path="postcard.from"  value={pc.from || 'May 14, 2026 · 7pm'} accent={purple} E={E} />
            <DetailRow label="Where" path="location"        value={person.location || 'Otango HQ, San Francisco'} accent={purple} E={E} />
            <DetailRow label="RSVP"  path="email"           value={person.email || 'rsvp@otango.app'} accent={purple} E={E} />
          </div>
          <div style={{ fontSize: 9, color: '#888' }}>
            {E('website', person.website || 'otango.app', { display: 'inline' })}
          </div>
        </div>
      </div>
    </Frame>
  );
}
function DetailRow({ label, path, value, accent, E }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 3 }}>
        {label}
      </div>
      {E(path, value, { fontSize: 13, fontWeight: 600, display: 'block' }, { tag: 'div' })}
    </div>
  );
}

// ── Thank-you card — elegant minimal ──────────────────────────────────
export function PostcardThanks({ accent, person, readOnly, onPatch }) {
  const pc = person.postcard || {};
  const teal = accent !== '#1756C8' ? accent : '#0A7C6E';
  const E = makeE(readOnly, onPatch);

  return (
    <Frame bg="#F4F7FC">
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 12, background: '#FFFEF8',
        boxShadow: '0 14px 36px rgba(0,0,0,0.10)', position: 'relative',
        padding: '40px 50px', textAlign: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontWeight: 700, fontSize: 56, lineHeight: 1, color: teal, marginBottom: 14,
        }}>thank you</div>
        <div style={{ width: 50, height: 1, background: teal, opacity: 0.5, marginBottom: 18 }} />
        {E('postcard.message',
          pc.message || 'For your kindness, your time, and the spark you bring. It means more than these words can carry.',
          {
            fontFamily: "'Playfair Display', serif", fontSize: 14, color: '#444',
            lineHeight: 1.7, maxWidth: 320, display: 'block',
          },
          { tag: 'div', multiline: true })}
        <div style={{ marginTop: 24, fontSize: 11, color: teal, fontStyle: 'italic' }}>
          {'— '}
          {E('postcard.from', pc.from || person.name, { display: 'inline' })}
        </div>
      </div>
    </Frame>
  );
}

// ── Holiday card — festive seasonal ───────────────────────────────────
export function PostcardHoliday({ accent, person, readOnly, onPatch }) {
  const pc = person.postcard || {};
  const red = accent !== '#1756C8' ? accent : '#C0392B';
  const cream = '#FBF6EE';
  const E = makeE(readOnly, onPatch);

  return (
    <Frame bg="#0F1F3D">
      <div style={{
        width: CARD_W, height: CARD_H, borderRadius: 14, overflow: 'hidden',
        background: cream, position: 'relative',
        boxShadow: '0 16px 42px rgba(15,31,61,0.45)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 14,
          background: `repeating-linear-gradient(45deg, ${red} 0 12px, transparent 12px 24px, #0F1F3D 24px 36px, transparent 36px 48px)`,
          opacity: 0.7,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 14,
          background: `repeating-linear-gradient(-45deg, ${red} 0 12px, transparent 12px 24px, #0F1F3D 24px 36px, transparent 36px 48px)`,
          opacity: 0.7,
        }} />

        <div style={{
          position: 'absolute', inset: '40px 30px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: 12,
        }}>
          {E('postcard.greeting', pc.greeting || 'Happy Holidays', {
            fontSize: 28, letterSpacing: 8, textTransform: 'uppercase', color: red,
            fontFamily: "'Playfair Display', serif", fontWeight: 700, display: 'block',
          }, { tag: 'div' })}
          <div style={{ fontSize: 60 }}>❄</div>
          {E('postcard.message',
            pc.message || 'Wishing you warmth, light, and excellent company through the coldest nights.',
            { fontSize: 12, color: '#3A2E1F', maxWidth: 320, lineHeight: 1.6, display: 'block' },
            { tag: 'div', multiline: true })}
          <div style={{ fontStyle: 'italic', color: red, marginTop: 8, fontSize: 12 }}>
            {'— '}
            {E('postcard.from', pc.from || person.name, { display: 'inline' })}
          </div>
        </div>
      </div>
    </Frame>
  );
}
