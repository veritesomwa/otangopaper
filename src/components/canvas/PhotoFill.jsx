// Renders inside an existing circular avatar slot inside a template.
// Drop-in replacement for the 👤 emoji placeholder: when the user has uploaded
// a photo (person.photoUrl) it renders that photo cropped into the slot;
// otherwise it falls back to the emoji.

export function PhotoFill({ photoUrl, fallback = '👤' }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          display: 'block',
          // Stop the print engine from desaturating photos
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      />
    );
  }
  return fallback;
}
