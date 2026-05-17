// Export controller. Uses zero external dependencies — opens a print window
// for PDF, rasterises via SVG <foreignObject> for PNG, and emits an HTML doc
// for Word (which Word & Pages open without complaint). When a real backend
// is in play, swap these implementations for /export/* endpoints.
//
// Every public function returns a Promise that resolves on success.

import { isOffline } from './api.js';

/* ──────────────────────────────────────────────────────────────────────────
 * 1. PDF — open canvas in a new window with a print stylesheet
 * ────────────────────────────────────────────────────────────────────────── */

// Page-size catalogue. Canvas pixels are authored at 72 DPI (1pt = 1px), but
// browsers print using 96 DPI for CSS pixels — so 595px CSS only covers 75%
// of A4. We compensate with a transform: scale() applied after inlineNode().
const PAGE_SPECS = {
  // id      canvas (72dpi)         physical paper        scale factor (96/72 = 1.3333…)
  a4:     { canvasW: 595, canvasH: 842, paperCss: 'A4',                scale: 1.3334 },
  letter: { canvasW: 612, canvasH: 792, paperCss: '8.5in 11in',        scale: 1.3334 },
  a5:     { canvasW: 420, canvasH: 595, paperCss: 'A5',                scale: 1.3334 },
};

function pickPageSpec(pageSize) {
  if (!pageSize) return PAGE_SPECS.a4;
  return PAGE_SPECS[pageSize.id] || PAGE_SPECS.a4;
}

/**
 * Print the canvas to PDF. Opens a popup window containing a clone of the
 * canvas DOM and uses the browser's native "Save as PDF" dialog.
 *
 * Why this is finicky:
 *   - The canvas is authored at 72 DPI but browsers print at 96 DPI, so a
 *     595×842 canvas only fills 75% of A4 unless we scale it.
 *   - inlineNode() copies *every* computed style (including transform: none),
 *     which would otherwise stomp our scale. We re-apply the transform on
 *     the clone AFTER inlining so it wins.
 *   - page-break-after on the wrapper must be `avoid`, not `always`, or the
 *     browser produces a blank second page.
 *
 * @param {HTMLElement} canvasNode  the rendered template DOM
 * @param {string}      docName     suggested file name
 * @param {object}      [pageSize]  selected page size (from data/pageSizes.js)
 */
export async function exportPDF(canvasNode, docName = 'OtangoPaper Document', pageSize) {
  if (!canvasNode) throw new Error('Nothing to export');

  const spec = pickPageSpec(pageSize);

  // Inline the computed styles into a DOM clone …
  const clone = inlineClone(canvasNode);

  // … and then forcibly override the layout properties that need to differ
  // in the print window. Setting them on the clone's inline style *after*
  // inlineClone() guarantees they aren't overwritten by computed styles.
  Object.assign(clone.style, {
    width:           `${spec.canvasW}px`,
    height:          `${spec.canvasH}px`,
    transform:       `scale(${spec.scale})`,
    transformOrigin: 'top left',
    position:        'absolute',
    top:             '0',
    left:            '0',
    margin:          '0',
  });

  const html = clone.outerHTML;

  const win = window.open('', '_blank', 'width=900,height=1200');
  if (!win) throw new Error('Please allow popups to export to PDF');

  // Sized so the scaled canvas fills the wrapper exactly (canvas * scale).
  const wrapperW = Math.round(spec.canvasW * spec.scale);
  const wrapperH = Math.round(spec.canvasH * spec.scale);

  win.document.open();
  win.document.write(`
    <!DOCTYPE html>
    <html><head>
      <meta charset="utf-8"/>
      <title>${escapeHtml(docName)}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;600;700&family=Nunito:wght@400;500;600;700&display=swap"/>
      <style>
        /* Honour every background colour, gradient, and image in the printout. */
        html, body, * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust:        exact !important;
          color-adjust:              exact !important;
        }

        @page { size: ${spec.paperCss}; margin: 0; }

        html, body {
          margin: 0; padding: 0; background: #fff;
          width: ${wrapperW}px;
          height: ${wrapperH}px;
          overflow: hidden;
        }

        /* The .print-page container is sized to match the physical paper.
           The canvas inside is scaled up so it fills it edge-to-edge. */
        .print-page {
          width: ${wrapperW}px;
          height: ${wrapperH}px;
          overflow: hidden;
          position: relative;
          page-break-after: avoid;
          page-break-inside: avoid;
          break-after: avoid;
          break-inside: avoid;
        }
      </style>
    </head><body><div class="print-page">${html}</div></body></html>
  `);
  win.document.close();

  // Give fonts/images a chance to load before print
  await new Promise((resolve) => {
    if (win.document.readyState === 'complete') resolve();
    else win.addEventListener('load', resolve);
  });
  await new Promise((r) => setTimeout(r, 400));
  win.focus();
  win.print();
  // Don't auto-close — user might cancel the print dialog and still want the page.
}

