// Master canvas that picks a renderer based on `template.style`.
//
// Renderers come from templates/index.jsx and each is a pure component of
// (person, sections, accent, fontHeading, fontBody, readOnly). The page is
// fixed-size (default 595 × 842 px = A4-ish at ~72 DPI) so thumbnails can
// scale it uniformly. The active page size can be overridden via the
// `pageSize` prop ({ width, height }).

import { forwardRef } from 'react';
import { TEMPLATE_RENDERERS } from './templates/index.jsx';
import { DEFAULT_PERSON }     from '@data/defaultPerson.js';
import { DEFAULT_SECTIONS }   from '@data/defaultSections.js';
import { FONT_PAIRS }         from '@data/fontPairs.js';
import { DEFAULT_PAGE_SIZE }  from '@data/pageSizes.js';

export const PAGE_WIDTH  = DEFAULT_PAGE_SIZE.width;
export const PAGE_HEIGHT = DEFAULT_PAGE_SIZE.height;

export const TemplateCanvas = forwardRef(function TemplateCanvas(
  { template, person, sections, readOnly = true, fontPair, pageSize, onPatch, onPatchSections },
  ref
) {
  const fp     = fontPair || FONT_PAIRS[0];
  const p      = person   || DEFAULT_PERSON;
  const s      = sections || DEFAULT_SECTIONS;
  const accent = template?.accent || '#1756C8';
  const style  = template?.style  || 'modern';
  const size   = pageSize || DEFAULT_PAGE_SIZE;

  const bg = style === 'tech' ? '#0D1117' : '#ffffff';

  const props = {
    person: p, sections: s, accent, readOnly,
    fontHeading: fp.heading, fontBody: fp.body,
    // onPatch(path, value) — patch a nested person field. No-op in thumbnails.
    onPatch: readOnly ? undefined : onPatch,
    // onPatchSections(updater) — replace the sections array.
    onPatchSections: readOnly ? undefined : onPatchSections,
  };

  const render = TEMPLATE_RENDERERS[style] || TEMPLATE_RENDERERS.modern;

  return (
    <div ref={ref} data-otango-canvas style={{
      width: size.width, height: size.height,
      background: bg, overflow: 'hidden', position: 'relative',
    }}>
      {render(props)}
    </div>
  );
});
