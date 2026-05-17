import { useRef, useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { useDocument } from '@hooks/useDocument.js';
import { useToast }    from '@hooks/useToast.js';
import { useIsMobile } from '@hooks/useMediaQuery.js';
import { exportShareLink } from '@services/exportService.js';
import { ToolBtn, VDivider } from './ToolBtn.jsx';
import { ZoomControls }      from './ZoomControls.jsx';

/** Apply an inline-format command to the current text selection. */
function applyFormat(cmd, value = null) {
  // execCommand is technically deprecated but still the only universally
  // supported way to format text inside contenteditable. Replace with the
  // selection / Range APIs if you need to drop it. Most calls require a
  // contentEditable element to be focused first — toolbar buttons should
  // call e.preventDefault() on mousedown so the active selection persists.
  if (typeof document.execCommand === 'function') {
    document.execCommand(cmd, false, value);
  }
}

/** The horizontal toolbar at the top of the editor screen. */
export function EditorToolbar({ zoom, setZoom, onFitZoom, onBack, onExport }) {
  const { docName, setDocName, saved, undo, redo, canUndo, canRedo } = useDocument();
  const { push: pushToast } = useToast();
  const [editingName, setEditingName] = useState(false);
  const nameRef = useRef(null);

  const handleShare = async () => {
    try {
      const link = await exportShareLink(docName);
      pushToast(`Share link copied: ${link}`, { type: 'success' });
    } catch (e) {
      pushToast(e.message || 'Could not create share link', { type: 'error' });
    }
  };

  const handleAlign = (dir) => () => applyFormat(
    dir === 'left'    ? 'justifyLeft'   :
    dir === 'center'  ? 'justifyCenter' :
    dir === 'right'   ? 'justifyRight'  :
    dir === 'justify' ? 'justifyFull'   :
                        'justifyLeft'
  );

  // Apply a text colour via execCommand to the active selection. The picker's
  // mousedown is suppressed by the surrounding label so contentEditable
  // doesn't lose its selection before the colour change lands.
  const handleColor = (e) => applyFormat('foreColor', e.target.value);

  const isMobile = useIsMobile();

  // ── Mobile top bar — only the items the user explicitly asked to keep up
  //    top: back, doc name, save indicator, undo/redo, share, export. All
  //    formatting tools live in the new bottom bar (see EditorBottomBar).
  if (isMobile) {
    return (
      <div style={{
        height: 50, background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4, flexShrink: 0, zIndex: 5,
      }}>
        <ToolBtn icon={<Icon name="back" />} label="Back to home" onClick={onBack} />

        {editingName ? (
          <input
            ref={nameRef} defaultValue={docName} autoFocus
            onBlur={(e) => { setDocName(e.target.value || 'My Document'); setEditingName(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur(); }}
            style={{
              background: 'var(--bg-elevated)', border: '1px solid #1756C8', borderRadius: 6,
              padding: '4px 8px', fontSize: 12, fontWeight: 500, color: 'var(--fg-primary)',
              fontFamily: "'DM Sans', sans-serif", outline: 'none',
              flex: 1, minWidth: 0,
            }}
          />
        ) : (
          <span
            onClick={() => setEditingName(true)}
            style={{
              flex: 1, minWidth: 0,
              fontSize: 12, fontWeight: 500, color: 'var(--fg-primary)',
              cursor: 'text', padding: '4px 6px', borderRadius: 6,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >{docName}</span>
        )}

        <span title={saved ? 'Saved' : 'Saving…'} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: saved ? '#22C55E' : '#F59E0B',
          flexShrink: 0, marginRight: 2,
        }} />

        <ToolBtn icon={<Icon name="undo" style={{ opacity: canUndo ? 1 : 0.35 }} />}
          label="Undo" onClick={canUndo ? undo : undefined} />
        <ToolBtn icon={<Icon name="redo" style={{ opacity: canRedo ? 1 : 0.35 }} />}
          label="Redo" onClick={canRedo ? redo : undefined} />

        <ToolBtn icon={<Icon name="share" />} label="Share" onClick={handleShare} />

        <button onClick={onExport} style={{
          background: 'linear-gradient(135deg,#1756C8,#00C8D4)', border: 'none', color: '#fff',
          borderRadius: 999, padding: '7px 12px', fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          boxShadow: '0 3px 12px rgba(23, 86, 200,0.35)',
        }}>
          <Icon name="download" /> Export
        </button>
      </div>
    );
  }

  return (
    <div style={{
      height: 50, background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6, flexShrink: 0, zIndex: 5,
    }}>
      <ToolBtn icon={<Icon name="back" />} label="Back to home" onClick={onBack} />
      <VDivider />

      {editingName ? (
        <input
          ref={nameRef} defaultValue={docName} autoFocus
          onBlur={(e) => { setDocName(e.target.value || 'My Document'); setEditingName(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur(); }}
          style={{
            background: 'var(--bg-elevated)', border: '1px solid #1756C8', borderRadius: 6,
            padding: '4px 9px', fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)',
            fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 180,
          }}
        />
      ) : (
        <span
          onClick={() => setEditingName(true)}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          style={{
            fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)',
            cursor: 'text', padding: '4px 6px', borderRadius: 6,
            transition: 'background 150ms',
            maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >{docName}</span>
      )}

      <span style={{
        fontSize: 11, color: saved ? 'var(--fg-tertiary)' : '#F59E0B',
        marginLeft: 2, transition: 'color 300ms',
      }}>
        · {saved ? 'Saved' : 'Saving…'}
      </span>

      <VDivider />
      <ToolBtn icon={<Icon name="undo" style={{ opacity: canUndo ? 1 : 0.35 }} />}
        label="Undo (⌘Z)"   onClick={canUndo ? undo : undefined} />
      <ToolBtn icon={<Icon name="redo" style={{ opacity: canRedo ? 1 : 0.35 }} />}
        label="Redo (⌘⇧Z)"  onClick={canRedo ? redo : undefined} />
      <VDivider />
      <div onMouseDown={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ToolBtn icon={<Icon name="bold" />}      label="Bold (⌘B)"      onClick={() => applyFormat('bold')} />
        <ToolBtn icon={<Icon name="italic" />}    label="Italic (⌘I)"    onClick={() => applyFormat('italic')} />
        <ToolBtn icon={<Icon name="underline" />} label="Underline (⌘U)" onClick={() => applyFormat('underline')} />
      </div>
      <VDivider />
      <div onMouseDown={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ToolBtn icon={<Icon name="alignL" />} label="Align left"    onClick={handleAlign('left')} />
        <ToolBtn icon={<Icon name="alignC" />} label="Align center"  onClick={handleAlign('center')} />
        <ToolBtn icon={<Icon name="alignR" />} label="Align right"   onClick={handleAlign('right')} />
        <ToolBtn icon={<Icon name="alignJ" />} label="Justify"       onClick={handleAlign('justify')} />
      </div>
      <VDivider />
      {/* Text colour — labelled icon over a hidden colour input, opens the
          system colour picker. mousedown blocks the editor from losing
          selection while the picker mounts. */}
      <label
        title="Text colour"
        onMouseDown={(e) => e.preventDefault()}
        style={{
          width: 36, height: 36, borderRadius: 10, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--fg-secondary)', position: 'relative',
        }}
      >
        <Icon name="textColor" />
        <input
          type="color"
          onChange={handleColor}
          style={{
            position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer',
          }}
        />
      </label>
      <VDivider />
      <ZoomControls zoom={zoom} setZoom={setZoom} onFit={onFitZoom} />
      <VDivider />
      <ToolBtn icon={<Icon name="eye" />} label="Preview"
        onClick={() => pushToast('Preview is the canvas you see — try Export → PDF for a print-ready view.', { type: 'info' })} />

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={handleShare} style={{
          background: 'transparent', border: '1.5px solid var(--border-strong)', color: 'var(--fg-primary)',
          borderRadius: 999, padding: '7px 16px', fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, transition: 'all 150ms',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Icon name="share" /> Share
        </button>
        <button onClick={onExport} style={{
          background: 'linear-gradient(135deg,#1756C8,#00C8D4)', border: 'none', color: '#fff',
          borderRadius: 999, padding: '7px 18px', fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 3px 12px rgba(23, 86, 200,0.35)', transition: 'all 150ms',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Icon name="download" /> Export
        </button>
      </div>
    </div>
  );
}
