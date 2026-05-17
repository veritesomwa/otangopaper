// AI Tools — client-side stubs for the nine AI features.
//
// Every function takes plain inputs (text or a person object) and returns a
// Promise resolving to the transformed result. The fake "thinking time" makes
// loading states feel real. To swap to a real backend, replace each
// function's body with `apiFetch('/ai/<endpoint>', { method: 'POST', body: ... })`.

const THINK_MS = 450;

function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ── Heuristics shared across tools ────────────────────────────────────

const WEAK_VERBS = ['worked on', 'helped with', 'was responsible for', 'assisted', 'did', 'made', 'used', 'took part in', 'participated in', 'involved in'];
const STRONG_VERBS = ['Led', 'Built', 'Shipped', 'Designed', 'Architected', 'Owned', 'Drove', 'Launched', 'Delivered', 'Spearheaded'];

const FILLER_WORDS = /\b(very|really|just|quite|simply|basically|actually|literally|definitely|absolutely|kind of|sort of)\s+/gi;

// Common ATS keywords by domain — used by ATS Optimization
const ATS_DICT = {
  general: ['Agile', 'Scrum', 'Cross-functional', 'Stakeholders', 'KPI', 'OKR', 'Roadmap', 'Strategy', 'Mentorship', 'Leadership', 'Collaboration', 'Analytics', 'Optimization'],
  engineering: ['Production', 'Scalable', 'Distributed', 'Microservices', 'API', 'CI/CD', 'Testing', 'Deployment', 'Performance', 'Latency', 'Throughput', 'Reliability'],
  design: ['User Research', 'Design System', 'Wireframes', 'Prototyping', 'Accessibility', 'A/B Testing', 'User Flow', 'Information Architecture'],
  product: ['Product Strategy', 'Roadmap', 'PRD', 'OKRs', 'KPIs', 'User Insights', 'Market Research', 'Cross-functional', 'Stakeholder Management'],
};

function detectDomain(person) {
  const t = (person?.title || '').toLowerCase();
  if (/engineer|developer|software|programming/.test(t)) return 'engineering';
  if (/design|ux|ui|product designer/.test(t))           return 'design';
  if (/product manager|pm|strategy/.test(t))             return 'product';
  return 'general';
}

function hasMetric(text) {
  return /\d+%|\$[\d,]+|\b\d+(?:\.\d+)?(?:k|K|m|M|x|X|\+)?\b/.test(text || '');
}

// ── 1. Improve Resume — bulk-rewrites bullets into stronger versions ──
export async function improveResume(person) {
  await delay(THINK_MS);
  const next = JSON.parse(JSON.stringify(person));
  let changes = 0;

  if (next.summary) {
    next.summary = strengthen(next.summary);
  }
  next.experience = (next.experience || []).map((e) => ({
    ...e,
    bullets: (e.bullets || []).map((b) => {
      const improved = strengthen(b);
      if (improved !== b) changes++;
      return improved;
    }),
  }));
  return { person: next, changes, message: `Strengthened ${changes} bullet${changes === 1 ? '' : 's'} with sharper verbs and clearer phrasing.` };
}

function strengthen(text) {
  if (!text) return text;
  let out = text;
  // Replace weak verbs at the start of bullets
  WEAK_VERBS.forEach((weak, i) => {
    const rx = new RegExp(`^${weak}\\b`, 'i');
    if (rx.test(out)) {
      out = out.replace(rx, STRONG_VERBS[i % STRONG_VERBS.length]);
    }
  });
  // Capitalize first letter
  out = out.charAt(0).toUpperCase() + out.slice(1);
  // Strip filler
  out = out.replace(FILLER_WORDS, '');
  // If no metric, suggest one
  if (!hasMetric(out) && /improve|reduce|increase|grow|launch|deliver|ship/i.test(out)) {
    if (!out.endsWith('.')) out = out;
  }
  return out.trim();
}

