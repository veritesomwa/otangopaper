// References — same density as Languages / Interests, but with a touch of
// typographic flair: each entry sits behind a thin accent rule, the name uses
// the heading font, and the title shows in italic. No card backgrounds.

import { EditableText } from '@components/common/EditableText.jsx';

export function ReferencesBlock({
  references = [],
  accent = '#1756C8',
  readOnly = false,
  onPatch,
  fontHeading,
  // Optional overrides so the block blends with dark sidebars.
  labelColor = null,   // section heading colour — defaults to accent
  textColor  = '#222', // primary line
  subColor   = '#888', // dim line (title + contact)
  // Kept for backward compat with earlier callers — ignored now.
  compact, bgChip, border,
}) {
  if (!references.length) return null;
  const E = (path, value, style, opts = {}) => (
    <EditableText
      value={value} readOnly={readOnly}
      onChange={(v) => onPatch?.(path, v)}
      tag={opts.tag || 'span'}
      style={style}
    />
  );
  const header = labelColor || accent;
  const heading = fontHeading || "'Space Grotesk', sans-serif";

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: heading,
        fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
        color: header, marginBottom: 8, borderBottom: `2px solid ${accent}`, paddingBottom: 3,
      }}>
        References
      </div>

      {references.map((r, ri) => (
        <div key={r.id || ri} style={{
          // Thin accent rule on the left — no fill, just the line.
          paddingLeft: 9,
          borderLeft: `2px solid ${accent}55`,
          marginBottom: 9,
        }}>
          {/* Row 1: name + title — matches the Languages flex layout */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', gap: 8, color: textColor,
          }}>
            {E(`references.${ri}.name`, r.name, {
              fontFamily: heading, fontWeight: 700, fontSize: 10,
            })}
            {r.title && E(`references.${ri}.title`, r.title, {
              fontStyle: 'italic', fontSize: 9, color: subColor, textAlign: 'right',
            })}
          </div>

          {/* Row 2: company on its own quiet line, if present */}
          {r.company && (
            <div style={{ fontSize: 8.5, color: accent, fontWeight: 500, marginTop: 1 }}>
              {E(`references.${ri}.company`, r.company, { display: 'inline' })}
            </div>
          )}

          {/* Row 3: contact line — in a quiet mono so it reads as metadata */}
          {(r.email || r.phone) && (
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8, color: subColor, marginTop: 2, letterSpacing: 0.2,
            }}>
              {r.email && E(`references.${ri}.email`, r.email, { display: 'inline' })}
              {r.email && r.phone && (
                <span style={{ margin: '0 5px', opacity: 0.5 }}>·</span>
              )}
              {r.phone && E(`references.${ri}.phone`, r.phone, { display: 'inline' })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
