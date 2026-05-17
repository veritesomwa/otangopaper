import { useEffect, useRef, useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { Logo, Wordmark } from '@components/common/Logo.jsx';
import { useTheme } from '@hooks/useTheme.js';
import { useAuth }  from '@hooks/useAuth.js';
import { useToast } from '@hooks/useToast.js';
import { NotificationsDropdown } from './NotificationsDropdown.jsx';

/**
 * Global header.
 *
 * Right-side cluster:
 *   - Always: theme toggle, notifications
 *   - Always (outside the editor): "Create" CTA
 *   - When SIGNED IN:  user avatar with a small dropdown (sign out)
 *   - When SIGNED OUT: "Sign in" button (opens the LoginModal via onSignInClick)
 */
export function Topbar({
  searchVal, onSearch, isEditor, onNewDesign, onGoHome, onSignInClick,
}) {
  const { theme, toggleTheme }    = useTheme();
  const { user, isAuthenticated } = useAuth();

  return (
    <div style={{
      height: 56, background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 18px', gap: 14, flexShrink: 0, zIndex: 100,
    }}>
      {/* Logo — clickable, returns to Home */}
      <button
        type="button"
        onClick={onGoHome}
        title="Go to Home"
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        style={{
          display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0,
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '4px 6px', borderRadius: 10, transition: 'opacity 150ms',
          fontFamily: 'inherit',
        }}
      >
        <Logo size={32} />
        <Wordmark />
      </button>

      {!isEditor && (
        <div style={{ flex: 1, maxWidth: 380, position: 'relative', marginLeft: 8 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--fg-tertiary)', pointerEvents: 'none', display: 'flex',
          }}>
            <Icon name="search" />
          </span>
          <input
            value={searchVal}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Search templates, designs…"
            style={{
              width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 999, padding: '8px 16px 8px 38px', color: 'var(--fg-primary)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <IconButton title="Toggle theme" onClick={toggleTheme}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </IconButton>

        <NotificationsDropdown />

        {!isEditor && (
          <button onClick={onNewDesign} style={{
            background: 'linear-gradient(135deg,#1756C8,#00C8D4)', color: '#fff', border: 'none',
            borderRadius: 999, padding: '8px 18px', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(23, 86, 200,0.38)',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 150ms',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Icon name="plus" /> Create
          </button>
        )}

        {isAuthenticated
          ? <UserMenu user={user} />
          : <SignInButton onClick={onSignInClick} />}
      </div>
    </div>
  );
}

/* ── Sign-in button (visible when signed-out) ─────────────────────────── */

function SignInButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Sign in"
      style={{
        background: 'transparent', border: '1.5px solid var(--border-strong)',
        color: 'var(--fg-primary)', borderRadius: 999, padding: '7px 16px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 150ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'rgba(23, 86, 200,0.45)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent';        e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
    >
      <Icon name="user" size={14} /> Sign in
    </button>
  );
}

/* ── User dropdown (visible when signed-in) ───────────────────────────── */

function UserMenu({ user }) {
  const { logout }          = useAuth();
  const { push: pushToast } = useToast();
  const [open, setOpen]     = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const initials = (user?.name ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2) : 'U').toUpperCase();

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await logout();
      pushToast('Signed out', { type: 'success' });
    } catch (e) {
      pushToast(e.message || 'Sign out failed', { type: 'error' });
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {user?.picture ? (
        <button
          onClick={() => setOpen((v) => !v)}
          title={user?.name || 'Account'}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            border: open ? '2px solid #1756C8' : '2px solid transparent',
            padding: 0, cursor: 'pointer',
            background: 'transparent',
            overflow: 'hidden',
          }}
        >
          <img src={user.picture} alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          }} />
        </button>
      ) : (
        <button
          onClick={() => setOpen((v) => !v)}
          title={user?.name || 'Account'}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#0C2A5C,#00A8B4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', flexShrink: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            border: open ? '2px solid #1756C8' : 'none',
          }}
        >
          {initials}
        </button>
      )}

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 240, background: 'var(--bg-surface)',
          border: '1px solid var(--border)', borderRadius: 12,
          boxShadow: '0 24px 56px rgba(0,0,0,0.35)',
          animation: 'scaleIn 0.18s cubic-bezier(0.34,1.2,0.64,1)',
          transformOrigin: 'top right', zIndex: 200,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--fg-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{user?.name || 'You'}</div>
            <div style={{
              fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{user?.email || ''}</div>
            {user?.isAdmin && (
              <span style={{
                display: 'inline-block', marginTop: 6,
                background: 'linear-gradient(135deg,#1756C8,#00C8D4)', color: '#fff',
                fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                letterSpacing: 0.5,
              }}>ADMIN</span>
            )}
          </div>
          <button onClick={handleSignOut} style={{
            display: 'flex', width: '100%', padding: '10px 16px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--fg-secondary)', fontFamily: "'DM Sans', sans-serif",
            fontSize: 12.5, textAlign: 'left',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >Sign out</button>
        </div>
      )}
    </div>
  );
}

/* ── Small icon button used by theme toggle ───────────────────────────── */

function IconButton({ children, title, onClick }) {
  return (
    <button title={title} onClick={onClick} style={{
      width: 34, height: 34, borderRadius: 8, background: 'transparent', border: 'none',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--fg-secondary)', transition: 'all 150ms',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent';        e.currentTarget.style.color = 'var(--fg-secondary)'; }}
    >
      {children}
    </button>
  );
}
