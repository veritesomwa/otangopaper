// The AI Tools panel — 9 actions exposed inside the right-side panel of the
// editor. Each tool is a thin wrapper around `services/aiTools.js`. Most
// actions either rewrite a single text field (Rewrite / Fix / Shorten / Expand)
// or operate on the whole document (Improve / ATS / Summary / Tailor).

import { useState, useMemo } from 'react';
import { useDocument } from '@hooks/useDocument.js';
import { useToast } from '@hooks/useToast.js';
import { aiTools } from '@services/aiTools.js';

// Each tool is one row in the panel.
const TOOLS = [
  { id: 'improve',  label: 'Improve Resume',     desc: 'Strengthen verbs across all bullets', scope: 'global', emoji: '✨' },
  { id: 'summary',  label: 'Generate Summary',   desc: 'Write a fresh professional summary',  scope: 'global', emoji: '📝' },
  { id: 'ats',      label: 'ATS Optimization',   desc: 'Score keyword coverage + suggest',    scope: 'global', emoji: '🎯' },
  { id: 'tailor',   label: 'Tailor for Job',     desc: 'Match resume against a JD',           scope: 'jd',     emoji: '🧭' },
  { id: 'rewrite',  label: 'Rewrite Pro',        desc: 'Make it sound more professional',     scope: 'field',  emoji: '🪄' },
  { id: 'grammar',  label: 'Fix Grammar',        desc: 'Typos, casing, punctuation',          scope: 'field',  emoji: '🛠' },
  { id: 'shorten',  label: 'Shorten Text',       desc: 'Trim to ~70% of length',              scope: 'field',  emoji: '✂️' },
  { id: 'expand',   label: 'Expand Content',     desc: 'Add detail + impact clauses',         scope: 'field',  emoji: '📈' },
];

