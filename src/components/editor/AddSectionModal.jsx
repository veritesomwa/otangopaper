const EXTRAS = [
  { id: 'awards',         label: 'Awards & Honors', icon: '🏆' },
  { id: 'publications',   label: 'Publications',    icon: '📚' },
  { id: 'volunteer',      label: 'Volunteering',    icon: '🤝' },
  { id: 'projects',       label: 'Projects',        icon: '💡' },
  { id: 'certifications', label: 'Certifications',  icon: '🎓' },
  { id: 'references',     label: 'References',      icon: '👥' },
];

/** Modal listing extra sections the user can append to their resume. */
export function AddSectionModal({ onAdd, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.18s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--bg-surface)', borderRadius: 20, padding: 28, width: 380,
        border: '1px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        animation: 'scaleIn 0.22s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18,
          color: 'var(--fg-primary)', marginBottom: 4,
        }}>Add a section</div>
        <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginBottom: 20 }}>
          Choose what to add to your document
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {EXTRAS.map((s) => (
            <button key={s.id}
              onClick={() => { onAdd(s); onClose(); }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1756C8'; e.currentTarget.style.background = 'rgba(23, 86, 200,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '11px 14px', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 9,
                fontFamily: "'DM Sans', sans-serif", transition: 'all 150ms',
              }}
            >
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-primary)' }}>{s.label}</span>
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{
          marginTop: 18, width: '100%', background: 'transparent', border: '1px solid var(--border)',
          borderRadius: 999, padding: 9, fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: 'var(--fg-secondary)', cursor: 'pointer',
        }}>Cancel</button>
      </div>
    </div>
  );
}
