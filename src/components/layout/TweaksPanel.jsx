import { useEffect, useState } from 'react';
import { useTheme } from '@hooks/useTheme.js';
import { useTemplates } from '@hooks/useTemplates.js';

/**
 * Floating dev panel for switching theme, opening templates, etc.
 * Opens when an "edit_mode" message is received from a parent frame.
 */
export function TweaksPanel({ showOnboarding, setShowOnboarding, onOpenTemplate }) {
  const { theme, setTheme } = useTheme();
  const { templates } = useTemplates();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div id="tweaks-panel" className={open ? 'open' : ''}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13,
          color: 'var(--fg-primary)',
        }}>Tweaks</span>
        <button
          onClick={() => { setOpen(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--fg-tertiary)', lineHeight: 1 }}
        >×</button>
      </div>

      <div>
        <div className="tw-label">Color mode</div>
        <div className="tw-row">
          {['dark', 'light'].map((m) => (
            <button key={m} className={`tw-chip ${theme === m ? 'on' : ''}`} onClick={() => setTheme(m)}>
              {m === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="tw-label">Skip onboarding</div>
        <div className="tw-row">
          <button className={`tw-chip ${!showOnboarding ? 'on' : ''}`} onClick={() => setShowOnboarding(false)}>Skip</button>
          <button className={`tw-chip ${showOnboarding ? 'on' : ''}`}  onClick={() => setShowOnboarding(true)}>Show</button>
        </div>
      </div>

      <div>
        <div className="tw-label">Open in editor</div>
        <div className="tw-row" style={{ flexDirection: 'column', gap: 5 }}>
          {templates.slice(0, 4).map((t) => (
            <button key={t.id} className="tw-chip"
              onClick={() => onOpenTemplate(t)}
              style={{ textAlign: 'left', borderRadius: 8, padding: '6px 10px' }}
            >
              {t.name} <span style={{ opacity: 0.5, fontSize: 10 }}>({t.cat})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
