import { useEffect } from 'react';
import { LoginCard } from './LoginCard.jsx';

/**
 * In-app login dialog. Backdrops over the main UI so the user keeps their
 * place. Closes on backdrop click, on the × button, on the Esc key, and
 * automatically after a successful sign-in.
 */
export function LoginModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 440,
          animation: 'scaleIn 0.22s cubic-bezier(0.34,1.2,0.64,1)' }}>
        <LoginCard onSuccess={onClose} onClose={onClose} />
      </div>
    </div>
  );
}
