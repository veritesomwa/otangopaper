import { useRef, useState } from 'react';
import { useToast } from '@hooks/useToast.js';
import { FormField } from './FormField.jsx';

/** Personal info form + avatar upload + password fields. */
export function ProfileTab({ profile, setProfile }) {
  const { push: pushToast } = useToast();

  const [name, setName]                   = useState(profile.name);
  const [email, setEmail]                 = useState(profile.email);
  const [title, setTitle]                 = useState(profile.title);
  const [website, setWebsite]             = useState(profile.website);
  const [bio, setBio]                     = useState(profile.bio);
  const [avatarUrl, setAvatarUrl]         = useState(profile.avatarUrl || '');
  const [currentPw, setCurrentPw]         = useState('');
  const [newPw, setNewPw]                 = useState('');
  const [saved, setSaved]                 = useState(false);

  const fileRef = useRef(null);

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = () => {
    setProfile({ ...profile, name, email, title, website, bio, avatarUrl });
    setSaved(true);
    pushToast('Profile updated', { type: 'success' });
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      pushToast('Please pick an image file', { type: 'error' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      pushToast('Image must be under 2 MB', { type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(String(reader.result));
      setProfile({ ...profile, name, email, title, website, bio, avatarUrl: String(reader.result) });
      pushToast('Photo uploaded', { type: 'success' });
    };
    reader.onerror = () => pushToast('Could not read that file', { type: 'error' });
    reader.readAsDataURL(file);
  };

  const handlePasswordUpdate = () => {
    if (!currentPw || !newPw) {
      pushToast('Fill in both password fields', { type: 'error' });
      return;
    }
    if (newPw.length < 8) {
      pushToast('New password must be at least 8 characters', { type: 'error' });
      return;
    }
    // Real impl: authService.changePassword({ currentPw, newPw })
    setCurrentPw(''); setNewPw('');
    pushToast('Password updated', { type: 'success' });
  };

  return (
    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Card title="Personal information">
        <FormField label="Full name" value={name} onChange={setName} placeholder="Your full name" />
        <FormField label="Job title" value={title} onChange={setTitle} placeholder="e.g. Product Designer" />
        <FormField label="Email"     value={email} onChange={setEmail} type="email" />
        <FormField label="Website"   value={website} onChange={setWebsite} placeholder="yoursite.com" />

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--fg-tertiary)',
            marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.8px',
          }}>Bio</label>
          <textarea
            value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
            onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            style={{
              width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 14px', color: 'var(--fg-primary)', resize: 'vertical',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none',
              transition: 'border-color 150ms', lineHeight: 1.6,
            }}
          />
        </div>

        <button onClick={handleSave} style={{
          background: saved ? '#22C55E' : 'linear-gradient(135deg,#1756C8,#00C8D4)',
          border: 'none', borderRadius: 999, padding: '10px 24px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
          color: '#fff', cursor: 'pointer', transition: 'background 300ms',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          {saved ? '✓ Saved!' : 'Save changes'}
        </button>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Profile photo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar avatarUrl={avatarUrl} initials={initials} />
            <div>
              <button onClick={() => fileRef.current?.click()} style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 999, padding: '8px 16px', fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, color: 'var(--fg-primary)', cursor: 'pointer',
                display: 'block', marginBottom: 6,
              }}>Upload photo</button>
              <input ref={fileRef} type="file" accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }} />
              <div style={{ fontSize: 10, color: 'var(--fg-tertiary)' }}>JPG, PNG or GIF · Max 2MB</div>
              {avatarUrl && (
                <button onClick={() => { setAvatarUrl(''); setProfile({ ...profile, avatarUrl: '' }); }} style={{
                  marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: 'var(--fg-tertiary)',
                  fontFamily: "'DM Sans', sans-serif",
                }}>Remove</button>
              )}
            </div>
          </div>
        </Card>

        <Card title="Security">
          <FormField label="Current password" value={currentPw} onChange={setCurrentPw} type="password" placeholder="••••••••" />
          <FormField label="New password"     value={newPw}     onChange={setNewPw}     type="password" placeholder="••••••••" />
          <button onClick={handlePasswordUpdate} style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 999, padding: '9px 20px', fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: 'var(--fg-secondary)', cursor: 'pointer',
          }}>Update password</button>
        </Card>
      </div>
    </div>
  );
}

function Avatar({ avatarUrl, initials }) {
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt="Avatar" style={{
        width: 64, height: 64, borderRadius: '50%', objectFit: 'cover',
        border: '3px solid var(--border)',
      }} />
    );
  }
  return (
    <div style={{
      width: 64, height: 64, borderRadius: '50%',
      background: 'linear-gradient(135deg,#0C2A5C,#00A8B4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 20, color: '#fff',
    }}>{initials}</div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', borderRadius: 16, padding: 24,
      border: '1px solid var(--border)',
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15,
        color: 'var(--fg-primary)', marginBottom: 20,
      }}>{title}</div>
      {children}
    </div>
  );
}
