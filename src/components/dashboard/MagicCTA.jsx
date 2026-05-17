import { useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';

const QUICK_PICKS = [
  { id: 'resume',      label: 'Resume',        emoji: '📄' },
  { id: 'card',        label: 'Card',          emoji: '💼' },
  { id: 'postcard',    label: 'Postcard',      emoji: '📮' },
  { id: 'letter',      label: 'Cover letter',  emoji: '✉️' },
  { id: 'newsletter',  label: 'Newsletter',    emoji: '📰' },
  { id: 'certificate', label: 'Certificate',   emoji: '🏆' },
  { id: 'banner',      label: 'Banner',        emoji: '🔷' },
  { id: 'portfolio',   label: 'Portfolio',     emoji: '🎨' },
];

/**
 * Dashboard banner that launches the Magic Tool.
 * When `onLaunch` is given a category id, the wizard skips the picker step.
 */
export function MagicCTA({ onLaunch }) {
  const [hover, setHover] = useState(false);

  return (
    <div className="fade-up" style={{
      background: 'linear-gradient(135deg, rgba(23, 86, 200,0.18), rgba(0, 200, 212,0.10))',
      border: '1px solid rgba(23, 86, 200,0.35)', borderRadius: 16,
      padding: '20px 24px', marginBottom: 26,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: 'linear-gradient(135deg,#FF7A1F,#00C8D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, color: '#fff',
          boxShadow: '0 6px 18px rgba(23, 86, 200,0.4)',
        }}>🪄</div>

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16,
              color: 'var(--fg-primary)',
            }}>Magic Tool</span>
            <span style={{
              background: 'linear-gradient(135deg,#FF7A1F,#00C8D4)', color: '#fff',
              fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999, letterSpacing: 0.5,
            }}>NEW</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            Pick a doc type below — answer a quick survey — get every matching template pre-filled with your info.
          </div>
        </div>

        <button
          onClick={() => onLaunch(null)}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          style={{
            background: 'linear-gradient(135deg,#FF7A1F,#00C8D4)', border: 'none',
            borderRadius: 999, padding: '10px 20px',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            color: '#fff', cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 4px 14px rgba(23, 86, 200,0.4)',
            display: 'flex', alignItems: 'center', gap: 6,
            transform: hover ? 'translateY(-1px)' : 'translateY(0)',
            transition: 'transform 150ms',
          }}
        >
          Open <Icon name="arrowR" size={12} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {QUICK_PICKS.map((q) => (
          <button
            key={q.id}
            onClick={() => onLaunch(q.id)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(23, 86, 200,0.6)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-secondary)'; }}
            style={{
              background: 'var(--bg-elevated)',
              border: '1.5px solid var(--border)', borderRadius: 999,
              padding: '7px 14px', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
              color: 'var(--fg-secondary)',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 150ms',
            }}
          >
            <span style={{ fontSize: 14 }}>{q.emoji}</span> {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
