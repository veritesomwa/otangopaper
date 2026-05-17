import { Icon } from '@components/common/Icon.jsx';
import { useAuth } from '@hooks/useAuth.js';
import { NavItem } from './NavItem.jsx';

/** Left navigation rail visible on home/dashboard/profile screens. */
export function Sidebar({ activeNav, setNav, onNewDesign }) {
  const { isAuthenticated } = useAuth();

  // Profile only appears for signed-in users — for everyone else there's
  // nothing meaningful behind it. Sign-out happens via the topbar avatar.
  const navItems = [
    { id: 'home',      label: 'Home',        icon: <Icon name="home" /> },
    { id: 'magic',     label: 'Magic Tool',  icon: <Icon name="sparkle" />, badge: 'NEW' },
    { id: 'templates', label: 'Templates',   icon: <Icon name="grid" />, badge: '24' },
    { id: 'designs',   label: 'My designs',  icon: <Icon name="file" />, badge: '4'  },
    { id: 'starred',   label: 'Starred',     icon: <Icon name="star" /> },
    isAuthenticated && { id: 'profile', label: 'Profile', icon: <Icon name="user" /> },
  ].filter(Boolean);

  return (
    <div style={{
      width: 220, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '14px 10px', gap: 2, flexShrink: 0,
      overflowY: 'auto', transition: 'background 250ms',
    }}>
      {navItems.map((n) => (
        <NavItem
          key={n.id} icon={n.icon} label={n.label} badge={n.badge}
          active={activeNav === n.id} onClick={() => setNav(n.id)}
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
        active={false} onClick={onNewDesign} />
      <NavItem icon={<Icon name="sliders" />} label="Settings"
        active={activeNav === 'settings'} onClick={() => setNav('settings')} />

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
}
