import { Icon } from '@components/common/Icon.jsx';
import { TemplateThumbnail } from '@components/canvas/TemplateThumbnail.jsx';
import { useTemplates } from '@hooks/useTemplates.js';

/**
 * Slide-in panel listing all templates in the current category. Used when
 * the user clicks the Templates icon in the left tool strip.
 */
export function TemplateSwitcher({ currentTemplate, onSwitch, onClose }) {
  const { templates } = useTemplates();
  const sameCategory = templates.filter((t) => t.cat === currentTemplate.cat);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 56, bottom: 0, width: 220,
      background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
      zIndex: 10, display: 'flex', flexDirection: 'column',
      animation: 'slideIn 220ms cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{
        padding: '14px 14px 10px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13,
          color: 'var(--fg-primary)',
        }}>Templates</span>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-tertiary)', display: 'flex',
        }}>
          <Icon name="close" />
        </button>
      </div>

      <div style={{ overflowY: 'auto', padding: '10px', flex: 1 }}>
        <div style={{
          fontSize: 10, color: 'var(--fg-tertiary)', marginBottom: 8, letterSpacing: 0.5,
          textTransform: 'uppercase', fontWeight: 600,
        }}>{currentTemplate.cat}</div>

        {sameCategory.map((t) => {
          const active = t.id === currentTemplate.id;
          return (
            <div key={t.id}
              onClick={() => { onSwitch(t); onClose(); }}
              style={{
                borderRadius: 10, overflow: 'hidden', marginBottom: 10, cursor: 'pointer',
                border: active ? '2px solid #1756C8' : '1px solid var(--border)',
                transition: 'all 150ms',
                boxShadow: active ? '0 0 0 3px rgba(23, 86, 200,0.18)' : 'none',
              }}
            >
              <TemplateThumbnail template={t} scale={0.3} />
              <div style={{
                padding: '6px 10px', background: 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--fg-primary)' }}>{t.name}</span>
                {active && (
                  <span style={{ color: '#1756C8', display: 'flex' }}>
                    <Icon name="check" size={14} strokeWidth={2.5} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
