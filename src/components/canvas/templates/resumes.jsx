// Auto-grouped renderers used by TemplateCanvas. Each component is a pure
// function of (person, sections, accent, fontHeading, fontBody).

import { EditableText } from '@components/common/EditableText.jsx';
import { ReferencesBlock } from './ReferencesBlock.jsx';
import { SkillChip } from '@components/common/SkillChip.jsx';
import { PhotoFill } from '../PhotoFill.jsx';

export function ModernResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  return (
    <div style={{ fontFamily:fontBody, height:'100%', display:'flex', fontSize:10 }}>
      {/* Left sidebar */}
      <div style={{ width:195, background:accent, padding:'28px 18px', display:'flex',
        flexDirection:'column', gap:0, flexShrink:0, color:'#fff' }}>
        {/* Photo */}
        <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,0.25)',
          margin:'0 auto 14px', border:'3px solid rgba(255,255,255,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
          <PhotoFill photoUrl={person.photoUrl} />
        </div>
        {/* Name */}
        <EditableText value={person.name} readOnly={readOnly}
          style={{ fontFamily:fontHeading, fontWeight:700, fontSize:14, textAlign:'center',
            lineHeight:1.2, marginBottom:5, color:'#fff', display:'block' }} tag='div' onChange={(v) => onPatch?.('name', v)} />
        <EditableText value={person.title} readOnly={readOnly}
          style={{ fontSize:9, textAlign:'center', color:'rgba(255,255,255,0.8)',
            marginBottom:16, display:'block', lineHeight:1.4 }} tag='div' onChange={(v) => onPatch?.('title', v)} />
        <div style={{ height:1, background:'rgba(255,255,255,0.2)', marginBottom:14 }}></div>
        {/* Contact */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
            color:'rgba(255,255,255,0.6)', marginBottom:7 }}>Contact</div>
          {[['✉', person.email], ['📱', person.phone], ['📍', person.location], ['🌐', person.website]].map(([ic, v])=>(
            <div key={v} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:5, color:'rgba(255,255,255,0.85)', fontSize:9 }}>
              <span style={{ fontSize:9, lineHeight:1.5 }}>{ic}</span>
              <span style={{ lineHeight:1.4 }}>{v}</span>
            </div>
          ))}
        </div>
        {/* Skills */}
        {vis('skills') && <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
            color:'rgba(255,255,255,0.6)', marginBottom:7 }}>Skills</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
            {person.skills.map((s,si)=>(
              <span key={s} style={{ background:'rgba(255,255,255,0.18)', color:'#fff', fontSize:8,
                padding:'2px 7px', borderRadius:999 }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span>
            ))}
          </div>
        </div>}
        {/* Languages */}
        {vis('languages') && <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
            color:'rgba(255,255,255,0.6)', marginBottom:7 }}>Languages</div>
          {person.languages.map((l,li)=>(
            <div key={li} style={{ fontSize:9, color:'rgba(255,255,255,0.85)', marginBottom:4, display:'flex', justifyContent:'space-between' }}>
              <span>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ opacity:.7 }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
            </div>
          ))}
        </div>}
        {/* Hobbies */}
        {vis('hobbies') && <div>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
            color:'rgba(255,255,255,0.6)', marginBottom:7 }}>Interests</div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.8)', lineHeight:1.6 }}>
            {(person.hobbies||[]).map((h, hi) => (
              <span key={hi}>
                {hi > 0 && ' · '}
                <EditableText value={h} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} tag='span' />
              </span>
            ))}
          </div>
        </div>}

        {vis('references') && <ReferencesBlock
          references={person.references || []}
          accent={accent} readOnly={readOnly} onPatch={onPatch}
          fontHeading={fontHeading}
          compact={false} />}
      </div>
      {/* Main content */}
      <div style={{ flex:1, padding:'28px 22px', overflowY:'auto' }}>
        {/* Summary */}
        {vis('summary') && <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:fontHeading, fontSize:10, fontWeight:700, letterSpacing:1.5,
            textTransform:'uppercase', color:accent, marginBottom:6, borderBottom:`2px solid ${accent}`, paddingBottom:3 }}>
            Professional Summary
          </div>
          <EditableText value={person.summary} readOnly={readOnly}
            style={{ fontSize:9.5, lineHeight:1.65, color:'#444', display:'block' }} tag='div' onChange={(v) => onPatch?.('summary', v)} />
        </div>}
        {/* Experience */}
        {vis('experience') && <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:fontHeading, fontSize:10, fontWeight:700, letterSpacing:1.5,
            textTransform:'uppercase', color:accent, marginBottom:8, borderBottom:`2px solid ${accent}`, paddingBottom:3 }}>
            Experience
          </div>
          {person.experience.map((e,ei)=>(
            <div key={e.id} style={{ marginBottom:11 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:2 }}>
                <span style={{ fontFamily:fontHeading, fontWeight:700, fontSize:10.5, color:'#222' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                <span style={{ fontSize:8.5, color:'#888', flexShrink:0 }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
              </div>
              <div style={{ fontSize:9, fontWeight:600, color:accent, marginBottom:4 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
              <ul style={{ paddingLeft:12, margin:0 }}>
                {e.bullets.map((b,i)=>(
                  <li key={i} style={{ fontSize:9, lineHeight:1.6, color:'#555', marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>}
        {/* Education */}
        {vis('education') && <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:fontHeading, fontSize:10, fontWeight:700, letterSpacing:1.5,
            textTransform:'uppercase', color:accent, marginBottom:8, borderBottom:`2px solid ${accent}`, paddingBottom:3 }}>
            Education
          </div>
          {person.education.map((e,edi)=>(
            <div key={e.id} style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:10, color:'#222' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                <div style={{ fontSize:9, color:'#666' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div>
              </div>
              <div style={{ fontSize:8.5, color:'#888', flexShrink:0 }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}

// ── MINIMAL template ─────────────────────────────────────────


export function MinimalResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  return (
    <div style={{ fontFamily:fontBody, padding:'42px 48px', fontSize:10, color:'#222', height:'100%', boxSizing:'border-box' }}>
      <EditableText value={person.name} readOnly={readOnly}
        style={{ fontFamily:fontHeading, fontWeight:700, fontSize:28, letterSpacing:'-0.03em',
          color:'#111', display:'block', marginBottom:3, lineHeight:1.1 }} tag='div' onChange={(v) => onPatch?.('name', v)} />
      <EditableText value={person.title} readOnly={readOnly}
        style={{ fontSize:12, color:accent, fontWeight:500, display:'block', marginBottom:10 }} tag='div' onChange={(v) => onPatch?.('title', v)} />
      {/* Contact row */}
      <div style={{ display:'flex', gap:16, fontSize:9, color:'#777', marginBottom:24, borderBottom:'1px solid #e0e0e0', paddingBottom:14 }}>
        <><EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' /><EditableText value={person.phone} readOnly={readOnly} onChange={(v)=>onPatch?.('phone', v)} tag='span' /><EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' /><EditableText value={person.website} readOnly={readOnly} onChange={(v)=>onPatch?.('website', v)} tag='span' /></>
      </div>
      {/* Summary */}
      {vis('summary') && <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:6 }}>About</div>
        <EditableText value={person.summary} readOnly={readOnly}
          style={{ fontSize:10, lineHeight:1.75, color:'#444', display:'block' }} tag='div' onChange={(v) => onPatch?.('summary', v)} />
      </div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 32px' }}>
        <div>
          {/* Experience */}
          {vis('experience') && <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:10 }}>Experience</div>
            {person.experience.map((e,ei)=>(
              <div key={e.id} style={{ marginBottom:12, paddingBottom:12, borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:1 }}>
                  <span style={{ fontWeight:700, fontSize:10, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                  <span style={{ fontSize:8.5, color:'#aaa' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
                </div>
                <div style={{ fontSize:9, color:accent, marginBottom:4 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
                {e.bullets.map((b,i)=>(
                  <div key={i} style={{ fontSize:9, lineHeight:1.6, color:'#666', paddingLeft:8,
                    borderLeft:`2px solid ${accent}33`, marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</div>
                ))}
              </div>
            ))}
          </div>}
        </div>
        <div>
          {/* Education */}
          {vis('education') && <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:10 }}>Education</div>
            {person.education.map((e,edi)=>(
              <div key={e.id} style={{ marginBottom:10 }}>
                <div style={{ fontWeight:700, fontSize:10, color:'#111' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                <div style={{ fontSize:9, color:'#666' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div>
                <div style={{ fontSize:8.5, color:'#aaa' }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
              </div>
            ))}
          </div>}
          {/* Skills */}
          {vis('skills') && <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:8 }}>Skills</div>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {person.skills.map((s,si)=><SkillChip key={si} label={s} accent={accent} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} />)}
            </div>
          </div>}
          {/* Hobbies */}
          {vis('hobbies') && <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:8 }}>Interests</div>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {person.hobbies.map((h,hi)=><SkillChip key={hi} label={h} accent={accent} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} />)}
            </div>
          </div>}

          {vis('references') && <ReferencesBlock
            references={person.references || []}
            accent={accent} readOnly={readOnly} onPatch={onPatch}
            fontHeading={fontHeading}
            compact={false} />}
          {/* Languages */}
          {vis('languages') && <div>
            <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#aaa', marginBottom:8 }}>Languages</div>
            {person.languages.map((l,li)=>(
              <div key={li} style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:9, color:'#555' }}>
                <span>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:'#aaa' }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}

// ── EXECUTIVE template ───────────────────────────────────────


export function ExecutiveResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  return (
    <div style={{ fontFamily:fontBody, height:'100%', fontSize:10 }}>
      {/* Header band */}
      <div style={{ background:accent, padding:'26px 36px 22px', color:'#fff' }}>
        <EditableText value={person.name} readOnly={readOnly}
          style={{ fontFamily:fontHeading, fontWeight:700, fontSize:24, letterSpacing:'-0.02em',
            display:'block', marginBottom:4, color:'#fff' }} tag='div' onChange={(v) => onPatch?.('name', v)} />
        <EditableText value={person.title} readOnly={readOnly}
          style={{ fontSize:11, color:'rgba(255,255,255,0.8)', display:'block', marginBottom:14 }} tag='div' onChange={(v) => onPatch?.('title', v)} />
        <div style={{ display:'flex', gap:20, fontSize:9, color:'rgba(255,255,255,0.7)' }}>
          <><EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' /><EditableText value={person.phone} readOnly={readOnly} onChange={(v)=>onPatch?.('phone', v)} tag='span' /><EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' /></>
        </div>
      </div>
      {/* Two-column body */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:0, height:'calc(100% - 110px)' }}>
        <div style={{ padding:'22px 24px', borderRight:'1px solid #eee' }}>
          {vis('summary') && <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1.5,
              textTransform:'uppercase', color:accent, borderBottom:`2px solid ${accent}`, paddingBottom:3, marginBottom:8 }}>
              Executive Summary
            </div>
            <EditableText value={person.summary} readOnly={readOnly}
              style={{ fontSize:9.5, lineHeight:1.7, color:'#444', display:'block' }} tag='div' onChange={(v) => onPatch?.('summary', v)} />
          </div>}
          {vis('experience') && <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1.5,
              textTransform:'uppercase', color:accent, borderBottom:`2px solid ${accent}`, paddingBottom:3, marginBottom:10 }}>
              Professional Experience
            </div>
            {person.experience.map((e,ei)=>(
              <div key={e.id} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ fontFamily:fontHeading, fontWeight:700, fontSize:10.5, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                  <span style={{ fontSize:8.5, color:'#999' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
                </div>
                <div style={{ fontSize:9, fontWeight:600, color:accent, marginBottom:5 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
                <ul style={{ paddingLeft:13, margin:0 }}>
                  {e.bullets.map((b,i)=>(
                    <li key={i} style={{ fontSize:9, lineHeight:1.65, color:'#555', marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>}
          {vis('education') && <div>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1.5,
              textTransform:'uppercase', color:accent, borderBottom:`2px solid ${accent}`, paddingBottom:3, marginBottom:8 }}>
              Education
            </div>
            {person.education.map((e,edi)=>(
              <div key={e.id} style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:10, color:'#111' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                  <div style={{ fontSize:9, color:'#666' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div>
                </div>
                <div style={{ fontSize:8.5, color:'#999' }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
              </div>
            ))}
          </div>}
        </div>
        <div style={{ padding:'22px 18px', background:'#fafafa' }}>
          {vis('skills') && <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1.5,
              textTransform:'uppercase', color:accent, marginBottom:8 }}>Core Skills</div>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {person.skills.map((s,si)=><SkillChip key={si} label={s} accent={accent} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} />)}
            </div>
          </div>}
          {vis('languages') && <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1.5,
              textTransform:'uppercase', color:accent, marginBottom:8 }}>Languages</div>
            {person.languages.map((l,li)=>(
              <div key={li} style={{ fontSize:9, color:'#555', marginBottom:4, display:'flex', justifyContent:'space-between' }}>
                <span>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:'#999' }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
              </div>
            ))}
          </div>}
          {vis('hobbies') && <div>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1.5,
              textTransform:'uppercase', color:accent, marginBottom:8 }}>Interests</div>
            <div style={{ fontSize:9, color:'#666', lineHeight:1.8 }}>{(person.hobbies||[]).map((h, hi) => (
              <span key={hi}>
                {hi > 0 && ' · '}
                <EditableText value={h} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} tag='span' />
              </span>
            ))}</div>
          </div>}

          {vis('references') && <ReferencesBlock
            references={person.references || []}
            accent={accent} readOnly={readOnly} onPatch={onPatch}
            fontHeading={fontHeading}
            compact={false} />}
        </div>
      </div>
    </div>
  );
}

// ── CREATIVE template ─────────────────────────────────────────


export function CreativeResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  return (
    <div style={{ fontFamily:fontBody, height:'100%', fontSize:10 }}>
      {/* Big color hero */}
      <div style={{ background:`linear-gradient(135deg, ${accent}, ${accent}cc)`, padding:'30px 32px 22px', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}></div>
        <div style={{ position:'absolute', bottom:-30, left:120, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}></div>
        <div style={{ display:'flex', alignItems:'center', gap:16, position:'relative' }}>
          <div style={{ width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,0.25)',
            border:'3px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:26, flexShrink:0 }}><PhotoFill photoUrl={person.photoUrl} /></div>
          <div>
            <EditableText value={person.name} readOnly={readOnly}
              style={{ fontFamily:fontHeading, fontWeight:800, fontSize:22, letterSpacing:'-0.03em',
                color:'#fff', display:'block', marginBottom:3 }} tag='div' onChange={(v) => onPatch?.('name', v)} />
            <EditableText value={person.title} readOnly={readOnly}
              style={{ fontSize:10, color:'rgba(255,255,255,0.85)', display:'block', marginBottom:6 }} tag='div' onChange={(v) => onPatch?.('title', v)} />
            <div style={{ display:'flex', gap:12, fontSize:8.5, color:'rgba(255,255,255,0.75)' }}>
              <span>{<EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' />}</span><span>{<EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' />}</span>
            </div>
          </div>
        </div>
        {/* Skills row */}
        {vis('skills') && <div style={{ marginTop:14, display:'flex', flexWrap:'wrap', gap:4 }}>
          {person.skills.slice(0,6).map((s,si)=>(
            <span key={s} style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:8,
              padding:'3px 9px', borderRadius:999, border:'1px solid rgba(255,255,255,0.3)' }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span>
          ))}
        </div>}
      </div>
      {/* Body */}
      <div style={{ padding:'20px 28px', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'0 24px' }}>
        <div>
          {vis('summary') && <div style={{ marginBottom:14 }}>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1,
              textTransform:'uppercase', color:accent, marginBottom:5 }}>About Me</div>
            <EditableText value={person.summary} readOnly={readOnly}
              style={{ fontSize:9, lineHeight:1.7, color:'#555', display:'block' }} tag='div' onChange={(v) => onPatch?.('summary', v)} />
          </div>}
          {vis('experience') && <div>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1,
              textTransform:'uppercase', color:accent, marginBottom:8 }}>Experience</div>
            {person.experience.map((e,ei)=>(
              <div key={e.id} style={{ marginBottom:10, paddingLeft:10, borderLeft:`3px solid ${accent}44` }}>
                <div style={{ fontWeight:700, fontSize:10, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</div>
                <div style={{ fontSize:9, color:accent, marginBottom:3 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />} · {<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</div>
                <div style={{ fontSize:9, color:'#666', lineHeight:1.6 }}>{e.bullets[0]}</div>
              </div>
            ))}
          </div>}
        </div>
        <div>
          {vis('education') && <div style={{ marginBottom:14 }}>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1,
              textTransform:'uppercase', color:accent, marginBottom:8 }}>Education</div>
            {person.education.map((e,edi)=>(
              <div key={e.id} style={{ marginBottom:8, padding:'8px', background:`${accent}0a`, borderRadius:6 }}>
                <div style={{ fontWeight:700, fontSize:9.5, color:'#111' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                <div style={{ fontSize:8.5, color:'#777' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />} · {<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
              </div>
            ))}
          </div>}
          {vis('languages') && <div style={{ marginBottom:14 }}>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1,
              textTransform:'uppercase', color:accent, marginBottom:8 }}>Languages</div>
            {person.languages.map((l,li)=>(
              <div key={li} style={{ marginBottom:5 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, marginBottom:2 }}>
                  <span style={{ fontWeight:600 }}>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:'#888' }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
                </div>
                <div style={{ height:3, borderRadius:999, background:'#eee', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:l.level==='Native'?'100%':l.level==='Fluent'?'80%':'55%', background:`linear-gradient(90deg,${accent},${accent}99)`, borderRadius:999 }}></div>
                </div>
              </div>
            ))}
          </div>}
          {vis('hobbies') && <div>
            <div style={{ fontFamily:fontHeading, fontWeight:700, fontSize:9.5, letterSpacing:1,
              textTransform:'uppercase', color:accent, marginBottom:8 }}>Interests</div>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {person.hobbies.map((h,hi)=><SkillChip key={hi} label={h} accent={accent} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} />)}
            </div>
          </div>}

          {vis('references') && <ReferencesBlock
            references={person.references || []}
            accent={accent} readOnly={readOnly} onPatch={onPatch}
            fontHeading={fontHeading}
            compact={false} />}
        </div>
      </div>
    </div>
  );
}

// ── TECH template ─────────────────────────────────────────────


export function TechResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const mono = "'JetBrains Mono', monospace";
  return (
    <div style={{ fontFamily:mono, background:'#0D1117', height:'100%', padding:'28px 30px',
      fontSize:9, color:'#A8B0C0', overflowY:'auto' }}>
      {/* Terminal header */}
      <div style={{ marginBottom:18 }}>
        <div style={{ color:'#5C6474', fontSize:8.5, marginBottom:4 }}>{'// resume.json'}</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <span style={{ color:accent, fontSize:8.5 }}>const</span>
          <EditableText value={person.name.replace(' ', '_').toLowerCase()} readOnly={readOnly}
            style={{ color:'#F4F7FC', fontWeight:700, fontSize:20, letterSpacing:'-0.02em' }} tag='span' />
          <span style={{ color:'#5C6474' }}>= {'{'}</span>
        </div>
        <div style={{ paddingLeft:16, marginTop:4, color:'#A8B0C0', fontSize:9 }}>
          <div><span style={{ color:accent }}>title</span><span style={{ color:'#5C6474' }}>: "</span><EditableText value={person.title} readOnly={readOnly} style={{ color:'#22C55E' }} tag='span' onChange={(v) => onPatch?.('title', v)} /><span style={{ color:'#5C6474' }}>"</span></div>
          <div><span style={{ color:accent }}>email</span><span style={{ color:'#5C6474' }}>: "</span><span style={{ color:'#F59E0B' }}>{<EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' />}</span><span style={{ color:'#5C6474' }}>"</span></div>
          <div><span style={{ color:accent }}>location</span><span style={{ color:'#5C6474' }}>: "</span><span style={{ color:'#F59E0B' }}>{<EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' />}</span><span style={{ color:'#5C6474' }}>"</span></div>
        </div>
        <div style={{ color:'#5C6474' }}>{'}'}</div>
      </div>
      {vis('summary') && <div style={{ marginBottom:14, padding:'10px 12px', background:'#1A1F2E', borderRadius:6, borderLeft:`3px solid ${accent}` }}>
        <div style={{ color:accent, fontSize:8, letterSpacing:2, textTransform:'uppercase', marginBottom:5 }}>/** summary */</div>
        <EditableText value={person.summary} readOnly={readOnly}
          style={{ fontSize:9, lineHeight:1.65, color:'#A8B0C0', display:'block' }} tag='div' onChange={(v) => onPatch?.('summary', v)} />
      </div>}
      {vis('skills') && <div style={{ marginBottom:14 }}>
        <div style={{ color:'#5C6474', marginBottom:6 }}>{'// skills[]'}</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
          {person.skills.map((s,si)=>(
            <span key={s} style={{ background:'rgba(0, 200, 212,0.12)', color:accent, fontSize:8,
              padding:'3px 9px', borderRadius:4, border:`1px solid ${accent}33`, fontFamily:mono }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span>
          ))}
        </div>
      </div>}
      {vis('experience') && <div style={{ marginBottom:14 }}>
        <div style={{ color:'#5C6474', marginBottom:8 }}>{'// experience[]'}</div>
        {person.experience.map((e,ei)=>(
          <div key={e.id} style={{ marginBottom:10, paddingLeft:12, borderLeft:`1px solid #232838` }}>
            <div style={{ color:'#F4F7FC', fontWeight:700, fontSize:10 }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</div>
            <div style={{ display:'flex', gap:8, marginBottom:5 }}>
              <span style={{ color:accent }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</span>
              <span style={{ color:'#5C6474' }}>|</span>
              <span style={{ color:'#5C6474' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
            </div>
            {e.bullets.slice(0,2).map((b,j)=>(
              <div key={j} style={{ color:'#7C8698', fontSize:8.5, lineHeight:1.6, paddingLeft:8 }}>
                <span style={{ color:accent }}>→ </span>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${j}`, v)} tag='span' />}
              </div>
            ))}
          </div>
        ))}
      </div>}
      {vis('education') && <div style={{ marginBottom:14 }}>
        <div style={{ color:'#5C6474', marginBottom:8 }}>{'// education[]'}</div>
        {person.education.map((e,edi)=>(
          <div key={e.id} style={{ marginBottom:7, paddingLeft:12, borderLeft:`1px solid #232838` }}>
            <div style={{ color:'#F4F7FC', fontSize:9.5, fontWeight:700 }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
            <div style={{ color:accent, fontSize:8.5 }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />} <span style={{ color:'#5C6474' }}>· {<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</span></div>
          </div>
        ))}
      </div>}
      {vis('references') && <ReferencesBlock
        references={person.references || []}
        accent={accent} readOnly={readOnly} onPatch={onPatch}
        fontHeading={fontHeading}
        textColor='#F4F7FC' subColor='rgba(244,247,252,0.55)'
        bgChip='rgba(0, 200, 212,0.08)' border={`1px solid ${accent}33`}
        compact={true} />}
    </div>
  );
}

// ── CLASSIC template ──────────────────────────────────────────


export function ClassicResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const serif = "'Georgia', serif";
  return (
    <div style={{ fontFamily:serif, padding:'40px 44px', fontSize:10, color:'#1A1A1A', height:'100%' }}>
      {/* Centered header */}
      <div style={{ textAlign:'center', borderBottom:'2px solid #1A1A1A', paddingBottom:12, marginBottom:16 }}>
        <EditableText value={person.name} readOnly={readOnly}
          style={{ fontFamily:serif, fontWeight:700, fontSize:22, letterSpacing:'0.05em',
            textTransform:'uppercase', display:'block', marginBottom:4 }} tag='div' onChange={(v) => onPatch?.('name', v)} />
        <EditableText value={person.title} readOnly={readOnly}
          style={{ fontSize:10, color:'#555', display:'block', marginBottom:8 }} tag='div' onChange={(v) => onPatch?.('title', v)} />
        <div style={{ fontSize:9, color:'#666', display:'flex', justifyContent:'center', gap:12 }}>
          <span>{<EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' />}</span><span>·</span><span>{<EditableText value={person.phone} readOnly={readOnly} onChange={(v)=>onPatch?.('phone', v)} tag='span' />}</span><span>·</span><span>{<EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' />}</span>
        </div>
      </div>
      {vis('summary') && <div style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:10, letterSpacing:1.5, textTransform:'uppercase',
          borderBottom:'1px solid #ccc', paddingBottom:3, marginBottom:7 }}>OBJECTIVE</div>
        <EditableText value={person.summary} readOnly={readOnly}
          style={{ fontSize:9.5, lineHeight:1.75, color:'#444', display:'block' }} tag='div' onChange={(v) => onPatch?.('summary', v)} />
      </div>}
      {vis('experience') && <div style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:10, letterSpacing:1.5, textTransform:'uppercase',
          borderBottom:'1px solid #ccc', paddingBottom:3, marginBottom:8 }}>EXPERIENCE</div>
        {person.experience.map((e,ei)=>(
          <div key={e.id} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:700, fontSize:10, fontStyle:'italic' }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</span>
              <span style={{ fontSize:9, color:'#666' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
            </div>
            <div style={{ fontWeight:600, fontSize:9.5, marginBottom:4 }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</div>
            <ul style={{ paddingLeft:14, margin:0 }}>
              {e.bullets.map((b,i)=>(
                <li key={i} style={{ fontSize:9, lineHeight:1.65, color:'#555', marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>}
      {vis('education') && <div style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:10, letterSpacing:1.5, textTransform:'uppercase',
          borderBottom:'1px solid #ccc', paddingBottom:3, marginBottom:8 }}>EDUCATION</div>
        {person.education.map((e,edi)=>(
          <div key={e.id} style={{ marginBottom:7, display:'flex', justifyContent:'space-between' }}>
            <div>
              <span style={{ fontWeight:700, fontSize:10, fontStyle:'italic' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</span>
              <div style={{ fontSize:9, color:'#555' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
            </div>
            <div style={{ fontSize:9, color:'#666' }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
          </div>
        ))}
      </div>}
      {vis('skills') && <div style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:10, letterSpacing:1.5, textTransform:'uppercase',
          borderBottom:'1px solid #ccc', paddingBottom:3, marginBottom:7 }}>SKILLS</div>
        <div style={{ fontSize:9, color:'#444', lineHeight:1.8 }}>{(person.skills||[]).map((s, si) => (
              <span key={si}>
                {si > 0 && ' · '}
                <EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />
              </span>
            ))}</div>
      </div>}
      {vis('hobbies') && <div>
        <div style={{ fontWeight:700, fontSize:10, letterSpacing:1.5, textTransform:'uppercase',
          borderBottom:'1px solid #ccc', paddingBottom:3, marginBottom:7 }}>INTERESTS</div>
        <div style={{ fontSize:9, color:'#444', lineHeight:1.8 }}>{(person.hobbies||[]).map((h, hi) => (
              <span key={hi}>
                {hi > 0 && ' · '}
                <EditableText value={h} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} tag='span' />
              </span>
            ))}</div>
      </div>}

      {vis('references') && <ReferencesBlock
        references={person.references || []}
        accent={accent} readOnly={readOnly} onPatch={onPatch}
        fontHeading={fontHeading}
        compact={false} />}
    </div>
  );
}

// ── LETTER (Cover Letter) templates ──────────────────────────


export function WarmCreamResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const cream = '#F5EDE0'; const brown = accent !== '#1756C8' ? accent : '#8B6F47';
  return (
    <div style={{ fontFamily:fontBody, height:'100%', background:cream, fontSize:10, padding:'32px 32px 24px' }}>
      {/* Header: centered with photo right */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, paddingBottom:16, borderBottom:`2px solid ${brown}55` }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:3, textTransform:'uppercase', color:brown, marginBottom:7 }}>Curriculum Vitae</div>
          <EditableText value={person.name} readOnly={readOnly} tag='div'
            style={{ fontFamily:"'Georgia', serif", fontWeight:700, fontSize:24, color:'#2C1810', letterSpacing:'-0.01em', lineHeight:1.1, marginBottom:4, display:'block' }} onChange={(v) => onPatch?.('name', v)} />
          <EditableText value={person.title} readOnly={readOnly} tag='div'
            style={{ fontSize:11, color:brown, fontWeight:500, display:'block', marginBottom:12 }} onChange={(v) => onPatch?.('title', v)} />
          <div style={{ display:'flex', flexDirection:'column', gap:3.5, fontSize:9, color:'#6B5344' }}>
            {[['✉', person.email],['📱', person.phone],['📍', person.location],['🌐', person.website]].map(([ic,v])=>(
              <span key={v}>{ic} {v}</span>
            ))}
          </div>
        </div>
        <div style={{ width:88, height:88, borderRadius:'50%', background:`${brown}33`, flexShrink:0,
          border:`4px solid ${brown}66`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, marginLeft:20 }}><PhotoFill photoUrl={person.photoUrl} /></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'0 24px' }}>
        <div>
          {vis('summary') && <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:brown, marginBottom:6 }}>Profile</div>
            <EditableText value={person.summary} readOnly={readOnly} tag='div'
              style={{ fontSize:9.5, lineHeight:1.75, color:'#4A3728', display:'block' }} onChange={(v) => onPatch?.('summary', v)} />
          </div>}
          {vis('experience') && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:brown, marginBottom:8 }}>Work Experience</div>
            {person.experience.map((e,ei)=>(
              <div key={e.id} style={{ marginBottom:11, paddingLeft:10, borderLeft:`2px solid ${brown}55` }}>
                <div style={{ fontFamily:"'Georgia', serif", fontWeight:700, fontSize:10.5, color:'#2C1810', marginBottom:1 }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:9, color:brown, fontWeight:600 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</span>
                  <span style={{ fontSize:8.5, color:'#9A7B6A' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
                </div>
                {e.bullets.map((b,i)=><div key={i} style={{ fontSize:9, lineHeight:1.65, color:'#5A4035', marginBottom:2 }}>• {<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</div>)}
              </div>
            ))}
          </div>}
        </div>
        <div>
          {vis('education') && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:brown, marginBottom:8 }}>Education</div>
            {person.education.map((e,edi)=>(
              <div key={e.id} style={{ marginBottom:10, padding:'8px 10px', background:`${brown}14`, borderRadius:6 }}>
                <div style={{ fontFamily:"'Georgia', serif", fontWeight:700, fontSize:10, color:'#2C1810' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                <div style={{ fontSize:8.5, color:'#8B6F47' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div>
                <div style={{ fontSize:8, color:'#B09070', marginTop:2 }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
              </div>
            ))}
          </div>}
          {vis('skills') && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:brown, marginBottom:8 }}>Skills</div>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {person.skills.map((s,si)=>(
                <span key={s} style={{ background:`${brown}22`, color:brown, fontSize:8.5, padding:'3px 8px', borderRadius:4, marginBottom:4, marginRight:4 }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span>
              ))}
            </div>
          </div>}
          {vis('languages') && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:brown, marginBottom:8 }}>Languages</div>
            {person.languages.map((l,li)=>(
              <div key={li} style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:9, color:'#5A4035' }}>
                <span>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:'#B09070' }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
              </div>
            ))}
          </div>}
          {vis('hobbies') && <div>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:brown, marginBottom:6 }}>Interests</div>
            <div style={{ fontSize:9, color:'#6B5344', lineHeight:1.8 }}>{(person.hobbies||[]).map((h, hi) => (
              <span key={hi}>
                {hi > 0 && ' · '}
                <EditableText value={h} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} tag='span' />
              </span>
            ))}</div>
          </div>}

          {vis('references') && <ReferencesBlock
            references={person.references || []}
            accent={accent} readOnly={readOnly} onPatch={onPatch}
            fontHeading={fontHeading}
            compact={false} />}
        </div>
      </div>
    </div>
  );
}

// ── NAVY DARK template ──────────────────────────────────────
// Inspired by: Art Director dark — huge name, dark left panel


export function NavyDarkResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const navy = '#0F1F3D';
  return (
    <div style={{ fontFamily:fontBody, height:'100%', display:'flex', fontSize:10 }}>
      {/* Wide dark left */}
      <div style={{ width:230, background:navy, padding:'32px 20px 24px', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.15)',
          border:'3px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:28, marginBottom:16, flexShrink:0 }}><PhotoFill photoUrl={person.photoUrl} /></div>
        <EditableText value={person.name} readOnly={readOnly} tag='div'
          style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:900, fontSize:19, color:'#fff',
            letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:6, display:'block' }} onChange={(v) => onPatch?.('name', v)} />
        <EditableText value={person.title} readOnly={readOnly} tag='div'
          style={{ fontSize:9.5, color:'rgba(255,255,255,0.6)', marginBottom:18, display:'block', lineHeight:1.4 }} onChange={(v) => onPatch?.('title', v)} />
        <div style={{ height:1, background:'rgba(255,255,255,0.15)', marginBottom:16 }}></div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Contact Me</div>
          {[['✉', person.email],['📱', person.phone],['📍', person.location],['🌐', person.website]].map(([ic,v])=>(
            <div key={v} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:5, color:'rgba(255,255,255,0.75)', fontSize:8.5 }}>
              <span style={{ opacity:.6, flexShrink:0, marginTop:.5 }}>{ic}</span><span style={{ lineHeight:1.4 }}>{v}</span>
            </div>
          ))}
        </div>
        {vis('skills') && <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Skills</div>
          {person.skills.slice(0,6).map((s,si)=>(
            <div key={s} style={{ marginBottom:6 }}>
              <div style={{ fontSize:8.5, color:'rgba(255,255,255,0.8)', marginBottom:3 }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</div>
              <div style={{ height:3, background:'rgba(255,255,255,0.1)', borderRadius:999, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${85-si*8}%`, background:'linear-gradient(90deg,#1756C8,#00C8D4)', borderRadius:999 }}></div>
              </div>
            </div>
          ))}
        </div>}
        {vis('languages') && <div>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Languages</div>
          {person.languages.map((l,li)=>(
            <div key={li} style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:9, color:'rgba(255,255,255,0.75)' }}>
              <span>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ opacity:.6 }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
            </div>
          ))}
        </div>}

        {vis('references') && <ReferencesBlock
          references={person.references || []}
          accent={accent} readOnly={readOnly} onPatch={onPatch}
          fontHeading={fontHeading}
          textColor='rgba(255,255,255,0.9)' subColor='rgba(255,255,255,0.55)'
          compact={false} />}
      </div>
      {/* Right content */}
      <div style={{ flex:1, padding:'28px 22px', overflowY:'auto' }}>
        {vis('summary') && <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:9.5, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:navy, borderBottom:`2px solid ${navy}`, paddingBottom:3, marginBottom:8 }}>About Me</div>
          <EditableText value={person.summary} readOnly={readOnly} tag='div'
            style={{ fontSize:9.5, lineHeight:1.7, color:'#444', display:'block' }} onChange={(v) => onPatch?.('summary', v)} />
        </div>}
        {vis('experience') && <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:9.5, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:navy, borderBottom:`2px solid ${navy}`, paddingBottom:3, marginBottom:10 }}>Work Experience</div>
          {person.experience.map((e,ei)=>(
            <div key={e.id} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontWeight:700, fontSize:10.5, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                <span style={{ fontSize:8.5, color:'#999' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
              </div>
              <div style={{ fontSize:9, fontWeight:600, color:navy, marginBottom:4 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
              <ul style={{ paddingLeft:13, margin:0 }}>
                {e.bullets.map((b,i)=><li key={i} style={{ fontSize:9, lineHeight:1.65, color:'#555', marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</li>)}
              </ul>
            </div>
          ))}
        </div>}
        {vis('education') && <div>
          <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:9.5, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:navy, borderBottom:`2px solid ${navy}`, paddingBottom:3, marginBottom:8 }}>Education</div>
          {person.education.map((e,edi)=>(
            <div key={e.id} style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
              <div><div style={{ fontWeight:700, fontSize:10, color:'#111' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div><div style={{ fontSize:9, color:'#666' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div></div>
              <div style={{ fontSize:8.5, color:'#999' }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}

// ── EMERALD BOLD template ─────────────────────────────────────
// Inspired by: Lorna Alvarado Digital Designer — lime/yellow-green large name, dark green


export function EmeraldBoldResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const dark = '#0D2818'; const bright = accent !== '#1756C8' ? accent : '#4ADE80';
  return (
    <div style={{ fontFamily:fontBody, height:'100%', fontSize:10 }}>
      {/* Bold header */}
      <div style={{ background:dark, padding:'26px 28px 20px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:'rgba(74,222,128,0.07)' }}></div>
        <div style={{ display:'flex', gap:18, alignItems:'center' }}>
          <div style={{ width:76, height:76, borderRadius:'50%', background:'rgba(255,255,255,0.1)',
            border:`3px solid ${bright}55`, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:28, flexShrink:0 }}><PhotoFill photoUrl={person.photoUrl} /></div>
          <div>
            <EditableText value={person.name} readOnly={readOnly} tag='div'
              style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:900, fontSize:22, lineHeight:1.1,
                color:bright, display:'block', letterSpacing:'-0.03em', marginBottom:5 }} onChange={(v) => onPatch?.('name', v)} />
            <EditableText value={person.title} readOnly={readOnly} tag='div'
              style={{ fontSize:10.5, color:'rgba(255,255,255,0.7)', display:'block', fontStyle:'italic' }} onChange={(v) => onPatch?.('title', v)} />
          </div>
        </div>
        {vis('summary') && <div style={{ marginTop:16, padding:'12px 14px', background:'rgba(74,222,128,0.08)',
          borderRadius:8, borderLeft:`3px solid ${bright}` }}>
          <EditableText value={person.summary} readOnly={readOnly} tag='div'
            style={{ fontSize:9, lineHeight:1.65, color:'rgba(255,255,255,0.75)', display:'block' }} onChange={(v) => onPatch?.('summary', v)} />
        </div>}
      </div>
      {/* Body two-col */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:0, height:'calc(100% - 180px)' }}>
        <div style={{ padding:'20px 22px', borderRight:'1px solid #e5e5e5' }}>
          {vis('experience') && <div>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <div style={{ width:4, height:14, background:bright, borderRadius:2 }}></div>
              <span style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:'uppercase', color:dark }}>Work Experience</span>
            </div>
            {person.experience.map((e,ei)=>(
              <div key={e.id} style={{ marginBottom:12, paddingBottom:12, borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:1 }}>
                  <span style={{ fontWeight:700, fontSize:10.5, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                  <span style={{ fontSize:8.5, background:dark, color:'#fff', padding:'1px 7px', borderRadius:999, flexShrink:0 }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
                </div>
                <div style={{ fontSize:9, color:bright==='#4ADE80'?dark:bright, fontWeight:600, marginBottom:5 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
                {e.bullets.map((b,i)=>(
                  <div key={i} style={{ display:'flex', gap:5, marginBottom:3 }}>
                    <span style={{ color:bright, flexShrink:0, marginTop:1 }}>▸</span>
                    <span style={{ fontSize:9, lineHeight:1.6, color:'#555' }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>}
        </div>
        <div style={{ padding:'20px 18px', background:'#fafafa' }}>
          {vis('education') && <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <div style={{ width:4, height:14, background:bright, borderRadius:2 }}></div>
              <span style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:'uppercase', color:dark }}>Education</span>
            </div>
            {person.education.map((e,edi)=>(
              <div key={e.id} style={{ marginBottom:10, padding:'8px 10px', background:`${bright}18`, borderRadius:8 }}>
                <div style={{ fontWeight:700, fontSize:9.5, color:dark }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                <div style={{ fontSize:8.5, color:'#555', marginTop:2 }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div>
                <div style={{ fontSize:8, color:'#999', marginTop:1 }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
              </div>
            ))}
          </div>}
          {vis('skills') && <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <div style={{ width:4, height:14, background:bright, borderRadius:2 }}></div>
              <span style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:'uppercase', color:dark }}>Skills</span>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {person.skills.map((s,si)=>(
                <span key={s} style={{ background:`${bright}20`, color:dark, fontSize:8.5, padding:'3px 8px', borderRadius:4, marginBottom:4, marginRight:4, border:`1px solid ${bright}44` }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span>
              ))}
            </div>
          </div>}
          {vis('languages') && <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <div style={{ width:4, height:14, background:bright, borderRadius:2 }}></div>
              <span style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:'uppercase', color:dark }}>Languages</span>
            </div>
            {person.languages.map((l,li)=>(
              <div key={li} style={{ marginBottom:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'#333', marginBottom:2 }}>
                  <span style={{ fontWeight:600 }}>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:'#888' }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
                </div>
                <div style={{ height:3, borderRadius:999, background:'#e5e5e5', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:l.level==='Native'?'100%':l.level==='Fluent'?'80%':'55%',
                    background:`linear-gradient(90deg,${dark},${bright})`, borderRadius:999 }}></div>
                </div>
              </div>
            ))}
          </div>}

          {vis('references') && <ReferencesBlock
            references={person.references || []}
            accent={accent} readOnly={readOnly} onPatch={onPatch}
            fontHeading={fontHeading}
            compact={false} />}
          <div style={{ marginTop:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <div style={{ width:4, height:14, background:bright, borderRadius:2 }}></div>
              <span style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:'uppercase', color:dark }}>Contact</span>
            </div>
            {[['✉', person.email],['📱', person.phone],['🌐', person.website]].map(([ic,v])=>(
              <div key={v} style={{ fontSize:8.5, color:'#555', marginBottom:4 }}>{ic} {v}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SCARLET template ─────────────────────────────────────────
// Inspired by: Lorna Alvarado red — bold red left sidebar, "RESUME" vertical


export function ScarletResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const red = accent !== '#1756C8' ? accent : '#C0392B';
  return (
    <div style={{ fontFamily:fontBody, height:'100%', display:'flex', fontSize:10 }}>
      {/* Narrow red sidebar */}
      <div style={{ width:50, background:red, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', flexShrink:0, position:'relative' }}>
        <span style={{ writingMode:'vertical-rl', textOrientation:'mixed', transform:'rotate(180deg)',
          fontFamily:"'Space Grotesk', sans-serif", fontWeight:900, fontSize:13, color:'rgba(255,255,255,0.25)',
          letterSpacing:6, textTransform:'uppercase', userSelect:'none' }}>RESUME</span>
      </div>
      {/* Main area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        {/* Header band */}
        <div style={{ background:'#1A1A1A', padding:'22px 22px 18px', display:'flex', gap:16, alignItems:'center' }}>
          <div style={{ width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,0.12)',
            border:`3px solid ${red}`, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:26, flexShrink:0 }}><PhotoFill photoUrl={person.photoUrl} /></div>
          <div>
            <EditableText value={person.name} readOnly={readOnly} tag='div'
              style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:800, fontSize:18, color:'#fff',
                letterSpacing:'-0.02em', display:'block', marginBottom:3 }} onChange={(v) => onPatch?.('name', v)} />
            <EditableText value={person.title} readOnly={readOnly} tag='div'
              style={{ fontSize:10, color:red, fontWeight:500, display:'block', marginBottom:8 }} onChange={(v) => onPatch?.('title', v)} />
            <div style={{ display:'flex', gap:14, fontSize:8.5, color:'rgba(255,255,255,0.6)' }}>
              <span>{<EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' />}</span><span>{<EditableText value={person.phone} readOnly={readOnly} onChange={(v)=>onPatch?.('phone', v)} tag='span' />}</span><span>{<EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' />}</span>
            </div>
          </div>
        </div>
        {/* Two-col body */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', flex:1, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px' }}>
            {vis('summary') && <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
                color:red, borderBottom:`2px solid ${red}`, paddingBottom:3, marginBottom:7 }}>Summary</div>
              <EditableText value={person.summary} readOnly={readOnly} tag='div'
                style={{ fontSize:9.5, lineHeight:1.7, color:'#444', display:'block' }} onChange={(v) => onPatch?.('summary', v)} />
            </div>}
            {vis('experience') && <div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
                color:red, borderBottom:`2px solid ${red}`, paddingBottom:3, marginBottom:8 }}>History</div>
              {person.experience.map((e,ei)=>(
                <div key={e.id} style={{ marginBottom:11 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <span style={{ fontWeight:700, fontSize:10.5, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                    <span style={{ fontSize:8.5, color:'#999' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
                  </div>
                  <div style={{ fontSize:9, fontWeight:600, color:red, marginBottom:4 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
                  <ul style={{ paddingLeft:12, margin:0 }}>
                    {e.bullets.map((b,i)=><li key={i} style={{ fontSize:9, lineHeight:1.6, color:'#555', marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</li>)}
                  </ul>
                </div>
              ))}
            </div>}
          </div>
          <div style={{ padding:'18px 16px', background:'#f8f8f8', borderLeft:'1px solid #eee' }}>
            {vis('education') && <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
                color:red, marginBottom:8 }}>Education</div>
              {person.education.map((e,edi)=>(
                <div key={e.id} style={{ marginBottom:8 }}>
                  <div style={{ fontWeight:700, fontSize:9.5, color:'#111' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                  <div style={{ fontSize:8.5, color:'#666' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div>
                  <div style={{ fontSize:8, color:'#aaa' }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
                </div>
              ))}
            </div>}
            {vis('skills') && <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
                color:red, marginBottom:8 }}>Skills</div>
              {person.skills.map((s,si)=>(
                <div key={s} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                  <div style={{ width:4, height:4, borderRadius:'50%', background:red, flexShrink:0 }}></div>
                  <span style={{ fontSize:9, color:'#444' }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span>
                </div>
              ))}
            </div>}
            {vis('languages') && <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
                color:red, marginBottom:8 }}>Languages</div>
              {person.languages.map((l,li)=>(
                <div key={li} style={{ fontSize:9, color:'#555', marginBottom:5 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                    <span style={{ fontWeight:600 }}>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:'#999' }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
                  </div>
                  <div style={{ height:3, borderRadius:999, background:'#ddd', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:l.level==='Native'?'100%':l.level==='Fluent'?'80%':'55%', background:red, borderRadius:999 }}></div>
                  </div>
                </div>
              ))}
            </div>}
            {vis('hobbies') && <div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
                color:red, marginBottom:6 }}>Interests</div>
              <div style={{ fontSize:9, color:'#666', lineHeight:1.8 }}>{(person.hobbies||[]).map((h, hi) => (
              <span key={hi}>
                {hi > 0 && ' · '}
                <EditableText value={h} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} tag='span' />
              </span>
            ))}</div>
            </div>}

            {vis('references') && <ReferencesBlock
              references={person.references || []}
              accent={accent} readOnly={readOnly} onPatch={onPatch}
              fontHeading={fontHeading}
              compact={false} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TERRACOTTA template ───────────────────────────────────────
// Inspired by: Olivia Wilson orange — warm orange header, photo, white body


export function TerracottaResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const terra = accent !== '#1756C8' ? accent : '#D2603A';
  return (
    <div style={{ fontFamily:fontBody, height:'100%', fontSize:10 }}>
      {/* Header */}
      <div style={{ background:terra, padding:'24px 28px 20px', display:'flex', gap:18, alignItems:'center' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.22)',
          border:'3px solid rgba(255,255,255,0.45)', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:30, flexShrink:0 }}><PhotoFill photoUrl={person.photoUrl} /></div>
        <div style={{ flex:1 }}>
          <EditableText value={person.name} readOnly={readOnly} tag='div'
            style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:800, fontSize:20,
              color:'#fff', letterSpacing:'-0.02em', display:'block', marginBottom:3 }} onChange={(v) => onPatch?.('name', v)} />
          <EditableText value={person.title} readOnly={readOnly} tag='div'
            style={{ fontSize:10.5, color:'rgba(255,255,255,0.85)', display:'block', marginBottom:8 }} onChange={(v) => onPatch?.('title', v)} />
          <div style={{ display:'flex', gap:12, fontSize:8.5, color:'rgba(255,255,255,0.7)' }}>
            <span>✉ {<EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' />}</span><span>📍 {<EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' />}</span>
          </div>
        </div>
        <div style={{ fontSize:9.5, color:'rgba(255,255,255,0.7)', textAlign:'right' }}>
          <div>{<EditableText value={person.phone} readOnly={readOnly} onChange={(v)=>onPatch?.('phone', v)} tag='span' />}</div>
          <div style={{ marginTop:4 }}>{<EditableText value={person.website} readOnly={readOnly} onChange={(v)=>onPatch?.('website', v)} tag='span' />}</div>
        </div>
      </div>
      {/* Body */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', height:'calc(100% - 120px)' }}>
        <div style={{ padding:'20px 22px' }}>
          {vis('summary') && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
              color:terra, borderBottom:`2px solid ${terra}55`, paddingBottom:3, marginBottom:7 }}>About Me</div>
            <EditableText value={person.summary} readOnly={readOnly} tag='div'
              style={{ fontSize:9.5, lineHeight:1.7, color:'#444', display:'block' }} onChange={(v) => onPatch?.('summary', v)} />
          </div>}
          {vis('experience') && <div>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
              color:terra, borderBottom:`2px solid ${terra}55`, paddingBottom:3, marginBottom:10 }}>Experience</div>
            {person.experience.map((e,ei)=>(
              <div key={e.id} style={{ marginBottom:12, paddingLeft:10, borderLeft:`3px solid ${terra}55` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ fontWeight:700, fontSize:10.5, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                  <span style={{ fontSize:8.5, color:'#999' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
                </div>
                <div style={{ fontSize:9, fontWeight:600, color:terra, marginBottom:4 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
                <ul style={{ paddingLeft:12, margin:0 }}>
                  {e.bullets.map((b,i)=><li key={i} style={{ fontSize:9, lineHeight:1.65, color:'#555', marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</li>)}
                </ul>
              </div>
            ))}
          </div>}
        </div>
        <div style={{ padding:'20px 18px', background:'#FDF8F5', borderLeft:'1px solid #F0E8E0' }}>
          {vis('education') && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
              color:terra, marginBottom:8 }}>Education</div>
            {person.education.map((e,edi)=>(
              <div key={e.id} style={{ marginBottom:10, padding:'8px 10px',
                background:`${terra}12`, borderRadius:8, borderLeft:`3px solid ${terra}` }}>
                <div style={{ fontWeight:700, fontSize:9.5, color:'#2C1410' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                <div style={{ fontSize:8.5, color:'#8B5040' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div>
                <div style={{ fontSize:8, color:'#B07A68' }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
              </div>
            ))}
          </div>}
          {vis('skills') && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
              color:terra, marginBottom:8 }}>Skills</div>
            {person.skills.map((s,si)=>(
              <div key={s} style={{ marginBottom:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:8.5, color:'#555', marginBottom:2 }}>
                  <span>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span><span style={{ color:'#aaa' }}>{90-si*5}%</span>
                </div>
                <div style={{ height:3.5, background:'#F0E8E0', borderRadius:999, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${90-si*5}%`, background:`linear-gradient(90deg,${terra},${terra}bb)`, borderRadius:999 }}></div>
                </div>
              </div>
            ))}
          </div>}
          {vis('languages') && <div>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase',
              color:terra, marginBottom:8 }}>Languages</div>
            {person.languages.map((l,li)=>(
              <div key={li} style={{ fontSize:9, color:'#666', marginBottom:4, display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontWeight:600 }}>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:'#aaa' }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
              </div>
            ))}
          </div>}

          {vis('references') && <ReferencesBlock
            references={person.references || []}
            accent={accent} readOnly={readOnly} onPatch={onPatch}
            fontHeading={fontHeading}
            compact={false} />}
        </div>
      </div>
    </div>
  );
}

// ── TEAL RIGHT SIDEBAR template ───────────────────────────────
// Inspired by: Richard Sanchez teal — teal right sidebar with skill bars


export function TealRightResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const teal = accent !== '#1756C8' ? accent : '#0A7C6E';
  return (
    <div style={{ fontFamily:fontBody, height:'100%', display:'flex', fontSize:10 }}>
      {/* Left main */}
      <div style={{ flex:1, padding:'28px 22px' }}>
        <div style={{ marginBottom:18, paddingBottom:14, borderBottom:`3px solid ${teal}` }}>
          <EditableText value={person.name} readOnly={readOnly} tag='div'
            style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:800, fontSize:22, color:'#111',
              letterSpacing:'-0.03em', display:'block', marginBottom:3 }} onChange={(v) => onPatch?.('name', v)} />
          <EditableText value={person.title} readOnly={readOnly} tag='div'
            style={{ fontSize:11, color:teal, fontWeight:500, display:'block', marginBottom:8 }} onChange={(v) => onPatch?.('title', v)} />
          <div style={{ display:'flex', gap:14, fontSize:8.5, color:'#777' }}>
            <span>{<EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' />}</span><span>{<EditableText value={person.phone} readOnly={readOnly} onChange={(v)=>onPatch?.('phone', v)} tag='span' />}</span><span>{<EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' />}</span>
          </div>
        </div>
        {vis('summary') && <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:teal, marginBottom:7 }}>Profile</div>
          <EditableText value={person.summary} readOnly={readOnly} tag='div'
            style={{ fontSize:9.5, lineHeight:1.75, color:'#444', display:'block' }} onChange={(v) => onPatch?.('summary', v)} />
        </div>}
        {vis('experience') && <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:teal, marginBottom:8 }}>Experience</div>
          {person.experience.map((e,ei)=>(
            <div key={e.id} style={{ marginBottom:11 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontWeight:700, fontSize:10.5, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                <span style={{ fontSize:8.5, color:'#999' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
              </div>
              <div style={{ fontSize:9, color:teal, fontWeight:600, marginBottom:4 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
              <ul style={{ paddingLeft:12, margin:0 }}>
                {e.bullets.map((b,i)=><li key={i} style={{ fontSize:9, lineHeight:1.65, color:'#555', marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</li>)}
              </ul>
            </div>
          ))}
        </div>}
        {vis('education') && <div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:teal, marginBottom:8 }}>Education</div>
          {person.education.map((e,edi)=>(
            <div key={e.id} style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
              <div><div style={{ fontWeight:700, fontSize:10, color:'#111' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div><div style={{ fontSize:9, color:'#666' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div></div>
              <div style={{ fontSize:8.5, color:'#999', flexShrink:0 }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
            </div>
          ))}
        </div>}
      </div>
      {/* Right teal sidebar */}
      <div style={{ width:175, background:teal, padding:'28px 16px', color:'#fff', flexShrink:0 }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.2)',
          border:'3px solid rgba(255,255,255,0.4)', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:24, margin:'0 auto 18px', flexShrink:0 }}><PhotoFill photoUrl={person.photoUrl} /></div>
        {vis('skills') && <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase',
            color:'rgba(255,255,255,0.55)', marginBottom:8 }}>Skills</div>
          {person.skills.map((s,si)=>(
            <div key={s} style={{ marginBottom:7 }}>
              <div style={{ fontSize:8.5, color:'rgba(255,255,255,0.9)', marginBottom:3 }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</div>
              <div style={{ height:3, background:'rgba(255,255,255,0.15)', borderRadius:999, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${88-si*7}%`, background:'rgba(255,255,255,0.7)', borderRadius:999 }}></div>
              </div>
            </div>
          ))}
        </div>}
        {vis('languages') && <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase',
            color:'rgba(255,255,255,0.55)', marginBottom:8 }}>Languages</div>
          {person.languages.map((l,li)=>(
            <div key={li} style={{ fontSize:9, color:'rgba(255,255,255,0.85)', marginBottom:5, display:'flex', justifyContent:'space-between' }}>
              <span>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ opacity:.65 }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
            </div>
          ))}
        </div>}
        {vis('hobbies') && <div>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase',
            color:'rgba(255,255,255,0.55)', marginBottom:6 }}>Interests</div>
          <div style={{ fontSize:8.5, color:'rgba(255,255,255,0.8)', lineHeight:1.8 }}>{(person.hobbies||[]).map((h, hi) => (
              <span key={hi}>
                {hi > 0 && ' · '}
                <EditableText value={h} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} tag='span' />
              </span>
            ))}</div>
        </div>}

        {vis('references') && <ReferencesBlock
          references={person.references || []}
          accent={accent} readOnly={readOnly} onPatch={onPatch}
          fontHeading={fontHeading}
          compact={false} />}
      </div>
    </div>
  );
}

// ── CHARCOAL DARK template ────────────────────────────────────
// Inspired by: Adeline Palmerston / Richard dark — full dark two-column


export function CharcoalDarkResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const charcoal = '#1E1E2E'; const mid = '#2C2C3E'; const hi = accent !== '#1756C8' ? accent : '#7C8FFF';
  return (
    <div style={{ fontFamily:fontBody, height:'100%', background:charcoal, fontSize:10, display:'flex' }}>
      {/* Left */}
      <div style={{ width:200, background:mid, padding:'28px 18px', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:`${hi}33`,
          border:`3px solid ${hi}66`, display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:24, marginBottom:14, flexShrink:0 }}><PhotoFill photoUrl={person.photoUrl} /></div>
        <EditableText value={person.name} readOnly={readOnly} tag='div'
          style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:16, color:'#fff',
            letterSpacing:'-0.02em', lineHeight:1.2, marginBottom:4, display:'block' }} onChange={(v) => onPatch?.('name', v)} />
        <EditableText value={person.title} readOnly={readOnly} tag='div'
          style={{ fontSize:9, color:hi, marginBottom:16, display:'block', lineHeight:1.4 }} onChange={(v) => onPatch?.('title', v)} />
        <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:16 }}></div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:7.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:8 }}>Contact</div>
          {[['✉', person.email],['📱', person.phone],['📍', person.location]].map(([ic,v])=>(
            <div key={v} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:5, color:'rgba(255,255,255,0.65)', fontSize:8.5 }}>
              <span style={{ opacity:.5, flexShrink:0 }}>{ic}</span><span style={{ lineHeight:1.4, wordBreak:'break-all' }}>{v}</span>
            </div>
          ))}
        </div>
        {vis('skills') && <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:7.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:8 }}>Skills</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
            {person.skills.map((s,si)=>(
              <span key={s} style={{ background:`${hi}20`, color:hi, fontSize:7.5, padding:'2px 7px', borderRadius:4, border:`1px solid ${hi}35` }}>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span>
            ))}
          </div>
        </div>}
        {vis('languages') && <div>
          <div style={{ fontSize:7.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:8 }}>Languages</div>
          {person.languages.map((l,li)=>(
            <div key={li} style={{ fontSize:9, color:'rgba(255,255,255,0.7)', marginBottom:4, display:'flex', justifyContent:'space-between' }}>
              <span>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:`${hi}aa` }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
            </div>
          ))}
        </div>}

        {vis('references') && <ReferencesBlock
          references={person.references || []}
          accent={accent} readOnly={readOnly} onPatch={onPatch}
          fontHeading={fontHeading}
          textColor='rgba(255,255,255,0.9)' subColor='rgba(255,255,255,0.55)'
          compact={false} />}
      </div>
      {/* Right */}
      <div style={{ flex:1, padding:'28px 22px', overflowY:'auto' }}>
        {vis('summary') && <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:hi, marginBottom:7 }}>Profile</div>
          <EditableText value={person.summary} readOnly={readOnly} tag='div'
            style={{ fontSize:9.5, lineHeight:1.7, color:'rgba(255,255,255,0.6)', display:'block' }} onChange={(v) => onPatch?.('summary', v)} />
        </div>}
        {vis('experience') && <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:hi, marginBottom:10,
            borderBottom:`1px solid rgba(255,255,255,0.08)`, paddingBottom:5 }}>Experience</div>
          {person.experience.map((e,ei)=>(
            <div key={e.id} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontWeight:700, fontSize:10.5, color:'rgba(255,255,255,0.9)' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                <span style={{ fontSize:8.5, background:`${hi}22`, color:hi, padding:'1px 7px', borderRadius:999 }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
              </div>
              <div style={{ fontSize:9, color:hi, fontWeight:500, marginBottom:4 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
              <ul style={{ paddingLeft:12, margin:0 }}>
                {e.bullets.map((b,i)=><li key={i} style={{ fontSize:9, lineHeight:1.65, color:'rgba(255,255,255,0.5)', marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${i}`, v)} tag='span' />}</li>)}
              </ul>
            </div>
          ))}
        </div>}
        {vis('education') && <div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:hi, marginBottom:8,
            borderBottom:`1px solid rgba(255,255,255,0.08)`, paddingBottom:5 }}>Education</div>
          {person.education.map((e,edi)=>(
            <div key={e.id} style={{ marginBottom:10, padding:'10px 12px', background:'rgba(255,255,255,0.04)', borderRadius:8 }}>
              <div style={{ fontWeight:700, fontSize:10, color:'rgba(255,255,255,0.9)' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />} · {<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}

// ── TIMELINE template ─────────────────────────────────────────
// Inspired by: Adeline super-minimal — timeline dots, ultra-clean


export function TimelineResume({ person, sections, accent, readOnly, fontHeading, fontBody, onPatch }) {
  const vis = id => sections.find(s=>s.id===id)?.visible !== false;
  const col = accent !== '#1756C8' ? accent : '#1756C8';
  return (
    <div style={{ fontFamily:fontBody, padding:'36px 40px', height:'100%', fontSize:10 }}>
      {/* Header row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, marginBottom:22, paddingBottom:16, borderBottom:`1px solid #e8e8e8` }}>
        <div>
          <EditableText value={person.name} readOnly={readOnly} tag='div'
            style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:800, fontSize:22, color:'#111',
              letterSpacing:'-0.03em', display:'block', marginBottom:3 }} onChange={(v) => onPatch?.('name', v)} />
          <EditableText value={person.title} readOnly={readOnly} tag='div'
            style={{ fontSize:11, color:col, fontWeight:500, display:'block' }} onChange={(v) => onPatch?.('title', v)} />
        </div>
        <div style={{ fontSize:9, color:'#aaa', textAlign:'right', lineHeight:1.8 }}>
          <div>{<EditableText value={person.email} readOnly={readOnly} onChange={(v)=>onPatch?.('email', v)} tag='span' />}</div><div>{<EditableText value={person.phone} readOnly={readOnly} onChange={(v)=>onPatch?.('phone', v)} tag='span' />}</div><div>{<EditableText value={person.location} readOnly={readOnly} onChange={(v)=>onPatch?.('location', v)} tag='span' />}</div>
        </div>
      </div>
      {/* Two column */}
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'0 28px' }}>
        <div>
          {vis('summary') && <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#bbb', marginBottom:7 }}>About</div>
            <EditableText value={person.summary} readOnly={readOnly} tag='div'
              style={{ fontSize:9.5, lineHeight:1.75, color:'#555', display:'block' }} onChange={(v) => onPatch?.('summary', v)} />
          </div>}
          {vis('experience') && <div>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#bbb', marginBottom:12 }}>Experience</div>
            {person.experience.map((e,ei)=>(
              <div key={e.id} style={{ display:'flex', gap:10, marginBottom:14, position:'relative' }}>
                {/* Timeline */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, paddingTop:2 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:col, flexShrink:0, zIndex:1 }}></div>
                  {ei < person.experience.length-1 && <div style={{ width:1, flex:1, background:`${col}25`, minHeight:40, marginTop:3 }}></div>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:1 }}>
                    <span style={{ fontWeight:700, fontSize:10.5, color:'#111' }}>{<EditableText value={e.role} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.role`, v)} tag='span' />}</span>
                    <span style={{ fontSize:8, color:'#bbb' }}>{<EditableText value={e.period} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.period`, v)} tag='span' />}</span>
                  </div>
                  <div style={{ fontSize:9, color:col, fontWeight:600, marginBottom:4 }}>{<EditableText value={e.company} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.company`, v)} tag='span' />}</div>
                  {e.bullets.map((b,j)=>(
                    <div key={j} style={{ fontSize:9, lineHeight:1.6, color:'#666', paddingLeft:8,
                      borderLeft:`2px solid ${col}22`, marginBottom:2 }}>{<EditableText value={b} readOnly={readOnly} onChange={(v)=>onPatch?.(`experience.${ei}.bullets.${j}`, v)} tag='span' />}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>}
        </div>
        <div>
          {vis('education') && <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#bbb', marginBottom:10 }}>Education</div>
            {person.education.map((e,edi)=>(
              <div key={e.id} style={{ display:'flex', gap:10, marginBottom:10 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:`${col}66`, flexShrink:0, marginTop:3 }}></div>
                <div>
                  <div style={{ fontWeight:700, fontSize:9.5, color:'#111' }}>{<EditableText value={e.degree} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.degree`, v)} tag='span' />}</div>
                  <div style={{ fontSize:8.5, color:'#888' }}>{<EditableText value={e.school} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.school`, v)} tag='span' />}</div>
                  <div style={{ fontSize:8, color:'#bbb' }}>{<EditableText value={e.year} readOnly={readOnly} onChange={(v)=>onPatch?.(`education.${edi}.year`, v)} tag='span' />}</div>
                </div>
              </div>
            ))}
          </div>}
          {vis('skills') && <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#bbb', marginBottom:8 }}>Skills</div>
            {person.skills.map((s,si)=>(
              <div key={s} style={{ marginBottom:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:8.5, color:'#555', marginBottom:2 }}>
                  <span>{<EditableText value={s} readOnly={readOnly} onChange={(v)=>onPatch?.(`skills.${si}`, v)} tag='span' />}</span>
                </div>
                <div style={{ height:3, background:'#f0f0f0', borderRadius:999, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${90-si*8}%`, background:`linear-gradient(90deg,${col},${col}88)`, borderRadius:999 }}></div>
                </div>
              </div>
            ))}
          </div>}
          {vis('languages') && <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#bbb', marginBottom:8 }}>Languages</div>
            {person.languages.map((l,li)=>(
              <div key={li} style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'#555', marginBottom:4 }}>
                <span>{<EditableText value={l.lang} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.lang`, v)} tag='span' />}</span><span style={{ color:'#bbb' }}>{<EditableText value={l.level} readOnly={readOnly} onChange={(v)=>onPatch?.(`languages.${li}.level`, v)} tag='span' />}</span>
              </div>
            ))}
          </div>}
          {vis('hobbies') && <div>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#bbb', marginBottom:6 }}>Interests</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {person.hobbies.map((h,hi)=>(
                <span key={h} style={{ background:`${col}10`, color:col, fontSize:8.5, padding:'2px 8px', borderRadius:999, border:`1px solid ${col}25` }}>{<EditableText value={h} readOnly={readOnly} onChange={(v)=>onPatch?.(`hobbies.${hi}`, v)} tag='span' />}</span>
              ))}
            </div>
          </div>}

          {vis('references') && <ReferencesBlock
            references={person.references || []}
            accent={accent} readOnly={readOnly} onPatch={onPatch}
            fontHeading={fontHeading}
            compact={false} />}
        </div>
      </div>
    </div>
  );
}