export function AIToolsPanel() {
  const { person, applyAI, patchPath, patchPerson } = useDocument();
  const { push: pushToast } = useToast();

  const [busyId, setBusyId]   = useState(null);
  const [target, setTarget]   = useState({ kind: 'summary' });
  const [jd,     setJD]       = useState('');
  const [result, setResult]   = useState(null);

  // Build the dropdown options for per-field actions: summary + every bullet.
  const targetOptions = useMemo(() => {
    const opts = [{ value: 'summary', label: 'Summary' }];
    (person.experience || []).forEach((e, ei) => {
      (e.bullets || []).forEach((b, bi) => {
        const preview = (b || '').slice(0, 38) + ((b || '').length > 38 ? '…' : '');
        opts.push({ value: `bullet:${ei}:${bi}`, label: `${e.company} • bullet ${bi + 1}: ${preview}` });
      });
    });
    return opts;
  }, [person]);

  /** Read the current value of whatever target the user picked. */
  function readTarget() {
    if (target.kind === 'summary') return person.summary || '';
    if (target.kind === 'bullet') return person.experience?.[target.ei]?.bullets?.[target.bi] || '';
    return '';
  }

  /** Write a transformed value back to the active target. */
  function writeTarget(value) {
    if (target.kind === 'summary')      patchPath('summary', value);
    else if (target.kind === 'bullet')  patchPath(`experience.${target.ei}.bullets.${target.bi}`, value);
  }

  /** Parse a target descriptor (e.g. "bullet:0:2") into our internal shape. */
  function setTargetFromValue(v) {
    if (v === 'summary') return setTarget({ kind: 'summary' });
    const m = v.match(/^bullet:(\d+):(\d+)$/);
    if (m) setTarget({ kind: 'bullet', ei: parseInt(m[1], 10), bi: parseInt(m[2], 10) });
  }

  async function runTool(tool) {
    setBusyId(tool.id);
    setResult(null);
    try {
      switch (tool.id) {
        case 'improve': {
          const r = await aiTools.improveResume(person);
          // Apply the strengthened person back via patchPerson (full replace of
          // person except contact info, which we don't touch). We just merge
          // the experience + summary.
          patchPerson({ summary: r.person.summary, experience: r.person.experience });
          setResult({ kind: 'message', text: r.message });
          pushToast(r.message, { type: 'success' });
          break;
        }
        case 'summary': {
          const text = await aiTools.generateSummary(person);
          patchPath('summary', text);
          setResult({ kind: 'message', text: 'Summary regenerated.' });
          pushToast('Summary regenerated', { type: 'success' });
          break;
        }
        case 'ats': {
          const r = await aiTools.atsOptimize(person);
          setResult({ kind: 'ats', ...r });
          pushToast(r.message, { type: 'success' });
          break;
        }
        case 'tailor': {
          if (!jd.trim()) {
            pushToast('Paste a job description first', { type: 'info' });
            break;
          }
          const r = await aiTools.tailorForJD(person, jd);
          setResult({ kind: 'tailor', ...r });
          pushToast(r.message, { type: 'success' });
          break;
        }
        case 'rewrite': {
          const v = readTarget(); if (!v) { pushToast('Target is empty', { type: 'info' }); break; }
          const out = await aiTools.rewriteProfessionally(v);
          writeTarget(out); setResult({ kind: 'preview', before: v, after: out });
          pushToast('Rewrote target', { type: 'success' });
          break;
        }
        case 'grammar': {
          const v = readTarget(); if (!v) { pushToast('Target is empty', { type: 'info' }); break; }
          const out = await aiTools.fixGrammar(v);
          writeTarget(out); setResult({ kind: 'preview', before: v, after: out });
          pushToast('Grammar fixed', { type: 'success' });
          break;
        }
        case 'shorten': {
          const v = readTarget(); if (!v) { pushToast('Target is empty', { type: 'info' }); break; }
          const out = await aiTools.shortenText(v);
          writeTarget(out); setResult({ kind: 'preview', before: v, after: out });
          pushToast('Shortened', { type: 'success' });
          break;
        }
        case 'expand': {
          const v = readTarget(); if (!v) { pushToast('Target is empty', { type: 'info' }); break; }
          const out = await aiTools.expandContent(v);
          writeTarget(out); setResult({ kind: 'preview', before: v, after: out });
          pushToast('Expanded', { type: 'success' });
          break;
        }
        default: break;
      }
    } catch (err) {
      pushToast(err.message || 'AI action failed', { type: 'error' });
    } finally {
      setBusyId(null);
    }
  }

  /** Add the suggested skills from an ATS / Tailor result. */
  function addSkills(skills) {
    if (!skills?.length) return;
    const existing = new Set((person.skills || []).map((s) => s.toLowerCase()));
    const merged = [...(person.skills || [])];
    skills.forEach((s) => { if (!existing.has(s.toLowerCase())) merged.push(s); });
    patchPath('skills', merged);
    pushToast(`Added ${skills.length} skill${skills.length === 1 ? '' : 's'}`, { type: 'success' });
  }

  return (
    <div style={{ padding: '14px 12px', overflowY: 'auto', flex: 1 }}>
      {/* Per-field target picker */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Target text</label>
        <select
          value={
            target.kind === 'summary' ? 'summary' :
            target.kind === 'bullet'  ? `bullet:${target.ei}:${target.bi}` : ''
          }
          onChange={(e) => setTargetFromValue(e.target.value)}
          style={selectStyle}
        >
          {targetOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 4 }}>
          Used by Rewrite / Grammar / Shorten / Expand.
        </div>
      </div>

      {/* Tool buttons */}
      <div style={{ display: 'grid', gap: 8 }}>
        {TOOLS.map((t) => (
          <ToolRow key={t.id} tool={t} busy={busyId === t.id} onClick={() => runTool(t)} />
        ))}
      </div>

      {/* JD textarea — appears below the Tailor button */}
      <div style={{ marginTop: 14 }}>
        <label style={labelStyle}>Job description (for Tailor for Job)</label>
        <textarea
          value={jd}
          onChange={(e) => setJD(e.target.value)}
          placeholder="Paste the JD here…"
          style={{
            width: '100%', minHeight: 90, padding: 8, borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
            color: 'var(--fg-primary)', fontSize: 11, fontFamily: "'DM Sans', sans-serif",
            resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Result panel */}
      {result && <ResultPanel result={result} addSkills={addSkills} />}
    </div>
  );
}

function ToolRow({ tool, busy, onClick }) {
  return (
    <button
      onClick={onClick} disabled={busy}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10,
        border: '1px solid var(--border)', background: 'var(--bg-elevated)',
        cursor: busy ? 'wait' : 'pointer', textAlign: 'left',
        opacity: busy ? 0.7 : 1,
        transition: 'background 120ms, transform 120ms',
      }}
      onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = '#1756C814'; }}
      onMouseLeave={(e) => { if (!busy) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
    >
      <span style={{ fontSize: 18, lineHeight: 1, width: 24, textAlign: 'center' }}>
        {busy ? '⏳' : tool.emoji}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{tool.label}</div>
        <div style={{ fontSize: 10, color: 'var(--fg-tertiary)' }}>{tool.desc}</div>
      </span>
    </button>
  );
}

