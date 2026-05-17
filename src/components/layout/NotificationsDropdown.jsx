import { useEffect, useRef, useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';

const SAMPLE_FEED = [
  { id: 1, icon: '✨', title: 'Magic Tool is live',  body: 'Generate a tailored resume in three minutes.', time: '2h' },
  { id: 2, icon: '📥', title: 'Export complete',     body: 'My Resume 2024 saved as PDF.',                 time: '1d' },
  { id: 3, icon: '⭐', title: 'New template',        body: 'Try Charcoal Dark for tech roles.',            time: '3d' },
  { id: 4, icon: '🔗', title: 'Share link viewed',    body: 'Your shared link was opened 4 times.',         time: '5d' },
];

/** Bell button + animated dropdown panel of notifications. */
export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const unread = SAMPLE_FEED.length;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button title="Notifications" onClick={() => setOpen((v) => !v)} style={{
        position: 'relative',
        width: 34, height: 34, borderRadius: 8, background: 'transparent', border: 'none',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: open ? 'var(--fg-primary)' : 'var(--fg-secondary)',
        transition: 'all 150ms',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = open ? 'var(--bg-elevated)' : 'transparent'; e.currentTarget.style.color = open ? 'var(--fg-primary)' : 'var(--fg-secondary)'; }}
      >
        <Icon name="bell" />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%',
            background: '#EF4444', border: '2px solid var(--bg-sidebar)',
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 320, background: 'var(--bg-surface)',
          border: '1px solid var(--border)', borderRadius: 12,
          boxShadow: '0 24px 56px rgba(0,0,0,0.35)',
          animation: 'scaleIn 0.18s cubic-bezier(0.34,1.2,0.64,1)',
          transformOrigin: 'top right', zIndex: 200,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13,
              color: 'var(--fg-primary)',
            }}>Notifications</span>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: '#5C90FF', fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
            }}>Mark all read</button>
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {SAMPLE_FEED.map((n) => (
              <div key={n.id} style={{
                display: 'flex', gap: 10, padding: '11px 14px',
                borderBottom: '1px solid var(--border)', cursor: 'pointer',
                transition: 'background 150ms',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 9, fontSize: 14,
                  background: 'rgba(23, 86, 200,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{n.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.5,
                    overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.body}</div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--fg-tertiary)', flexShrink: 0 }}>{n.time}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 14px', textAlign: 'center' }}>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#5C90FF', fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
            }}>See all notifications</button>
          </div>
        </div>
      )}
    </div>
  );
}
