// Page size presets exposed in the editor's Design tab. Width/height are in
// CSS pixels at ~72 DPI, the same units the templates were authored in.

export const PAGE_SIZES = [
  { id: 'a4',     label: 'A4',         sub: '210 × 297 mm', width: 595, height: 842 },
  { id: 'letter', label: 'US Letter',  sub: '8.5 × 11 in',  width: 612, height: 792 },
  { id: 'a5',     label: 'A5',         sub: '148 × 210 mm', width: 420, height: 595 },
];

export const DEFAULT_PAGE_SIZE = PAGE_SIZES[0];
