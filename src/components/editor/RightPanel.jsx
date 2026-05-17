import { useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { TemplateThumbnail } from '@components/canvas/TemplateThumbnail.jsx';
import { useDocument }  from '@hooks/useDocument.js';
import { useTemplates } from '@hooks/useTemplates.js';
import { FONT_PAIRS }   from '@data/fontPairs.js';

import { SectionRow }       from './SectionRow.jsx';
import { ColorSwatch }      from './ColorSwatch.jsx';
import { AIFillPanel }      from './AIFillPanel.jsx';
import { AddSectionModal }  from './AddSectionModal.jsx';
import { PageSizePicker }   from './PageSizePicker.jsx';
import { AIToolsPanel }     from './AIToolsPanel.jsx';
import { AISuggestionsPanel } from './AISuggestionsPanel.jsx';
import { PhotoUploadControl } from '@components/common/PhotoUploadControl.jsx';

const ACCENT_PRESETS = ['#1756C8', '#00C8D4', '#FF7A1F', '#22C55E', '#EF4444', '#F59E0B', '#EC4899', '#0D1117'];

const TABS = [
  { id: 'sections',    label: 'Sections',  icon: 'section'  },
  { id: 'design',      label: 'Design',    icon: 'palette'  },
  { id: 'elements',    label: 'Templates', icon: 'template' },
  { id: 'ai',          label: 'AI',        emoji: '✨'      },
  { id: 'suggestions', label: 'Tips',      emoji: '💡'      },
];

/** Right panel with three tabs: Sections / Design / Templates. */
export function RightPanel() {
  const {
    template, sections, accent, fontPair, person,
    setSections, setAccent, setFontPair, applyAI, patchPerson,
    fontScale, lineHeight, sectionGap, bulletStyle,
    setFontScale, setLineHeight, setSectionGap, setBulletStyle,
  } = useDocument();
  const { templates } = useTemplates();

  const [tab, setTab]                       = useState('sections');
  const [showAIFill, setShowAIFill]         = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [dragId, setDragId]                 = useState(null);
  const [dragOverId, setDragOverId]         = useState(null);

  const handleToggle = (id) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  };

  const handleDragStart = (id) => setDragId(id);
  const handleDragOver  = (id) => setDragOverId(id);
  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) {
      setDragId(null); setDragOverId(null); return;
    }
    setSections((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((s) => s.id === dragId);
      const to   = arr.findIndex((s) => s.id === targetId);
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
    setDragId(null); setDragOverId(null);
  };

  const handleAddSection = (s) => {
    setSections((prev) => [...prev, { id: s.id, label: s.label, visible: true, locked: false }]);
  };

  return (
    <div style={{
      width: 248, background: 'var(--bg-sidebar)', borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 6px' }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '11px 2px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 500,
              color: active ? '#5C90FF' : 'var(--fg-tertiary)',
              borderBottom: active ? '2px solid #1756C8' : '2px solid transparent',
              transition: 'all 150ms',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              {t.emoji ? <span style={{ fontSize: 12, lineHeight: 1 }}>{t.emoji}</span> : <Icon name={t.icon} />}
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px' }}>
        {tab === 'sections' && (
          <SectionsTab
            sections={sections}
            showAIFill={showAIFill} setShowAIFill={setShowAIFill}
            applyAI={applyAI}
            onToggle={handleToggle}
            onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
            dragId={dragId} dragOverId={dragOverId}
            showAddSection={showAddSection} setShowAddSection={setShowAddSection}
            handleAddSection={handleAddSection}
            person={person} patchPerson={patchPerson}
          />
        )}

        {tab === 'design' && (
          <DesignTab
            accent={accent} setAccent={setAccent}
            fontPair={fontPair} setFontPair={setFontPair}
            fontScale={fontScale}     setFontScale={setFontScale}
            lineHeight={lineHeight}   setLineHeight={setLineHeight}
            sectionGap={sectionGap}   setSectionGap={setSectionGap}
            bulletStyle={bulletStyle} setBulletStyle={setBulletStyle}
          />
        )}

        {tab === 'elements' && (
          <TemplatesTab
            templates={templates} template={template}
          />
        )}

        {tab === 'ai'          && <AIToolsPanel />}
        {tab === 'suggestions' && <AISuggestionsPanel />}
      </div>
    </div>
  );
}

function SectionsTab({
  sections, showAIFill, setShowAIFill, applyAI,
  onToggle, onDragStart, onDragOver, onDrop, dragId, dragOverId,
  showAddSection, setShowAddSection, handleAddSection,
  person, patchPerson,
}) {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <PhotoUploadControl
          photoUrl={person.photoUrl}
          onChange={(url) => patchPerson({ photoUrl: url })}
        />
      </div>
      {!showAIFill && (
        <button
          onClick={() => setShowAIFill(true)}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg,rgba(23, 86, 200,0.2),rgba(0, 200, 212,0.12))')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg,rgba(23, 86, 200,0.12),rgba(0, 200, 212,0.08))')}
          style={{
            width: '100%', marginBottom: 12, padding: '9px 12px', borderRadius: 10,
            background: 'linear-gradient(135deg,rgba(23, 86, 200,0.12),rgba(0, 200, 212,0.08))',
            border: '1px solid rgba(23, 86, 200,0.3)', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
            color: '#5C90FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            transition: 'all 150ms',
          }}
        >
          ✨ AI Fill content
        </button>
      )}

      {showAIFill && <AIFillPanel onClose={() => setShowAIFill(false)} onApply={applyAI} />}

      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
        color: 'var(--fg-tertiary)', marginBottom: 10,
      }}>
        Document sections
      </div>

      {sections.map((s) => (
        <SectionRow key={s.id} section={s} onToggle={onToggle}
          onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
          dragOver={dragOverId === s.id && dragId !== s.id}
        />
      ))}

      <button
        onClick={() => setShowAddSection(true)}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(23, 86, 200,0.5)'; e.currentTarget.style.color = 'var(--fg-secondary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--fg-tertiary)'; }}
        style={{
          width: '100%', marginTop: 10, padding: 8, borderRadius: 8,
          border: '1.5px dashed rgba(255,255,255,0.12)', background: 'transparent',
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
          color: 'var(--fg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 150ms',
        }}
      >
        <Icon name="plus" /> Add section
      </button>

      {showAddSection && (
        <AddSectionModal onAdd={handleAddSection} onClose={() => setShowAddSection(false)} />
      )}
    </div>
  );
}

