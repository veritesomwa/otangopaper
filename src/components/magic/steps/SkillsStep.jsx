// Skills wizard step. Suggestions are role-aware: we read the current person.title
// (which may have been edited inside the wizard, or seeded from the saved
// Profile) and pull a tailored list from the AI tools' role library.

import { useDocument } from '@hooks/useDocument.js';
import { getRoleProfile } from '@services/aiTools.js';
import { TagInputStep } from './TagInputStep.jsx';

// Mixed fallback when no clear role match — broad enough to cover anyone.
const FALLBACK = [
  'Figma', 'JavaScript', 'TypeScript', 'React', 'Python', 'SQL',
  'Project Management', 'Agile', 'Communication', 'Leadership',
  'Stakeholder Management',
];

export function SkillsStep(props) {
  const { person } = useDocument();
  const role = getRoleProfile(person);
  // Use the role's own skill list first; merge the fallback at the end so the
  // user always sees a few generic options too.
  const seen = new Set();
  const suggestions = [...(role.skills || []), ...FALLBACK].filter((s) => {
    const k = s.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k); return true;
  }).slice(0, 16);

  return (
    <TagInputStep {...props}
      fieldKey="skills"
      placeholder="Type a skill and press Enter…"
      suggestions={suggestions}
    />
  );
}
