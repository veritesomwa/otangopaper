// Magazine + blog-style newsletter renderers, every text editable inline.

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

// ── Magazine masthead — bold editorial layout ─────────────────────────
export function MagazineNewsletter({ accent, person, readOnly, onPatch }) {
  const nl = person?.newsletter || {};
  const E = makeE(readOnly, onPatch);
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', background: '#fff' }}>
      <div style={{
        background: '#0D1117', color: '#fff',
        padding: '28px 32px', borderBottom: `8px solid ${accent}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {E('newsletter.title', nl.title || 'OtangoPaper Quarterly', {
            fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 30,
            letterSpacing: '-0.02em', display: 'inline-block',
          }, { tag: 'div' })}
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6 }}>
            {'#'}
            {E('newsletter.issue', nl.issue || '01', { display: 'inline' })}
            {' · '}
            {E('newsletter.date', nl.date || '', { display: 'inline' }, { placeholder: 'Date' })}
          </div>
        </div>
        {E('newsletter.subtitle', nl.subtitle || 'A magazine about modern design', {
          fontSize: 11, opacity: 0.7, marginTop: 4, display: 'block',
        }, { tag: 'div' })}
      </div>

      <div style={{ padding: '20px 32px' }}>
        <div style={{ display: 'flex', gap: 18 }}>
          <div style={{
            width: 200, height: 130, background: '#eee', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#bbb', fontSize: 9, flexShrink: 0,
          }}>[ Cover Art ]</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 9, color: accent, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700,
            }}>Cover Story</div>
            {E('newsletter.hero.headline', nl.hero?.headline || 'AI reshapes the design industry in 2026', {
              fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18,
              color: '#0D1117', marginTop: 6, lineHeight: 1.2, display: 'block',
            }, { tag: 'div' })}
            {E('newsletter.hero.body', nl.hero?.body || 'A look at where the field is going.', {
              fontSize: 10, color: '#555', lineHeight: 1.7, marginTop: 8, display: 'block',
            }, { tag: 'div', multiline: true })}
          </div>
        </div>

        <div style={{ height: 1, background: '#eee', margin: '20px 0 16px' }} />

        <div style={{ fontSize: 9, color: '#999', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
          Inside this issue
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {(nl.stories || []).map((s, i) => (
            <div key={i} style={{ borderTop: `2px solid ${accent}`, paddingTop: 8 }}>
              {E(`newsletter.stories.${i}.headline`, s.headline, {
                fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 12, color: '#0D1117', display: 'block',
              }, { tag: 'div' })}
              {E(`newsletter.stories.${i}.summary`, s.summary, {
                fontSize: 9, color: '#777', lineHeight: 1.6, marginTop: 4, display: 'block',
              }, { tag: 'div', multiline: true })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Personal Blog — friendly long-form layout ─────────────────────────
export function BlogNewsletter({ accent, person, readOnly, onPatch }) {
  const nl = person?.newsletter || {};
  const E = makeE(readOnly, onPatch);
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', background: '#fff', padding: '28px 32px' }}>
      <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: 14, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `linear-gradient(135deg,${accent},${accent}99)`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 14,
          }}>{(person.name || 'O')[0]}</div>
          <div>
            {E('name', person.name || 'Otango', {
              fontWeight: 700, fontSize: 12, color: '#0D1117', display: 'block',
            }, { tag: 'div' })}
            <div style={{ fontSize: 10, color: '#888' }}>
              {E('newsletter.subtitle', nl.subtitle || 'thinking out loud', { display: 'inline' })}
              {' · '}
              {E('newsletter.date', nl.date || '', { display: 'inline' }, { placeholder: 'Date' })}
            </div>
          </div>
        </div>
      </div>

      {E('newsletter.hero.headline', nl.hero?.headline || 'Some thoughts on what I shipped this month', {
        fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22,
        color: '#0D1117', lineHeight: 1.25, marginBottom: 12, display: 'block',
      }, { tag: 'div' })}
      {E('newsletter.hero.body', nl.hero?.body || 'A short intro paragraph that hooks the reader.', {
        fontSize: 11, color: '#444', lineHeight: 1.85, marginBottom: 18, display: 'block',
      }, { tag: 'div', multiline: true })}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(nl.stories || []).map((s, i) => (
          <div key={i} style={{ paddingLeft: 12, borderLeft: `3px solid ${accent}55` }}>
            {E(`newsletter.stories.${i}.headline`, s.headline, {
              fontWeight: 700, fontSize: 12, color: '#0D1117', marginBottom: 3, display: 'block',
            }, { tag: 'div' })}
            {E(`newsletter.stories.${i}.summary`, s.summary, {
              fontSize: 10.5, color: '#555', lineHeight: 1.7, display: 'block',
            }, { tag: 'div', multiline: true })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22, padding: '12px 14px', background: `${accent}12`,
        borderRadius: 8, fontSize: 10, color: '#444', lineHeight: 1.5 }}>
        ✉️ Reply directly with thoughts, or forward this to a friend.
      </div>
    </div>
  );
}
