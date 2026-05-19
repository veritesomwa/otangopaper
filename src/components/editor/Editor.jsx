import { useCallback, useEffect, useRef, useState } from 'react';
import { useDocument } from '@hooks/useDocument.js';
import { TemplateCanvas } from '@components/canvas/TemplateCanvas.jsx';

import { EditorToolbar }    from './EditorToolbar.jsx';
import { EditorBottomBar }  from './EditorBottomBar.jsx';
import { RightPanel }       from './RightPanel.jsx';
import { ExportModal }      from './ExportModal.jsx';
import { ZOOM_LIMITS }      from './ZoomControls.jsx';
import { useIsMobile }      from '@hooks/useMediaQuery.js';

const { MIN: ZMIN, MAX: ZMAX, STEP: ZSTEP } = ZOOM_LIMITS;

/**
 * Top-level editor screen. Composes the toolbar, the canvas, the right panel,
 * and the export modal. All shared state lives in `DocumentContext` — this
 * component just wires the chrome together.
 *
 * Note: the old Canva-style left tool strip (Select / Text / Image / Shapes /
 * Layers / Templates) was removed — its features either lived in the
 * contentEditable canvas directly, or moved to the right panel. Switching
 * template now happens via the right panel's Templates tab.
 */
export function Editor({ onBack }) {
  const {
    template, sections, person, accent, fontPair, pageSize, canvasRef,
    patchPath, setSections,
    fontScale, lineHeight, sectionGap, bulletStyle,
    undo, redo, canUndo, canRedo,
  } = useDocument();

  const [zoom, setZoom]                   = useState(0.9);
  const [showExport, setShowExport]       = useState(false);
  const [rightOpen, setRightOpen]         = useState(true);

  const isMobile = useIsMobile();

  // The scroll viewport that holds the canvas — used to compute fit-to-viewport.
  const viewportRef = useRef(null);

  /** Fit the canvas inside the viewport with a small margin. */
  const fitZoom = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const padding = 80; // outer breathing room
    const availW = Math.max(200, vp.clientWidth  - padding);
    const availH = Math.max(200, vp.clientHeight - padding);
    const w = pageSize?.width  || 595;
    const h = pageSize?.height || 842;
    const fit = Math.min(availW / w, availH / h);
    setZoom(clamp(fit, ZMIN, ZMAX));
  }, [pageSize]);

  // Recompute fit when the page size changes (only if user is currently fitted)
  useEffect(() => {
    fitZoom();
    // We *want* this to run on initial mount and on pageSize change. Adding
    // `zoom` would cause a fight if the user manually zooms.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize?.id]);

  // Keyboard shortcuts — undo/redo, tool palette, zoom (⌘+/-/0/1)
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target?.tagName;
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable;
      const mod = e.metaKey || e.ctrlKey;

      // ⌘Z / ⌘⇧Z work even inside contenteditable
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) { if (canRedo) redo(); }
        else            { if (canUndo) undo(); }
        return;
      }

      // Zoom shortcuts — let them work everywhere except inside text inputs
      if (mod && !isEditable) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault(); setZoom((z) => clamp(z + ZSTEP, ZMIN, ZMAX)); return;
        }
        if (e.key === '-' || e.key === '_') {
          e.preventDefault(); setZoom((z) => clamp(z - ZSTEP, ZMIN, ZMAX)); return;
        }
        if (e.key === '0') { e.preventDefault(); setZoom(1);    return; }
        if (e.key === '1') { e.preventDefault(); fitZoom();      return; }
      }

      if (mod) return;
      if (isEditable) return;

      // ']' toggles the right tabs panel. The old '[' / '\\' shortcuts used to
      // collapse the left tool strip — that panel was removed, so they're
      // gone too.
      if (e.key === ']') { e.preventDefault(); setRightOpen((v) => !v); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, canUndo, canRedo, fitZoom]);

  // Ctrl/Cmd + wheel zoom on the canvas viewport
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? -1 : 1;
      setZoom((z) => clamp(z + dir * 0.05, ZMIN, ZMAX));
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, []);

  if (!template) return null;
  const tpl = { ...template, accent };

  return (
    <div className="fade-in" style={{
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      <EditorToolbar
        zoom={zoom} setZoom={setZoom}
        onFitZoom={fitZoom}
        onBack={onBack}
        onExport={() => setShowExport(true)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Canvas viewport — Cmd/Ctrl + wheel zooms */}
        <div ref={viewportRef} style={{
          flex: 1, background: 'var(--bg-canvas)', display: 'flex',
          alignItems: 'flex-start', justifyContent: 'center', overflow: 'auto',
          padding: '40px 24px', position: 'relative',
        }}>
          {/* OUTER box — takes up the *scaled* footprint so the viewport's
              scroll area grows / shrinks with the zoom. Without this, CSS
              transforms only rescale the paint output, not the layout box,
              and zooming in would render content that the user can't scroll
              to. flex-shrink:0 keeps the page at its full scaled width even
              when narrower than the viewport. */}
          <div style={{
            width:   (pageSize?.width  || 595) * zoom,
            height:  (pageSize?.height || 842) * zoom,
            flexShrink: 0, position: 'relative',
            transition: 'width 200ms, height 200ms',
          }}>
            {/* INNER box — the actual page at its natural pixel size, then
                scaled visually. NOT `.scale-in` — that class's animation
                holds transform: scale(1) via animation-fill-mode and would
                stomp our inline transform, defeating the zoom entirely. */}
            <div style={{
              width:  pageSize?.width  || 595,
              height: pageSize?.height || 842,
              transform:       `scale(${zoom})`,
              transformOrigin: 'top left',
              transition:      'transform 200ms',
              boxShadow:       '0 12px 56px rgba(0,0,0,0.4)',
              borderRadius:    2,
              // CSS variables consumed by the global stylesheet rules below.
              '--ot-font-scale':  fontScale,
              '--ot-line-height': lineHeight,
              '--ot-section-gap': `${sectionGap}px`,
              '--ot-bullet':      bulletCharFor(bulletStyle),
              '--ot-list-style':  listStyleFor(bulletStyle),
            }}>
              <TemplateCanvas
                ref={canvasRef}
                template={tpl} sections={sections} person={person}
                readOnly={false} fontPair={fontPair} pageSize={pageSize}
                onPatch={patchPath}
                onPatchSections={setSections}
              />
            </div>
          </div>
        </div>

        <RightPanel open={rightOpen} onToggle={() => setRightOpen((v) => !v)} />
      </div>

      {/* Mobile-only second toolbar holding the formatting tools that don't
          fit in the slim mobile top bar. */}
      {isMobile && (
        <EditorBottomBar zoom={zoom} setZoom={setZoom} onFitZoom={fitZoom} />
      )}

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

// ── Bullet style helpers — used to set CSS vars on the canvas wrapper ─────
function listStyleFor(s) {
  switch (s) {
    case 'circle': return 'circle';
    case 'square': return 'square';
    case 'dash':
    case 'arrow':
    case 'none':   return 'none';
    case 'disc':
    default:       return 'disc';
  }
}
function bulletCharFor(s) {
  switch (s) {
    case 'dash':  return "'– '";
    case 'arrow': return "'→ '";
    case 'circle':
    case 'square':
    case 'disc':
    case 'none':
    default:      return "''";
  }
}
