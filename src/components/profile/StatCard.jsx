/** Small metric tile shown in a row across the top of the profile screen. */
export function StatCard({ value, label, icon, color }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 14,
      padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1,
    }}>
      <div style={{
        fontSize: 9.5, color: 'var(--fg-tertiary)',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span> {label}
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 28,
        background: `linear-gradient(135deg,${color || '#1756C8'},${color ? color + '99' : '#00C8D4'})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>{value}</div>
    </div>
  );
}
