import { useEffect, useRef, useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';

const PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

const MIN = 0.1;
const MAX = 5;
const STEP = 0.1;
const FIT = 'fit';   // sentinel — picks a value that fills the canvas viewport

/**
 * Modern zoom widget for the editor toolbar.
 *
 *   ┌─[−]──[ 100% ▾ ]──[+]─┐
 *
 *   - Click − / + to step in/out (rounded to the next preset, then by STEP).
 *   - Click the % chip to type an exact value, or pick a preset from the dropdown.
 *   - Cmd/Ctrl +/-  → zoom in/out
 *   - Cmd/Ctrl 0    → reset to 100%
 *   - Cmd/Ctrl 1    → fit to viewport
 *   - Cmd/Ctrl + wheel inside the canvas → smooth zoom
 *
 * Uses inline state for the popover so it doesn't depend on Document context.
 */
export function ZoomControls({ zoom, setZoom, onFit }) {
  const [open, setOpen]         = useState(false);
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState('');
  const popoverRef              = useRef(null);

  const pct = Math.round(clamp(zoom, MIN, MAX) * 100);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!popoverRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const stepIn  = () => setZoom((z) => clamp(roundUp(z + 0.0001),   MIN, MAX));
  const stepOut = () => setZoom((z) => clamp(roundDown(z - 0.0001), MIN, MAX));

  const commitDraft = () => {
    const n = parseFloat(draft.replace('%', '').trim());
    if (Number.isFinite(n) && n > 0) setZoom(clamp(n / 100, MIN, MAX));
    setEditing(false);
  };

  return (
    <div ref={popoverRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
      <Btn icon="minus" title="Zoom out (⌘−)" onClick={stepOut} disabled={zoom <= MIN + 0.001} />

      {/* Zoom % display — click to edit, or open the dropdown */}
      <div style={{ position: 'relative' }}>
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { commitDraft(); }
              if (e.key === 'Escape') { setEditing(false); }
            }}
            style={{
              width: 64, height: 26, padding: '0 8px', border: '1px solid #1756C8',
              borderRadius: 8, background: 'var(--bg-elevated)', color: 'var(--fg-primary)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, outline: 'none',
              textAlign: 'center',
            }}
          />
        ) : (
          <button
            onClick={() => setOpen((v) => !v)}
            onDoubleClick={() => { setDraft(`${pct}%`); setEditing(true); }}
            title="Click to choose zoom · Double-click to type"
            style={{
              minWidth: 64, height: 26, padding: '0 10px',
              borderRadius: 8, border: '1px solid var(--border)',
              background: open ? 'rgba(23, 86, 200,0.16)' : 'var(--bg-elevated)',
              color: open ? '#5C90FF' : 'var(--fg-primary)',
              cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4,
              transition: 'all 150ms',
            }}
          >
            <span>{pct}%</span>
            <span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
          </button>
        )}

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 10, boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            zIndex: 200, padding: 6, minWidth: 160,
            animation: 'scaleIn 0.16s cubic-bezier(0.34,1.2,0.64,1)',
            transformOrigin: 'top',
          }}>
            <PopoverItem label="Fit to viewport" hint="⌘1"
              onClick={() => { setOpen(false); onFit?.(); }} />
            <PopoverItem label="Zoom to 100%"   hint="⌘0"
              onClick={() => { setOpen(false); setZoom(1); }} />
            <div style={{ height: 1, background: 'var(--border)', margin: '4px 2px' }} />
            {PRESETS.map((p) => (
              <PopoverItem key={p}
                label={`${Math.round(p * 100)}%`}
                onClick={() => { setOpen(false); setZoom(p); }}
                active={Math.abs(zoom - p) < 0.005}
              />
            ))}
          </div>
        )}
      </div>

      <Btn icon="plus" title="Zoom in (⌘+)" onClick={stepIn} disabled={zoom >= MAX - 0.001} />
    </div>
  );
}

function Btn({ icon, title, onClick, disabled }) {
  return (
    <button
      title={title} onClick={onClick} disabled={disabled}
      style={{
        width: 28, height: 28, borderRadius: 8, border: 'none',
        background: 'transparent', color: 'var(--fg-secondary)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms',
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent';        e.currentTarget.style.color = 'var(--fg-secondary)'; }}
    >
      <Icon name={icon} size={14} />
    </button>
  );
}

function PopoverItem({ label, hint, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', padding: '6px 10px', borderRadius: 6,
      border: 'none', cursor: 'pointer',
      background: active ? 'rgba(23, 86, 200,0.16)' : 'transparent',
      color: active ? '#5C90FF' : 'var(--fg-primary)',
      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
      textAlign: 'left',
    }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <span>{label}</span>
      {hint && <span style={{ fontSize: 10, opacity: 0.5 }}>{hint}</span>}
    </button>
  );
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function roundUp(n)   { return Math.round((n + STEP) * 100) / 100; }
function roundDown(n) { return Math.round((n - STEP) * 100) / 100; }

export const ZOOM_LIMITS = { MIN, MAX, STEP, FIT };
