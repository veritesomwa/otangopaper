/** Single line in the Activity tab. */
export function ActivityRow({ icon, title, sub, time }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: 'rgba(23, 86, 200,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>{sub}</div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', flexShrink: 0 }}>{time}</div>
    </div>
  );
}
