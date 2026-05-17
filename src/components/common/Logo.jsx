// Otango logo (the circular OT brand mark). Used in the topbar, login,
// onboarding, and anywhere else we need the mark.
//
// Just renders /otango-logo.svg from public/, with optional shadow and a
// tunable size. Pass `as="button"` if you want it clickable (used in Topbar
// to navigate home).

const SHADOW = '0 3px 10px rgba(23,86,200,0.45)';

export function Logo({ size = 32, withShadow = true, alt = 'Otango' }) {
  return (
    <img
      src="/otango-logo.svg"
      alt={alt}
      width={size}
      height={size}
      style={{
        display: 'block',
        width: size, height: size,
        borderRadius: '50%',
        boxShadow: withShadow ? SHADOW : 'none',
      }}
    />
  );
}

/** Wordmark — the gradient OTANGOPAPER text used next to the mark. */
export function Wordmark({ size = 17 }) {
  return (
    <span style={{
      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size,
      letterSpacing: 0.5,
      background: 'linear-gradient(135deg,#5C90FF,#00C8D4)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>OTANGOPAPER</span>
  );
}