function ResultPanel({ result, addSkills }) {
  if (result.kind === 'message') {
    return (
      <div style={resultBoxStyle}>
        <div style={{ fontSize: 11, color: 'var(--fg-secondary)' }}>{result.text}</div>
      </div>
    );
  }
  if (result.kind === 'preview') {
    return (
      <div style={resultBoxStyle}>
        <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', marginBottom: 4 }}>Before:</div>
        <div style={{ fontSize: 10.5, color: 'var(--fg-secondary)', marginBottom: 8, fontStyle: 'italic' }}>
          {result.before.slice(0, 200)}{result.before.length > 200 ? '…' : ''}
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', marginBottom: 4 }}>After:</div>
        <div style={{ fontSize: 10.5, color: 'var(--fg-primary)' }}>
          {result.after}
        </div>
      </div>
    );
  }
  if (result.kind === 'ats') {
    return (
      <div style={resultBoxStyle}>
        <ScoreBar label="ATS Score" score={result.score} />
        <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 8 }}>
          Detected role: <strong>{result.domain}</strong> · {result.presentCount} keywords found · {result.missingCount} missing.
        </div>
        {result.suggestSkills?.length > 0 && (
          <>
            <div style={{ marginTop: 10, marginBottom: 6, fontSize: 11, color: 'var(--fg-primary)', fontWeight: 600 }}>
              Suggested skills to add:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {result.suggestSkills.map((s) => (
                <span key={s} style={chipStyle}>{s}</span>
              ))}
            </div>
            <button onClick={() => addSkills(result.suggestSkills)} style={primaryBtnStyle}>
              Add all to Skills
            </button>
          </>
        )}
      </div>
    );
  }
  if (result.kind === 'tailor') {
    return (
      <div style={resultBoxStyle}>
        <ScoreBar label="JD Match" score={result.matchRate} />
        {result.matched?.length > 0 && (
          <>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-primary)', fontWeight: 600 }}>
              ✓ Already in resume:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
              {result.matched.map((k) => (
                <span key={k} style={{ ...chipStyle, background: '#22C55E18', color: '#15803D', borderColor: '#22C55E33' }}>{k}</span>
              ))}
            </div>
          </>
        )}
        {result.missing?.length > 0 && (
          <>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-primary)', fontWeight: 600 }}>
              ✗ Missing from resume:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4, marginBottom: 8 }}>
              {result.missing.map((k) => (
                <span key={k} style={{ ...chipStyle, background: '#EF444418', color: '#B91C1C', borderColor: '#EF444433' }}>{k}</span>
              ))}
            </div>
            {result.suggestSkills?.length > 0 && (
              <button onClick={() => addSkills(result.suggestSkills)} style={primaryBtnStyle}>
                Add top {result.suggestSkills.length} to Skills
              </button>
            )}
          </>
        )}
      </div>
    );
  }
  return null;
}

function ScoreBar({ label, score }) {
  const color = score >= 75 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--fg-secondary)' }}>{label}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, transition: 'width 300ms' }} />
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 };
const selectStyle = {
  width: '100%', padding: '6px 8px', borderRadius: 6, fontSize: 11,
  border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--fg-primary)',
};
const resultBoxStyle = {
  marginTop: 14, padding: 10, borderRadius: 10, background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
};
const chipStyle = {
  fontSize: 9.5, padding: '2px 7px', borderRadius: 999,
  background: '#1756C814', color: '#1756C8', border: '1px solid #1756C833',
};
const primaryBtnStyle = {
  width: '100%', padding: '7px 10px', borderRadius: 8,
  background: '#1756C8', color: '#fff', border: 'none', fontSize: 11, fontWeight: 600,
  cursor: 'pointer',
};