function DesignTab({
  accent, setAccent, fontPair, setFontPair,
  fontScale, setFontScale, lineHeight, setLineHeight,
  sectionGap, setSectionGap, bulletStyle, setBulletStyle,
}) {
  return (
    <div>
      <Section label="Accent color">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {ACCENT_PRESETS.map((c) => (
            <ColorSwatch key={c} color={c} selected={accent === c} onClick={() => setAccent(c)} />
          ))}
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>Custom:</label>
          <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)}
            style={{
              width: 32, height: 26, borderRadius: 6, border: '1px solid var(--border)',
              cursor: 'pointer', padding: 2, background: 'transparent',
            }}
          />
          <span style={{
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--fg-secondary)',
          }}>{accent}</span>
        </div>
      </Section>

      <Section label="Font pairing">
        {FONT_PAIRS.map((fp) => {
          const active = fontPair.id === fp.id;
          return (
            <div key={fp.id} onClick={() => setFontPair(fp)} style={{
              padding: '10px 12px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
              border: '1.5px solid', transition: 'all 150ms',
              borderColor: active ? '#1756C8' : 'var(--border)',
              background: active ? 'rgba(23, 86, 200,0.1)' : 'var(--bg-elevated)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 3,
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{fp.label}</span>
                {active && (
                  <span style={{ color: '#1756C8', display: 'flex' }}>
                    <Icon name="check" size={14} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--fg-tertiary)' }}>
                {fp.heading.split(',')[0].replace(/'/g, '')} + {fp.body.split(',')[0].replace(/'/g, '')}
              </div>
            </div>
          );
        })}
      </Section>

      <Section label="Page size">
        <PageSizePicker />
      </Section>

      {/* ── Format controls ────────────────────────────────────────── */}
      <Section label="Font size">
        <Slider
          value={fontScale} min={0.75} max={1.30} step={0.05}
          onChange={setFontScale}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      </Section>

      <Section label="Line spacing">
        <Slider
          value={lineHeight} min={1.0} max={2.0} step={0.05}
          onChange={setLineHeight}
          format={(v) => `${v.toFixed(2)}×`}
        />
      </Section>

      <Section label="Section spacing">
        <Slider
          value={sectionGap} min={0} max={32} step={1}
          onChange={setSectionGap}
          format={(v) => `${v}px`}
        />
      </Section>

      <Section label="Bullet style">
        <BulletPicker value={bulletStyle} onChange={setBulletStyle} />
      </Section>
    </div>
  );
}

/** Compact slider with label + numeric readout. */
function Slider({ value, min, max, step, onChange, format }) {
  return (
    <div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#1756C8' }}
      />
      <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textAlign: 'right' }}>
        {format ? format(value) : value}
      </div>
    </div>
  );
}

const BULLET_OPTIONS = [
  { id: 'disc',   label: '●  Filled' },
  { id: 'circle', label: '○  Outline' },
  { id: 'square', label: '■  Square' },
  { id: 'dash',   label: '–  Dash' },
  { id: 'arrow',  label: '→  Arrow' },
  { id: 'none',   label: '   None' },
];

function BulletPicker({ value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
      {BULLET_OPTIONS.map((o) => {
        const active = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)}
            style={{
              padding: '7px 9px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              border: active ? '1.5px solid #1756C8' : '1px solid var(--border)',
              background: active ? 'rgba(23, 86, 200,0.10)' : 'var(--bg-elevated)',
              color: active ? '#5C90FF' : 'var(--fg-primary)',
              textAlign: 'left',
            }}
          >{o.label}</button>
        );
      })}
    </div>
  );
}

function TemplatesTab({ templates, template }) {
  const sameCat = templates.filter((t) => t.cat === template?.cat);
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
        color: 'var(--fg-tertiary)', marginBottom: 10,
      }}>Switch template</div>
      <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginBottom: 12, lineHeight: 1.5 }}>
        Your content is preserved when switching templates.
      </div>
      {sameCat.map((t) => {
        const active = t.id === template?.id;
        return (
          <div key={t.id} style={{
            borderRadius: 10, overflow: 'hidden', marginBottom: 10, cursor: 'pointer',
            border: active ? '2px solid #1756C8' : '1px solid var(--border)',
            transition: 'all 150ms',
          }}>
            <TemplateThumbnail template={t} scale={0.35} />
            <div style={{
              padding: '6px 10px', background: 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--fg-primary)' }}>{t.name}</span>
              {active && (
                <span style={{
                  fontSize: 9, color: '#1756C8',
                  background: 'rgba(23, 86, 200,0.12)', padding: '1px 6px', borderRadius: 999,
                }}>Active</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
        color: 'var(--fg-tertiary)', marginBottom: 10,
      }}>{label}</div>
      {children}
    </div>
  );
}
