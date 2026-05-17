import { StepContainer } from '../StepContainer.jsx';
import { MagicStepNav }  from '../MagicStepNav.jsx';

/** Splash step that explains what the wizard does. */
export function WelcomeStep({ step, magic }) {
  const points = [
    { icon: '⏱️', title: 'Takes ~3 minutes',     sub: 'Eight short steps, each one focused.' },
    { icon: '✨', title: 'Switch styles freely',  sub: 'Your content slots into any template.' },
    { icon: '💾', title: 'Auto-saves',            sub: 'You can come back and edit any time.' },
  ];
  return (
    <StepContainer emoji={step.emoji} title="Magic Resume Tool" subtitle={step.subtitle}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 4,
      }}>
        {points.map((p) => (
          <div key={p.title} style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '14px 14px',
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{p.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 3 }}>{p.title}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>{p.sub}</div>
          </div>
        ))}
      </div>
      <MagicStepNav
        isFirst={magic.isFirst} isLast={magic.isLast} canSkip={false}
        onBack={magic.back} onNext={magic.next}
        nextLabel="Start"
      />
    </StepContainer>
  );
}
