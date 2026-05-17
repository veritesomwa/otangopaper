// A tiny ToolBtn-shaped trigger that pops a row of tool buttons below it.
// Used on the mobile bottom toolbar to fold related controls (Format, Align)
// into a single tap target.

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';

export function DropdownButton({ icon, label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      // Prevent the toolbar from stealing the contentEditable selection.
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={label}
        style={{
          height: 36, padding: '0 8px', borderRadius: 10,
          background: open ? 'rgba(23,86,200,0.18)' : 'transparent',
          color: open ? '#5C90FF' : 'var(--fg-secondary)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        {icon}
        <Icon name="chevronR" size={10} strokeWidth={2.2} style={{ transform: 'rotate(90deg)' }} />
      </button>

      {open && (
        <div
          // Pops UP from the bottom toolbar
          style={{
            position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
            display: 'flex', alignItems: 'center', gap: 2,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)', borderRadius: 12,
            padding: 4, boxShadow: '0 18px 48px rgba(0,0,0,0.3)',
            animation: 'scaleIn 0.16s cubic-bezier(0.34,1.15,0.64,1)',
            transformOrigin: 'bottom left', zIndex: 200,
            whiteSpace: 'nowrap',
          }}
        >
          {/* Wrapping the children in onClick={()=>setOpen(false)} would steal
              child handlers; instead, let each child run, then close on the
              next document mousedown handled by the effect above. */}
          {children}
        </div>
      )}
    </div>
  );
}
