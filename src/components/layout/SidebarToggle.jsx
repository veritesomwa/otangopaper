// The hamburger that shows / hides the left sidebar. Lives inside the page
// content (NOT the topbar) so we leave room in the topbar for a separate
// nav-hamburger later. On desktop it collapses the inline sidebar; on mobile
// it opens the drawer.

import { Icon } from '@components/common/Icon.jsx';

export function SidebarToggle({ open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={open ? 'Hide sidebar' : 'Show sidebar'}
      style={{
        // Sits in the top-left of the page content, just below the topbar.
        // Sticky so it stays in view when the user scrolls long pages.
        position: 'sticky', top: 0, alignSelf: 'flex-start',
        marginLeft: 12, marginTop: 10, zIndex: 50,
        width: 36, height: 36, borderRadius: 10,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--fg-secondary)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#1756C814';
        e.currentTarget.style.borderColor = 'rgba(23,86,200,0.4)';
        e.currentTarget.style.color = '#5C90FF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-elevated)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.color = 'var(--fg-secondary)';
      }}
    >
      <Icon name={open ? 'close' : 'menu'} />
    </button>
  );
}
