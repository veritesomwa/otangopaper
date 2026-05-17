/** Back / Skip / Next button row at the bottom of every wizard step. */
export function MagicStepNav({
  isFirst, isLast, canSkip,
  onBack, onSkip, onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
}) {
  return (
    <div style={{
      display: 'flex', gap: 10, marginTop: 28, justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <button onClick={onBack} disabled={isFirst} style={{
        background: 'transparent', border: '1.5px solid var(--border)',
        borderRadius: 999, padding: '11px 22px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: isFirst ? 'var(--fg-disabled)' : 'var(--fg-secondary)',
        cursor: isFirst ? 'default' : 'pointer',
        opacity: isFirst ? 0.5 : 1,
      }}>← Back</button>

      <div style={{ display: 'flex', gap: 10 }}>
        {canSkip && !isLast && (
          <button onClick={onSkip} style={{
            background: 'transparent', border: 'none',
            borderRadius: 999, padding: '11px 18px',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: 'var(--fg-tertiary)', cursor: 'pointer',
          }}>Skip</button>
        )}

        <button onClick={onNext} disabled={nextDisabled} style={{
          background: nextDisabled
            ? 'var(--bg-elevated)'
            : 'linear-gradient(135deg,#1756C8,#00C8D4)',
          color: nextDisabled ? 'var(--fg-disabled)' : '#fff',
          border: 'none', borderRadius: 999, padding: '11px 28px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
          cursor: nextDisabled ? 'default' : 'pointer',
          boxShadow: nextDisabled ? 'none' : '0 4px 14px rgba(23, 86, 200,0.35)',
          transition: 'all 200ms',
        }}>{nextLabel} →</button>
      </div>
    </div>
  );
}
