import { useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { useTemplates }   from '@hooks/useTemplates.js';
import { templateService } from '@services/templateService.js';
import { CategoryStrip }  from '@components/dashboard/CategoryStrip.jsx';
import { TemplateCard }   from '@components/dashboard/TemplateCard.jsx';

/** Dedicated full-page gallery (sidebar → "Templates"). */
export function TemplatesScreen({ onOpenTemplate, externalSearch }) {
  const { templates } = useTemplates();
  const [filter, setFilter] = useState('All');
  const [innerSearch, setInner] = useState('');
  const search = externalSearch || innerSearch;

  const filtered = templateService.filterByCategory(templates, filter)
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
    });

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
      <div style={{ padding: '32px 40px', maxWidth: 1160, margin: '0 auto' }}>
        <ScreenHeader
          icon="grid" title="Templates"
          subtitle="Browse all designs. Click one to start editing."
          rightSlot={!externalSearch && <SearchInput value={innerSearch} onChange={setInner} />}
        />
        <CategoryStrip activeFilter={filter} setFilter={setFilter} />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px,1fr))', gap: 16,
        }}>
          {filtered.map((t, i) => (
            <TemplateCard key={t.id} tpl={t} onOpen={onOpenTemplate} idx={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--fg-tertiary)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>No templates match your search</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScreenHeader({ icon, title, subtitle, rightSlot }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      marginBottom: 24,
    }}>
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
          color: 'var(--fg-primary)', marginBottom: 4,
        }}>
          <Icon name={icon} size={20} /> {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>{subtitle}</div>
        )}
      </div>
      {rightSlot}
    </div>
  );
}

function SearchInput({ value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--fg-tertiary)', pointerEvents: 'none', display: 'flex',
      }}>
        <Icon name="search" size={14} />
      </span>
      <input
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Search templates…"
        style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 999, padding: '8px 14px 8px 32px', width: 220,
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--fg-primary)',
          outline: 'none', transition: 'border-color 150ms',
        }}
      />
    </div>
  );
}
