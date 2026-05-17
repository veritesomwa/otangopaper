// Ordered list of steps shown in the Magic Tool wizard. The component for each
// step is loaded by id in MagicTool.jsx; keep ids and labels in sync there.

export const MAGIC_STEPS = [
  { id: 'welcome',    label: 'Welcome',     emoji: '✨', subtitle: "Let's build your resume in a few minutes." },
  { id: 'basics',     label: 'Basics',      emoji: '👋', subtitle: 'Who are you and how can people reach you?' },
  { id: 'summary',    label: 'Summary',     emoji: '📝', subtitle: 'A two-line elevator pitch for the top of your CV.' },
  { id: 'experience', label: 'Experience',  emoji: '💼', subtitle: 'List the roles that show what you can do.' },
  { id: 'education',  label: 'Education',   emoji: '🎓', subtitle: 'Schools, degrees, certifications.' },
  { id: 'skills',     label: 'Skills',      emoji: '⚡', subtitle: 'The keywords recruiters scan for.' },
  { id: 'languages',  label: 'Languages',   emoji: '🌍', subtitle: 'Languages you speak (optional).' },
  { id: 'hobbies',    label: 'Hobbies',     emoji: '🎨', subtitle: 'A bit of personality (optional).' },
  { id: 'pick',       label: 'Pick design', emoji: '🪄', subtitle: 'Choose a template — your content slots in automatically.' },
];

/** Steps the user is allowed to skip. */
export const OPTIONAL_STEPS = new Set(['languages', 'hobbies']);
