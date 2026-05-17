import { useState } from 'react';
import { useAuth }  from '@hooks/useAuth.js';
import { useToast } from '@hooks/useToast.js';
import { Logo, Wordmark } from '@components/common/Logo.jsx';
import { GoogleSignInButton } from './GoogleSignInButton.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Inner card content for sign in / sign up. Doesn't include any outer
 * positioning — `<LoginScreen>` (full-page) and `<LoginModal>` (overlay)
 * both wrap this same component.
 *
 * Props:
 *   onSuccess() — called after a successful auth attempt (modal closes itself)
 *   onClose()   — optional close button shown in the top-right corner
 */
export function LoginCard({ onSuccess, onClose }) {
  const { passwordLogin, register, googleLogin } = useAuth();
  const { push: pushToast } = useToast();

  const [mode, setMode]     = useState('login');   // 'login' | 'register'
  const [email, setEmail]   = useState('');
  const [password, setPwd]  = useState('');
  const [name, setName]     = useState('');
  const [busy, setBusy]     = useState(false);
  const [err, setErr]       = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!email || !password) {
      setErr('Email and password are required.');
      return;
    }
    if (mode === 'register' && password.length < 8) {
      setErr('Password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'register') {
        await register({ email, password, name });
        pushToast('Welcome to OtangoPaper', { type: 'success' });
      } else {
        await passwordLogin({ email, password });
        pushToast('Welcome back', { type: 'success' });
      }
      onSuccess?.();
    } catch (e) {
      setErr(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleCredential = async (idToken) => {
    setBusy(true); setErr(null);
    try {
      await googleLogin(idToken);
      pushToast('Welcome to OtangoPaper', { type: 'success' });
      onSuccess?.();
    } catch (e) {
      setErr(e.message || 'Google sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      width: '100%', maxWidth: 440, padding: '36px 36px 30px',
      background: 'var(--bg-surface)', borderRadius: 22,
      border: '1px solid var(--border)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
      position: 'relative',
    }}>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 30, height: 30, borderRadius: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--fg-tertiary)', fontSize: 20, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-tertiary)'; }}
        >×</button>
      )}

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 12, marginBottom: 22,
      }}>
        <Logo size={48} />
        <Wordmark size={22} />
      </div>

      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 22,
        marginBottom: 6, lineHeight: 1.2, textAlign: 'center',
      }}>
        {mode === 'register' ? 'Create your account' : 'Sign in to OtangoPaper'}
      </h1>
      <p style={{
        fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.6,
        marginBottom: 22, textAlign: 'center',
      }}>
        {mode === 'register'
          ? 'Use email + password, or continue with Google. Same email = same account.'
          : 'Welcome back. Use email + password, or continue with Google.'}
      </p>

      {/* Tabs */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
        background: 'var(--bg-elevated)', borderRadius: 999, padding: 4,
        marginBottom: 18,
      }}>
        <Tab active={mode === 'login'}    onClick={() => setMode('login')}>Sign in</Tab>
        <Tab active={mode === 'register'} onClick={() => setMode('register')}>Create account</Tab>
      </div>

      {/* Form */}
      <form onSubmit={submit}>
        {mode === 'register' && (
          <Field
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Your full name"
            autoComplete="name"
          />
        )}
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          value={password}
          onChange={setPwd}
          placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
          type="password"
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          required
        />

        {err && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#EF4444', padding: '10px 14px', borderRadius: 10,
            fontSize: 12, lineHeight: 1.5, marginBottom: 14,
          }}>{err}</div>
        )}

        <button type="submit" disabled={busy} style={{
          width: '100%',
          background: busy ? 'var(--bg-elevated)' : 'linear-gradient(135deg,#1756C8,#00C8D4)',
          color: busy ? 'var(--fg-tertiary)' : '#fff',
          border: 'none', borderRadius: 999, padding: '12px',
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
          cursor: busy ? 'default' : 'pointer',
          boxShadow: busy ? 'none' : '0 4px 14px rgba(23, 86, 200,0.35)',
          transition: 'all 200ms',
        }}>
          {busy ? '…' : mode === 'register' ? 'Create account →' : 'Sign in →'}
        </button>
      </form>

      {/* Divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0',
        color: 'var(--fg-tertiary)', fontSize: 11,
      }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span>or</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Google */}
      {GOOGLE_CLIENT_ID ? (
        <GoogleSignInButton
          clientId={GOOGLE_CLIENT_ID}
          onCredential={handleGoogleCredential}
        />
      ) : (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
          color: '#F59E0B', padding: '12px 14px', borderRadius: 10,
          fontSize: 11.5, lineHeight: 1.6, textAlign: 'left',
        }}>
          <strong style={{ color: 'var(--fg-primary)' }}>Google sign-in unavailable</strong><br/>
          Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env</code> to enable it.
        </div>
      )}

      <div style={{
        marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border)',
        fontSize: 11, color: 'var(--fg-tertiary)', lineHeight: 1.6, textAlign: 'center',
      }}>
        By continuing you agree to our terms of service and privacy policy.
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? 'var(--bg-surface)' : 'transparent',
        color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
        border: 'none', borderRadius: 999, padding: '8px 12px',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600,
        boxShadow: active ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 150ms',
      }}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', autoComplete, required }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--fg-tertiary)',
        marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.7,
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
        onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
        style={{
          width: '100%', background: 'var(--bg-elevated)',
          border: '1px solid var(--border)', borderRadius: 10,
          padding: '10px 14px', color: 'var(--fg-primary)',
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none',
          transition: 'border-color 150ms',
        }}
      />
    </div>
  );
}
