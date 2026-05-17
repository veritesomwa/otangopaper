import { StepContainer } from '../StepContainer.jsx';
import { WIZARDS } from '../wizardConfig.js';

const ORDER = [
  { id: 'resume',      desc: 'A polished CV for any job application' },
  { id: 'card',        desc: 'Two-sided business card with logo + contact' },
  { id: 'postcard',    desc: 'Greeting cards, thank-yous, holiday cards' },
  { id: 'letter',      desc: 'Cover letters tailored to a role' },
  { id: 'newsletter',  desc: 'Email or print newsletters with stories' },
  { id: 'certificate', desc: 'Achievement, completion, or appreciation' },
  { id: 'banner',      desc: 'LinkedIn profile banners' },
  { id: 'portfolio',   desc: 'Showcase your projects, work, and skills' },
  { id: 'college',     desc: 'Statements of purpose & personal statements' },
];

/** First step when no category is preset. User picks what to make. */
export function PickCategoryStep({ step, onChooseCategory }) {
  return (
    <StepContainer emoji={step.emoji} title="What do you want to make?" subtitle={step.subtitle}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12,
      }}>
        {ORDER.map((opt) => {
          const w = WIZARDS[opt.id];
          if (!w) return null;
          return (
            <button
              key={opt.id}
              onClick={() => onChooseCategory(opt.id)}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1756C8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              style={{
                background: 'var(--bg-elevated)', border: '1.5px solid var(--border)',
                borderRadius: 14, padding: '16px 14px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6,
                transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div style={{ fontSize: 26 }}>{w.emoji}</div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: 14, color: 'var(--fg-primary)',
              }}>{w.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>
                {opt.desc}
              </div>
            </button>
          );
        })}
      </div>
    </StepContainer>
  );
}
