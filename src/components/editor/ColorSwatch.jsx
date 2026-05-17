/** Single accent-color swatch in the Design tab. */
export function ColorSwatch({ color, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 26, height: 26, borderRadius: 8, background: color, cursor: 'pointer',
        border: selected ? '2.5px solid white' : '2px solid transparent',
        boxShadow: selected ? '0 0 0 2px #1756C8' : 'none',
        transition: 'transform 150ms, box-shadow 150ms',
        transform: selected ? 'scale(1.1)' : 'scale(1)',
      }}
    />
  );
}
