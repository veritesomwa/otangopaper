import { Icon } from '@components/common/Icon.jsx';
import { useTemplates } from '@hooks/useTemplates.js';
import { useStarred }   from '@hooks/useStarred.js';
import { TemplateCard } from '@components/dashboard/TemplateCard.jsx';

/** "Starred" templates — populated from localStorage via useStarred(). */
export function StarredScreen({ onOpenTemplate }) {
  const { templates } = useTemplates();
  const { ids, toggle } = useStarred();
  const starred = templates.filter((t) => ids.includes(t.id));

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
      <div style={{ padding: '32px 40px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
          color: 'var(--fg-primary)',
        }}>
          <Icon name="star" size={20} /> Starred templates
        </div>

        {starred.length === 0 ? (
          <Empty />
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px,1fr))', gap: 16,
          }}>
            {starred.map((t, i) => (
              <div key={t.id} style={{ position: 'relative' }}>
                <TemplateCard tpl={t} onOpen={onOpenTemplate} idx={i} />
                <button
                  title="Remove star"
                  onClick={(e) => { e.stopPropagation(); toggle(t.id); }}
                  style={{
                    position: 'absolute', top: 14, left: 12, zIndex: 5,
                    background: 'rgba(245,158,11,0.95)', color: '#fff', border: 'none',
                    borderRadius: 999, padding: '3px 10px', fontSize: 10, fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >★</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px dashed var(--border)',
      borderRadius: 16, padding: '48px 32px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 38, marginBottom: 10 }}>⭐</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 6 }}>
        Nothing starred yet
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>
        Open a template, hit the ★ button, and it'll show up here.
      </div>
    </div>
  );
}
