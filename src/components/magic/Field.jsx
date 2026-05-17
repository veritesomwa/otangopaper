/** Reusable labelled <input> + optional <textarea> used by every wizard step. */
export function Field({ label, value, onChange, placeholder = '', type = 'text', textarea, rows = 4 }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--fg-tertiary)',
        marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.8px',
      }}>{label}</label>
      <Tag
        type={textarea ? undefined : type}
        rows={textarea ? rows : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
        onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
        style={{
          width: '100%', background: 'var(--bg-elevated)',
          border: '1px solid var(--border)', borderRadius: 10,
          padding: '11px 14px', color: 'var(--fg-primary)',
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          outline: 'none', transition: 'border-color 150ms',
          lineHeight: textarea ? 1.6 : undefined,
          resize: textarea ? 'vertical' : undefined,
        }}
      />
    </div>
  );
}
