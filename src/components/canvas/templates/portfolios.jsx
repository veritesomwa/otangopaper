// Portfolio renderers — every text node is click-to-edit.

import { EditableText } from '@components/common/EditableText.jsx';
import { PhotoFill } from '../PhotoFill.jsx';

function makeE(readOnly, onPatch) {
  return (path, value, style, opts = {}) => (
    <EditableText
      value={value} readOnly={readOnly}
      onChange={(v) => onPatch?.(path, v)}
      tag={opts.tag || 'span'}
      multiline={opts.multiline}
      placeholder={opts.placeholder}
      style={style}
    />
  );
}

const DEFAULT_DESIGN_PROJECTS = [
  { title: 'Design System',        client: 'Figma',       year: '2024', tags: ['UX', 'Systems'] },
  { title: 'Mobile App Redesign',  client: 'Airbnb',      year: '2023', tags: ['Mobile', 'Research'] },
  { title: 'Brand Identity',       client: 'Startup Co.', year: '2023', tags: ['Branding', 'Visual'] },
  { title: 'Data Dashboard',       client: 'TechCorp',    year: '2022', tags: ['UI', 'Data Viz'] },
];

export function PortfolioDesignCanvas({ accent, person, readOnly, onPatch }) {
  const projects = (person.portfolio?.projects && person.portfolio.projects.length > 0)
    ? person.portfolio.projects
    : DEFAULT_DESIGN_PROJECTS;
  const E = makeE(readOnly, onPatch);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', fontSize: 10 }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${accent},#00C8D4)`, padding: '28px 30px 22px', color: '#fff' }}>
        <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>
          Portfolio
        </div>
        {E('name', person.name, {
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 4, display: 'block',
        }, { tag: 'div' })}
        {E('title', person.title, { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 14, display: 'block' }, { tag: 'div' })}
        <div style={{ display: 'flex', gap: 16, fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>
          <span>✉ {E('email',    person.email,    { display: 'inline' })}</span>
          <span>🌐 {E('website',  person.website,  { display: 'inline' })}</span>
          <span>📍 {E('location', person.location, { display: 'inline' })}</span>
        </div>
      </div>
      {/* About */}
      <div style={{ padding: '16px 28px', borderBottom: '1px solid #eee' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>
          About
        </div>
        {E('summary', person.summary, {
          fontSize: 9.5, lineHeight: 1.7, color: '#555', maxWidth: '80%', display: 'block',
        }, { tag: 'div', multiline: true })}
      </div>
      {/* Projects grid */}
      <div style={{ padding: '16px 28px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#aaa', marginBottom: 12 }}>
          Selected Work
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {projects.map((p, i) => (
            <div key={p.title + i} style={{ background: `${accent}${i % 2 === 0 ? '08' : '05'}`, borderRadius: 10,
              padding: '12px 14px', border: `1px solid ${accent}18` }}>
              <div style={{ height: 44, background: `${accent}${i === 0 ? '18' : '0d'}`, borderRadius: 6,
                marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎨</div>
              {E(`portfolio.projects.${i}.title`, p.title, {
                fontWeight: 700, fontSize: 10, color: '#111', marginBottom: 2, display: 'block',
              }, { tag: 'div' })}
              <div style={{ fontSize: 8.5, color: '#888', marginBottom: 5 }}>
                {E(`portfolio.projects.${i}.client`, p.client, { display: 'inline' })}
                {' · '}
                {E(`portfolio.projects.${i}.year`,   p.year,   { display: 'inline' })}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ background: `${accent}15`, color: accent, fontSize: 7.5,
                    padding: '1px 6px', borderRadius: 999 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Skills */}
      <div style={{ padding: '0 28px 16px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>
          Core Skills
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {(person.skills || []).map(s => (
            <span key={s} style={{ background: `${accent}12`, color: accent, fontSize: 8.5,
              padding: '3px 9px', borderRadius: 999, border: `1px solid ${accent}28` }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}


const DEFAULT_DEV_PROJECTS = [
  { title: 'distributed-cache',  lang: 'Go',         stars: 1240, desc: 'High-performance caching layer' },
  { title: 'react-motion-kit',   lang: 'TypeScript', stars: 892,  desc: 'Animation primitives for React' },
  { title: 'ml-inference-api',   lang: 'Python',     stars: 623,  desc: 'Deploy ML models in one command' },
];

export function PortfolioDevCanvas({ accent, person, readOnly, onPatch }) {
  const projects = (person.portfolio?.projects && person.portfolio.projects.length > 0)
    ? person.portfolio.projects.map((p, i) => ({ ...DEFAULT_DEV_PROJECTS[i] || {}, ...p }))
    : DEFAULT_DEV_PROJECTS;
  const mono = "'JetBrains Mono', monospace";
  const E = makeE(readOnly, onPatch);
  return (
    <div style={{ fontFamily: mono, height: '100%', background: '#0D1117', fontSize: 9.5, color: '#A8B0C0' }}>
      <div style={{ padding: '28px 28px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg,${accent},#00C8D4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            <PhotoFill photoUrl={person.photoUrl} />
          </div>
          <div>
            {E('name', person.name, {
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: '#F4F7FC', display: 'block',
            }, { tag: 'div' })}
            {E('title', person.title, { color: accent, fontSize: 10.5, marginTop: 2, display: 'block' }, { tag: 'div' })}
            <div style={{ fontSize: 8.5, color: '#5C6474', marginTop: 2 }}>
              {E('website',  person.website,  { display: 'inline' })}
              {' · '}
              {E('location', person.location, { display: 'inline' })}
            </div>
          </div>
        </div>
        <div style={{ background: '#1A1F2E', borderRadius: 8, padding: '12px 14px', marginBottom: 16,
          borderLeft: `3px solid ${accent}` }}>
          <div style={{ color: accent, fontSize: 8, marginBottom: 4 }}>/** about */</div>
          {E('summary', person.summary, {
            fontSize: 9, lineHeight: 1.65, color: '#A8B0C0', display: 'block',
          }, { tag: 'div', multiline: true })}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#5C6474', marginBottom: 8 }}>{'// skills'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {[...(person.skills || []), 'Go', 'Rust', 'Docker', 'K8s'].slice(0, 10).map(s => (
              <span key={s} style={{ background: `${accent}15`, color: accent, fontSize: 8,
                padding: '2px 8px', borderRadius: 4, border: `1px solid ${accent}2a` }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ color: '#5C6474', marginBottom: 8 }}>{'// pinned projects'}</div>
          {projects.map((p, i) => (
            <div key={p.title + i} style={{ background: '#1A1F2E', borderRadius: 8, padding: '10px 12px',
              marginBottom: 8, border: '1px solid #232838' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                {E(`portfolio.projects.${i}.title`, p.title, {
                  color: '#5C90FF', fontWeight: 700, fontSize: 10,
                })}
                <span style={{ fontSize: 8.5, color: '#5C6474' }}>⭐ {(p.stars || 0).toLocaleString()}</span>
              </div>
              {E(`portfolio.projects.${i}.desc`, p.desc, {
                fontSize: 8.5, color: '#7C8698', marginBottom: 4, display: 'block',
              }, { tag: 'div', multiline: true })}
              <span style={{ background: `${accent}18`, color: accent, fontSize: 7.5, padding: '1px 7px', borderRadius: 3 }}>{p.lang}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
