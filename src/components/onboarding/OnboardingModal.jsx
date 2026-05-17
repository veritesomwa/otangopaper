import { useState } from 'react';
import { useTemplates } from '@hooks/useTemplates.js';
import { TemplateThumbnail } from '@components/canvas/TemplateThumbnail.jsx';

const DOC_TYPES = [
  { id: 'resume',  label: 'Resume',       emoji: '📄', desc: 'Showcase your career history' },
  { id: 'letter',  label: 'Cover Letter', emoji: '✉️', desc: 'Write a compelling cover letter' },
  { id: 'nl',      label: 'Newsletter',   emoji: '📰', desc: 'Publish news and updates' },
  { id: 'college', label: 'College App',  emoji: '🎓', desc: 'Apply to colleges and grad schools' },
  { id: 'cert',    label: 'Certificate',  emoji: '🏆', desc: 'Create achievement awards' },
];

const CAT_BY_TYPE = {
  resume:  'Resume',
  letter:  'Cover Letter',
  nl:      'Newsletter',
  college: 'College App',
  cert:    'Certificate',
};

const STEPS = ['Welcome', 'Choose type', 'Start creating'];

/** First-run modal: welcome → pick a type → done. */
export function OnboardingModal({ onComplete }) {
  const [step, setStep]     = useState(0);
  const [chosen, setChosen] = useState(null);
  const { templates }       = useTemplates();

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9998,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: 'var(--bg-surface)', borderRadius: 24, width: 500,
        border: '1px solid var(--border)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        overflow: 'hidden', animation: 'scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--bg-elevated)', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            background: 'linear-gradient(90deg,#1756C8,#00C8D4)',
            width: `${((step + 1) / 3) * 100}%`,
            transition: 'width 350ms cubic-bezier(0.4,0,0.2,1)',
            borderRadius: 999,
          }} />
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          {/* Steps indicator */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
                  background: i <= step ? 'linear-gradient(135deg,#1756C8,#00C8D4)' : 'var(--bg-elevated)',
                  color: i <= step ? '#fff' : 'var(--fg-tertiary)',
                  border: i === step ? 'none' : '1px solid var(--border)',
                }}>{i + 1}</div>
                <span style={{
                  fontSize: 11, color: i === step ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                  fontWeight: i === step ? 600 : 400,
                }}>{s}</span>
                {i < 2 && <span style={{ color: 'var(--fg-disabled)', fontSize: 12 }}>›</span>}
              </div>
            ))}
          </div>

          {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
          {step === 1 && (
            <PickTypeStep
              chosen={chosen} setChosen={setChosen} templates={templates}
              onBack={() => setStep(0)} onNext={() => setStep(2)}
            />
          )}
          {step === 2 && <DoneStep onComplete={onComplete} />}
        </div>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }) {
  return (
    <div className="fade-up">
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 26,
        lineHeight: 1.2, marginBottom: 10,
      }}>
        Welcome to{' '}
        <span style={{
          background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Otango</span>
      </div>
      <p style={{ fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
        Create stunning resumes, cover letters, newsletters, and more — with beautiful templates and an intuitive editor. Let's get you started.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 26 }}>
        {['📄 17+ templates', '✏️ Inline editing', '📥 Export to PDF'].map((f) => (
          <div key={f} style={{
            background: 'var(--bg-elevated)', borderRadius: 10, padding: '10px 12px',
            border: '1px solid var(--border)', fontSize: 12, color: 'var(--fg-secondary)', textAlign: 'center',
          }}>{f}</div>
        ))}
      </div>
      <button onClick={onNext} style={{
        width: '100%', background: 'linear-gradient(135deg,#1756C8,#00C8D4)', border: 'none',
        borderRadius: 999, padding: '13px', fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600, fontSize: 14, color: '#fff', cursor: 'pointer',
        boxShadow: '0 4px 18px rgba(23, 86, 200,0.4)',
      }}>Get started →</button>
    </div>
  );
}

function PickTypeStep({ chosen, setChosen, templates, onBack, onNext }) {
  const previews = chosen
    ? templates.filter((t) => t.cat === CAT_BY_TYPE[chosen]).slice(0, 3)
    : [];

  return (
    <div className="fade-up">
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20,
        marginBottom: 6, color: 'var(--fg-primary)',
      }}>What would you like to create?</div>
      <p style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginBottom: 16 }}>
        Select a type to see matching templates.
      </p>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {DOC_TYPES.map((dt) => {
          const active = chosen === dt.id;
          return (
            <button key={dt.id} onClick={() => setChosen(dt.id)} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px',
              borderRadius: 999, border: '1.5px solid', cursor: 'pointer',
              transition: 'all 150ms', fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 500,
              borderColor: active ? '#1756C8' : 'var(--border)',
              background:  active ? 'rgba(23, 86, 200,0.14)' : 'transparent',
              color:       active ? '#5C90FF' : 'var(--fg-secondary)',
            }}>
              <span style={{ fontSize: 15 }}>{dt.emoji}</span> {dt.label}
            </button>
          );
        })}
      </div>

      {previews.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, animation: 'fadeIn 0.25s ease' }}>
          {previews.map((t) => (
            <div key={t.id} style={{
              flex: 1, borderRadius: 10, overflow: 'hidden',
              border: '1px solid var(--border)', cursor: 'pointer',
              transition: 'all 150ms', background: 'var(--bg-elevated)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1756C8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <TemplateThumbnail template={t} scale={0.19} />
              <div style={{
                padding: '6px 8px', fontSize: 10, fontWeight: 500,
                color: 'var(--fg-primary)', textAlign: 'center',
              }}>{t.name}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          flex: 1, background: 'transparent', border: '1.5px solid var(--border)',
          borderRadius: 999, padding: '11px', fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, color: 'var(--fg-secondary)', cursor: 'pointer',
        }}>Back</button>
        <button onClick={onNext} disabled={!chosen} style={{
          flex: 2,
          background: chosen ? 'linear-gradient(135deg,#1756C8,#00C8D4)' : 'var(--bg-elevated)',
          border: 'none', borderRadius: 999, padding: '11px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
          color: chosen ? '#fff' : 'var(--fg-disabled)',
          cursor: chosen ? 'pointer' : 'default', transition: 'all 200ms',
          boxShadow: chosen ? '0 4px 14px rgba(23, 86, 200,0.35)' : 'none',
        }}>Continue →</button>
      </div>
    </div>
  );
}

function DoneStep({ onComplete }) {
  return (
    <div className="fade-up" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🎉</div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
        marginBottom: 8, color: 'var(--fg-primary)',
      }}>You're all set!</div>
      <p style={{
        fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.7,
        marginBottom: 28, maxWidth: 340, margin: '0 auto 28px',
      }}>
        Browse templates and start creating your first document. Your work saves automatically as you type.
      </p>
      <button onClick={onComplete} style={{
        background: 'linear-gradient(135deg,#1756C8,#00C8D4)', border: 'none', borderRadius: 999,
        padding: '13px 40px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
        color: '#fff', cursor: 'pointer', boxShadow: '0 4px 18px rgba(23, 86, 200,0.4)',
      }}>Browse templates →</button>
    </div>
  );
}
