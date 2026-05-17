// Defines the Magic Tool wizards: which steps each document type walks through,
// and which template category the final picker filters by.
//
// Each step id resolves to a React component in MagicTool's STEP_COMPONENTS map.
// Steps in OPTIONAL_STEPS show a "Skip" button.

export const WIZARDS = {
  resume: {
    label: 'Resume', emoji: '📄',
    steps: ['basics', 'summary', 'experience', 'education', 'skills', 'languages', 'hobbies', 'references', 'pickResume'],
  },
  card: {
    label: 'Business Card', emoji: '💼',
    steps: ['cardIdentity', 'cardContact', 'pickCard'],
  },
  letter: {
    label: 'Cover Letter', emoji: '✉️',
    steps: ['basics', 'letterRecipient', 'letterBody', 'pickLetter'],
  },
  newsletter: {
    label: 'Newsletter', emoji: '📰',
    steps: ['newsletterMeta', 'newsletterHero', 'newsletterStories', 'pickNewsletter'],
  },
  certificate: {
    label: 'Certificate', emoji: '🏆',
    steps: ['certificateDetails', 'pickCertificate'],
  },
  college: {
    label: 'College App', emoji: '🎓',
    steps: ['basics', 'collegeProgram', 'collegeEssay', 'pickCollege'],
  },
  banner: {
    label: 'LinkedIn Banner', emoji: '🔷',
    steps: ['basics', 'summary', 'skills', 'pickBanner'],
  },
  portfolio: {
    label: 'Portfolio', emoji: '🎨',
    steps: ['basics', 'summary', 'portfolioProjects', 'skills', 'pickPortfolio'],
  },
  postcard: {
    label: 'Postcard', emoji: '📮',
    steps: ['postcardDetails', 'pickPostcard'],
  },
};

/** When a wizard runs without a preset category, this step lets the user pick. */
export const PICK_CATEGORY_STEP = 'pickCategory';

/** Step ids the user can skip. */
export const OPTIONAL_STEPS = new Set(['languages', 'hobbies', 'summary', 'references']);

/** Map a wizard category id → template `cat` value used by the gallery. */
export const CATEGORY_FILTER = {
  resume:      'Resume',
  card:        'Business Card',
  letter:      'Cover Letter',
  newsletter:  'Newsletter',
  certificate: 'Certificate',
  college:     'College App',
  banner:      'LinkedIn',
  portfolio:   'Portfolio',
  postcard:    'Postcard',
};

/** Friendly metadata for each step (label, subtitle, emoji). */
export const STEP_META = {
  basics:                { label: 'Basics',          emoji: '👋', subtitle: 'Who are you and how can people reach you?' },
  summary:               { label: 'Summary',         emoji: '📝', subtitle: 'A two-line elevator pitch.' },
  experience:            { label: 'Experience',      emoji: '💼', subtitle: 'List the roles that show what you can do.' },
  education:             { label: 'Education',       emoji: '🎓', subtitle: 'Schools, degrees, certifications.' },
  skills:                { label: 'Skills',          emoji: '⚡', subtitle: 'The keywords recruiters scan for.' },
  languages:             { label: 'Languages',       emoji: '🌍', subtitle: 'Languages you speak (optional).' },
  hobbies:               { label: 'Hobbies',         emoji: '🎨', subtitle: 'A bit of personality (optional).' },
  references:            { label: 'References',      emoji: '👥', subtitle: 'People who can vouch for you (optional).' },

  cardIdentity:          { label: 'Card identity',   emoji: '💼', subtitle: 'The you that people remember.' },
  cardContact:           { label: 'Contact',         emoji: '📇', subtitle: 'How they get back in touch.' },

  letterRecipient:       { label: 'Recipient',       emoji: '📨', subtitle: 'Who is the letter for?' },
  letterBody:            { label: 'Letter body',     emoji: '✍️', subtitle: 'Your pitch. Three or four short paragraphs.' },

  newsletterMeta:        { label: 'Issue info',      emoji: '🗞️', subtitle: 'Title, issue number, date.' },
  newsletterHero:        { label: 'Lead story',      emoji: '⭐', subtitle: 'The headline and lede that opens the issue.' },
  newsletterStories:     { label: 'More stories',    emoji: '📑', subtitle: 'Two to four short follow-ups.' },

  certificateDetails:    { label: 'Certificate',     emoji: '🏆', subtitle: 'Recipient, award, and signatory.' },

  collegeProgram:        { label: 'Program',         emoji: '🎓', subtitle: 'Where are you applying?' },
  collegeEssay:          { label: 'Essay',           emoji: '📝', subtitle: 'Your statement of purpose / personal statement.' },

  portfolioProjects:     { label: 'Projects',        emoji: '🧰', subtitle: 'Up to four highlights for your case studies.' },

  postcardDetails:       { label: 'Postcard',        emoji: '📮', subtitle: 'A short message and a destination.' },

  // Final picker step ids (one per category) — they all reuse the same component
  pickResume:            { label: 'Pick design',     emoji: '🪄', subtitle: 'Choose a layout — your content slots in automatically.' },
  pickCard:              { label: 'Pick design',     emoji: '🪄', subtitle: 'Pick a card style.' },
  pickLetter:            { label: 'Pick design',     emoji: '🪄', subtitle: 'Pick a letterhead.' },
  pickNewsletter:        { label: 'Pick design',     emoji: '🪄', subtitle: 'Pick a newsletter layout.' },
  pickCertificate:       { label: 'Pick design',     emoji: '🪄', subtitle: 'Pick a certificate frame.' },
  pickCollege:           { label: 'Pick design',     emoji: '🪄', subtitle: 'Pick an essay layout.' },
  pickBanner:            { label: 'Pick design',     emoji: '🪄', subtitle: 'Pick a banner style.' },
  pickPortfolio:         { label: 'Pick design',     emoji: '🪄', subtitle: 'Pick a portfolio layout.' },
  pickPostcard:          { label: 'Pick design',     emoji: '🪄', subtitle: 'Pick a postcard.' },

  pickCategory:          { label: 'What to make',    emoji: '✨', subtitle: 'Which kind of document do you want?' },
};
