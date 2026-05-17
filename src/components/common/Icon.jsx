// Centralised icon set. Each entry is just an SVG path (or an array of paths).
// Components consume them via <Icon name="search" /> rather than redefining
// inline SVG everywhere.

const PATHS = {
  // navigation / chrome
  home:    'M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z',
  grid:    ['M3 3h7v7H3z','M14 3h7v7h-7z','M3 14h7v7H3z','M14 14h7v7h-7z'],
  file:    ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6'],
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
  sun:     ['M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42','M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z'],
  moon:    'M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z',
  plus:    'M12 5v14M5 12h14',
  minus:   'M5 12h14',
  search:  ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z','M21 21l-4.35-4.35'],
  sliders: ['M4 21v-7','M4 10V3','M12 21v-9','M12 8V3','M20 21v-5','M20 12V3','M1 14h6','M9 8h6','M17 16h6'],
  bell:    ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  user:    ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  arrowR:  'M5 12h14M12 5l7 7-7 7',
  back:    'M15 18l-6-6 6-6',

  // editor
  undo:     'M3 7v6h6M3.51 15a9 9 0 1 0 .49-4.9',
  redo:     'M21 7v6h-6M20.49 15a9 9 0 1 1-.49-4.9',
  bold:     'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
  italic:   ['M19 4h-9','M14 20H5','M15 4L9 20'],
  align:    'M21 10H3M21 6H3M21 14H3M21 18H3',
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  eyeOff:   ['M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94','M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19','M1 1l22 22'],
  cursor:   'M5 3l14 9-7 1-3 7z',
  type:     ['M4 7V4h16v3','M9 20h6','M12 4v16'],
  image:    ['M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z','M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z','M21 15l-5-5L5 21'],
  shapes:   ['M12 2L2 19h20z','M7 22a5 5 0 0 1 0-10','M21 22a5 5 0 0 1-10 0'],
  layers:   ['M12 2l10 6.5-10 6.5L2 8.5z','M2 15.5l10 6.5 10-6.5','M2 12l10 6.5 10-6.5'],
  trash:    ['M3 6h18','M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6','M9 6V4h6v2'],
  drag:     'M8 6h.01M8 10h.01M8 14h.01M12 6h.01M12 10h.01M12 14h.01',
  palette:  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01A1.506 1.506 0 0 1 14.5 18H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z',
  check:    'M20 6L9 17l-5-5',
  template: ['M4 3h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z','M4 11h6a1 1 0 0 1 1 1v9H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z','M14 11h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7v-9a1 1 0 0 1 1-1z'],
  share:    ['M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8','M16 6l-4-4-4 4','M12 2v13'],
  close:    'M18 6L6 18M6 6l12 12',
  section:  ['M8 3H5a2 2 0 0 0-2 2v3','M21 8V5a2 2 0 0 0-2-2h-3','M3 16v3a2 2 0 0 0 2 2h3','M16 21h3a2 2 0 0 0 2-2v-3'],
  clock:    ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','M12 6v6l4 2'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  more:     ['M12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z','M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z','M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
  sparkle:  'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z',
  menu:     ['M3 6h18', 'M3 12h18', 'M3 18h18'],
  chevronL: 'M15 18l-6-6 6-6',
  chevronR: 'M9 18l6-6-6-6',

  // Format / typography
  underline: ['M6 4v8a6 6 0 0 0 12 0V4', 'M4 21h16'],
  alignL:    ['M3 6h18', 'M3 10h12', 'M3 14h18', 'M3 18h12'],
  alignC:    ['M3 6h18', 'M6 10h12', 'M3 14h18', 'M6 18h12'],
  alignR:    ['M3 6h18', 'M9 10h12', 'M3 14h18', 'M9 18h12'],
  alignJ:    ['M3 6h18', 'M3 10h18', 'M3 14h18', 'M3 18h18'],
  textColor: ['M6 18l6-13 6 13', 'M8 14h8', 'M4 21h16'],
};

export function Icon({ name, size = 16, strokeWidth = 1.75, ...rest }) {
  const d = PATHS[name];
  if (!d) {
    if (typeof console !== 'undefined') console.warn(`Icon: unknown name "${name}"`);
    return null;
  }
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      {...rest}
    >
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
