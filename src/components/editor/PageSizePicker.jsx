import { useDocument } from '@hooks/useDocument.js';
import { PAGE_SIZES }  from '@data/pageSizes.js';

/** Active page-size selector inside the right panel's Design tab. */
export function PageSizePicker() {
  const { pageSize, setPageSize } = useDocument();

  return (
    <>
      {PAGE_SIZES.map((s) => {
        const active = pageSize.id === s.id;
        return (
          <div key={s.id} onClick={() => setPageSize(s)} style={{
            padding: '8px 12px', borderRadius: 8, marginBottom: 5, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid', fontSize: 11, color: 'var(--fg-secondary)',
            background: active ? 'rgba(23, 86, 200,0.1)' : 'transparent',
            borderColor: active ? '#1756C8' : 'var(--border)',
            transition: 'all 150ms',
          }}>
            <span><strong style={{ color: 'var(--fg-primary)' }}>{s.label}</strong> · {s.sub}</span>
            {active && <span style={{ color: '#1756C8', fontSize: 10 }}>● Active</span>}
          </div>
        );
      })}
    </>
  );
}
