import { useEffect, useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { useTemplates } from '@hooks/useTemplates.js';
import { templateService } from '@services/templateService.js';
import { documentService }  from '@services/documentService.js';

import { HeroBanner }    from './HeroBanner.jsx';
import { MagicCTA }      from './MagicCTA.jsx';
import { StatsBar }      from './StatsBar.jsx';
import { CategoryStrip } from './CategoryStrip.jsx';
import { TemplateCard }  from './TemplateCard.jsx';
import { RecentCard }    from './RecentCard.jsx';
import { NewDesignCard } from './NewDesignCard.jsx';

/**
 * Home / dashboard screen. Three sections, top to bottom:
 *   • Hero banner + stats
 *   • Recent designs grid
 *   • Template gallery (filterable + searchable)
 */
export function Dashboard({ onOpenTemplate, onLaunchMagic, externalSearch }) {
  const { templates } = useTemplates();
  const [filter, setFilter]     = useState('All');
  const [innerSearch, setInner] = useState('');
  const search = externalSearch || innerSearch;   // topbar search wins when set
  const setSearch = setInner;
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let cancelled = false;
    documentService.list().then((rs) => { if (!cancelled) setRecent(rs); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const filtered = templateService
    .filterByCategory(templates, filter)
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
    });

  const startNew = () => onOpenTemplate(templates[0]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
      <div style={{ padding: '32px 40px', maxWidth: 1160, margin: '0 auto' }}>
        <HeroBanner onStart={startNew} />
        {onLaunchMagic && <MagicCTA onLaunch={onLaunchMagic} />}
        <StatsBar />

        {recent.length > 0 && (
          <div style={{ marginBottom: 38 }}>
            <SectionHeader icon={<Icon name="clock" />} title="Recent designs" />
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px,1fr))', gap: 14,
            }}>
              {recent.map((d, i) => (
                <RecentCard key={d.id} design={d} onOpen={onOpenTemplate} idx={i} />
              ))}
              <NewDesignCard onClick={startNew} />
            </div>
          </div>
        )}

        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16,
              color: 'var(--fg-primary)', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Icon name="grid" /> All templates
            </div>
            <SearchInput value={search} onChange={setSearch} />
          </div>

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
              <div style={{ fontSize: 14, fontWeight: 500 }}>No templates found</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Try a different search or category</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16,
        color: 'var(--fg-primary)', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {icon} {title}
      </div>
      <button style={{
        background: 'none', border: 'none', cursor: 'pointer', fontSize: 12,
        color: 'var(--fg-tertiary)', fontFamily: "'DM Sans', sans-serif",
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        See all <Icon name="arrowR" size={12} />
      </button>
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
          borderRadius: 999, padding: '7px 14px 7px 30px', width: 200,
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--fg-primary)',
          outline: 'none', transition: 'border-color 150ms',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#1756C8')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  );
}
