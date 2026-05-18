import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_PERSON }   from '@data/defaultPerson.js';
import { DEFAULT_SECTIONS } from '@data/defaultSections.js';
import { FONT_PAIRS }       from '@data/fontPairs.js';
import { DEFAULT_PAGE_SIZE } from '@data/pageSizes.js';

export const DocumentContext = createContext(null);

const HISTORY_LIMIT = 40;

/**
 * Holds the document the user is currently editing. Wraps an Editor session.
 *
 * State:
 *   template, sections, person, accent, fontPair, pageSize, docName, saved
 *   canUndo, canRedo
 *   canvasRef       (ref to the rendered template node, used by exportService)
 *
 * Actions:
 *   open(template)           start a new doc using template
 *   switchTemplate(t)        swap the look while preserving content
 *   patchPerson(patch)       merge fields into person
 *   setSections(updater)
 *   setAccent(c) / setFontPair(fp) / setPageSize(p) / setDocName(n)
 *   applyAI(payload)         apply AI-generated resume content
 *   undo() / redo()
 *   markDirty()
 */
export function DocumentProvider({ children }) {
  const [template, setTemplateRaw]   = useState(null);
  const [sections, setSectionsRaw]   = useState(() => clone(DEFAULT_SECTIONS));
  const [person, setPersonRaw]       = useState(() => clone(DEFAULT_PERSON));
  const [accent, setAccentRaw]       = useState('#1756C8');
  const [fontPair, setFontPairRaw]   = useState(FONT_PAIRS[0]);
  const [pageSize, setPageSizeRaw]   = useState(DEFAULT_PAGE_SIZE);
  const [docName, setDocNameRaw]     = useState('My Document');
  const [saved, setSaved]            = useState(true);

  // Document-level format controls — applied as CSS variables on the canvas
  // wrapper so they reach into every template renderer without a refactor.
  const [fontScale,    setFontScaleRaw]    = useState(1);    // 0.75 – 1.30
  const [lineHeight,   setLineHeightRaw]   = useState(1.5);  // 1.0 – 2.0
  const [sectionGap,   setSectionGapRaw]   = useState(0);    // 0 – 32 px (extra)
  const [bulletStyle,  setBulletStyleRaw]  = useState('disc'); // disc · circle · square · dash · arrow · none

  // History stack — keeps snapshots so undo/redo can replay them.
  const [history, setHistory]   = useState([]);  // { template, sections, person, accent, fontPair, pageSize, docName }[]
  const [hIdx, setHIdx]         = useState(-1);
  const isReplaying             = useRef(false);
  const dirtyTimeout            = useRef(null);

  // External handle on the canvas DOM node — set by Editor; read by export service.
  const canvasRef = useRef(null);

  // ── Snapshotting ──────────────────────────────────────────────────────────
  const buildSnapshot = useCallback(() => clone({
    template, sections, person, accent, fontPair, pageSize, docName,
    fontScale, lineHeight, sectionGap, bulletStyle,
  }), [template, sections, person, accent, fontPair, pageSize, docName,
       fontScale, lineHeight, sectionGap, bulletStyle]);

  const commitSnapshot = useCallback(() => {
    if (isReplaying.current) return;
    const snap = buildSnapshot();
    setHistory((prev) => {
      const trimmed = prev.slice(0, hIdx + 1);
      // Skip dupes — happens when nothing actually changed
      const last = trimmed[trimmed.length - 1];
      if (last && JSON.stringify(last) === JSON.stringify(snap)) return prev;
      const next = [...trimmed, snap].slice(-HISTORY_LIMIT);
      setHIdx(next.length - 1);
      return next;
    });
  }, [buildSnapshot, hIdx]);

  // Seed the initial snapshot once on mount
  useEffect(() => {
    if (history.length === 0) {
      setHistory([buildSnapshot()]);
      setHIdx(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markDirty = useCallback(() => {
    setSaved(false);
    clearTimeout(dirtyTimeout.current);
    dirtyTimeout.current = setTimeout(() => {
      commitSnapshot();
      setSaved(true);
    }, 600);
  }, [commitSnapshot]);

  // ── Replay a snapshot (undo / redo) ───────────────────────────────────────
  const apply = useCallback((snap) => {
    if (!snap) return;
    isReplaying.current = true;
    setTemplateRaw(snap.template);
    setSectionsRaw(snap.sections);
    setPersonRaw(snap.person);
    setAccentRaw(snap.accent);
    setFontPairRaw(snap.fontPair);
    setPageSizeRaw(snap.pageSize);
    setDocNameRaw(snap.docName);
    if (typeof snap.fontScale   === 'number') setFontScaleRaw(snap.fontScale);
    if (typeof snap.lineHeight  === 'number') setLineHeightRaw(snap.lineHeight);
    if (typeof snap.sectionGap  === 'number') setSectionGapRaw(snap.sectionGap);
    if (typeof snap.bulletStyle === 'string') setBulletStyleRaw(snap.bulletStyle);
    setSaved(true);
    // Release the replay flag on the next tick
    setTimeout(() => { isReplaying.current = false; }, 0);
  }, []);

  const undo = useCallback(() => {
    if (hIdx <= 0) return;
    apply(history[hIdx - 1]);
    setHIdx(hIdx - 1);
  }, [hIdx, history, apply]);

  const redo = useCallback(() => {
    if (hIdx >= history.length - 1) return;
    apply(history[hIdx + 1]);
    setHIdx(hIdx + 1);
  }, [hIdx, history, apply]);

  // ── Public mutators ───────────────────────────────────────────────────────
  const setSections = useCallback((updater) => { setSectionsRaw(updater); markDirty(); }, [markDirty]);
  const setAccent   = useCallback((a)        => { setAccentRaw(a);        markDirty(); }, [markDirty]);
  const setFontPair = useCallback((fp)       => { setFontPairRaw(fp);     markDirty(); }, [markDirty]);
  const setPageSize = useCallback((p)        => { setPageSizeRaw(p);      markDirty(); }, [markDirty]);
  const setDocName  = useCallback((n)        => { setDocNameRaw(n || 'My Document'); markDirty(); }, [markDirty]);

  // Format setters — clamped + dirty-marked.
  const setFontScale   = useCallback((n) => { setFontScaleRaw(clamp(n, 0.75, 1.30));    markDirty(); }, [markDirty]);
  const setLineHeight  = useCallback((n) => { setLineHeightRaw(clamp(n, 1.0, 2.0));     markDirty(); }, [markDirty]);
  const setSectionGap  = useCallback((n) => { setSectionGapRaw(clamp(n, 0, 32));        markDirty(); }, [markDirty]);
  const setBulletStyle = useCallback((s) => { setBulletStyleRaw(String(s || 'disc'));   markDirty(); }, [markDirty]);

  /**
   * Open a template fresh. `seedProfile` is the user's saved Profile sub-doc
   * (from AuthContext); when present, it shallow-overrides DEFAULT_PERSON so
   * name/email/title/etc. are pre-filled without forcing the user to retype
   * common info. Pass nothing for the legacy behaviour (DEFAULT_PERSON only).
   */
  const open = useCallback((tpl, seedProfile) => {
    setTemplateRaw(tpl);
    setAccentRaw(tpl?.accent || '#1756C8');
    setFontPairRaw(FONT_PAIRS[0]);
    setSectionsRaw(clone(DEFAULT_SECTIONS));
    const seededPerson = mergePerson(DEFAULT_PERSON, seedProfile);
    setPersonRaw(clone(seededPerson));
    setPageSizeRaw(DEFAULT_PAGE_SIZE);
    setDocNameRaw(tpl?.name || 'My Document');
    setFontScaleRaw(1);
    setLineHeightRaw(1.5);
    setSectionGapRaw(0);
    setBulletStyleRaw('disc');
    setSaved(true);
    // Reset history to start fresh on this doc
    setHistory([clone({
      template: tpl,
      sections: DEFAULT_SECTIONS, person: seededPerson,
      accent: tpl?.accent || '#1756C8', fontPair: FONT_PAIRS[0],
      pageSize: DEFAULT_PAGE_SIZE, docName: tpl?.name || 'My Document',
      fontScale: 1, lineHeight: 1.5, sectionGap: 0, bulletStyle: 'disc',
    })]);
    setHIdx(0);
  }, []);

  const switchTemplate = useCallback((tpl) => {
    setTemplateRaw(tpl);
    setAccentRaw(tpl?.accent || '#1756C8');
    markDirty();
  }, [markDirty]);

  const patchPerson = useCallback((patch) => {
    setPersonRaw((prev) => ({ ...prev, ...patch }));
    markDirty();
  }, [markDirty]);

  /**
   * Set a nested field on `person` by dotted path. Creates intermediate
   * objects as needed. Used by inline-editable text inside templates.
   * Examples:
   *   patchPath('name',                'New Name')
   *   patchPath('newsletter.title',    'New Title')
   *   patchPath('postcard.message',    'New message')
   */
  const patchPath = useCallback((path, value) => {
    if (!path) return;
    setPersonRaw((prev) => {
      const parts = String(path).split('.');
      const next = clone(prev);
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i];
        if (cur[k] === null || typeof cur[k] !== 'object') cur[k] = {};
        cur = cur[k];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
    markDirty();
  }, [markDirty]);

  const applyAI = useCallback((data) => {
    setPersonRaw((prev) => ({
      ...prev,
      summary: data.summary || prev.summary,
      skills:  data.skills  || prev.skills,
      experience: data.experience
        ? data.experience.map((e, i) => ({
            ...(prev.experience[i] || { id: `e${i + 1}` }),
            ...e,
            id: prev.experience[i]?.id || `e${i + 1}`,
          }))
        : prev.experience,
    }));
    markDirty();
  }, [markDirty]);

  const value = useMemo(() => ({
    // state
    template, sections, person, accent, fontPair, pageSize, docName, saved,
    fontScale, lineHeight, sectionGap, bulletStyle,
    canUndo: hIdx > 0,
    canRedo: hIdx < history.length - 1,
    canvasRef,
    // mutators
    open, switchTemplate, patchPerson, patchPath, applyAI, markDirty,
    setSections, setAccent, setFontPair, setPageSize, setDocName,
    setFontScale, setLineHeight, setSectionGap, setBulletStyle,
    undo, redo,
  }), [
    template, sections, person, accent, fontPair, pageSize, docName, saved,
    fontScale, lineHeight, sectionGap, bulletStyle,
    hIdx, history.length,
    open, switchTemplate, patchPerson, patchPath, applyAI, markDirty,
    setSections, setAccent, setFontPair, setPageSize, setDocName,
    setFontScale, setLineHeight, setSectionGap, setBulletStyle,
    undo, redo,
  ]);

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/** Merge a saved profile into the DEFAULT_PERSON seed. Only fields that are
 *  defined and non-empty in the profile override defaults — that way, a
 *  freshly-saved Profile without (say) `experience` still inherits the demo
 *  experience block from DEFAULT_PERSON. */
function mergePerson(defaults, profile) {
  if (!profile || typeof profile !== 'object') return defaults;
  const out = { ...defaults };
  for (const [k, v] of Object.entries(profile)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  // The avatar control writes to person.photoUrl, but the profile form keeps
  // an `avatarUrl` alias — accept either.
  if (!out.photoUrl && profile.avatarUrl) out.photoUrl = profile.avatarUrl;
  return out;
}

function clamp(n, lo, hi) {
  const x = Number(n);
  if (Number.isNaN(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}
