import { useEffect, useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { documentService } from '@services/documentService.js';
import { RecentCard }      from '@components/dashboard/RecentCard.jsx';
import { NewDesignCard }   from '@components/dashboard/NewDesignCard.jsx';

/** "My designs" full-page screen. */
export function MyDesignsScreen({ onOpenTemplate }) {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    let cancelled = false;
    documentService.list().then((rs) => { if (!cancelled) setDesigns(rs); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
      <div style={{ padding: '32px 40px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
          color: 'var(--fg-primary)',
        }}>
          <Icon name="file" size={20} /> My designs
        </div>

        {designs.length === 0 ? (
          <Empty onCreate={() => onOpenTemplate(undefined)} />
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px,1fr))', gap: 16,
          }}>
            {designs.map((d, i) => (
              <RecentCard key={d.id} design={d} onOpen={onOpenTemplate} idx={i} />
            ))}
            <NewDesignCard onClick={() => onOpenTemplate(undefined)} />
          </div>
        )}
      </div>
    </div>
  );
}

function Empty({ onCreate }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px dashed var(--border)',
      borderRadius: 16, padding: '48px 32px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 38, marginBottom: 10 }}>📂</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 6 }}>
        No designs yet
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginBottom: 18 }}>
        Pick a template to get started. Anything you create will appear here.
      </div>
      <button onClick={onCreate} style={{
        background: 'linear-gradient(135deg,#1756C8,#00C8D4)', color: '#fff', border: 'none',
        borderRadius: 999, padding: '10px 22px',
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(23, 86, 200,0.35)',
      }}>Create a new design →</button>
    </div>
  );
}
