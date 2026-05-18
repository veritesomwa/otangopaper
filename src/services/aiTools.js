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

/* ──────────────────────────────────────────────────────────────────────────
 * Role library — every helper that produces resume content (summary, bullets,
 * skills) reads from here, keyed by domain. The detector below maps a free-
 * form job title onto one of these keys; anything unrecognised falls back to
 * 'general'. Keep entries grounded — bullet starters should sound like real
 * impact, not buzzword soup.
 * ────────────────────────────────────────────────────────────────────────── */

const ROLE_LIBRARY = {
  engineering: {
    label: 'engineering',
    summaryAdj: ['production-minded', 'pragmatic', 'systems-thinking', 'detail-oriented'],
    summaryFocus: ['distributed systems', 'reliability', 'developer experience', 'performance at scale'],
    bullets: [
      'Led migration of {service} to a microservices architecture, cutting p99 latency by 38%',
      'Designed and shipped a new {feature} pipeline handling {N}M+ requests/day',
      'Reduced incident MTTR by 50% by adding structured tracing and SLO-driven alerts',
      'Mentored {N} junior engineers; two were promoted to senior within 18 months',
      'Authored the team handbook now used to onboard every new hire',
      'Owned migration from {legacy} to {new}; zero customer-facing downtime',
      'Built CI/CD pipeline in {tool}; deploy time fell from 30 min → 4 min',
      'Drove 20% reduction in cloud spend by right-sizing instances and adding autoscaling',
    ],
    skills: ['Python', 'TypeScript', 'Go', 'AWS', 'Kubernetes', 'Docker', 'PostgreSQL', 'Redis', 'gRPC', 'CI/CD', 'Distributed Systems', 'System Design'],
    atsKeywords: ['Production', 'Scalable', 'Distributed', 'Microservices', 'API', 'CI/CD', 'Testing', 'Deployment', 'Performance', 'Latency', 'Throughput', 'Reliability'],
  },

  design: {
    label: 'design',
    summaryAdj: ['user-centred', 'systems-thinking', 'craft-obsessed', 'research-grounded'],
    summaryFocus: ['design systems', 'cross-platform consistency', 'user research', 'accessibility'],
    bullets: [
      'Led redesign of {flow}, increasing completion by 32% and reducing support tickets by 18%',
      'Built and maintained the {name} design system used by {N} product teams',
      'Facilitated {N}+ usability sessions across {N} countries to validate the new {feature}',
      'Partnered with engineering to ship the first WCAG-AA compliant {product}',
      'Reduced design-to-dev handoff time by 40% with a tokenised Figma component library',
      'Defined visual language and brand system used across web, mobile, and marketing',
      'Mentored {N} junior designers and ran weekly critique sessions',
      'Shipped {N} A/B tests; winners drove +12% conversion lift on the signup flow',
    ],
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Accessibility', 'Motion Design', 'A/B Testing', 'Interaction Design', 'Visual Design', 'Information Architecture'],
    atsKeywords: ['User Research', 'Design System', 'Wireframes', 'Prototyping', 'Accessibility', 'A/B Testing', 'User Flow', 'Information Architecture', 'Usability'],
  },

  product: {
    label: 'product',
    summaryAdj: ['outcome-driven', 'data-informed', 'cross-functional', 'customer-obsessed'],
    summaryFocus: ['product strategy', 'roadmap execution', 'metrics that matter', 'cross-functional alignment'],
    bullets: [
      'Owned the {area} roadmap end-to-end; shipped {N} releases hitting every quarterly OKR',
      'Defined and tracked KPIs for {feature}; drove +24% activation in the first 90 days',
      'Partnered with engineering and design to launch {product}, reaching {N}K MAU in 6 months',
      'Ran the {area} discovery cycle — {N} customer interviews + competitive analysis',
      'Authored {N} PRDs and led weekly cross-functional standups',
      'Reduced churn by 14% by surfacing in-product education at the right moments',
      'Built dashboards in {tool} to track north-star and counter metrics weekly',
      'Influenced pricing strategy that lifted ARPU by 18% on annual plans',
    ],
    skills: ['Product Strategy', 'Roadmapping', 'User Research', 'PRD Writing', 'SQL', 'Analytics', 'A/B Testing', 'Mixpanel', 'Stakeholder Management', 'Cross-functional Leadership'],
    atsKeywords: ['Product Strategy', 'Roadmap', 'PRD', 'OKRs', 'KPIs', 'User Insights', 'Market Research', 'Cross-functional', 'Stakeholder Management'],
  },

  data: {
    label: 'data',
    summaryAdj: ['rigorous', 'pragmatic', 'production-minded', 'curious'],
    summaryFocus: ['experimentation', 'forecasting', 'data pipelines', 'self-serve analytics'],
    bullets: [
      'Built an experimentation platform handling {N}+ concurrent A/B tests across product surfaces',
      'Designed forecasting model that beat the existing baseline by {N}% on weekly revenue prediction',
      'Owned the data warehouse migration from {legacy} → {new}; halved query costs',
      'Partnered with product to define the activation metric now reported at the company all-hands',
      'Created self-serve dashboards in {tool} that retired {N}+ ad-hoc requests/month',
      'Mentored {N} analysts on causal inference and experiment design',
      'Reduced data freshness from 24h → 30 min for the executive KPI dashboard',
      'Shipped feature store powering {N} ML models in production',
    ],
    skills: ['SQL', 'Python', 'dbt', 'Airflow', 'Snowflake', 'BigQuery', 'Looker', 'A/B Testing', 'Causal Inference', 'Statistics', 'Machine Learning', 'Forecasting'],
    atsKeywords: ['Experimentation', 'Hypothesis Testing', 'Forecasting', 'Statistical Significance', 'Cohort Analysis', 'Data Pipelines', 'Warehousing'],
  },

  marketing: {
    label: 'marketing',
    summaryAdj: ['brand-led', 'metrics-driven', 'storytelling-first', 'channel-fluent'],
    summaryFocus: ['growth', 'positioning', 'lifecycle', 'content + paid'],
    bullets: [
      'Grew the {channel} channel from {N}K → {N}M monthly visitors in 18 months',
      'Launched {N} integrated campaigns across paid, organic, and lifecycle; +27% pipeline contribution',
      'Owned brand refresh — new identity, messaging, and website; +33% time on page',
      'Built and managed a content engine producing {N} pieces/quarter at sub-$50 CPM',
      'Improved trial → paid conversion by 19% by re-segmenting the lifecycle program',
      'Partnered with sales on ABM motion targeting {N} accounts; closed {N}M in pipeline',
      'Defined the brand voice and writing guidelines now used company-wide',
      'Owned the swag and event playbook; ran {N} regional roadshows under a single budget',
    ],
    skills: ['SEO', 'Paid Acquisition', 'Lifecycle Marketing', 'Brand', 'Content Strategy', 'Copywriting', 'HubSpot', 'Marketo', 'GA4', 'Attribution', 'Webflow', 'A/B Testing'],
    atsKeywords: ['Positioning', 'GTM', 'Pipeline', 'MQL', 'SQL', 'CAC', 'LTV', 'Funnel', 'Conversion'],
  },

  sales: {
    label: 'sales',
    summaryAdj: ['quota-crushing', 'consultative', 'pipeline-focused', 'customer-obsessed'],
    summaryFocus: ['enterprise sales', 'pipeline generation', 'territory ownership', 'multi-threading'],
    bullets: [
      'Closed {N}M in ARR in FY{year} — {N}% of quota, top {N}% in the region',
      'Built outbound playbook adopted by the full {N}-person AE team',
      'Multi-threaded {N} enterprise accounts; closed {logo} as the largest deal of the quarter',
      'Reduced sales cycle by 19 days by introducing structured discovery in stage 1',
      'Owned the {region} territory end-to-end — pipeline gen, mid-funnel, close',
      'Partnered with marketing on ABM motion; sourced {N}M in net-new pipeline',
      'Mentored {N} new AEs through ramp; all hit quota in their first full quarter',
    ],
    skills: ['Enterprise Sales', 'MEDDPICC', 'Solution Selling', 'Outbound', 'Salesforce', 'Outreach', 'Account Planning', 'Negotiation', 'Forecasting'],
    atsKeywords: ['Quota', 'Pipeline', 'Closed Won', 'ARR', 'ACV', 'TCV', 'Outbound', 'Multi-threaded', 'Discovery', 'Negotiation'],
  },

  general: {
    label: 'general',
    summaryAdj: ['cross-functional', 'pragmatic', 'outcome-focused', 'collaborative'],
    summaryFocus: ['delivering measurable impact', 'building strong teams', 'shipping pragmatic solutions'],
    bullets: [
      'Led {project} from concept to launch, hitting all milestones on schedule',
      'Mentored {N} team members; two were promoted within 12 months',
      'Authored process documentation that became the team standard',
      'Owned cross-functional coordination across engineering, design, and stakeholders',
      'Drove measurable improvements in {metric}, +{N}% in the first quarter',
      'Reduced operational overhead by 25% by automating recurring workflows',
    ],
    skills: ['Cross-functional Collaboration', 'Project Management', 'Stakeholder Management', 'Strategic Planning', 'Communication', 'Mentorship'],
    atsKeywords: ['Agile', 'Scrum', 'Cross-functional', 'Stakeholders', 'KPI', 'OKR', 'Roadmap', 'Strategy', 'Mentorship', 'Leadership', 'Collaboration'],
  },
};

