// Weekly-style newsletter — every text node is click-to-edit.

import { EditableText } from '@components/common/EditableText.jsx';

export function NewsletterCanvas({ accent, person, readOnly, onPatch }) {
  const nl = person?.newsletter || {};
  const stories = (nl.stories || []).slice(0, 4);

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
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', fontSize: 10 }}>
      <div style={{ background: accent, padding: '20px 28px', color: '#fff' }}>
        {E('newsletter.subtitle', nl.subtitle || 'Weekly Digest', {
          fontSize: 8, letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)', marginBottom: 4, display: 'block',
        }, { tag: 'div' })}
        {E('newsletter.title', nl.title || 'This Week in Tech', {
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4, display: 'block',
        }, { tag: 'div' })}
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)' }}>
          {E('newsletter.date', nl.date || 'April 25, 2026', { display: 'inline' })}
          {' · Issue #'}
          {E('newsletter.issue', nl.issue || '42', { display: 'inline' })}
        </div>
      </div>
      <div style={{ padding: '18px 28px' }}>
        <div style={{ background: '#f5f5f5', borderRadius: 8, height: 60, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 9 }}>[ Featured Image ]</div>
        {E('newsletter.hero.headline', nl.hero?.headline || 'Lead headline goes here', {
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: '#111', marginBottom: 5, display: 'block',
        }, { tag: 'div' })}
        {E('newsletter.hero.body', nl.hero?.body || 'Lede paragraph that opens the issue.', {
          fontSize: 9, lineHeight: 1.7, color: '#555', marginBottom: 16, display: 'block',
        }, { tag: 'div', multiline: true })}
        {stories.length > 0 && (
          <>
            <div style={{ height: 1, background: '#eee', marginBottom: 14 }}></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {stories.map((s, i) => (
                <div key={i} style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 8 }}>
                  {E(`newsletter.stories.${i}.headline`, s.headline, {
                    fontWeight: 700, fontSize: 9.5, color: '#111', marginBottom: 3, display: 'block',
                  }, { tag: 'div' })}
                  {E(`newsletter.stories.${i}.summary`, s.summary, {
                    fontSize: 8.5, color: '#777', lineHeight: 1.6, display: 'block',
                  }, { tag: 'div', multiline: true })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
