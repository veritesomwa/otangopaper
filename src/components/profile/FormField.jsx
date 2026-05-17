/** Labelled text input used in the profile/security forms. */
export function FormField({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--fg-tertiary)',
        marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.8px',
      }}>{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
        onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
        style={{
          width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '10px 14px', color: 'var(--fg-primary)',
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none',
          transition: 'border-color 150ms',
        }}
      />
    </div>
  );
}
