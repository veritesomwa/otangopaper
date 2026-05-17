/** Standard frame around every step's content. */
export function StepContainer({ emoji, title, subtitle, children }) {
  return (
    <div className="fade-up" style={{ animation: 'fadeUp 0.32s cubic-bezier(0.4,0,0.2,1) both' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 38, marginBottom: 8 }}>{emoji}</div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24,
          color: 'var(--fg-primary)', marginBottom: 6, letterSpacing: '-0.01em',
        }}>{title}</div>
        <div style={{
          fontSize: 13, color: 'var(--fg-secondary)', maxWidth: 460,
          margin: '0 auto', lineHeight: 1.6,
        }}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
