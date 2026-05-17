import { STEP_META } from './wizardConfig.js';

/** Step pills + gradient bar shown at the top of the wizard. */
export function MagicProgress({ stepIds, stepIndex, jumpTo }) {
  const progress = ((stepIndex + 1) / stepIds.length) * 100;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        height: 4, background: 'var(--bg-elevated)', borderRadius: 999, overflow: 'hidden',
        marginBottom: 18,
      }}>
        <div style={{
          width: `${progress}%`, height: '100%',
          background: 'linear-gradient(90deg,#1756C8,#00C8D4)',
          borderRadius: 999, transition: 'width 350ms cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>

      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'center',
      }}>
        {stepIds.map((id, i) => {
          const meta    = STEP_META[id] || { label: id, emoji: '✨' };
          const done    = i < stepIndex;
          const current = i === stepIndex;
          return (
            <button key={id}
              onClick={() => done && jumpTo(id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
                border: '1px solid', cursor: done ? 'pointer' : 'default',
                fontFamily: "'DM Sans', sans-serif",
                borderColor: current ? '#1756C8' : 'var(--border)',
                background:  current ? 'rgba(23, 86, 200,0.15)' : 'transparent',
                color:       current ? '#5C90FF' : done ? 'var(--fg-secondary)' : 'var(--fg-tertiary)',
                opacity: !current && !done ? 0.6 : 1,
                transition: 'all 150ms',
              }}
            >
              <span style={{ fontSize: 13 }}>{meta.emoji}</span> {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