// Legacy alias — older callers still expect `ATS_DICT`. Map each role to its
// dictionary so atsOptimize() keeps working without a touch.
const ATS_DICT = Object.fromEntries(
  Object.entries(ROLE_LIBRARY).map(([k, v]) => [k, v.atsKeywords]),
);

/** Best-effort detection of which role library entry to use. Looks at the
 *  job title (and falls back to the summary if the title is empty). */
function detectDomain(person) {
  const t = (person?.title || '').toLowerCase();
  const s = (person?.summary || '').toLowerCase();
  const haystack = `${t} ${s}`;
  if (/data scientist|data engineer|analyst|machine learning|ml engineer|ai engineer/.test(haystack)) return 'data';
  if (/engineer|developer|software|programming|swe|backend|frontend|full[\s-]?stack|devops|sre/.test(haystack)) return 'engineering';
  if (/design|ux|ui|brand designer|art director|illustrator/.test(haystack)) return 'design';
  if (/product manager|product lead|pm\b|product owner|growth product/.test(haystack)) return 'product';
  if (/marketing|brand manager|content|seo|growth marketer|demand gen/.test(haystack))   return 'marketing';
  if (/sales|account executive|\bae\b|account manager|business development|\bbdr\b|\bsdr\b/.test(haystack)) return 'sales';
  return 'general';
}

