import { useEffect, useRef, useState } from 'react';

const FRAME = 280;       // px — circular viewport size in the modal
const OUTPUT = 320;      // px — exported PNG resolution (same on both axes)
const MIN_SCALE = 0.25;
const MAX_SCALE = 4;

/**
 * Modal that lets the user pan + zoom an uploaded image inside a circular
 * frame and export the cropped region as a PNG data URL.
 *
 * Implementation notes:
 *   - We layout the natural image at `imgW` × `imgH`. `scale` resizes it,
 *     `offset` translates it. The frame is a fixed circle.
 *   - `applyCrop` renders the same transform to a 320×320 canvas with a
 *     circular clip and toDataURL()s the result.
 *
 * Props:
 *   imageSrc:       string (object URL / data URL) — image to crop
 *   onCancel():     close without saving
 *   onApply(url):   close, returning a data URL of the cropped photo
 */
export function ImageCropper({ imageSrc, onCancel, onApply }) {
  const [scale, setScale]   = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  // Drag state
  const dragRef = useRef(null);

  // Load image natural size, fit it to the frame as a starting point
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const fit = Math.max(FRAME / img.naturalWidth, FRAME / img.naturalHeight);
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      setScale(fit);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const onPointerDown = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset({ x: dragRef.current.ox + dx, y: dragRef.current.oy + dy });
  };
  const onPointerUp = (e) => {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
  };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((s) => clamp(s + delta, MIN_SCALE, MAX_SCALE));
  };

  const applyCrop = async () => {
    const canvas = document.createElement('canvas');
    canvas.width  = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');

    // Clip to a circle the size of the canvas
    ctx.beginPath();
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Recreate the on-screen transform but mapped to OUTPUT (instead of FRAME)
    const ratio = OUTPUT / FRAME;
    const drawW = imgSize.w * scale * ratio;
    const drawH = imgSize.h * scale * ratio;
    const drawX = (OUTPUT - drawW) / 2 + offset.x * ratio;
    const drawY = (OUTPUT - drawH) / 2 + offset.y * ratio;

    const img = await loadImage(imageSrc);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    onApply(canvas.toDataURL('image/png'));
  };

  const drawW = imgSize.w * scale;
  const drawH = imgSize.h * scale;
  const drawX = (FRAME - drawW) / 2 + offset.x;
  const drawY = (FRAME - drawH) / 2 + offset.y;

  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.18s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--bg-surface)', borderRadius: 20, padding: 28, width: 380,
        border: '1px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        animation: 'scaleIn 0.22s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18,
          color: 'var(--fg-primary)', marginBottom: 4,
        }}>Crop your photo</div>
        <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginBottom: 18 }}>
          Drag to reposition. Scroll or use the slider to zoom.
        </div>

        {/* Crop viewport */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
          style={{
            width: FRAME, height: FRAME, margin: '0 auto 16px',
            borderRadius: '50%', overflow: 'hidden', position: 'relative',
            background: 'var(--bg-elevated)', cursor: 'grab', touchAction: 'none',
            border: '2px solid var(--border-strong)',
            boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.06)',
          }}
        >
          {imageSrc && imgSize.w > 0 && (
            <img
              src={imageSrc}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                left: drawX, top: drawY,
                width: drawW, height: drawH,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          )}
          {/* Inner ring for visual feedback */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            boxShadow: '0 0 0 9999px rgba(13,17,23,0.55)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Zoom slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <button
            onClick={() => setScale((s) => clamp(s - 0.1, MIN_SCALE, MAX_SCALE))}
            style={zoomBtnStyle()}
          >−</button>
          <input
            type="range" min={MIN_SCALE} max={MAX_SCALE} step={0.01}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#1756C8' }}
          />
          <button
            onClick={() => setScale((s) => clamp(s + 0.1, MIN_SCALE, MAX_SCALE))}
            style={zoomBtnStyle()}
          >+</button>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnStyle({ ghost: true })}>Cancel</button>
          <button onClick={applyCrop} style={btnStyle()}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = src;
  });
}

function zoomBtnStyle() {
  return {
    width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    color: 'var(--fg-primary)', fontSize: 16, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

function btnStyle({ ghost } = {}) {
  if (ghost) return {
    background: 'transparent', border: '1.5px solid var(--border)',
    borderRadius: 999, padding: '9px 18px', fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, color: 'var(--fg-secondary)', cursor: 'pointer',
  };
  return {
    background: 'linear-gradient(135deg,#1756C8,#00C8D4)', color: '#fff', border: 'none',
    borderRadius: 999, padding: '9px 22px', fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(23, 86, 200,0.35)',
  };
}
