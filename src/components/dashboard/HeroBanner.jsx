import { Icon } from '@components/common/Icon.jsx';
import { TemplateThumbnail } from '@components/canvas/TemplateThumbnail.jsx';
import { useTemplates } from '@hooks/useTemplates.js';

/** Big gradient promo banner at the top of the dashboard. */
export function HeroBanner({ onStart }) {
  const { templates } = useTemplates();

  return (
    <div className="fade-up" style={{
      background: 'linear-gradient(135deg, rgba(23, 86, 200,0.18) 0%, rgba(0, 200, 212,0.10) 100%)',
      border: '1px solid rgba(23, 86, 200,0.25)', borderRadius: 18,
      padding: '28px 32px 26px', marginBottom: 36,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{
            background: 'linear-gradient(135deg,#1756C8,#00C8D4)', borderRadius: 6,
            padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
          }}>NEW</span>
          <span style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>
            AI-powered templates now available
          </span>
        </div>

        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26,
          lineHeight: 1.25, marginBottom: 10,
        }}>
          <span style={{ color: 'var(--fg-primary)' }}>Create something </span>
          <span style={{
            background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>remarkable.</span>
        </div>

        <p style={{
          fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.65,
          maxWidth: 420, marginBottom: 20,
        }}>
          Professional resumes, cover letters, newsletters, college applications, and certificates — all in one place.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={onStart} style={{
            background: 'linear-gradient(135deg,#1756C8,#00C8D4)', color: '#fff', border: 'none',
            borderRadius: 999, padding: '10px 22px', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(23, 86, 200,0.38)',
            display: 'flex', alignItems: 'center', gap: 7, transition: 'all 150ms',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Icon name="plus" /> Start designing
          </button>

          <button style={{
            background: 'transparent', border: '1.5px solid var(--border-strong)', color: 'var(--fg-primary)',
            borderRadius: 999, padding: '10px 20px', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 150ms',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'rgba(23, 86, 200,0.45)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent';        e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          >
            <Icon name="sparkle" /> Explore templates
          </button>
        </div>
      </div>

      {/* Mini template preview stack */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-end' }}>
        {templates.slice(0, 3).map((t, i) => (
          <div key={t.id}
            onClick={onStart}
            style={{
              borderRadius: 8, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              transform: `translateY(${i === 1 ? -8 : 0}px) rotate(${i === 0 ? -3 : i === 2 ? 3 : 0}deg)`,
              transition: 'transform 300ms', cursor: 'pointer',
            }}
          >
            <TemplateThumbnail template={t} scale={0.14} />
          </div>
        ))}
      </div>
    </div>
  );
}
