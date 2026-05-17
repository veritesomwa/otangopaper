import { useState } from 'react';
import { aiService } from '@services/aiService.js';

/** Small AI assistant panel that fills resume content from a prompt. */
export function AIFillPanel({ onClose, onApply }) {
  const [prompt, setPrompt]   = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await aiService.fill(prompt);
      setResult(data);
    } catch (_) {
      setError('Could not generate content. Try a more specific description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-elevated)', borderRadius: 12, padding: 14, marginBottom: 14,
      border: '1px solid rgba(23, 86, 200,0.3)', animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>✨</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13,
          background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>AI Content Fill</span>
        <button onClick={onClose} style={{
          marginLeft: 'auto', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--fg-tertiary)', fontSize: 16, lineHeight: 1, display: 'flex',
        }}>×</button>
      </div>

      <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginBottom: 10, lineHeight: 1.5 }}>
        Describe yourself or paste a job description and AI will fill your resume.
      </div>

      <textarea
        value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
        placeholder="e.g. Senior software engineer at Google, 8 years experience in distributed systems, Python, Go, Kubernetes…"
        onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
        onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
        style={{
          width: '100%', background: 'var(--bg-overlay)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '9px 11px', color: 'var(--fg-primary)',
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, resize: 'vertical',
          outline: 'none', lineHeight: 1.5, transition: 'border-color 150ms',
        }}
      />

      {error && (
        <div style={{ fontSize: 11, color: '#EF4444', marginTop: 6 }}>{error}</div>
      )}

      {result && (
        <div style={{
          marginTop: 10, background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '10px 12px',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#22C55E', marginBottom: 5 }}>
            ✓ Content generated
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--fg-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
            {result.summary?.slice(0, 90)}…
          </div>
          <button onClick={() => { onApply(result); onClose(); }} style={{
            background: '#22C55E', border: 'none', borderRadius: 999, padding: '6px 14px',
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: '#fff',
            cursor: 'pointer',
          }}>Apply to resume</button>
        </div>
      )}

      <button onClick={handleGenerate} disabled={loading || !prompt.trim()} style={{
        marginTop: 10, width: '100%',
        background: loading
          ? 'var(--bg-overlay)'
          : 'linear-gradient(135deg,#1756C8,#00C8D4)',
        border: 'none', borderRadius: 999, padding: 9,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12,
        color: loading ? 'var(--fg-tertiary)' : '#fff',
        cursor: loading || !prompt.trim() ? 'default' : 'pointer',
        transition: 'all 200ms',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        {loading ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
            Generating…
          </>
        ) : '✨ Generate content'}
      </button>
    </div>
  );
}
