import { Icon } from '@components/common/Icon.jsx';
import { useTheme }    from '@hooks/useTheme.js';
import { useToast }    from '@hooks/useToast.js';
import { useStarred }  from '@hooks/useStarred.js';
import { useLocalStorage } from '@hooks/useLocalStorage.js';

/** Workspace-level settings. */
export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const { push: pushToast }  = useToast();
  const { ids: starred }     = useStarred();
  const [autosave, setAutosave]  = useLocalStorage('otango.settings.autosave', true);
  const [_onb, setOnb]           = useLocalStorage('otango.onboarding.shown', false);

  const clearStorage = () => {
    if (!confirm('Clear all locally stored Otango data? This signs you out and removes starred templates.')) return;
    Object.keys(localStorage).filter((k) => k.startsWith('otango.')).forEach((k) => localStorage.removeItem(k));
    pushToast('Local data cleared. Reloading…', { type: 'success' });
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
      <div style={{ padding: '32px 40px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
          color: 'var(--fg-primary)',
        }}>
          <Icon name="sliders" size={20} /> Settings
        </div>

        <Card title="Appearance">
          <Row label="Color mode" sub="Switch between dark and light themes.">
            <div style={{ display: 'flex', gap: 6 }}>
              {['dark', 'light'].map((m) => (
                <button key={m} onClick={() => setTheme(m)} style={{
                  padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                  border: '1.5px solid', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  background:  theme === m ? 'rgba(23, 86, 200,0.16)' : 'transparent',
                  borderColor: theme === m ? '#1756C8' : 'var(--border)',
                  color:       theme === m ? '#5C90FF' : 'var(--fg-secondary)',
                }}>
                  {m === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
              ))}
            </div>
          </Row>
        </Card>

        <Card title="Editor">
          <Row label="Autosave" sub="Quietly snapshot changes every few seconds for undo/redo.">
            <Toggle on={autosave} onClick={() => setAutosave((v) => !v)} />
          </Row>
          <Row label="Show onboarding next launch"
               sub="Re-runs the welcome modal next time you open Otango.">
            <button onClick={() => { setOnb(true); pushToast('Onboarding will show on next launch.'); }} style={chipStyle()}>
              Re-enable
            </button>
          </Row>
        </Card>

        <Card title="Data">
          <Row label={`Starred templates · ${starred.length}`} sub="Stored locally on this device.">
            <button onClick={clearStorage} style={chipStyle({ danger: true })}>
              Clear local data
            </button>
          </Row>
        </Card>

        <Card title="About">
          <div style={{ fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.7 }}>
            <div><strong style={{ color: 'var(--fg-primary)' }}>Otango</strong> v0.1.0</div>
            <div>Built with React + Vite. Backend not connected — all data is local.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '20px 24px', marginBottom: 16,
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14,
        color: 'var(--fg-primary)', marginBottom: 14,
      }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, sub, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 44, height: 24, borderRadius: 999, cursor: 'pointer', position: 'relative',
      background: on ? 'linear-gradient(135deg,#1756C8,#00C8D4)' : 'var(--bg-elevated)',
      border: '1px solid var(--border)', transition: 'background 200ms', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 22 : 3, width: 16, height: 16,
        borderRadius: '50%', background: '#fff', transition: 'left 200ms',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

function chipStyle({ danger } = {}) {
  return {
    background: danger ? 'rgba(239,68,68,0.12)' : 'transparent',
    border:    `1.5px solid ${danger ? 'rgba(239,68,68,0.35)' : 'var(--border)'}`,
    borderRadius: 999, padding: '6px 14px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
    color: danger ? '#EF4444' : 'var(--fg-secondary)', cursor: 'pointer',
  };
}
