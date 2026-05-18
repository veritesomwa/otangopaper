// Left navigation rail. Two modes:
//   • Desktop ( >= 900px ) → inline column that takes up its 220px slot
//   • Mobile  ( <  900px ) → fixed drawer that slides in from the left over
//     a translucent backdrop. The hamburger button in the topbar toggles it.

import { useEffect } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { useIsMobile } from '@hooks/useMediaQuery.js';
import { NavItem } from './NavItem.jsx';

const WIDTH = 220;

export function Sidebar({ activeNav, setNav, onNewDesign, open = true, onClose }) {
  const isMobile = useIsMobile();

  // Profile is reached from the avatar dropdown in the topbar — not here.
  const navItems = [
    { id: 'home',      label: 'Home',        icon: <Icon name="home" /> },
    { id: 'magic',     label: 'Magic Tool',  icon: <Icon name="sparkle" />, badge: 'NEW' },
    { id: 'templates', label: 'Templates',   icon: <Icon name="grid" />, badge: '24' },
    { id: 'designs',   label: 'My designs',  icon: <Icon name="file" />, badge: '4'  },
    { id: 'starred',   label: 'Starred',     icon: <Icon name="star" /> },
  ];

  // Esc closes the drawer on mobile
  useEffect(() => {
    if (!isMobile || !open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobile, open, onClose]);

  // Lock background scroll while the drawer is open
  useEffect(() => {
    if (!isMobile || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isMobile, open]);

  // Tapping a nav item closes the drawer on mobile.
  const handleNav = (id) => {
    setNav(id);
    if (isMobile) onClose?.();
  };
  const handleNewDesign = () => {
    onNewDesign?.();
    if (isMobile) onClose?.();
  };

  // On desktop, when sidebar is hidden, render nothing — the canvas reclaims
  // the space cleanly. On mobile, we always mount the drawer so the slide
  // transition can animate; visibility is driven by `open`.
  if (!isMobile && !open) return null;

  const panel = (
    <div style={{
      width: WIDTH, background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '14px 10px', gap: 2,
      flexShrink: 0, overflowY: 'auto',
      ...(isMobile ? {
        position: 'fixed', top: 0, left: 0, height: '100dvh',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0.27, 1)',
        boxShadow: open ? '0 18px 48px rgba(0,0,0,0.32)' : 'none',
        zIndex: 110,
      } : {
        transition: 'background 250ms',
      }),
    }}>
      {/* Close button only inside the mobile drawer */}
      {isMobile && (
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--fg-secondary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Icon name="close" />
        </button>
      )}

      {navItems.map((n) => (
        <NavItem
          key={n.id} icon={n.icon} label={n.label} badge={n.badge}
          active={activeNav === n.id} onClick={() => handleNav(n.id)}
        />
      ))}

      <div style={{ height: 1, background: 'var(--border)', margin: '10px 2px' }} />

      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
        color: 'var(--fg-tertiary)', padding: '4px 12px 6px',
      }}>
        Workspace
      </div>

      <NavItem icon={<Icon name="plus" />}    label="New design"
        active={false} onClick={handleNewDesign} />
      <NavItem icon={<Icon name="sliders" />} label="Settings"
        active={activeNav === 'settings'} onClick={() => handleNav('settings')} />

      {/* Pro upsell */}
      <div style={{ marginTop: 'auto', paddingTop: 12 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(23, 86, 200,0.14), rgba(0, 200, 212,0.08))',
          border: '1px solid rgba(23, 86, 200,0.25)', borderRadius: 14, padding: '14px 12px',
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 12.5, fontWeight: 700,
            color: 'var(--fg-primary)', marginBottom: 4,
          }}>Upgrade to Pro</div>
          <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', lineHeight: 1.55, marginBottom: 12 }}>
            Unlock all templates, unlimited exports &amp; more.
          </div>
          <button style={{
            width: '100%', background: 'linear-gradient(135deg,#1756C8,#00C8D4)', border: 'none',
            borderRadius: 999, padding: '8px 0', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 12, color: '#fff', cursor: 'pointer',
          }}>Try Pro free →</button>
        </div>
      </div>
    </div>
  );

  // On desktop, just render the panel inline. On mobile, wrap it in a
  // backdrop + the drawer.
  if (!isMobile) return panel;

  return (
    <>
      {/* Translucent backdrop — tap to close */}
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 180ms',
          zIndex: 105,
        }}
      />
      {panel}
    </>
  );
}