// ── 2. Rewrite Professionally ─────────────────────────────────────────
export async function rewriteProfessionally(text) {
  await delay(THINK_MS);
  if (!text) return '';
  let out = text.trim();
  // Expand contractions
  const expansions = {
    "don't": 'do not', "won't": 'will not', "can't": 'cannot', "I've": 'I have',
    "I'm": 'I am', "they're": 'they are', "you're": 'you are', "it's": 'it is',
    "we're": 'we are', "doesn't": 'does not', "didn't": 'did not',
  };
  Object.entries(expansions).forEach(([k, v]) => {
    out = out.replace(new RegExp('\\b' + k + '\\b', 'gi'), v);
  });
  // Capitalize sentences
  out = out.replace(/(^|[.!?]\s+)([a-z])/g, (m, sep, c) => sep + c.toUpperCase());
  // Strip filler
  out = out.replace(FILLER_WORDS, '');
  // Ensure it ends with a period
  if (!/[.!?]$/.test(out)) out += '.';
  return out;
}

// ── 3. Fix Grammar ────────────────────────────────────────────────────
export async function fixGrammar(text) {
  await delay(THINK_MS);
  if (!text) return '';
  let out = text;
  // Fix common typos
  const typos = {
    'teh': 'the', 'recieve': 'receive', 'occured': 'occurred', 'seperate': 'separate',
    'definately': 'definitely', 'thier': 'their', "alot": 'a lot', 'alot': 'a lot',
  };
  Object.entries(typos).forEach(([k, v]) => {
    out = out.replace(new RegExp('\\b' + k + '\\b', 'gi'), (m) =>
      m[0] === m[0].toUpperCase() ? v[0].toUpperCase() + v.slice(1) : v);
  });
  // Collapse double spaces
  out = out.replace(/\s{2,}/g, ' ');
  // Capitalize first letter of each sentence
  out = out.replace(/(^|[.!?]\s+)([a-z])/g, (m, sep, c) => sep + c.toUpperCase());
  // Add period at end
  if (out.length && !/[.!?]$/.test(out)) out += '.';
  return out.trim();
}

// ── 4. Shorten Text ───────────────────────────────────────────────────
export async function shortenText(text, targetRatio = 0.7) {
  await delay(THINK_MS);
  if (!text) return '';
  let out = text.trim();
  // Strip filler aggressively
  out = out.replace(FILLER_WORDS, '');
  // Drop parenthetical asides
  out = out.replace(/\s*\([^)]*\)/g, '');
  // Drop "in order to" → "to"
  out = out.replace(/\bin order to\b/gi, 'to');
  // If still too long, truncate at the nearest sentence boundary
  const target = Math.max(20, Math.floor(text.length * targetRatio));
  if (out.length > target) {
    const cut = out.slice(0, target);
    const lastSentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
    out = lastSentence > 20 ? cut.slice(0, lastSentence + 1) : cut.slice(0, target).trimEnd() + '…';
  }
  return out.trim();
}

// ── 5. Expand Content ─────────────────────────────────────────────────
export async function expandContent(text) {
  await delay(THINK_MS);
  if (!text) return '';
  let out = text.trim();
  if (!/[.!?]$/.test(out)) out += '.';
  // Add a measurable-impact clause if none exists
  if (!hasMetric(out)) {
    const clauses = [
      ' This delivered measurable improvements to team velocity and product outcomes.',
      ' The change drove adoption across multiple downstream teams.',
      ' Results were validated through user research and quantitative analysis.',
      ' This work directly contributed to revenue growth and customer satisfaction.',
    ];
    out += clauses[Math.floor(Math.random() * clauses.length)];
  }
  // Add a context/detail clause
  const details = [
    ' Worked closely with cross-functional partners to align on scope and tradeoffs.',
    ' Collaborated with engineering, design, and stakeholder teams.',
    ' Iterated through multiple rounds of feedback and refinement.',
  ];
  out += details[Math.floor(Math.random() * details.length)];
  return out.trim();
}

