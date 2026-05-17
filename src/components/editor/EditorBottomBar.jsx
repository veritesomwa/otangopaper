// Mobile-only bottom bar — holds the formatting tools that don't fit in the
// slim mobile top bar. Each related cluster (Format, Align) collapses into
// a dropdown so even a 360 px viewport has room.

import { useToast } from '@hooks/useToast.js';
import { Icon } from '@components/common/Icon.jsx';
import { ToolBtn, VDivider } from './ToolBtn.jsx';
import { ZoomControls } from './ZoomControls.jsx';
import { DropdownButton } from './DropdownButton.jsx';

/** Re-implemented locally so we don't tangle imports — same shape as
 *  EditorToolbar.applyFormat. */
function applyFormat(cmd, value = null) {
  if (typeof document.execCommand === 'function') {
    document.execCommand(cmd, false, value);
  }
}

export function EditorBottomBar({ zoom, setZoom, onFitZoom }) {
  const { push: pushToast } = useToast();

  const handleAlign = (dir) => () => applyFormat(
    dir === 'left'    ? 'justifyLeft'   :
    dir === 'center'  ? 'justifyCenter' :
    dir === 'right'   ? 'justifyRight'  :
    dir === 'justify' ? 'justifyFull'   :
                        'justifyLeft'
  );
  const handleColor = (e) => applyFormat('foreColor', e.target.value);

  return (
    <div
      // Suppress contentEditable losing selection when the user taps a tool.
      onMouseDown={(e) => e.preventDefault()}
      style={{
        height: 50, background: 'var(--bg-sidebar)',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 10px', gap: 4, flexShrink: 0, zIndex: 4,
        overflowX: 'auto',
      }}
    >
      {/* Format dropdown — B / I / U */}
      <DropdownButton icon={<Icon name="bold" />} label="Format">
        <ToolBtn icon={<Icon name="bold" />}      label="Bold"      onClick={() => applyFormat('bold')} />
        <ToolBtn icon={<Icon name="italic" />}    label="Italic"    onClick={() => applyFormat('italic')} />
        <ToolBtn icon={<Icon name="underline" />} label="Underline" onClick={() => applyFormat('underline')} />
      </DropdownButton>

      {/* Align dropdown — L / C / R / J */}
      <DropdownButton icon={<Icon name="alignL" />} label="Align">
        <ToolBtn icon={<Icon name="alignL" />} label="Align left"   onClick={handleAlign('left')} />
        <ToolBtn icon={<Icon name="alignC" />} label="Align center" onClick={handleAlign('center')} />
        <ToolBtn icon={<Icon name="alignR" />} label="Align right"  onClick={handleAlign('right')} />
        <ToolBtn icon={<Icon name="alignJ" />} label="Justify"      onClick={handleAlign('justify')} />
      </DropdownButton>

      {/* Text colour — labelled icon over a hidden colour input. */}
      <label
        title="Text colour"
        onMouseDown={(e) => e.preventDefault()}
        style={{
          width: 36, height: 36, borderRadius: 10, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--fg-secondary)', position: 'relative', flexShrink: 0,
        }}
      >
        <Icon name="textColor" />
        <input
          type="color"
          onChange={handleColor}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </label>

      <VDivider />

      {/* Zoom — same component used in desktop toolbar. */}
      <ZoomControls zoom={zoom} setZoom={setZoom} onFit={onFitZoom} />

      <VDivider />

      {/* Preview hint — kept here so the slim top bar stays uncluttered. */}
      <ToolBtn
        icon={<Icon name="eye" />} label="Preview"
        onClick={() => pushToast('Preview is the canvas you see — try Export → PDF for a print-ready view.', { type: 'info' })}
      />
    </div>
  );
}
