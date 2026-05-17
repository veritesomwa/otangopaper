import { useRef, useState } from 'react';
import { useToast } from '@hooks/useToast.js';
import { ImageCropper } from './ImageCropper.jsx';

const MAX_BYTES = 5 * 1024 * 1024;  // 5 MB

/**
 * Profile-photo upload + crop control, reusable wherever the user can pick
 * a profile photo (editor side panel, magic wizard's basics step, etc.).
 *
 * Props:
 *   photoUrl:    current data URL (or empty string)
 *   onChange(u): called with the new data URL after the user crops, or '' on remove
 *   label:       optional headline ("Profile photo" by default)
 */
export function PhotoUploadControl({ photoUrl, onChange, label = 'Profile photo' }) {
  const { push: pushToast } = useToast();
  const [draftSrc, setDraftSrc] = useState(null);   // image queued for cropping
  const inputRef = useRef(null);

  const initials = 'AC'; // visual-only fallback; real initials are provided by the surrounding screen

  const onPick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      pushToast('Please pick an image file', { type: 'error' });
      return;
    }
    if (file.size > MAX_BYTES) {
      pushToast('Image must be under 5 MB', { type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload  = () => setDraftSrc(String(reader.result));
    reader.onerror = () => pushToast('Could not read that image', { type: 'error' });
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 12, padding: 14,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '.8px',
        textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 10,
      }}>{label}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Preview photoUrl={photoUrl} initials={initials} />

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              background: photoUrl ? 'transparent' : 'linear-gradient(135deg,#1756C8,#00C8D4)',
              color: photoUrl ? 'var(--fg-secondary)' : '#fff',
              border: photoUrl ? '1px solid var(--border)' : 'none',
              borderRadius: 999, padding: '7px 14px',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
              cursor: 'pointer', marginRight: 6,
            }}
          >
            {photoUrl ? 'Replace' : 'Upload photo'}
          </button>
          {photoUrl && (
            <button
              onClick={() => onChange('')}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--fg-tertiary)', borderRadius: 999, padding: '7px 12px',
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: 'pointer',
              }}
            >Remove</button>
          )}
          <div style={{
            fontSize: 10.5, color: 'var(--fg-tertiary)', marginTop: 6, lineHeight: 1.5,
          }}>
            JPG, PNG or GIF · Max 5 MB · You'll crop next.
          </div>
        </div>
      </div>

      {draftSrc && (
        <ImageCropper
          imageSrc={draftSrc}
          onCancel={() => setDraftSrc(null)}
          onApply={(croppedDataUrl) => {
            setDraftSrc(null);
            onChange(croppedDataUrl);
            pushToast('Photo updated', { type: 'success' });
          }}
        />
      )}
    </div>
  );
}

function Preview({ photoUrl, initials }) {
  return photoUrl
    ? (
      <img src={photoUrl} alt="" style={{
        width: 56, height: 56, borderRadius: '50%', objectFit: 'cover',
        border: '2px solid var(--border-strong)',
      }} />
    )
    : (
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg,#0C2A5C,#00A8B4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800, fontSize: 18,
      }}>{initials}</div>
    );
}