/* ──────────────────────────────────────────────────────────────────────────
 * 2. PNG — SVG foreignObject snapshot
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Rasterise the canvas to a PNG using an SVG <foreignObject> wrapper.
 * Works for typical text/svg/colour usage; complex effects may downgrade.
 */
export async function exportPNG(canvasNode, docName = 'OtangoPaper Document') {
  if (!canvasNode) throw new Error('Nothing to export');

  const rect = canvasNode.getBoundingClientRect();
  const w = Math.round(rect.width  || 595);
  const h = Math.round(rect.height || 842);

  // Build a foreignObject SVG containing the canvas HTML
  const html = inlineNode(canvasNode);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">${html}</div>
    </foreignObject>
  </svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url  = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    const c   = document.createElement('canvas');
    c.width   = w * 2;  // 2x for crisp output
    c.height  = h * 2;
    const ctx = c.getContext('2d');
    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0, w, h);

    const pngBlob = await new Promise((resolve, reject) =>
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
    );
    triggerDownload(pngBlob, `${docName}.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Word — emit a self-contained HTML document with a .doc extension
 * ────────────────────────────────────────────────────────────────────────── */

/** Emit a .doc that Word & Pages open as an editable document. */
export function exportWord(canvasNode, docName = 'OtangoPaper Document') {
  if (!canvasNode) throw new Error('Nothing to export');
  const html = inlineNode(canvasNode);
  const wrapped = `MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${escapeHtml(docName)}</title></head>
<body>${html}</body></html>`;
  const blob = new Blob([wrapped], { type: 'application/msword' });
  triggerDownload(blob, `${docName}.doc`);
}

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Share link — copy a (stub for now) shareable URL to the clipboard
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Generate a sharable read-only link. Real backend would mint a unique slug
 * and return its URL; the offline stub builds a fake link from the doc name.
 */
export async function exportShareLink(docName = 'OtangoPaper Document') {
  const slug = encodeURIComponent(docName.replace(/\s+/g, '-').toLowerCase());
  const link = isOffline()
    ? `https://otangopaper.app/preview/${slug}-${Math.random().toString(36).slice(2, 8)}`
    : await fetchRealShareLink(slug);

  await copyToClipboard(link);
  return link;
}

async function fetchRealShareLink() {
  // Real impl would POST to /share, get back { url }
  return `https://otangopaper.app/preview/${Math.random().toString(36).slice(2, 10)}`;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Inline the computed styles for `node` and every descendant onto a deep
 * DOM clone so the result renders identically when removed from the app's
 * CSS context. Returns the cloned root node (caller can mutate styles before
 * serialising).
 */
function inlineClone(node) {
  const clone = node.cloneNode(true);
  const srcWalker = document.createTreeWalker(node,  NodeFilter.SHOW_ELEMENT);
  const dstWalker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);
  let src = srcWalker.currentNode;
  let dst = dstWalker.currentNode;
  while (src && dst) {
    const cs = window.getComputedStyle(src);
    let css = '';
    for (const prop of cs) {
      const v = cs.getPropertyValue(prop);
      if (v) css += `${prop}:${v};`;
    }
    dst.setAttribute('style', css);
    src = srcWalker.nextNode();
    dst = dstWalker.nextNode();
  }
  return clone;
}

/** Convenience wrapper used by Word and PNG paths — same as inlineClone but
 *  serialised to a string for embedding into a wrapper document. */
function inlineNode(node) {
  return inlineClone(node).outerHTML;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to rasterise: ' + (e?.message || '')));
    img.src     = src;
  });
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch (_) { /* fall through */ }
  // Legacy fallback
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } finally { ta.remove(); }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