// ── 6. ATS Optimization ───────────────────────────────────────────────
export async function atsOptimize(person) {
  await delay(THINK_MS);
  const domain = detectDomain(person);
  const dict = [...(ATS_DICT[domain] || []), ...ATS_DICT.general];
  const have = new Set((person.skills || []).map((s) => s.toLowerCase()));
  const allText = [
    person.summary,
    ...(person.experience || []).flatMap((e) => [e.role, e.company, ...(e.bullets || [])]),
  ].join(' ').toLowerCase();
  const missing = dict.filter((kw) => !have.has(kw.toLowerCase()) && !allText.includes(kw.toLowerCase()));
  const present = dict.filter((kw) => have.has(kw.toLowerCase()) || allText.includes(kw.toLowerCase()));
  // Score: % of dict keywords present
  const score = Math.min(100, Math.round((present.length / dict.length) * 100));
  // Suggest adding the top 5 missing keywords as skills
  const suggestSkills = missing.slice(0, 5);
  return {
    score,
    domain,
    presentCount: present.length,
    missingCount: missing.length,
    suggestSkills,
    message: `Detected ${domain} role · ${score}/100 ATS coverage. Suggested ${suggestSkills.length} missing keywords.`,
  };
}

// ── 7. Generate Summary ───────────────────────────────────────────────
export async function generateSummary(person) {
  await delay(THINK_MS);
  const years = computeYears(person);
  const topExp = (person.experience || [])[0];
  const skills = (person.skills || []).slice(0, 4).join(', ');
  const title = person.title || 'professional';
  const yearsClause = years > 0 ? `${years}+ years ` : '';
  const expClause = topExp ? ` Most recently at ${topExp.company} as ${topExp.role}.` : '';
  const skillsClause = skills ? ` Strong skills in ${skills}.` : '';
  return `Experienced ${title} with ${yearsClause}of building and shipping high-impact work.${expClause}${skillsClause} Passionate about quality, collaboration, and delivering measurable results.`;
}

function computeYears(person) {
  const exp = person.experience || [];
  if (!exp.length) return 0;
  // Crude: parse the earliest year from periods like "2018 – 2021"
  let earliest = Infinity;
  exp.forEach((e) => {
    const m = (e.period || '').match(/\d{4}/);
    if (m) earliest = Math.min(earliest, parseInt(m[0], 10));
  });
  if (earliest === Infinity) return 0;
  return Math.max(0, new Date().getFullYear() - earliest);
}

// ── 8. Tailor for Job Description ─────────────────────────────────────
export async function tailorForJD(person, jdText) {
  await delay(THINK_MS + 200);
  const text = (jdText || '').toLowerCase();
  // Extract candidate keywords: capitalized phrases + common skill nouns
  const tokens = new Set();
  // Multi-word capitalized phrases (e.g. "Distributed Systems")
  for (const m of (jdText || '').matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g)) {
    if (m[1].length >= 3 && !/^(The|And|Or|For|With|Of|At|In|On|To|A|An)$/.test(m[1])) {
      tokens.add(m[1].trim());
    }
  }
  // Tech tokens — words from the ATS dict that appear
  Object.values(ATS_DICT).flat().forEach((kw) => {
    if (text.includes(kw.toLowerCase())) tokens.add(kw);
  });
  const keywords = Array.from(tokens).slice(0, 25);
  // Cross-reference with resume
  const resumeText = JSON.stringify(person).toLowerCase();
  const matched   = keywords.filter((k) => resumeText.includes(k.toLowerCase()));
  const missing   = keywords.filter((k) => !resumeText.includes(k.toLowerCase()));
  const matchRate = keywords.length === 0 ? 0 : Math.round((matched.length / keywords.length) * 100);
  return {
    keywords,
    matched,
    missing,
    matchRate,
    suggestSkills: missing.slice(0, 6),
    message: keywords.length
      ? `Found ${keywords.length} keywords in the JD · ${matchRate}% match. ${missing.length} missing.`
      : 'Could not extract clear keywords from the JD. Try a more detailed posting.',
  };
}