/** Public for callers that want to inspect the live library (e.g. magic-tool
 *  ExperienceStep showing suggestion chips for the current role). */
export function getRoleProfile(person) {
  const domain = detectDomain(person);
  return { domain, ...ROLE_LIBRARY[domain] };
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
//
// Builds a tailored summary from whatever lives on `person` right now — so
// passing the magic-tool's edited person gives a summary about the user's
// chosen title, while a freshly-seeded profile (from the registered account)
// gives a summary about that. The function is pure — caller decides which
// person object to hand it.

export async function generateSummary(person) {
  await delay(THINK_MS);
  const role     = getRoleProfile(person);
  const years    = computeYears(person);
  const topExp   = (person.experience || [])[0];
  const skills   = (person.skills || []).slice(0, 4).join(', ');
  const title    = person.title || 'professional';

  // Pick deterministic-feeling but slightly varied phrasing from the library.
  const adj   = pick(role.summaryAdj,   title);
  const focus = pick(role.summaryFocus, person.name || title);

  const yearsClause = years > 0 ? `${years}+ years` : 'multiple years';
  const expClause   = topExp ? ` Most recently at ${topExp.company} as ${topExp.role}.` : '';
  const skillsClause = skills ? ` Strong in ${skills}.` : '';

  return `${capitalise(adj)} ${title} with ${yearsClause} of experience focused on ${focus}.${expClause}${skillsClause} Known for shipping pragmatic work that moves the metrics that matter.`;
}

/** Stable pseudo-random pick from `arr` keyed by `seed` — same seed always
 *  picks the same item, so repeated calls don't churn the summary. */
function pick(arr, seed) {
  if (!arr?.length) return '';
  const s = String(seed || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}
function capitalise(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

// ── 7b. Suggest bullets — role-aware ──────────────────────────────────
//
// Returns 6–8 strong bullet-point starters tailored to the user's job title.
// Token placeholders like {service}, {N}, {feature} are kept so the user
// can fill them in — they read like prompts rather than fake claims.

export async function suggestBullets(person, count = 8) {
  await delay(THINK_MS - 200);
  const role = getRoleProfile(person);
  const bullets = role.bullets || [];
  // Rotate the starting offset based on the title so different titles see a
  // slightly different bullet ordering — feels less canned.
  const seedStart = Math.abs(hashCode(person.title || '')) % bullets.length;
  const out = [];
  for (let i = 0; i < Math.min(count, bullets.length); i++) {
    out.push(bullets[(seedStart + i) % bullets.length]);
  }
  return { domain: role.domain, bullets: out };
}

// ── 7c. Suggest skills — role-aware ──────────────────────────────────

export async function suggestSkillsForRole(person, count = 10) {
  await delay(THINK_MS - 250);
  const role  = getRoleProfile(person);
  const have  = new Set((person.skills || []).map((s) => s.toLowerCase()));
  const all   = role.skills || [];
  const fresh = all.filter((s) => !have.has(s.toLowerCase()));
  return {
    domain: role.domain,
    suggested: fresh.slice(0, count),
    alreadyHave: all.filter((s) => have.has(s.toLowerCase())),
  };
}

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return h;
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
  suggestBullets,
  suggestSkillsForRole,
  getRoleProfile,
};
