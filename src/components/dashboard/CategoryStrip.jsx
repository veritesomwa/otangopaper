import { TEMPLATE_CATS } from '@data/templates.js';
import { CAT_ICONS } from './categoryColors.js';

/** Pill row of categories above the template grid. */
export function CategoryStrip({ activeFilter, setFilter }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
      {TEMPLATE_CATS.map((c) => {
        const active = activeFilter === c;
        return (
          <button key={c} onClick={() => setFilter(c)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
            borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            border: '1.5px solid', fontFamily: "'DM Sans', sans-serif",
            transition: 'all 150ms',
            background: active ? 'rgba(23, 86, 200,0.16)' : 'transparent',
            borderColor: active ? '#1756C8' : 'var(--border)',
            color: active ? '#5C90FF' : 'var(--fg-secondary)',
          }}>
            <span style={{ fontSize: 13 }}>{CAT_ICONS[c]}</span> {c}
          </button>
        );
      })}
    </div>
  );
}
