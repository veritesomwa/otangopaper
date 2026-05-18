import { useToast } from '@hooks/useToast.js';
import { useIsMobile } from '@hooks/useMediaQuery.js';

/** Plan comparison + storage gauge. */
export function AccountTab() {
  const { push: pushToast } = useToast();
  const isMobile = useIsMobile();
  const handleUpgrade = () =>
    pushToast('Pro checkout coming soon — your wishlist has been noted.', { type: 'info' });
  const freeFeatures = ['6 templates', '3 PDF exports/month', 'Otango watermark', 'Community support'];
  const proFeatures  = [
    '17+ premium templates', 'Unlimited PDF exports', 'No watermarks',
    'Priority support', 'AI content fill', 'Custom branding',
  ];

  return (
    <div className="fade-up">
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 14 : 18, marginBottom: 20,
      }}>
        {/* Free */}
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 16, padding: 24,
          border: '1px solid var(--border)',
        }}>
          <PlanHeader title="Free" sub="Your current plan" badge="Current"
            badgeStyle={{ background: 'rgba(23, 86, 200,0.12)', color: '#5C90FF' }}
          />
          {freeFeatures.map((f) => <Bullet key={f} color="#22C55E">{f}</Bullet>)}
          <Price value="$0" />
        </div>

        {/* Pro */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(23, 86, 200,0.14),rgba(0, 200, 212,0.08))',
          borderRadius: 16, padding: 24,
          border: '1.5px solid rgba(23, 86, 200,0.35)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -20, width: 100, height: 100,
            borderRadius: '50%', background: 'rgba(23, 86, 200,0.08)',
          }} />
          <PlanHeader title="Pro" sub="Everything you need" badge="Popular"
            badgeStyle={{ background: 'linear-gradient(135deg,#1756C8,#00C8D4)', color: '#fff' }}
          />
          {proFeatures.map((f) => <Bullet key={f} gradient>{f}</Bullet>)}
          <Price value="$12" gradient />
          <button onClick={handleUpgrade} style={{
            marginTop: 14, width: '100%',
            background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
            border: 'none', borderRadius: 999, padding: 11,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
            color: '#fff', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(23, 86, 200,0.35)',
          }}>Start 14-day free trial →</button>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)', borderRadius: 16, padding: 24,
        border: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15,
          color: 'var(--fg-primary)', marginBottom: 16,
        }}>Storage usage</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', fontSize: 12,
          color: 'var(--fg-secondary)', marginBottom: 8,
        }}>
          <span>4.2 MB used</span>
          <span style={{ color: 'var(--fg-tertiary)' }}>50 MB limit</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: '8.4%', borderRadius: 999,
            background: 'linear-gradient(90deg,#1756C8,#00C8D4)',
          }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--fg-tertiary)' }}>
          8.4% of 50 MB used — upgrade for unlimited storage
        </div>
      </div>
    </div>
  );
}

function PlanHeader({ title, sub, badge, badgeStyle }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17,
          color: 'var(--fg-primary)',
        }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginTop: 3 }}>{sub}</div>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
        ...badgeStyle,
      }}>{badge}</span>
    </div>
  );
}

function Bullet({ color, gradient, children }) {
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8,
      fontSize: 12, color: 'var(--fg-secondary)',
    }}>
      <span style={gradient ? {
        background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      } : { color }}>✓</span>
      {children}
    </div>
  );
}

function Price({ value, gradient }) {
  return (
    <div style={{
      marginTop: 16, fontSize: 24,
      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
      color: gradient ? undefined : 'var(--fg-primary)',
    }}>
      <span style={gradient ? {
        background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      } : undefined}>{value}</span>
      <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--fg-tertiary)' }}>/mo</span>
    </div>
  );
}