// ── 9. AI Suggestions Panel — live resume analyzer ─────────────────────
export async function analyzeResume(person) {
  await delay(THINK_MS - 200);
  const suggestions = [];

  // Summary checks
  if (!person.summary) {
    suggestions.push({ id: 'sum-empty', severity: 'high', area: 'Summary', text: 'Add a professional summary so recruiters get a quick read.', fix: 'generate-summary' });
  } else if (person.summary.length < 80) {
    suggestions.push({ id: 'sum-short', severity: 'medium', area: 'Summary', text: 'Summary is short — aim for 2–3 sentences.', fix: 'expand-summary' });
  } else if (person.summary.length > 400) {
    suggestions.push({ id: 'sum-long', severity: 'low', area: 'Summary', text: 'Summary is long — recruiters skim, consider shortening.', fix: 'shorten-summary' });
  }

  // Experience checks
  const exp = person.experience || [];
  if (exp.length === 0) {
    suggestions.push({ id: 'exp-empty', severity: 'high', area: 'Experience', text: 'No work experience listed.', fix: null });
  } else {
    exp.forEach((e, ei) => {
      (e.bullets || []).forEach((b, bi) => {
        const verb = (b.split(/\s+/)[0] || '').toLowerCase();
        if (WEAK_VERBS.some((w) => b.toLowerCase().startsWith(w))) {
          suggestions.push({
            id: `weak-${ei}-${bi}`, severity: 'medium', area: `${e.company} bullet ${bi + 1}`,
            text: `"${b.slice(0, 60)}…" starts with a weak verb. Try a stronger action verb.`,
            fix: 'improve-bullet', target: { kind: 'bullet', ei, bi },
          });
        }
        if (!hasMetric(b) && b.length > 30) {
          suggestions.push({
            id: `metric-${ei}-${bi}`, severity: 'low', area: `${e.company} bullet ${bi + 1}`,
            text: 'No metric — quantify the impact (%, $, time, scale).',
            fix: null,
          });
        }
        if (b.length > 200) {
          suggestions.push({
            id: `long-${ei}-${bi}`, severity: 'low', area: `${e.company} bullet ${bi + 1}`,
            text: 'Bullet is long — keep each under ~30 words.',
            fix: 'shorten-bullet', target: { kind: 'bullet', ei, bi },
          });
        }
      });
      if (!e.bullets || e.bullets.length === 0) {
        suggestions.push({ id: `nob-${ei}`, severity: 'medium', area: e.company, text: `${e.company} has no bullet points.`, fix: null });
      }
    });
  }

  // Skills checks
  const skills = person.skills || [];
  if (skills.length < 4) {
    suggestions.push({ id: 'skills-few', severity: 'medium', area: 'Skills', text: 'Aim for 6–10 skills so the ATS has enough to match on.', fix: null });
  }
  if (skills.length > 20) {
    suggestions.push({ id: 'skills-many', severity: 'low', area: 'Skills', text: 'Too many skills — focus on the top 8–12 most relevant.', fix: null });
  }

  // Contact checks
  if (!person.email)    suggestions.push({ id: 'no-email',    severity: 'high', area: 'Contact', text: 'No email — recruiters cannot reach you.', fix: null });
  if (!person.phone)    suggestions.push({ id: 'no-phone',    severity: 'low',  area: 'Contact', text: 'No phone — consider adding one for callbacks.', fix: null });
  if (!person.location) suggestions.push({ id: 'no-location', severity: 'low',  area: 'Contact', text: 'No location — local recruiters filter on it.', fix: null });

  // Resume score: 100 minus weighted issues
  const weights = { high: 12, medium: 6, low: 2 };
  const score = Math.max(0, 100 - suggestions.reduce((s, x) => s + (weights[x.severity] || 0), 0));

  return { score, suggestions };
}

// ── Default export with all tools, useful for the panel ───────────────
export const aiTools = {
  improveResume,
  rewriteProfessionally,
  fixGrammar,
  shortenText,
  expandContent,
  atsOptimize,
  generateSummary,
  tailorForJD,
  analyzeResume,
};
