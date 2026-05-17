import { useIsMobile } from '@hooks/useMediaQuery.js';

/** Lightweight headline stats row above the recent designs grid.
 *  Desktop: 3 stat cards + an Upgrade-to-Pro card on a single row.
 *  Mobile:  stats wrap to a 2-up grid, Upgrade card spans the full width
 *           on its own line so the headline can wrap instead of overflowing. */
export function StatsBar() {
  const isMobile = useIsMobile();

  const stats = [
    { label: 'Templates',  value: '17+' },
    { label: 'My Designs', value: '4'  },
    { label: 'Exports',    value: '12' },
  ];

  // On mobile a stat card takes (50% − gap/2). On desktop they share equally.
  const statBasis  = isMobile ? 'calc(50% - 8px)' : '0';
  const upgradeBasis = isMobile ? '100%' : '0';

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32,
      maxWidth: '100%',
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12,
          padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 2,
          flex: `1 1 ${statBasis}`,
          minWidth: 120,
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
            background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{s.value}</span>
          <span style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>{s.label}</span>
        </div>
      ))}

      <div style={{
        background: 'linear-gradient(135deg, rgba(23, 86, 200,0.15), rgba(0, 200, 212,0.08))',
        border: '1px solid rgba(23, 86, 200,0.22)', borderRadius: 12,
        padding: '14px 20px',
        flex: `1 1 ${upgradeBasis}`,
        // Desktop took flex: 2 so it was twice as wide as a stat. Keep that
        // proportion on desktop, then go full-width on mobile.
        flexGrow: isMobile ? 1 : 2,
        display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center',
        minWidth: 0,  // allow the headline to wrap
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>
          ✨ Upgrade to Pro
        </div>
        <div style={{
          fontSize: 11, color: 'var(--fg-tertiary)', lineHeight: 1.5,
          // Wrap aggressively so "17+ templates" doesn't push the card wider.
          overflowWrap: 'anywhere', wordBreak: 'break-word',
        }}>
          Unlock all 17+ templates + unlimited PDF exports
        </div>
        <button style={{
          background: 'linear-gradient(135deg,#1756C8,#00C8D4)', border: 'none', borderRadius: 999,
          padding: '5px 14px', fontSize: 11, fontWeight: 600, color: '#fff', cursor: 'pointer',
          width: 'fit-content', marginTop: 2, fontFamily: "'DM Sans', sans-serif",
        }}>Try Pro free →</button>
      </div>
    </div>
  );
}
