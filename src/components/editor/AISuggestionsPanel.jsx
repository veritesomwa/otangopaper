// Live AI Suggestions panel — re-scans the resume whenever it changes and
// surfaces actionable issues with one-click fix buttons. Re-uses the same
// transformations from `services/aiTools.js` for the fix actions.

import { useEffect, useState } from 'react';
import { useDocument } from '@hooks/useDocument.js';
import { useToast } from '@hooks/useToast.js';
import { aiTools } from '@services/aiTools.js';

const SEVERITY_COLOR = {
  high:   { bg: '#EF444418', fg: '#B91C1C', border: '#EF444433' },
  medium: { bg: '#F59E0B1A', fg: '#B45309', border: '#F59E0B40' },
  low:    { bg: '#1756C814', fg: '#1756C8', border: '#1756C833' },
};

export function AISuggestionsPanel() {
  const { person, patchPath } = useDocument();
  const { push: pushToast } = useToast();
  const [scan, setScan]   = useState({ score: 100, suggestions: [] });
  const [busyId, setBusy] = useState(null);

  // Re-run the analyzer whenever the resume content changes. Debounced via
  // the natural async delay built into analyzeResume().
  useEffect(() => {
    let cancelled = false;
    aiTools.analyzeResume(person).then((r) => { if (!cancelled) setScan(r); });
    return () => { cancelled = true; };
  }, [person]);

  async function applyFix(s) {
    setBusy(s.id);
    try {
      switch (s.fix) {
        case 'generate-summary': {
          const text = await aiTools.generateSummary(person);
          patchPath('summary', text);
          pushToast('Summary generated', { type: 'success' });
          break;
        }
        case 'expand-summary': {
          const out = await aiTools.expandContent(person.summary || '');
          patchPath('summary', out);
          pushToast('Summary expanded', { type: 'success' });
          break;
        }
        case 'shorten-summary': {
          const out = await aiTools.shortenText(person.summary || '');
          patchPath('summary', out);
          pushToast('Summary shortened', { type: 'success' });
          break;
        }
        case 'improve-bullet': {
          if (!s.target) break;
          const path = `experience.${s.target.ei}.bullets.${s.target.bi}`;
          const current = person.experience?.[s.target.ei]?.bullets?.[s.target.bi] || '';
          // Run the strengthen pass via improveResume on a tiny synthetic person
          const r = await aiTools.improveResume({
            ...person,
            summary: '',
            experience: [{ ...person.experience[s.target.ei], bullets: [current] }],
          });
          patchPath(path, r.person.experience[0].bullets[0]);
          pushToast('Bullet strengthened', { type: 'success' });
          break;
        }
        case 'shorten-bullet': {
          if (!s.target) break;
          const path = `experience.${s.target.ei}.bullets.${s.target.bi}`;
          const current = person.experience?.[s.target.ei]?.bullets?.[s.target.bi] || '';
          const out = await aiTools.shortenText(current);
          patchPath(path, out);
          pushToast('Bullet shortened', { type: 'success' });
          break;
        }
        default: break;
      }
    } catch (err) {
      pushToast(err.message || 'Could not apply fix', { type: 'error' });
    } finally {
      setBusy(null);
    }
  }

  const grouped = {
    high:   scan.suggestions.filter((s) => s.severity === 'high'),
    medium: scan.suggestions.filter((s) => s.severity === 'medium'),
    low:    scan.suggestions.filter((s) => s.severity === 'low'),
  };

  return (
    <div style={{ padding: '14px 12px', overflowY: 'auto', flex: 1 }}>
      {/* Score header */}
      <div style={{
        padding: '14px 12px', borderRadius: 12, background: 'var(--bg-elevated)',
        border: '1px solid var(--border)', marginBottom: 14, textAlign: 'center',
      }}>
        <div style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
          Resume Score
        </div>
        <div style={{
          fontSize: 36, fontWeight: 800,
          color: scan.score >= 75 ? '#22C55E' : scan.score >= 50 ? '#F59E0B' : '#EF4444',
          fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1, marginTop: 4,
        }}>
          {scan.score}<span style={{ fontSize: 16, color: 'var(--fg-tertiary)', fontWeight: 500 }}> / 100</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-secondary)', marginTop: 6 }}>
          {scan.suggestions.length === 0
            ? 'No issues — looking great.'
            : `${scan.suggestions.length} suggestion${scan.suggestions.length === 1 ? '' : 's'} below.`}
        </div>
      </div>

      {/* Grouped suggestions */}
      {scan.suggestions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {grouped.high.length   > 0 && <Group label="Critical"     items={grouped.high}   busyId={busyId} onFix={applyFix} />}
          {grouped.medium.length > 0 && <Group label="Improvements" items={grouped.medium} busyId={busyId} onFix={applyFix} />}
          {grouped.low.length    > 0 && <Group label="Polish"       items={grouped.low}    busyId={busyId} onFix={applyFix} />}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: 18, textAlign: 'center', color: 'var(--fg-tertiary)', fontSize: 11 }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
      <div>Your resume is clean — no issues detected.</div>
    </div>
  );
}

function Group({ label, items, busyId, onFix }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 9.5, fontWeight: 700, color: 'var(--fg-tertiary)',
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        {items.map((s) => <SuggestionRow key={s.id} s={s} busy={busyId === s.id} onFix={onFix} />)}
      </div>
    </div>
  );
}

function SuggestionRow({ s, busy, onFix }) {
  const c = SEVERITY_COLOR[s.severity];
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 8, background: c.bg,
      border: `1px solid ${c.border}`, fontSize: 10.5, color: 'var(--fg-primary)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
        <span style={{ fontSize: 9.5, fontWeight: 600, color: c.fg, textTransform: 'uppercase', letterSpacing: 1 }}>
          {s.area}
        </span>
      </div>
      <div style={{ color: 'var(--fg-secondary)', lineHeight: 1.45 }}>{s.text}</div>
      {s.fix && (
        <button
          onClick={() => onFix(s)} disabled={busy}
          style={{
            marginTop: 6, padding: '4px 10px', borderRadius: 6,
            background: c.fg, color: '#fff', border: 'none', fontSize: 10, fontWeight: 600,
            cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? 'Fixing…' : 'Apply fix'}
        </button>
      )}
    </div>
  );
}
